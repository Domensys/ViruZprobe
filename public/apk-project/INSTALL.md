# 📦 Инструкция по установке из ZIP-архива

## Что внутри архива

```
parallel-reader-android-project.zip
└── parallel-reader-android-project/
    ├── www/
    │   └── index.html              ← HTML-приложение (ридер)
    ├── capacitor.config.json       ← Конфигурация Capacitor
    ├── package.json                ← Зависимости проекта
    ├── build-apk.sh                ← Скрипт сборки для Linux/Mac
    ├── build-apk.bat               ← Скрипт сборки для Windows
    └── README.md                   ← Подробная документация
```

## 🚀 Быстрый старт

### Шаг 1: Распакуйте архив

**Windows:**
- Правый клик на `parallel-reader-android-project.zip`
- Выберите "Извлечь всё..." или "Распаковать"

**Mac/Linux:**
```bash
unzip parallel-reader-android-project.zip
cd parallel-reader-android-project
```

### Шаг 2: Установите зависимости

Откройте терминал/командную строку в папке проекта и выполните:

```bash
npm install
```

Это установит Capacitor и все необходимые зависимости.

### Шаг 3: Добавьте Android-платформу

```bash
npx cap add android
```

Это создаст папку `android/` с нативным Android-проектом.

### Шаг 4: Синхронизируйте файлы

```bash
npx cap sync
```

Это скопирует файлы из `www/` в Android-проект.

### Шаг 5: Откройте в Android Studio

```bash
npx cap open android
```

Android Studio откроется с проектом. Подождите 2-5 минут, пока Gradle синхронизируется.

### Шаг 6: Соберите APK

**В Android Studio:**

1. Меню: `Build → Generate Signed Bundle / APK`
2. Выберите `APK` → Next
3. Создайте новый keystore или выберите существующий:
   - **Create new...** для первого раза
   - Укажите путь, пароль и alias
4. Выберите `release` → Next → Finish

**Результат:** `android/app/release/app-release.apk`

### Шаг 7: Установите на телефон

**Через USB:**
1. Включите «Отладку по USB» на телефоне
2. Подключите телефон к компьютеру
3. В Android Studio нажмите `Run ▶`

**Через файл:**
1. Скопируйте `app-release.apk` на телефон
2. Откройте файл на телефоне
3. Разрешите установку из неизвестных источников
4. Нажмите «Установить»

**Через ADB:**
```bash
adb install android/app/release/app-release.apk
```

## 🛠️ Требования

Перед началом убедитесь, что установлены:

1. **Node.js 18+** — https://nodejs.org
2. **Android Studio** — https://developer.android.com/studio
3. **Java JDK 17+** — https://adoptium.net

## 📱 Возможности приложения

✅ Параллельное чтение EN/RU  
✅ Озвучивание с выделением слов  
✅ Сохранение позиции чтения  
✅ Восстановление после закрытия  
✅ Клик — остановка + зелёная подсветка  
✅ Двойной клик — начало чтения с места  
✅ Полупрозрачная жёлтая заливка прочитанного  
✅ Темы: светлая, тёмная, сепия  
✅ Поддержка PDF, EPUB, FB2, TXT

## 🐛 Решение проблем

### Ошибка: "SDK location not found"
Создайте файл `android/local.properties`:
```
sdk.dir=/Users/ваш_пользователь/Library/Android/sdk
```

### Ошибка: "JAVA_HOME is not set"
Установите переменную окружения:
```bash
export JAVA_HOME=/path/to/jdk
```

### Медленная сборка
Увеличьте память для Gradle в `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m
```

## 📞 Поддержка

- Документация Capacitor: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio/intro

---

**Готово! Ваше Android-приложение готово к использованию 🎉**
