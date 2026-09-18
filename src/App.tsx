import { useState } from 'react';
import Reader from './components/Reader';
import BuildGuide from './components/BuildGuide';

type Tab = 'reader' | 'guide' | 'apk';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('reader');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📖</span>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Параллельный Ридер
                </h1>
                <p className="text-xs text-gray-400">Читай, переводи, учись — Android APK</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/apk-project/www/index.html');
                    const text = await response.text();
                    const blob = new Blob([text], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'parallel-reader.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    alert('Ошибка скачивания файла');
                  }
                }}
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-all shadow-lg"
              >
                <span>💾</span>
                <span className="hidden sm:inline">Скачать HTML</span>
              </button>
              <nav className="flex gap-1 bg-gray-800/80 rounded-xl p-1">
                {[
                  { id: 'reader' as Tab, label: 'Ридер', icon: '📖' },
                  { id: 'guide' as Tab, label: 'Изменения', icon: '✅' },
                  { id: 'apk' as Tab, label: 'Сборка APK', icon: '📱' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Download Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 border-b-4 border-green-400">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💾</span>
              <div>
                <p className="text-white font-bold text-lg">
                  Скачать HTML-файл для Android
                </p>
                <p className="text-green-100 text-sm">
                  Готовый файл со всеми функциями: ридер, перевод, озвучка, сохранение позиции
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/apk-project/www/index.html');
                  const text = await response.text();
                  const blob = new Blob([text], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'parallel-reader.html';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch (e) {
                  alert('Ошибка скачивания файла');
                }
              }}
              className="px-8 py-4 bg-white hover:bg-gray-100 rounded-xl text-green-700 font-bold text-lg transition-all shadow-2xl flex items-center gap-3 border-4 border-green-300"
            >
              <span className="text-3xl">⬇️</span>
              <span>СКАЧАТЬ ФАЙЛ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main>
        {activeTab === 'reader' && <Reader />}
        {activeTab === 'guide' && <ChangesGuide />}
        {activeTab === 'apk' && <BuildGuide />}
      </main>
    </div>
  );
}

function ChangesGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">✅ Внесённые изменения</h2>

      <div className="space-y-6">
        {/* Change 1 */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">👆</span>
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Нажатие на слово — остановка + подсветка</h3>
              <p className="text-gray-300 mb-3">
                При нажатии на любое слово в английском тексте:
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Озвучивание <strong className="text-white">останавливается</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Нажатое слово подсвечивается <strong className="text-white">прозрачным зелёным</strong> цветом</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Его перевод в русском тексте тоже <strong className="text-white">подсвечивается зелёным</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Предыдущие подсвеченные слова <strong className="text-white">сбрасываются</strong></span>
                </li>
              </ul>
              <div className="mt-3 flex gap-3 flex-wrap">
                <span className="inline-block px-3 py-1 bg-green-500/30 text-green-300 rounded text-sm">
                  EN: word → зелёная подсветка
                </span>
                <span className="inline-block px-3 py-1 bg-green-500/30 text-green-300 rounded text-sm">
                  RU: слово → зелёная подсветка
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change 2 */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💾</span>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Запоминание позиции чтения</h3>
              <p className="text-gray-300 mb-3">
                Приложение сохраняет место, где вы остановились:
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>При <strong className="text-white">остановке чтения</strong> — позиция сохраняется в localStorage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>При <strong className="text-white">выходе из приложения</strong> — позиция сохраняется автоматически</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>При <strong className="text-white">новом запуске</strong> — чтение начинается с запомненного места</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Сохраняется: <strong className="text-white">индекс предложения</strong> и <strong className="text-white">имя файла</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Change 3 */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🎨</span>
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-2">Улучшенный интерфейс для Android</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Все кнопки <strong className="text-white">видны на экране</strong> — не нужно скроллить</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Кнопки <strong className="text-white">крупные и удобные</strong> для тач-управления</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Адаптивная вёрстка для <strong className="text-white">мобильных экранов</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Тёмная тема для <strong className="text-white">комфортного чтения</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visual Demo */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">🎨 Цветовая схема подсветки</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-2xl mb-2">🟡</div>
              <p className="text-sm text-gray-300">Текущее слово при чтении</p>
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-400/80 text-black rounded text-sm font-bold">
                word
              </span>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-2xl mb-2">🟢</div>
              <p className="text-sm text-gray-300">Нажатое слово (остановка)</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-400/50 text-green-100 rounded text-sm font-bold border border-green-400">
                word
              </span>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-2xl mb-2">🔵</div>
              <p className="text-sm text-gray-300">Прочитанные слова</p>
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-400/30 text-gray-200 rounded text-sm">
                word
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
