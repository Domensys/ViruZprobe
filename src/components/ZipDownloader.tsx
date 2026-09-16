import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ZipDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState('');

  const downloadZip = async () => {
    setDownloading(true);
    setProgress('Создание архива...');

    try {
      const zip = new JSZip();

      // Загружаем все файлы проекта
      setProgress('Загрузка index.html...');
      const indexHtml = await fetch('/apk-project/www/index.html').then(r => r.text());
      zip.file('www/index.html', indexHtml);

      setProgress('Загрузка capacitor.config.json...');
      const capacitorConfig = await fetch('/apk-project/capacitor.config.json').then(r => r.text());
      zip.file('capacitor.config.json', capacitorConfig);

      setProgress('Загрузка package.json...');
      const packageJson = await fetch('/apk-project/package.json').then(r => r.text());
      zip.file('package.json', packageJson);

      setProgress('Загрузка README.md...');
      const readme = await fetch('/apk-project/README.md').then(r => r.text());
      zip.file('README.md', readme);

      setProgress('Загрузка build-apk.sh...');
      const buildSh = await fetch('/apk-project/build-apk.sh').then(r => r.text());
      zip.file('build-apk.sh', buildSh);

      setProgress('Загрузка build-apk.bat...');
      const buildBat = await fetch('/apk-project/build-apk.bat').then(r => r.text());
      zip.file('build-apk.bat', buildBat);

      setProgress('Загрузка INSTALL.md...');
      const installMd = await fetch('/apk-project/INSTALL.md').then(r => r.text());
      zip.file('INSTALL.md', installMd);

      setProgress('Загрузка QUICK_START.md...');
      const quickStartMd = await fetch('/apk-project/QUICK_START.md').then(r => r.text());
      zip.file('QUICK_START.md', quickStartMd);

      setProgress('Создание ZIP-архива...');
      const content = await zip.generateAsync({ type: 'blob' });
      
      setProgress('Сохранение файла...');
      saveAs(content, 'parallel-reader-android-project.zip');
      
      setProgress('✅ Архив успешно создан!');
      setTimeout(() => setProgress(''), 3000);
    } catch (error) {
      console.error('Ошибка создания архива:', error);
      setProgress('❌ Ошибка создания архива');
      setTimeout(() => setProgress(''), 3000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📦</span> Скачать весь проект одним архивом
      </h3>
      
      <p className="text-gray-300 mb-4">
        Все необходимые файлы для сборки Android-приложения в одном ZIP-архиве:
      </p>
      
      <ul className="text-sm text-gray-400 space-y-1 mb-6 list-disc list-inside">
        <li>www/index.html — HTML-приложение (ридер)</li>
        <li>capacitor.config.json — конфигурация Capacitor</li>
        <li>package.json — зависимости проекта</li>
        <li>build-apk.sh — скрипт сборки для Linux/Mac</li>
        <li>build-apk.bat — скрипт сборки для Windows</li>
        <li>README.md — полная документация</li>
        <li>INSTALL.md — пошаговая инструкция установки</li>
        <li>QUICK_START.md — краткое руководство по сборке APK</li>
      </ul>

      <button
        onClick={downloadZip}
        disabled={downloading}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
      >
        {downloading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Создание архива...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-2xl">💾</span>
            Скачать ZIP-архив (~15 KB)
          </span>
        )}
      </button>

      {progress && (
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg text-center">
          <p className="text-sm text-gray-300">{progress}</p>
        </div>
      )}
    </div>
  );
}
