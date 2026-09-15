import { useState, useRef, useEffect, useCallback } from 'react';

interface SavedPosition {
  fileName: string;
  sentenceIndex: number;
  timestamp: number;
}

const STORAGE_KEY = 'parallel_reader_position';

function Reader() {
  const [sentencesEN, setSentencesEN] = useState<string[]>([]);
  const [sentencesRU, setSentencesRU] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [clickedWord, setClickedWord] = useState<{ sIdx: number; wIdx: number } | null>(null);
  const [savedPosition, setSavedPosition] = useState<SavedPosition | null>(null);
  const [fileName, setFileName] = useState('');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);
  const currentIdxRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const enContainerRef = useRef<HTMLDivElement>(null);
  const ruContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    loadSavedPosition();

    // Save position before unload
    const handleBeforeUnload = () => {
      savePosition();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const loadSavedPosition = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const pos: SavedPosition = JSON.parse(saved);
        setSavedPosition(pos);
      }
    } catch (e) {
      // ignore
    }
  };

  const savePosition = useCallback(() => {
    if (fileName && currentIdxRef.current > 0) {
      const pos: SavedPosition = {
        fileName,
        sentenceIndex: currentIdxRef.current,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
      setSavedPosition(pos);
    }
  }, [fileName]);

  const updateStatus = (message: string, type: 'info' | 'success' | 'error') => {
    setStatus({ message, type });
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const fetchTranslation = async (text: string, retries = 3): Promise<string> => {
    if (!text.trim()) return '';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=${encodeURIComponent(text)}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]) {
            return data[0].map((item: string[]) => item[0]).join('');
          }
        }
      } catch (e) {
        if (attempt === retries) return text;
        await delay(300 * (attempt + 1));
      }
    }
    return text;
  };

  const readPdf = async (file: File): Promise<string> => {
    const pdfjsLib = (window as any).pdfjsLib;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + ' ';
    }
    return text;
  };

  const readEpub = async (file: File): Promise<string> => {
    const ePub = (window as any).ePub;
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    await book.opened;
    let text = '';
    const loadedSpine = await Promise.all(
      book.spine.spineItems.map((item: any) => item.load(book.load.bind(book)))
    );
    loadedSpine.forEach((doc: any) => {
      text += (doc.textContent || doc.body?.innerText || '') + ' ';
    });
    return text;
  };

  const readFb2 = async (file: File): Promise<string> => {
    const text = await file.text();
    const xmlDoc = new DOMParser().parseFromString(text, 'application/xml');
    const body = xmlDoc.querySelector('body');
    return body ? body.textContent || '' : '';
  };

  const processTextFile = async () => {
    if (isTranslating) return;
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      updateStatus('Пожалуйста, выберите файл (PDF, EPUB, FB2 или TXT).', 'error');
      return;
    }

    stopSpeech();
    setIsTranslating(true);
    setFileName(file.name);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    updateStatus(`Извлечение текста из ${file.name}...`, 'info');

    try {
      let extractedText = '';
      if (ext === 'pdf') extractedText = await readPdf(file);
      else if (ext === 'epub') extractedText = await readEpub(file);
      else if (ext === 'fb2') extractedText = await readFb2(file);
      else if (ext === 'txt') extractedText = await file.text();
      else throw new Error('Неподдерживаемый формат.');

      if (!extractedText.trim()) throw new Error('Файл пуст.');

      updateStatus('Подготовка текста и перевод...', 'info');
      await processAndTranslateFull(extractedText);
    } catch (err: any) {
      updateStatus(`Ошибка: ${err.message}`, 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const processAndTranslateFull = async (fullText: string) => {
    const cleanedText = fullText.replace(/\s+/g, ' ').trim();
    const enSentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];
    const ruSentences = new Array(enSentences.length).fill('');

    setSentencesEN(enSentences);
    setSentencesRU(ruSentences);
    setCurrentSentenceIndex(0);
    currentIdxRef.current = 0;

    updateStatus(`Текст загружен (${enSentences.length} предложений). Перевод...`, 'info');

    let currentBatch: string[] = [];
    let batchIndices: number[] = [];
    let currentBatchLength = 0;

    for (let i = 0; i < enSentences.length; i++) {
      const sentence = enSentences[i].trim();
      currentBatch.push(sentence);
      batchIndices.push(i);
      currentBatchLength += sentence.length;

      if (currentBatchLength >= 200 || i === enSentences.length - 1) {
        const combinedText = currentBatch.join(' ||| ');
        const translatedCombined = await fetchTranslation(combinedText);
        const splitTranslations = translatedCombined.split('|||');

        const newRuSentences = [...ruSentences];
        for (let j = 0; j < batchIndices.length; j++) {
          const idx = batchIndices[j];
          const transSentence = splitTranslations[j] ? splitTranslations[j].trim() : enSentences[idx];
          newRuSentences[idx] = transSentence;
        }
        setSentencesRU([...newRuSentences]);
        Object.assign(ruSentences, newRuSentences);

        const progress = Math.round(((i + 1) / enSentences.length) * 100);
        updateStatus(`Переведено ${progress}%. Можно запускать озвучивание.`, 'info');

        currentBatch = [];
        batchIndices = [];
        currentBatchLength = 0;
        await delay(80);
      }
    }
    updateStatus('✅ Полный перевод завершён!', 'success');
  };

  const startSpeech = () => {
    if (sentencesEN.length === 0) {
      updateStatus('Сначала загрузите файл.', 'error');
      return;
    }

    if (synthRef.current?.paused) {
      synthRef.current.resume();
      setIsPaused(false);
      return;
    }

    stopSpeech();
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setIsPaused(false);
    setClickedWord(null);
    speakNext();
  };

  const speakNext = () => {
    if (currentIdxRef.current >= sentencesEN.length || !isSpeakingRef.current) {
      stopSpeech();
      updateStatus('Чтение завершено.', 'success');
      return;
    }

    const textToRead = sentencesEN[currentIdxRef.current];
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    utteranceRef.current = utterance;

    utterance.onend = () => {
      currentIdxRef.current++;
      setCurrentSentenceIndex(currentIdxRef.current);
      savePosition();
      speakNext();
    };

    utterance.onerror = () => {
      currentIdxRef.current++;
      setCurrentSentenceIndex(currentIdxRef.current);
      speakNext();
    };

    synthRef.current?.speak(utterance);
  };

  const togglePause = () => {
    if (!isSpeakingRef.current) return;

    if (synthRef.current?.speaking && !synthRef.current?.paused) {
      synthRef.current.pause();
      setIsPaused(true);
      updateStatus('⏸ Пауза', 'info');
    } else if (synthRef.current?.paused) {
      synthRef.current.resume();
      setIsPaused(false);
      updateStatus('▶ Продолжение', 'success');
    }
  };

  const stopSpeech = () => {
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setIsPaused(false);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    savePosition();
  };

  const handleWordClick = (sIdx: number, wIdx: number) => {
    // Остановить чтение
    stopSpeech();

    // Установить подсвеченное слово
    setClickedWord({ sIdx, wIdx });

    // Установить текущий индекс предложения
    setCurrentSentenceIndex(sIdx);
    currentIdxRef.current = sIdx;

    // Сохранить позицию
    savePosition();

    updateStatus(`Слово выбрано. Чтение остановлено на предложении ${sIdx + 1}.`, 'info');
  };

  const resumeFromWord = () => {
    if (sentencesEN.length === 0) return;
    setClickedWord(null);
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setIsPaused(false);
    speakNext();
  };

  const scrollToCurrent = () => {
    const enEl = document.getElementById(`sent-en-${currentIdxRef.current}`);
    const ruEl = document.getElementById(`sent-ru-${currentIdxRef.current}`);
    enEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ruEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const changeRate = (val: number) => {
    setSpeechRate(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Saved Position Banner */}
      {savedPosition && sentencesEN.length === 0 && (
        <div className="mb-4 bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📌</span>
            <div>
              <p className="text-blue-200 font-medium">
                Сохранённая позиция: «{savedPosition.fileName}»
              </p>
              <p className="text-blue-300/70 text-sm">
                Предложение #{savedPosition.sentenceIndex + 1} • {new Date(savedPosition.timestamp).toLocaleString('ru')}
              </p>
            </div>
          </div>
          <span className="text-blue-300 text-sm">Загрузите тот же файл для продолжения</span>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.epub,.fb2,.txt"
            className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-purple-500"
          />
          <button
            onClick={processTextFile}
            disabled={isTranslating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            {isTranslating ? '⏳ Перевод...' : '📄 Загрузить и перевести'}
          </button>
          <button
            onClick={startSpeech}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            ▶ Озвучить
          </button>
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            {isPaused ? '▶ Продолжить' : '⏸ Пауза'}
          </button>
          <button
            onClick={stopSpeech}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            ⏹ Стоп
          </button>

          <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 ml-auto">
            <label className="text-xs text-gray-400 whitespace-nowrap">Скорость:</label>
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.05"
              value={speechRate}
              onChange={(e) => changeRate(parseFloat(e.target.value))}
              className="w-20 sm:w-28"
            />
            <span className="text-xs text-gray-300 w-10">{speechRate.toFixed(2)}x</span>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className={`mt-3 p-2 rounded-lg text-sm font-medium ${
            status.type === 'info' ? 'bg-blue-900/40 text-blue-300' :
            status.type === 'success' ? 'bg-green-900/40 text-green-300' :
            'bg-red-900/40 text-red-300'
          }`}>
            {status.message}
          </div>
        )}

        {/* Clicked word info */}
        {clickedWord && (
          <div className="mt-3 p-3 bg-green-900/30 border border-green-500/30 rounded-lg flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-green-400">🟢</span>
              <span className="text-green-200 text-sm">
                Выбрано: <strong>{sentencesEN[clickedWord.sIdx]?.split(' ')[clickedWord.wIdx]}</strong>
              </span>
            </div>
            <button
              onClick={resumeFromWord}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-medium transition-colors"
            >
              ▶ Продолжить чтение
            </button>
          </div>
        )}
      </div>

      {/* Text Containers */}
      {sentencesEN.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* English */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-750 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-300">🇬🇧 Оригинал (EN)</h3>
              <button onClick={scrollToCurrent} className="text-xs text-purple-400 hover:text-purple-300">
                📍 К текущему
              </button>
            </div>
            <div
              ref={enContainerRef}
              className="p-4 h-[500px] overflow-y-auto text-base leading-relaxed"
            >
              {sentencesEN.map((sent, sIdx) => (
                <span key={sIdx} id={`sent-en-${sIdx}`} className="inline mr-1">
                  {sent.trim().split(/\s+/).map((word, wIdx) => {
                    const isClicked = clickedWord?.sIdx === sIdx && clickedWord?.wIdx === wIdx;
                    const isRead = sIdx < currentIdxRef.current;
                    const isCurrent = sIdx === currentIdxRef.current && isSpeaking;

                    return (
                      <span
                        key={wIdx}
                        onClick={() => handleWordClick(sIdx, wIdx)}
                        className={`inline cursor-pointer px-0.5 rounded transition-all duration-150 ${
                          isClicked
                            ? 'bg-green-400/50 text-green-100 font-bold ring-1 ring-green-400'
                            : isCurrent
                            ? 'bg-yellow-400/60 text-black font-semibold'
                            : isRead
                            ? 'bg-yellow-400/20 text-gray-300'
                            : 'hover:bg-gray-600 text-gray-200'
                        }`}
                      >
                        {word}{' '}
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>
          </div>

          {/* Russian */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-750 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-300">🇷🇺 Перевод (RU)</h3>
              <span className="text-xs text-gray-500">
                {sentencesRU.filter(s => s).length}/{sentencesEN.length} переведено
              </span>
            </div>
            <div
              ref={ruContainerRef}
              className="p-4 h-[500px] overflow-y-auto text-base leading-relaxed"
            >
              {sentencesRU.map((sent, sIdx) => {
                if (!sent) return (
                  <span key={sIdx} id={`sent-ru-${sIdx}`} className="inline mr-1 text-gray-600 italic">
                    {sentencesEN[sIdx]?.trim().substring(0, 30)}...
                  </span>
                );

                // Пропорциональное сопоставление слов
                const enWords = sentencesEN[sIdx]?.trim().split(/\s+/) || [];
                const ruWords = sent.trim().split(/\s+/);

                return (
                  <span key={sIdx} id={`sent-ru-${sIdx}`} className="inline mr-1">
                    {ruWords.map((word, wIdx) => {
                      // Находим соответствующее английское слово
                      const ratio = enWords.length > 1
                        ? wIdx / Math.max(1, ruWords.length - 1)
                        : 0;
                      const correspondingEnWordIdx = Math.round(ratio * (enWords.length - 1));
                      const isClicked = clickedWord?.sIdx === sIdx && clickedWord?.wIdx === correspondingEnWordIdx;
                      const isRead = sIdx < currentIdxRef.current;

                      return (
                        <span
                          key={wIdx}
                          className={`inline px-0.5 rounded transition-all duration-150 ${
                            isClicked
                              ? 'bg-green-400/50 text-green-100 font-bold ring-1 ring-green-400'
                              : isRead
                              ? 'bg-yellow-400/20 text-gray-300'
                              : 'text-gray-200'
                          }`}
                        >
                          {word}{' '}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">📖</span>
          <h3 className="text-xl text-gray-400 mb-2">Загрузите файл для начала</h3>
          <p className="text-gray-500 text-sm">
            Поддерживаемые форматы: PDF, EPUB, FB2, TXT
          </p>
          {savedPosition && (
            <p className="text-blue-400 text-sm mt-4">
              💾 Найдена сохранённая позиция из файла «{savedPosition.fileName}»
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Reader;
