# Инструкция по запуску проекта MathTutor

## 📋 Требования

- **JDK 17.0.2** или выше - [Скачать](https://www.oracle.com/java/technologies/downloads/#java17)
- **Maven 3.6+** - [Скачать](https://maven.apache.org/download.cgi)
- **Node.js 18+** и npm
- **MySQL 8.0** - запущенный на localhost:3307
- **Git**

## 🗄️ Подготовка базы данных

### 1. Создание БД и пользователя (если еще не создано)

```sql
-- Создание БД (если не существует)
CREATE DATABASE IF NOT EXISTS repa_ab_1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создание пользователя (если не существует)
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '228abc228';

-- Предоставление прав
GRANT ALL PRIVILEGES ON repa_ab_1.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Импорт схемы БД

```bash
# Если у вас есть SQL дамп (Dump20260415.sql)
mysql -u root -p228abc228 -h localhost -P 3307 repa_ab_1 < Dump20260415.sql
```

## 🚀 Запуск Backend (Java)

### Шаг 1: Перейти в папку backend

```bash
cd backend
```

### Шаг 2: Компилирование проекта

```bash
mvn clean install
```

*Это может занять несколько минут при первом запуске (загрузка зависимостей)*

### Шаг 3: Запуск приложения

**Вариант 1 - С DEV профилем:**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

**Вариант 2 - Базовый запуск:**
```bash
mvn spring-boot:run
```

**Вариант 3 - Запуск собранного JAR:**
```bash
mvn clean package
java -jar target/mathtutor-backend-1.0.0.jar
```

### ✅ Успешный запуск
Когда вы увидите в консоли:
```
Started MathTutorApplication in X.XXX seconds
```

Backend готов! Доступен по адресу: **http://localhost:8080/api**

## 💻 Запуск Frontend (React)

### Шаг 1: Перейти в основную папку проекта

```bash
cd .. # если вы в папке backend
# или полный путь:
cd c:\Users\User\Desktop\course-work-team-32-kilasxanova-aksenov-fisina-master
```

### Шаг 2: Установка зависимостей

```bash
npm install
```

### Шаг 3: Запуск приложения

```bash
npm start
```

Приложение откроется автоматически на **http://localhost:3000**

## 🧪 Тестирование функциональности

### 1. Регистрация (SignUp)

1. Откройте приложение на http://localhost:3000
2. Нажмите на кнопку "Регистрация" или перейдите на `/signup`
3. Заполните форму:
   - ФИО: `Иван Петров`
   - Email: `ivan@example.com`
   - Пароль: `password123` (минимум 6 символов)
   - Повтор пароля: `password123`
   - Роль: `Студент`
   - Класс: `8` (для студентов)
   - Согласие: ✓ Отметьте
4. Нажмите "Зарегистрироваться"
5. ✅ Должны быть перенаправлены на главную страницу

### 2. Авторизация студента (SignIn)

1. Перейдите на `/signin` или нажмите "Личный кабинет"
2. Введите данные:
   - Email: `ivan@example.com`
   - Пароль: `password123`
3. Нажмите "Войти"
4. ✅ Должны быть перенаправлены на главную (/)
5. В хедере должна отобразиться приветствие: "Привет, Иван Петров!"

### 3. Авторизация репетитора

1. Перейдите на `/signup` для регистрации репетитора
2. Заполните форму:
   - ФИО: `Юлия Шадрина`
   - Email: `tutor@example.com`
   - Пароль: `tutorpass123`
   - Роль: `Репетитор`
   - Согласие: ✓ Отметьте
3. Нажмите "Зарегистрироваться"
4. ✅ Должны быть перенаправлены на админ панель (/admin)

## 📊 Проверка API с помощью Postman

### Регистрация
```
POST http://localhost:8080/api/auth/student/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Тестовый Пользователь",
  "role": "Студент",
  "phone": "+7 900 123-45-67",
  "grade": 9
}
```

### Логин
```
POST http://localhost:8080/api/auth/student/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 3,
  "email": "test@example.com",
  "fullName": "Тестовый Пользователь",
  "role": "Студент",
  "grade": 9,
  "phone": "+7 900 123-45-67"
}
```

### Получение профиля (использование токена)
```
GET http://localhost:8080/api/auth/student/profile/3
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## 🐛 Решение проблем

### ❌ Ошибка: "Port 8080 is already in use"
```bash
# Найти и остановить процесс на порту 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :8080
kill -9 <PID>
```

### ❌ Ошибка: "Could not connect to MySQL"
1. Проверьте, что MySQL запущен на localhost:3307
2. Проверьте учетные данные БД в `application.properties`
3. Проверьте, что БД `repa_ab_1` существует

### ❌ Ошибка: "Cannot resolve symbol 'com.mathtutor'"
```bash
# Пересоберите проект
mvn clean install -U
```

### ❌ Frontend не подключается к Backend
1. Убедитесь, что Backend запущен на http://localhost:8080
2. Проверьте CORS в `SecurityConfig.java`
3. Откройте консоль браузера (F12) и посмотрите ошибки в Network tab

## 📚 Структура проекта

```
course-work-team-32-kilasxanova-aksenov-fisina-master/
├── backend/                          # Java Spring Boot проект
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mathtutor/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml                      # Maven конфигурация
├── public/                           # React публичные файлы
├── src/                              # React исходный код
│   ├── api/                          # API клиент
│   ├── pages/                        # Страницы приложения
│   ├── componets/                    # Компоненты
│   ├── styles/                       # CSS файлы
│   ├── App.js                        # Главный компонент
│   └── index.js                      # Точка входа React
├── package.json                      # npm зависимости (Frontend)
├── pom.xml                           # Maven конфигурация (Backend)
└── BACKEND_SUMMARY.md               # Подробное описание Backend

```

## 🔑 Ключевые контакты для интеграции

### Backend Endpoints:
- Регистрация студента: `POST /api/auth/student/register`
- Логин студента: `POST /api/auth/student/login`
- Профиль: `GET /api/auth/student/profile/{userId}`

### Frontend Компоненты:
- API клиент: `src/api/authAPI.js`
- Регистрация: `src/pages/SignUp.js`
- Авторизация: `src/pages/SignIn.js`
- Главное приложение: `src/App.js`

## 💡 Советы разработчикам

1. **Логирование:** Включить логирование DEBUG уровня в `application-dev.properties`
2. **Database:** Используйте MySQL Workbench для визуализации БД
3. **REST клиент:** Используйте Postman, Insomnia или VS Code REST Client для тестирования API
4. **Отладка React:** Используйте React Developer Tools для Chrome/Firefox
5. **Hot Reload:** Frontend перезагружается автоматически при изменении кода

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи консоли (Backend и Frontend)
2. Убедитесь, что все требования установлены
3. Проверьте файлы конфигурации
4. Пересоберите проект (`mvn clean install`)
5. Очистите кэш npm (`npm cache clean --force`)

---

**Версия инструкции:** 1.0  
**Дата обновления:** 2026-04-20
