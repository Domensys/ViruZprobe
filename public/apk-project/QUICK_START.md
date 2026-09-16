# 📱 Как создать Android-приложение из ZIP-архива

## Шаг 1: Скачайте ZIP-архив

Нажмите кнопку **"💾 Скачать ZIP-архив"** на странице "Сборка APK"

Файл: `parallel-reader-android-project.zip` (~15 KB)

---

## Шаг 2: Распакуйте архив

### Windows:
1. Найдите скачанный файл `parallel-reader-android-project.zip`
2. Правый клик → **"Извлечь всё..."** или **"Распаковать"**
3. Выберите папку для распаковки
4. Нажмите **"Извлечь"**

### Mac:
1. Дважды кликните на `parallel-reader-android-project.zip`
2. Архив автоматически распакуется в папку `parallel-reader-android-project`

### Linux:
```bash
unzip parallel-reader-android-project.zip
cd parallel-reader-android-project
```

---

## Шаг 3: Установите необходимые программы

Перед сборкой APK нужно установить:

### 1. Node.js (обязательно)
- Скачайте с https://nodejs.org
- Выберите версию **18 или выше**
- Установите, следуя инструкциям

### 2. Android Studio (обязательно)
- Скачайте с https://developer.android.com/studio
- Установите, следуя инструкциям
- При первом запуске установите Android SDK

### 3. Java JDK 17+ (обычно устанавливается с Android Studio)
- Проверьте: https://adoptium.net

---

## Шаг 4: Откройте терминал/командную строку

### Windows:
1. Откройте папку `parallel-reader-android-project`
2. В адресной строке проводника введите `cmd` и нажмите Enter
3. Откроется командная строка в этой папке

### Mac:
1. Откройте Terminal
2. Введите `cd ` (с пробелом после cd)
3. Перетащите папку `parallel-reader-android-project` в Terminal
4. Нажмите Enter

### Linux:
```bash
cd /путь/к/parallel-reader-android-project
```

---

## Шаг 5: Установите зависимости

В терминале выполните:

```bash
npm install
```

Подождите 1-2 минуты, пока установятся все зависимости.

---

## Шаг 6: Добавьте Android-платформу

```bash
npx cap add android
```

Это создаст папку `android/` с нативным Android-проектом.

---

## Шаг 7: Синхронизируйте файлы

```bash
npx cap sync
```

Это скопирует файлы из `www/` в Android-проект.

---

## Шаг 8: Откройте в Android Studio

```bash
npx cap open android
```

Android Studio откроется с проектом.

**⏳ Подождите 2-5 минут**, пока Gradle синхронизируется (внизу будет прогресс-бар).

---

## Шаг 9: Соберите APK

### В Android Studio:

1. В верхнем меню: **Build → Generate Signed Bundle / APK**
2. Выберите **APK** → нажмите **Next**
3. **Создайте keystore** (если это первый раз):
   - Нажмите **Create new...**
   - Укажите путь для файла keystore (например, `my-release-key.jks`)
   - Придумайте пароль (запомните его!)
   - Заполните поля:
     - Key Alias: `my-key`
     - Password: (тот же пароль)
     - Validity: `25` лет
     - Name: ваше имя
   - Нажмите **OK**
4. Введите пароль от keystore → нажмите **Next**
5. Выберите **release** → нажмите **Finish**

### Результат:
APK будет создан в: `android/app/release/app-release.apk`

---

## Шаг 10: Установите на телефон

### Способ 1: Через USB (рекомендуется)

1. На телефоне:
   - Настройки → О телефоне → 7 раз нажмите на "Номер сборки"
   - Настройки → Система → Для разработчиков → включите "Отладка по USB"

2. Подключите телефон к компьютеру USB-кабелем

3. В Android Studio:
   - Выберите ваш телефон в списке устройств (вверху)
   - Нажмите кнопку **Run ▶** (зелёная стрелка)

### Способ 2: Через файл

1. Скопируйте `app-release.apk` на телефон (через USB, облако или email)

2. На телефоне:
   - Откройте файл `app-release.apk`
   - Разрешите установку из неизвестных источников
   - Нажмите **"Установить"**

### Способ 3: Через ADB

```bash
adb install android/app/release/app-release.apk
```

---

## ✅ Готово!

Теперь на вашем телефоне установлено приложение **"Parallel Reader"**!

### Возможности приложения:

- 📖 Параллельное чтение EN/RU
- 🔊 Озвучивание текста с выделением слов
- 💾 Сохранение позиции чтения
- 🔄 Восстановление после закрытия
- 👆 Клик по слову — остановка + зелёная подсветка
- 👆👆 Двойной клик — начало чтения с этого места
- 🎨 Темы: светлая, тёмная, сепия
- 📚 Поддержка PDF, EPUB, FB2, TXT

---

## 🐛 Если возникли проблемы

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

---

## 📞 Дополнительная помощь

- Документация Capacitor: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio/intro

---

**Удачи! 🎉**
