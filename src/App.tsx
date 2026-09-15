import { useState, useRef, useEffect } from 'react';

const defaultHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Моё приложение</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    p {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }
    .btn {
      background: white;
      color: #764ba2;
      border: none;
      padding: 12px 32px;
      border-radius: 25px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    .emoji {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">📱</div>
    <h1>Привет, Android!</h1>
    <p>Это веб-приложение, которое можно превратить в Android-приложение</p>
    <button class="btn" onclick="alert('Работает как Android-приложение! 🎉')">
      Нажми меня
    </button>
  </div>
</body>
</html>`;

type Tab = 'editor' | 'preview' | 'guide';
type Method = 'pwa' | 'capacitor' | 'webview' | 'twa';

function App() {
  const [htmlCode, setHtmlCode] = useState(defaultHTML);
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  const [activeMethod, setActiveMethod] = useState<Method>('capacitor');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && activeTab === 'preview') {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlCode);
        doc.close();
      }
    }
  }, [htmlCode, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const methods: Record<Method, { title: string; icon: string; difficulty: string; description: string; steps: string[]; code: string }> = {
    capacitor: {
      title: 'Capacitor (Рекомендуется)',
      icon: '⚡',
      difficulty: 'Средняя',
      description: 'Современный фреймворк от Ionic. Позволяет упаковать HTML/CSS/JS в нативное Android-приложение с доступом к API устройства.',
      steps: [
        'Установите Node.js на компьютер',
        'Создайте проект: npm init -y',
        'Установите Capacitor: npm install @capacitor/core @capacitor/cli',
        'Инициализируйте: npx cap init',
        'Скопируйте HTML-файлы в папку www/',
        'Добавьте Android: npx cap add android',
        'Скопируйте файлы: npx cap sync',
        'Откройте в Android Studio: npx cap open android',
        'Соберите APK в Android Studio'
      ],
      code: `# Установка Capacitor
npm install @capacitor/core @capacitor/cli

# Инициализация проекта
npx cap init "MyApp" "com.myapp.app"

# Копируем HTML в папку www
mkdir www
cp index.html www/

# Добавляем платформу Android
npm install @capacitor/android
npx cap add android

# Синхронизируем файлы
npx cap sync

# Открываем в Android Studio
npx cap open android`
    },
    pwa: {
      title: 'Progressive Web App (PWA)',
      icon: '🌐',
      difficulty: 'Лёгкая',
      description: 'Добавьте manifest.json и Service Worker к вашему HTML. Приложение можно "установить" на Android через браузер Chrome.',
      steps: [
        'Создайте manifest.json с описанием приложения',
        'Добавьте Service Worker для офлайн-работы',
        'Добавьте мета-теги в <head>',
        'Разместите на HTTPS-хостинге',
        'Откройте сайт в Chrome на Android',
        'Нажмите "Добавить на главный экран"'
      ],
      code: `<!-- manifest.json -->
{
  "name": "Моё Приложение",
  "short_name": "Приложение",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#764ba2",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

<!-- Добавьте в <head> вашего HTML: -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#764ba2">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">`
    },
    webview: {
      title: 'Android WebView',
      icon: '📲',
      difficulty: 'Средняя',
      description: 'Создайте нативное Android-приложение с WebView, который отображает ваш HTML. Полный контроль над нативными функциями.',
      steps: [
        'Установите Android Studio',
        'Создайте новый проект (Empty Activity)',
        'Скопируйте HTML-файлы в assets/',
        'Настройте WebView в Activity',
        'Добавьте разрешения в AndroidManifest.xml',
        'Соберите APK'
      ],
      code: `// MainActivity.java
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        WebView webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        
        webView.loadUrl("file:///android_asset/index.html");
        setContentView(webView);
    }
}

<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />`
    },
    twa: {
      title: 'TWA (Trusted Web Activity)',
      icon: '🔒',
      difficulty: 'Сложная',
      description: 'Упакуйте PWA в Android-приложение через Google Bubblewrap. Приложение публикуется в Google Play.',
      steps: [
        'Сначала создайте PWA (см. выше)',
        'Разместите на HTTPS-хостинге',
        'Установите Bubblewrap: npm i -g @nickvdh/bubblewrap',
        'Инициализируйте: bubblewrap init',
        'Соберите APK: bubblewrap build',
        'Подпишите и опубликуйте в Google Play'
      ],
      code: `# Установка Bubblewrap
npm install -g @nickvdh/bubblewrap

# Инициализация проекта
bubblewrap init --manifest=https://your-site.com/manifest.json

# Сборка APK
bubblewrap build

# Результат: app-release-signed.apk
# Загрузите в Google Play Console`
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📱</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  HTML → Android App
                </h1>
                <p className="text-sm text-gray-400">Создай Android-приложение из HTML-кода</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-300 text-sm">Да, это возможно!</span>
            </div>
          </div>
        </div>
      </header>

      {/* Answer Banner */}
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">✅</span>
            <div>
              <p className="text-green-200 font-medium">
                Да! Вы можете вставить HTML-код, изменить его и создать Android-приложение.
              </p>
              <p className="text-green-300/70 text-sm mt-1">
                Ниже — редактор кода с предпросмотром и 4 способа превратить HTML в Android-приложение.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-1 bg-gray-800 rounded-xl p-1 max-w-md">
          {[
            { id: 'editor' as Tab, label: 'Редактор', icon: '✏️' },
            { id: 'preview' as Tab, label: 'Предпросмотр', icon: '👁️' },
            { id: 'guide' as Tab, label: 'Гайд', icon: '📖' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">HTML-редактор</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  {copied ? '✅ Скопировано!' : '📋 Копировать'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
                >
                  💾 Скачать HTML
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-[500px] bg-gray-800 border border-gray-700 rounded-xl p-4 font-mono text-sm text-green-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                spellCheck={false}
                placeholder="Вставьте ваш HTML-код сюда..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {htmlCode.length} символов
              </div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">💡 Советы по редактированию:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Измените текст, цвета и стили под свой проект</li>
                <li>• Добавьте мета-тег viewport для мобильных устройств</li>
                <li>• Используйте CSS для адаптивного дизайна</li>
                <li>• JavaScript работает в WebView и Capacitor</li>
              </ul>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">Предпросмотр приложения</h2>
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-xs text-gray-400">Живой предпросмотр</span>
              </div>
            </div>
            {/* Phone Frame */}
            <div className="flex justify-center">
              <div className="w-[375px] bg-gray-800 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-700">
                <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden">
                  {/* Phone Notch */}
                  <div className="bg-gray-900 flex justify-center pt-2 pb-1">
                    <div className="w-20 h-5 bg-gray-800 rounded-full"></div>
                  </div>
                  {/* Screen */}
                  <iframe
                    ref={iframeRef}
                    className="w-full h-[600px] bg-white"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  {/* Bottom bar */}
                  <div className="bg-gray-900 flex justify-center pb-3 pt-2">
                    <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400">
              Так будет выглядеть ваше приложение на Android-устройстве
            </p>
          </div>
        )}

        {/* Guide Tab */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">4 способа создать Android-приложение</h2>
              <p className="text-gray-400">Выберите подходящий метод для вашего проекта</p>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.entries(methods) as [Method, typeof methods[Method]][]).map(([key, method]) => (
                <button
                  key={key}
                  onClick={() => setActiveMethod(key)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    activeMethod === key
                      ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/10'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <p className={`text-sm font-medium mt-2 ${activeMethod === key ? 'text-purple-300' : 'text-gray-300'}`}>
                    {method.title}
                  </p>
                  <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                    method.difficulty === 'Лёгкая' ? 'bg-green-500/20 text-green-300' :
                    method.difficulty === 'Средняя' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {method.difficulty}
                  </span>
                </button>
              ))}
            </div>

            {/* Method Details */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{methods[activeMethod].icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{methods[activeMethod].title}</h3>
                    <p className="text-gray-400 text-sm">{methods[activeMethod].description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">📋 Пошаговая инструкция</h4>
                <div className="space-y-3 mb-6">
                  {methods[activeMethod].steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-gray-300 text-sm pt-1">{step}</p>
                    </div>
                  ))}
                </div>

                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">💻 Код</h4>
                <div className="relative">
                  <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-green-300 font-mono">
                    <code>{methods[activeMethod].code}</code>
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(methods[activeMethod].code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                  >
                    {copied ? '✅' : '📋'}
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">📊 Сравнение методов</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-400 font-medium">Метод</th>
                      <th className="text-center py-3 text-gray-400 font-medium">Google Play</th>
                      <th className="text-center py-3 text-gray-400 font-medium">Офлайн</th>
                      <th className="text-center py-3 text-gray-400 font-medium">API устройства</th>
                      <th className="text-center py-3 text-gray-400 font-medium">Сложность</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-3 text-gray-300">⚡ Capacitor</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">✅ Полный</td>
                      <td className="text-center py-3"><span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">Средняя</span></td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-3 text-gray-300">🌐 PWA</td>
                      <td className="text-center py-3">❌</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">⚠️ Частично</td>
                      <td className="text-center py-3"><span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">Лёгкая</span></td>
                    </tr>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-3 text-gray-300">📲 WebView</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">✅ Полный</td>
                      <td className="text-center py-3"><span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">Средняя</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-300">🔒 TWA</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">⚠️</td>
                      <td className="text-center py-3">⚠️ Частично</td>
                      <td className="text-center py-3"><span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-xs">Сложная</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-500 text-sm">
            💡 Отредактируйте HTML в редакторе → Скачайте файл → Используйте один из методов для создания APK
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
