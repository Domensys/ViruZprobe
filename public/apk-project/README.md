# 📱 Сборка Android-приложения (APK)

## ✅ Готовые файлы проекта

Все необходимые файлы уже подготовлены в папке `public/apk-project/`:

```
apk-project/
├── www/
│   └── index.html              ← HTML-приложение (ридер)
├── capacitor.config.json       ← Конфигурация Capacitor
├── package.json                ← Зависимости проекта
├── build-apk.sh                ← Скрипт для Linux/Mac
├── build-apk.bat               ← Скрипт для Windows
└── README.md                   ← Эта инструкция
```

## 🛠️ Требования для сборки

Перед началом убедитесь, что установлены:

1. **Node.js 18+** — https://nodejs.org
2. **Android Studio** — https://developer.android.com/studio
3. **Java JDK 17+** — https://adoptium.net

## 🚀 Быстрая сборка (рекомендуется)

### Способ 1: Автоматическая сборка

**Linux/Mac:**
```bash
cd public/apk-project
chmod +x build-apk.sh
./build-apk.sh
```

**Windows:**
```cmd
cd public\apk-project
build-apk.bat
```

Скрипт автоматически:
- Установит Capacitor
- Добавит Android-платформу
- Синхронизирует файлы
- Откроет Android Studio

### Способ 2: Ручная сборка

```bash
# 1. Перейдите в папку проекта
cd public/apk-project

# 2. Установите зависимости
npm install

# 3. Добавьте Android-платформу
npx cap add android

# 4. Синхронизируйте файлы
npx cap sync

# 5. Откройте в Android Studio
npx cap open android
```

## 📦 Сборка APK в Android Studio

После открытия проекта в Android Studio:

1. **Дождитесь** завершения синхронизации Gradle (2-5 минут)
2. **Соберите APK:**
   - Меню: `Build → Generate Signed Bundle / APK`
   - Выберите `APK` → `Next`
   - Создайте новый keystore или выберите существующий
   - Выберите `release` → `Next` → `Finish`

**Результат:** `android/app/release/app-release.apk`

### Debug APK (для тестирования)

```bash
cd android
./gradlew assembleDebug    # Linux/Mac
gradlew assembleDebug      # Windows
```

**Результат:** `android/app/build/outputs/apk/debug/app-debug.apk`

## 📲 Установка на телефон

### Через USB
1. Включите «Отладку по USB» на телефоне
2. Подключите телефон к компьютеру
3. В Android Studio нажмите `Run ▶`

### Через файл
1. Скопируйте APK на телефон
2. Откройте файл на телефоне
3. Разрешите установку из неизвестных источников
4. Нажмите «Установить»

### Через ADB
```bash
adb install app-release.apk
```

## 🎯 Особенности приложения

✅ **Параллельное чтение** — английский и русский текст одновременно  
✅ **Озвучивание** — синтез речи с выделением текущего слова  
✅ **Сохранение позиции** — автоматическое сохранение места чтения  
✅ **Восстановление позиции** — продолжение с места остановки  
✅ **Клик по слову** — остановка + зелёная подсветка слова и перевода  
✅ **Двойной клик** — начало чтения с выбранного слова  
✅ **Заливка прочитанного** — полупрозрачный жёлтый фон для прочитанных слов  
✅ **Темы** — светлая, тёмная, сепия  
✅ **Поддержка форматов** — PDF, EPUB, FB2, TXT  

## 🔧 Настройка

### Изменение названия приложения

Отредактируйте `capacitor.config.json`:
```json
{
  "appName": "Ваше название",
  "appId": "com.yourcompany.app"
}
```

Затем выполните:
```bash
npx cap sync
```

### Изменение иконки

1. Создайте иконку 1024×1024 px (PNG)
2. Поместите в `android/app/src/main/res/mipmap-*/ic_launcher.png`
3. Или используйте плагин: `npm install @capacitor/assets`

## 📝 Публикация в Google Play

1. Зарегистрируйтесь как разработчик ($25 единоразово)
2. Создайте приложение в Google Play Console
3. Загрузите подписанный APK
4. Заполните описание, добавьте скриншоты
5. Отправьте на проверку (1-3 дня)

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

**Удачи в создании вашего приложения! 🎉**
