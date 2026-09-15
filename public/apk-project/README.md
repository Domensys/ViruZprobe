# 📱 Parallel Reader — Сборка APK

Готовый проект для создания Android-приложения из HTML-кода.

## 📋 Что внутри

```
apk-project/
├── www/
│   └── index.html          ← HTML-файл приложения
├── capacitor.config.json    ← Конфигурация Capacitor
├── package.json             ← Зависимости проекта
├── build-apk.sh             ← Скрипт для Linux/Mac
├── build-apk.bat            ← Скрипт для Windows
└── README.md                ← Этот файл
```

## 🛠️ Требования

Перед сборкой убедитесь, что установлены:

1. **Node.js** (версия 18+) — https://nodejs.org
2. **Android Studio** — https://developer.android.com/studio
3. **Java JDK 17+** — https://adoptium.net

## 🚀 Быстрая сборка

### Способ 1: Автоматический (рекомендуется)

**Linux/Mac:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

**Windows:**
```cmd
build-apk.bat
```

Скрипт автоматически:
- Установит Capacitor
- Добавит Android-платформу
- Синхронизирует файлы
- Подготовит проект для Android Studio

### Способ 2: Ручной

```bash
# 1. Установите зависимости
npm install

# 2. Добавьте Android-платформу
npx cap add android

# 3. Синхронизируйте файлы
npx cap sync

# 4. Откройте в Android Studio
npx cap open android
```

## 📦 Сборка APK

После подготовки проекта:

1. **Откройте Android Studio** (через `npx cap open android`)
2. **Дождитесь** завершения синхронизации Gradle (может занять 2-5 минут)
3. **Соберите APK:**
   - Меню: `Build → Generate Signed Bundle / APK`
   - Выберите `APK` → `Next`
   - Создайте или выберите keystore
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

✅ **Клик по слову** — останавливает чтение и подсвечивает слово зелёным в EN и RU  
✅ **Сохранение позиции** — автоматически сохраняет место чтения  
✅ **Восстановление** — при повторном запуске продолжает с сохранённого места  
✅ **Адаптивный дизайн** — удобные кнопки для тач-управления  
✅ **Тёмная тема** — комфортное чтение  

## 🔧 Настройка

### Изменение иконки приложения

1. Создайте иконку 1024×1024 px (PNG)
2. Поместите в `android/app/src/main/res/mipmap-*/ic_launcher.png`
3. Или используйте плагин: `npm install @capacitor/assets`

### Изменение названия

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

Если возникли вопросы:
- Документация Capacitor: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio/intro

---

**Удачи в создании вашего приложения! 🎉**
