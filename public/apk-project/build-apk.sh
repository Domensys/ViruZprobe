#!/bin/bash
# ============================================================
#  Скрипт сборки APK для "Parallel Reader"
#  Запуск: chmod +x build-apk.sh && ./build-apk.sh
# ============================================================

set -e

echo "🚀 Начинаем сборку APK для Parallel Reader..."
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Скачайте с https://nodejs.org"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Проверка Java
if ! command -v java &> /dev/null; then
    echo "❌ Java не установлена. Установите JDK 17+ от https://adoptium.net"
    exit 1
fi
echo "✅ Java: $(java -version 2>&1 | head -1)"

# Создание папки проекта
PROJECT_DIR="parallel-reader-apk"
if [ -d "$PROJECT_DIR" ]; then
    echo "⚠️  Папка $PROJECT_DIR уже существует. Удаляю..."
    rm -rf "$PROJECT_DIR"
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Копирование файлов
echo ""
echo "📦 Копирование файлов..."
cp ../www/index.html www/index.html 2>/dev/null || mkdir -p www && cp ../www/index.html www/
cp ../capacitor.config.json .
cp ../package.json .

# Установка зависимостей
echo ""
echo "📥 Установка зависимостей Capacitor..."
npm install --silent

# Добавление Android платформы
echo ""
echo "🤖 Добавление платформы Android..."
npx cap add android

# Синхронизация
echo ""
echo "🔄 Синхронизация файлов..."
npx cap sync

echo ""
echo "✅ Проект готов!"
echo ""
echo "📱 Следующие шаги:"
echo "   1. Откройте проект в Android Studio:"
echo "      npx cap open android"
echo ""
echo "   2. В Android Studio:"
echo "      • Дождитесь завершения синхронизации Gradle"
echo "      • Build → Generate Signed Bundle / APK"
echo "      • Выберите 'APK' → Next"
echo "      • Создайте новый keystore или выберите существующий"
echo "      • Выберите 'release' → Next → Finish"
echo ""
echo "   3. APK будет в: android/app/release/app-release.apk"
echo ""
echo "🔧 Для debug-версии (без подписи):"
echo "   cd android && ./gradlew assembleDebug"
echo "   APK: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "🎉 Готово!"
