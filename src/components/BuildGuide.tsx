import { useState } from 'react';
import ZipDownloader from './ZipDownloader';

function BuildGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(idx);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback: открыть в новой вкладке
      window.open(url, '_blank');
    }
  };

  const steps = [
    {
      title: 'Подготовка окружения',
      icon: '🛠️',
      description: 'Установите необходимые инструменты на компьютер',
      code: `# 1. Установите Node.js (версия 18+)
# Скачайте с https://nodejs.org

# 2. Установите Android Studio
# Скачайте с https://developer.android.com/studio

# 3. Создайте папку проекта
mkdir parallel-reader-app
cd parallel-reader-app

# 4. Инициализируйте npm проект
npm init -y

# 5. Установите Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "Parallel Reader" "com.reader.parallel"`,
    },
    {
      title: 'Создание HTML-файла',
      icon: '📄',
      description: 'Создайте папку www и поместите туда HTML-файл приложения',
      code: `# Создайте структуру проекта
mkdir -p www

# Создайте файл www/index.html
# Скопируйте туда ваш HTML-код ридера
# (с внесёнными изменениями: подсветка, сохранение позиции)

# Структура проекта:
# parallel-reader-app/
# ├── www/
# │   └── index.html     ← ваш код ридера
# ├── package.json
# ├── capacitor.config.json
# └── node_modules/`,
    },
    {
      title: 'Настройка Capacitor',
      icon: '⚙️',
      description: 'Добавьте конфигурацию для Android',
      code: `// capacitor.config.json
{
  "appId": "com.reader.parallel",
  "appName": "Parallel Reader",
  "webDir": "www",
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": false
  }
}

# Установите Android платформу
npm install @capacitor/android
npx cap add android

# Синхронизируйте файлы
npx cap sync`,
    },
    {
      title: 'Добавление иконок и Splash Screen',
      icon: '🎨',
      description: 'Создайте иконку приложения',
      code: `# Установите плагин для иконок
npm install @capacitor/assets --save-dev

# Создайте папку resources и поместите:
# resources/icon.png (1024x1024)
# resources/splash.png (2732x2732)

# Сгенерируйте иконки для всех разрешений
npx capacitor-assets generate --android

# Или вручную скопируйте иконки в:
# android/app/src/main/res/mipmap-*/ic_launcher.png`,
    },
    {
      title: 'Сборка APK',
      icon: '📦',
      description: 'Откройте проект в Android Studio и соберите APK',
      code: `# Откройте проект в Android Studio
npx cap open android

# В Android Studio:
# 1. Подождите, пока Gradle синхронизируется
# 2. Build → Generate Signed Bundle / APK
# 3. Выберите "APK"
# 4. Создайте или выберите ключ подписи (keystore)
# 5. Выберите "release"
# 6. Нажмите "Finish"

# APK будет в:
# android/app/release/app-release.apk

# Для тестирования (debug APK):
# Build → Build Bundle(s) / APK(s) → Build APK(s)
# Debug APK: android/app/build/outputs/apk/debug/app-debug.apk`,
    },
    {
      title: 'Установка на Android',
      icon: '📲',
      description: 'Установите APK на устройство',
      code: `# Способ 1: Через USB
# 1. Включите "Отладку по USB" на телефоне
# 2. Подключите телефон к компьютеру
# 3. В Android Studio нажмите Run ▶

# Способ 2: Через файл
# 1. Скопируйте APK на телефон
# 2. Откройте файл на телефоне
# 3. Разрешите установку из неизвестных источников
# 4. Нажмите "Установить"

# Способ 3: Через ADB
adb install app-release.apk

# Способ 4: Google Play
# 1. Зарегистрируйтесь как разработчик ($25)
# 2. Загрузите подписанный APK
# 3. Заполните описание и скриншоты
# 4. Отправьте на проверку`,
    },
  ];

  const fullHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#1e1b4b">
    <title>Параллельный Ридер</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #1a1a2e;
            color: #e2e8f0;
            padding: 12px;
            min-height: 100vh;
            -webkit-tap-highlight-color: transparent;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h2 { color: #a78bfa; margin-bottom: 12px; font-size: 1.4rem; }
        
        .controls {
            background: #16213e;
            padding: 14px;
            border-radius: 12px;
            border: 1px solid #2d3748;
            margin-bottom: 12px;
        }
        .upload-group {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }
        .btn {
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            min-height: 44px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .btn-primary { background: #6366f1; color: white; }
        .btn-primary:hover { background: #4f46e5; }
        .btn-success { background: #22c55e; color: white; }
        .btn-success:hover { background: #16a34a; }
        .btn-warning { background: #f59e0b; color: white; }
        .btn-warning:hover { background: #d97706; }
        .btn-danger { background: #ef4444; color: white; }
        .btn-danger:hover { background: #dc2626; }
        .btn:disabled { background: #4b5563 !important; cursor: not-allowed; }
        
        .rate-control {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            background: #1e293b;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #374151;
        }
        
        .status {
            padding: 10px;
            border-radius: 8px;
            font-weight: 500;
            margin-top: 10px;
            display: none;
            font-size: 14px;
        }
        .status.info { background: #1e3a5f; color: #60a5fa; display: block; }
        .status.success { background: #14532d; color: #4ade80; display: block; }
        .status.error { background: #450a0a; color: #f87171; display: block; }
        
        .word-info {
            background: #14532d;
            border: 1px solid #22c55e;
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
            display: none;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
        }
        .word-info.active { display: flex; }
        
        #output {
            display: flex;
            gap: 12px;
            margin-top: 12px;
        }
        .text-container {
            flex: 1;
            height: calc(100vh - 280px);
            min-height: 400px;
            overflow-y: auto;
            padding: 16px;
            border: 1px solid #2d3748;
            border-radius: 12px;
            background: #16213e;
            line-height: 1.9;
            font-size: 17px;
        }
        
        .word {
            display: inline;
            padding: 1px 3px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .word:hover { background-color: #374151; }
        
        /* 🟢 Зелёная подсветка при нажатии */
        .word.clicked {
            background-color: rgba(34, 197, 94, 0.4) !important;
            color: #bbf7d0 !important;
            font-weight: 700;
            box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
            border: 1px solid rgba(34, 197, 94, 0.6);
        }
        
        /* 🟡 Жёлтая подсветка при чтении */
        .word.active {
            background-color: rgba(250, 204, 21, 0.7) !important;
            color: #000 !important;
            font-weight: 600;
        }
        
        /* 🔵 Прочитанные */
        .word.read {
            background-color: rgba(250, 204, 21, 0.2);
            color: #94a3b8;
        }

        .saved-banner {
            background: #1e3a5f;
            border: 1px solid #3b82f6;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
            display: none;
        }
        .saved-banner.active { display: block; }

        @media (max-width: 768px) {
            #output { flex-direction: column; }
            .text-container { height: 45vh; min-height: 250px; }
            .btn { padding: 10px 12px; font-size: 13px; }
        }
    </style>
</head>
<body>
<div class="container">
    <h2>📖 Параллельный Ридер</h2>

    <div id="savedBanner" class="saved-banner">
        <strong>📌 Сохранённая позиция:</strong>
        <span id="savedInfo"></span>
    </div>

    <div class="controls">
        <div class="upload-group">
            <input type="file" id="textFile" accept=".pdf,.epub,.fb2,.txt"
                   style="color:#a78bfa; font-size:13px;">
            <button class="btn btn-primary" id="translateBtn"
                    onclick="processTextFile()">📄 Загрузить</button>
            <button class="btn btn-success" onclick="startSpeech()">▶ Озвучить</button>
            <button class="btn btn-warning" id="pauseBtn"
                    onclick="togglePause()">⏸ Пауза</button>
            <button class="btn btn-danger" onclick="stopSpeech()">⏹ Стоп</button>
            <div class="rate-control">
                <span>🔊</span>
                <input type="range" id="speechRate" min="0.3" max="1.5"
                       step="0.05" value="0.85"
                       oninput="changeRate(this.value)">
                <span id="rateValue">0.85x</span>
            </div>
        </div>
        <div id="status" class="status"></div>
        <div id="wordInfo" class="word-info">
            <span id="wordInfoText"></span>
            <button class="btn btn-success" onclick="resumeFromWord()"
                    style="padding:6px 12px; font-size:12px;">
                ▶ Продолжить
            </button>
        </div>
    </div>

    <div id="output">
        <div class="text-container" id="originalContainer">
            <div id="originalContent"></div>
        </div>
        <div class="text-container" id="translatedContainer">
            <div id="translatedContent"></div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"><\/script>

<script>
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // ===== СОСТОЯНИЕ =====
    let sentencesEN = [];
    let sentencesRU = [];
    let synth = window.speechSynthesis;
    let utterance = null;
    let isSpeaking = false;
    let isTranslating = false;
    let currentSentenceIndex = 0;
    let clickedWordData = null; // {sIdx, wIdx}
    let currentFileName = '';

    const STORAGE_KEY = 'parallel_reader_position';
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // ===== ЗАГРУЗКА СОХРАНЁННОЙ ПОЗИЦИИ =====
    window.addEventListener('load', () => {
        loadSavedPosition();
    });

    // Сохранение при закрытии
    window.addEventListener('beforeunload', savePosition);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) savePosition();
    });

    function savePosition() {
        if (currentFileName && currentSentenceIndex > 0) {
            const pos = {
                fileName: currentFileName,
                sentenceIndex: currentSentenceIndex,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
        }
    }

    function loadSavedPosition() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const pos = JSON.parse(saved);
                const banner = document.getElementById('savedBanner');
                const info = document.getElementById('savedInfo');
                info.textContent = \` «\${pos.fileName}» — предложение #\${pos.sentenceIndex + 1} (\${new Date(pos.timestamp).toLocaleString('ru')})\`;
                banner.classList.add('active');
            }
        } catch(e) {}
    }

    // ===== УПРАВЛЕНИЕ СКОРОСТЬЮ =====
    function changeRate(val) {
        document.getElementById('rateValue').textContent = parseFloat(val).toFixed(2) + 'x';
        if (isSpeaking && synth.speaking && !synth.paused) {
            synth.cancel();
            speakNext();
        }
    }

    // ===== ОБРАБОТКА ФАЙЛА =====
    async function processTextFile() {
        if (isTranslating) return;
        const fileInput = document.getElementById('textFile');
        const file = fileInput.files[0];
        if (!file) {
            updateStatus('Выберите файл (PDF, EPUB, FB2 или TXT).', 'error');
            return;
        }

        stopSpeech();
        isTranslating = true;
        currentFileName = file.name;
        document.getElementById('translateBtn').disabled = true;

        const ext = file.name.split('.').pop().toLowerCase();
        updateStatus(\`Извлечение текста из \${file.name}...\`, 'info');

        try {
            let text = '';
            if (ext === 'pdf') text = await readPdf(file);
            else if (ext === 'epub') text = await readEpub(file);
            else if (ext === 'fb2') text = await readFb2(file);
            else if (ext === 'txt') text = await file.text();
            else throw new Error('Неподдерживаемый формат.');

            if (!text.trim()) throw new Error('Файл пуст.');

            // Проверяем сохранённую позицию
            let startIndex = 0;
            try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
                if (saved && saved.fileName === file.name) {
                    startIndex = saved.sentenceIndex;
                    updateStatus(\`Восстановлена позиция: предложение #\${startIndex + 1}\`, 'info');
                }
            } catch(e) {}

            updateStatus('Подготовка текста и перевод...', 'info');
            await processAndTranslateFull(text, startIndex);
        } catch (err) {
            updateStatus(\`Ошибка: \${err.message}\`, 'error');
        } finally {
            isTranslating = false;
            document.getElementById('translateBtn').disabled = false;
        }
    }

    async function readPdf(file) {
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + ' ';
        }
        return text;
    }

    async function readEpub(file) {
        const buf = await file.arrayBuffer();
        const book = ePub(buf);
        await book.opened;
        let text = '';
        const spine = await Promise.all(
            book.spine.spineItems.map(item => item.load(book.load.bind(book)))
        );
        spine.forEach(doc => { text += (doc.textContent || doc.body.innerText || '') + ' '; });
        return text;
    }

    async function readFb2(file) {
        const text = await file.text();
        const xml = new DOMParser().parseFromString(text, 'application/xml');
        const body = xml.querySelector('body');
        return body ? body.textContent : '';
    }

    // ===== ПЕРЕВОД =====
    async function fetchTranslation(text, retries = 3) {
        if (!text.trim()) return '';
        const url = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=\${encodeURIComponent(text)}\`;
        for (let a = 0; a <= retries; a++) {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data[0]) return data[0].map(i => i[0]).join('');
                }
            } catch(e) {
                if (a === retries) return text;
                await delay(300 * (a + 1));
            }
        }
        return text;
    }

    async function processAndTranslateFull(fullText, startIndex = 0) {
        const cleaned = fullText.replace(/\\s+/g, ' ').trim();
        sentencesEN = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
        sentencesRU = new Array(sentencesEN.length).fill('');
        currentSentenceIndex = startIndex;

        renderBaseText();
        updateStatus(\`Загружено \${sentencesEN.length} предложений. Перевод...\`, 'info');

        let batch = [], indices = [], batchLen = 0;
        for (let i = 0; i < sentencesEN.length; i++) {
            const s = sentencesEN[i].trim();
            batch.push(s);
            indices.push(i);
            batchLen += s.length;

            if (batchLen >= 200 || i === sentencesEN.length - 1) {
                const combined = batch.join(' ||| ');
                const translated = await fetchTranslation(combined);
                const parts = translated.split('|||');
                for (let j = 0; j < indices.length; j++) {
                    const idx = indices[j];
                    sentencesRU[idx] = parts[j] ? parts[j].trim() : sentencesEN[idx];
                    updateSentenceRU(idx, sentencesRU[idx]);
                }
                const pct = Math.round(((i + 1) / sentencesEN.length) * 100);
                updateStatus(\`Переведено \${pct}%\`, 'info');
                batch = []; indices = []; batchLen = 0;
                await delay(80);
            }
        }

        // Отмечаем прочитанные до startIndex
        if (startIndex > 0) {
            markSentencesAsRead(0, startIndex - 1);
        }

        updateStatus('✅ Перевод завершён!', 'success');
        document.getElementById('savedBanner').classList.remove('active');
    }

    // ===== РЕНДЕРИНГ =====
    function renderBaseText() {
        const origEl = document.getElementById('originalContent');
        const transEl = document.getElementById('translatedContent');
        origEl.innerHTML = '';
        transEl.innerHTML = '';

        sentencesEN.forEach((sent, sIdx) => {
            const span = document.createElement('span');
            span.className = 'sentence-wrap';
            span.id = \`sent-en-\${sIdx}\`;
            span.style.display = 'inline';
            span.style.marginRight = '4px';

            sent.trim().split(/\\s+/).forEach((w, wIdx) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';
                wordSpan.dataset.sidx = sIdx;
                wordSpan.dataset.widx = wIdx;
                wordSpan.textContent = w + ' ';
                // 👆 ОБРАБОТКА НАЖАТИЯ — остановка + зелёная подсветка
                wordSpan.onclick = () => onWordClick(sIdx, wIdx);
                span.appendChild(wordSpan);
            });
            origEl.appendChild(span);

            const ruSpan = document.createElement('span');
            ruSpan.className = 'sentence-wrap';
            ruSpan.id = \`sent-ru-\${sIdx}\`;
            ruSpan.style.display = 'inline';
            ruSpan.style.marginRight = '4px';
            transEl.appendChild(ruSpan);
        });
    }

    function updateSentenceRU(sIdx, textRU) {
        const el = document.getElementById(\`sent-ru-\${sIdx}\`);
        if (!el) return;
        el.innerHTML = '';
        const words = textRU.trim().split(/\\s+/);
        const enWords = sentencesEN[sIdx]?.trim().split(/\\s+/) || [];

        words.forEach((w, wIdx) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.dataset.sidx = sIdx;
            span.dataset.widx = wIdx;
            span.textContent = w + ' ';

            if (sIdx < currentSentenceIndex) {
                span.classList.add('read');
            }

            el.appendChild(span);
        });
    }

    // ===== 🟢 НАЖАТИЕ НА СЛОВО =====
    function onWordClick(sIdx, wIdx) {
        // 1. Остановить чтение
        stopSpeech();

        // 2. Убрать предыдущую зелёную подсветку
        document.querySelectorAll('.word.clicked').forEach(el => {
            el.classList.remove('clicked');
        });

        // 3. Подсветить нажатое слово в EN зелёным
        const enWord = document.querySelector(
            \`#sent-en-\${sIdx} .word[data-widx="\${wIdx}"]\`
        );
        if (enWord) {
            enWord.classList.add('clicked');
            enWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // 4. Подсветить соответствующее слово в RU зелёным
        const enWords = sentencesEN[sIdx]?.trim().split(/\\s+/) || [];
        const ruContainer = document.getElementById(\`sent-ru-\${sIdx}\`);
        if (ruContainer) {
            const ruWords = ruContainer.querySelectorAll('.word');
            if (ruWords.length > 0) {
                const ratio = enWords.length > 1
                    ? wIdx / (enWords.length - 1) : 0;
                const ruIdx = Math.min(
                    Math.round(ratio * (ruWords.length - 1)),
                    ruWords.length - 1
                );
                ruWords[ruIdx].classList.add('clicked');
                ruWords[ruIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // 5. Сохранить данные о нажатом слове
        clickedWordData = { sIdx, wIdx };
        currentSentenceIndex = sIdx;

        // 6. Показать инфо-панель
        const wordInfo = document.getElementById('wordInfo');
        const wordText = document.getElementById('wordInfoText');
        wordText.textContent = \`🟢 Выбрано: "\${enWords[wIdx]}" (предложение \${sIdx + 1})\`;
        wordInfo.classList.add('active');

        // 7. Сохранить позицию
        savePosition();
        updateStatus(\`⏹ Чтение остановлено. Слово: "\${enWords[wIdx]}"\`, 'info');
    }

    function resumeFromWord() {
        clickedWordData = null;
        document.querySelectorAll('.word.clicked').forEach(el => el.classList.remove('clicked'));
        document.getElementById('wordInfo').classList.remove('active');
        isSpeaking = true;
        speakNext();
    }

    // ===== ОЗВУЧИВАНИЕ =====
    function startSpeech() {
        if (sentencesEN.length === 0) {
            updateStatus('Сначала загрузите файл.', 'error');
            return;
        }
        if (synth.paused) {
            synth.resume();
            document.getElementById('pauseBtn').textContent = '⏸ Пауза';
            return;
        }
        stopSpeech();
        isSpeaking = true;
        speakNext();
    }

    function speakNext() {
        if (currentSentenceIndex >= sentencesEN.length || !isSpeaking) {
            stopSpeech();
            updateStatus('✅ Чтение завершено.', 'success');
            return;
        }

        const text = sentencesEN[currentSentenceIndex];
        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = parseFloat(document.getElementById('speechRate').value);

        utterance.onend = () => {
            markSentenceAsRead(currentSentenceIndex);
            currentSentenceIndex++;
            savePosition();
            speakNext();
        };
        utterance.onerror = () => {
            currentSentenceIndex++;
            speakNext();
        };

        synth.speak(utterance);
    }

    function togglePause() {
        if (!isSpeaking) return;
        const btn = document.getElementById('pauseBtn');
        if (synth.speaking && !synth.paused) {
            synth.pause();
            btn.textContent = '▶ Продолжить';
            savePosition();
        } else if (synth.paused) {
            synth.resume();
            btn.textContent = '⏸ Пауза';
        }
    }

    function markSentenceAsRead(sIdx) {
        const enWords = document.querySelectorAll(\`#sent-en-\${sIdx} .word\`);
        enWords.forEach(el => { el.classList.remove('active'); el.classList.add('read'); });
        const ruWords = document.querySelectorAll(\`#sent-ru-\${sIdx} .word\`);
        ruWords.forEach(el => { el.classList.remove('active'); el.classList.add('read'); });
    }

    function markSentencesAsRead(from, to) {
        for (let i = from; i <= to; i++) {
            markSentenceAsRead(i);
        }
    }

    function stopSpeech() {
        isSpeaking = false;
        if (synth.speaking || synth.paused) synth.cancel();
        document.getElementById('pauseBtn').textContent = '⏸ Пауза';
        savePosition(); // 💾 Сохраняем позицию при остановке
    }

    function updateStatus(msg, type) {
        const el = document.getElementById('status');
        el.textContent = msg;
        el.className = \`status \${type}\`;
    }
<\/script>
</body>
</html>`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">📱 Сборка APK из HTML</h2>
        <p className="text-gray-400">Пошаговая инструкция: от HTML-кода до Android-приложения</p>
      </div>

      {/* ZIP Downloader */}
      <ZipDownloader />

      {/* Steps */}
      <div className="space-y-4 mb-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`rounded-xl border transition-all cursor-pointer ${
              activeStep === idx
                ? 'bg-gray-800 border-purple-500 shadow-lg shadow-purple-500/10'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setActiveStep(idx)}
          >
            <div className="p-4 flex items-center gap-4">
              <span className="text-2xl">{step.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                    Шаг {idx + 1}
                  </span>
                  <h3 className="font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mt-1">{step.description}</p>
              </div>
              <span className={`text-gray-500 transition-transform ${activeStep === idx ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>

            {activeStep === idx && (
              <div className="px-4 pb-4">
                <div className="relative">
                  <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-green-300 font-mono whitespace-pre-wrap">
                    <code>{step.code}</code>
                  </pre>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyCode(step.code, idx); }}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    {copiedBlock === idx ? '✅ Скопировано' : '📋 Копировать'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-500/30 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-amber-200 mb-1">Важно: APK нельзя собрать в браузере</h3>
            <p className="text-amber-200/80 text-sm">
              Для сборки APK нужны <strong>Android SDK, JDK и Gradle</strong> — они устанавливаются на ваш компьютер.
              Ниже я подготовил <strong>полностью готовый проект</strong> — скачайте его и соберите APK локально за 5 минут.
            </p>
          </div>
        </div>
      </div>

      {/* Download Full Project */}
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">📦 Скачать готовый проект</h3>
            <p className="text-gray-400 text-sm">
              Все файлы для сборки APK — HTML, конфиг, скрипты. Скачайте и следуйте инструкции.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => downloadFile('/apk-project/www/index.html', 'index.html')}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors flex flex-col items-center gap-2"
          >
            <span className="text-2xl">📄</span>
            <span>index.html</span>
            <span className="text-xs text-indigo-200">Приложение</span>
          </button>
          <button
            onClick={() => downloadFile('/apk-project/capacitor.config.json', 'capacitor.config.json')}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors flex flex-col items-center gap-2"
          >
            <span className="text-2xl">⚙️</span>
            <span>capacitor.config.json</span>
            <span className="text-xs text-indigo-200">Конфигурация</span>
          </button>
          <button
            onClick={() => downloadFile('/apk-project/package.json', 'package.json')}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors flex flex-col items-center gap-2"
          >
            <span className="text-2xl">📦</span>
            <span>package.json</span>
            <span className="text-xs text-indigo-200">Зависимости</span>
          </button>
          <button
            onClick={() => downloadFile('/apk-project/README.md', 'README.md')}
            className="px-4 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold transition-colors flex flex-col items-center gap-2"
          >
            <span className="text-2xl">📖</span>
            <span>README.md</span>
            <span className="text-xs text-green-200">Инструкция</span>
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-yellow-400">💡 Как использовать:</strong>
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Скачайте все файлы выше</li>
            <li>Создайте папку <code className="text-purple-300">parallel-reader</code></li>
            <li>Поместите <code className="text-purple-300">index.html</code> в папку <code className="text-purple-300">www/</code></li>
            <li>Поместите остальные файлы в корень папки</li>
            <li>Откройте терминал и выполните команды из раздела «Быстрый старт»</li>
          </ol>
        </div>
      </div>

      {/* Structure Preview */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-300 mb-3">📁 Структура проекта после скачивания:</h3>
        <pre className="text-sm text-green-300 font-mono bg-gray-900 rounded-lg p-4 overflow-x-auto">
{`apk-project/
├── www/
│   └── index.html           ← ваш ридер (с модификациями)
├── capacitor.config.json     ← настройки Capacitor
├── package.json              ← зависимости
├── build-apk.sh              ← скрипт для Mac/Linux
├── build-apk.bat             ← скрипт для Windows
└── README.md                 ← полная инструкция`}
        </pre>
      </div>

      {/* Quick Summary */}
      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🚀 Быстрый старт (TL;DR)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-bold text-green-400 mb-2">1. Установите:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✅ <a href="https://nodejs.org" target="_blank" className="text-blue-400 underline">Node.js 18+</a></li>
              <li>✅ <a href="https://developer.android.com/studio" target="_blank" className="text-blue-400 underline">Android Studio</a></li>
              <li>✅ <a href="https://adoptium.net" target="_blank" className="text-blue-400 underline">Java JDK 17+</a></li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-bold text-blue-400 mb-2">2. Скачайте файлы</h4>
            <p className="text-sm text-gray-300 mb-2">Нажмите кнопки выше для скачивания всех файлов проекта</p>
            <p className="text-xs text-gray-500">Создайте папку и поместите файлы в неё</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-bold text-purple-400 mb-2">3. Соберите APK:</h4>
            <pre className="text-xs text-green-300 font-mono overflow-x-auto">
{`# Linux/Mac:
chmod +x build-apk.sh
./build-apk.sh

# Windows:
build-apk.bat

# Или вручную:
npm install
npx cap add android
npx cap sync
npx cap open android`}
            </pre>
          </div>
        </div>
      </div>

      {/* Final APK Build Instructions */}
      <div className="mt-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📱</span> Финальная инструкция по сборке APK
        </h3>
        
        <div className="space-y-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-bold text-green-400 mb-2">Шаг 1: Подготовка файлов</h4>
            <p className="text-sm text-gray-300 mb-2">Создайте структуру папок:</p>
            <pre className="text-xs text-green-300 font-mono bg-black/30 rounded p-3 overflow-x-auto">
{`parallel-reader/
├── www/
│   └── index.html              ← скачайте из раздела выше
├── capacitor.config.json       ← скачайте из раздела выше
├── package.json                ← скачайте из раздела выше
└── README.md                   ← скачайте из раздела выше`}
            </pre>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-bold text-blue-400 mb-2">Шаг 2: Установка зависимостей</h4>
            <p className="text-sm text-gray-300 mb-2">Откройте терминал в папке проекта и выполните:</p>
            <pre className="text-xs text-green-300 font-mono bg-black/30 rounded p-3 overflow-x-auto">
{`cd parallel-reader
npm install`}
            </pre>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-bold text-purple-400 mb-2">Шаг 3: Добавление Android-платформы</h4>
            <pre className="text-xs text-green-300 font-mono bg-black/30 rounded p-3 overflow-x-auto">
{`npx cap add android
npx cap sync`}
            </pre>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-bold text-yellow-400 mb-2">Шаг 4: Открытие в Android Studio</h4>
            <pre className="text-xs text-green-300 font-mono bg-black/30 rounded p-3 overflow-x-auto">
{`npx cap open android`}
            </pre>
            <p className="text-sm text-gray-300 mt-2">
              Дождитесь завершения синхронизации Gradle (2-5 минут)
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-bold text-pink-400 mb-2">Шаг 5: Сборка APK</h4>
            <p className="text-sm text-gray-300 mb-2">В Android Studio:</p>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Меню: <code className="text-pink-300">Build → Generate Signed Bundle / APK</code></li>
              <li>Выберите <code className="text-pink-300">APK</code> → Next</li>
              <li>Создайте новый keystore или выберите существующий</li>
              <li>Выберите <code className="text-pink-300">release</code> → Next → Finish</li>
            </ol>
            <p className="text-sm text-green-400 mt-3 font-bold">
              ✅ Результат: <code>android/app/release/app-release.apk</code>
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-bold text-cyan-400 mb-2">Шаг 6: Установка на телефон</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="bg-black/30 rounded p-3">
                <p className="text-xs text-cyan-300 font-bold mb-1">Через USB:</p>
                <p className="text-xs text-gray-400">Включите «Отладку по USB» и нажмите Run ▶ в Android Studio</p>
              </div>
              <div className="bg-black/30 rounded p-3">
                <p className="text-xs text-cyan-300 font-bold mb-1">Через файл:</p>
                <p className="text-xs text-gray-400">Скопируйте APK на телефон и установите</p>
              </div>
              <div className="bg-black/30 rounded p-3">
                <p className="text-xs text-cyan-300 font-bold mb-1">Через ADB:</p>
                <code className="text-xs text-green-300">adb install app-release.apk</code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-300">
            <strong>🎉 Готово!</strong> Ваше Android-приложение «Parallel Reader» готово к использованию.
            Все функции работают: параллельное чтение, озвучивание, сохранение позиции, клик по словам.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BuildGuide;
