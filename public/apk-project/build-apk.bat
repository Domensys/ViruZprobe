@echo off
chcp 65001 >nul
REM ============================================================
REM  Скрипт сборки APK для "Parallel Reader" (Windows)
REM  Запуск: build-apk.bat
REM ============================================================

echo.
echo 🚀 Начинаем сборку APK для Parallel Reader...
echo.

REM Проверка Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js не установлен. Скачайте с https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✅ Node.js: %NODE_VER%

REM Проверка Java
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Java не установлена. Установите JDK 17+ с https://adoptium.net
    pause
    exit /b 1
)
echo ✅ Java: найдена

REM Создание папки проекта
set PROJECT_DIR=parallel-reader-apk
if exist "%PROJECT_DIR%" (
    echo ⚠️  Папка %PROJECT_DIR% уже существует. Удаляю...
    rmdir /s /q "%PROJECT_DIR%"
)

mkdir "%PROJECT_DIR%"
cd "%PROJECT_DIR%"

REM Копирование файлов
echo.
echo 📦 Копирование файлов...
mkdir www
copy "..\www\index.html" "www\" >nul
copy "..\capacitor.config.json" "." >nul
copy "..\package.json" "." >nul

REM Установка зависимостей
echo.
echo 📥 Установка зависимостей Capacitor...
call npm install --silent

REM Добавление Android платформы
echo.
echo 🤖 Добавление платформы Android...
call npx cap add android

REM Синхронизация
echo.
echo 🔄 Синхронизация файлов...
call npx cap sync

echo.
echo ✅ Проект готов!
echo.
echo 📱 Следующие шаги:
echo    1. Откройте проект в Android Studio:
echo       npx cap open android
echo.
echo    2. В Android Studio:
echo       • Дождитесь завершения синхронизации Gradle
echo       • Build → Generate Signed Bundle / APK
echo       • Выберите 'APK' → Next
echo       • Создайте новый keystore или выберите существующий
echo       • Выберите 'release' → Next → Finish
echo.
echo    3. APK будет в: android\app\release\app-release.apk
echo.
echo 🔧 Для debug-версии (без подписи):
echo    cd android
echo    gradlew assembleDebug
echo    APK: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 🎉 Готово!
pause
