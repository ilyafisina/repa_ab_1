# Backend для MathTutor - Резюме работ

## ✅ Завершенные работы

### 1. **Создана структура Java Spring Boot проекта**
   - **Java версия**: 17.0.2
   - **Spring Boot версия**: 3.2.4
   - **Build система**: Maven
   - **База данных**: MySQL 8.0 (localhost:3307, база: repa_ab_1)

### 2. **Настроена БД и подключение**
   - Конфигурация в `application.properties` с параметрами:
     - Host: localhost:3307
     - Username: root
     - Password: 228abc228
     - Database: repa_ab_1
   - Flyway для миграции БД (готовая основа для версионирования)

### 3. **Разработаны Entity классы** (6 таблиц)
   - ✅ `User.java` - Пользователи (Студенты и Репетиторы)
   - ✅ `Lesson.java` - Уроки
   - ✅ `Homework.java` - Домашние задания
   - ✅ `HomeworkFile.java` - Файлы домашних заданий
   - ✅ `Material.java` - Учебные материалы
   - ✅ `Payment.java` - Платежи

**Особенности Entity:**
- Полная интеграция JPA/Hibernate
- Валидация данных на уровне БД
- Автоматические timestamps (createdAt, updatedAt)
- Связи между сущностями (OneToMany, ManyToOne)

### 4. **Созданы DTO классы**
   - ✅ `RegisterRequest.java` - Регистрация
   - ✅ `LoginRequest.java` - Авторизация
   - ✅ `AuthResponse.java` - Ответ аутентификации
   - ✅ `UserDTO.java` - Данные пользователя

**Валидация DTO:**
- Email и password требования
- Минимальная длина пароля (6 символов)
- Обязательные поля

### 5. **Реализована система аутентификации и авторизации**

#### JWT токены:
- ✅ `JwtTokenProvider.java` - Генерация и валидация JWT
- ✅ `JwtAuthenticationFilter.java` - Фильтр для проверки токена
- Срок действия токена: 24 часа
- Алгоритм: HS512

#### Spring Security:
- ✅ `SecurityConfig.java` - Конфигурация безопасности
- CORS настроена для фронтенда (localhost:3000, localhost:3001)
- CSRF отключена (для REST API)
- Session Stateless (JWT подход)
- Защита маршрутов по ролям

### 6. **Разработаны Repository интерфейсы** (6 шт)
   - ✅ `UserRepository.java`
   - ✅ `LessonRepository.java`
   - ✅ `HomeworkRepository.java`
   - ✅ `HomeworkFileRepository.java`
   - ✅ `MaterialRepository.java`
   - ✅ `PaymentRepository.java`

### 7. **Созданы Service классы**
   - ✅ `AuthService.java` - Бизнес-логика регистрации и авторизации
   - ✅ `CustomUserDetailsService.java` - Загрузка пользователя для Spring Security

**Функциональность AuthService:**
- Регистрация с валидацией
- Проверка уникальности email
- Шифрование пароля (BCrypt)
- Генерация JWT токена
- Получение данных пользователя

### 8. **Разработаны REST Controller'ы**
   - ✅ `StudentAuthController.java` - Контроллер для регистрации и авторизации студентов

**Endpoints:**
```
POST   /api/auth/student/register     - Регистрация
POST   /api/auth/student/login        - Авторизация (логин)
GET    /api/auth/student/profile/{id} - Получение профиля (требует токен)
```

### 9. **Обработка ошибок**
   - ✅ `GlobalExceptionHandler.java` - Глобальная обработка исключений
   - ✅ `ResourceNotFoundException.java` - Пользователь не найден
   - ✅ `UserAlreadyExistsException.java` - Пользователь уже существует

**HTTP коды ответов:**
- 201 Created - Успешная регистрация
- 200 OK - Успешный логин
- 400 Bad Request - Ошибка валидации
- 401 Unauthorized - Неверные учетные данные
- 404 Not Found - Ресурс не найден
- 409 Conflict - Email уже зарегистрирован
- 500 Internal Server Error - Ошибка сервера

### 10. **Интеграция с React фронтенде**

#### Создан API Client:
- ✅ `src/api/authAPI.js` - Функции для работы с API

#### Обновлены компоненты:
- ✅ `SignUp.js` - Регистрация через API
  - Валидация данных на фронтенде
  - Выбор роли (Студент/Репетитор)
  - Выбор класса для студентов
  - Сохранение токена и данных пользователя
  - Перенаправление после регистрации

- ✅ `SignIn.js` - Авторизация через API
  - Логин по email
  - Различная логика для Студентов и Репетиторов
  - Автоматическое перенаправление (Студент → /, Репетитор → /admin)
  - Обработка ошибок с выводом сообщений

- ✅ `App.js` - Обновлена логика приложения
  - Проверка токена при загрузке
  - Управление аутентификацией по ролям
  - Защита маршрутов

- ✅ `Header.js` - Обновлен хедер
  - Отображение имени пользователя
  - Кнопка выхода
  - Разные ссылки в зависимости от роли

### 11. **Структура папок (по архитектуре)**
```
backend/
├── src/main/java/com/mathtutor/
│   ├── MathTutorApplication.java          (точка входа)
│   ├── controller/student/                (контроллеры студентов)
│   ├── service/                           (бизнес-логика)
│   ├── entity/                            (JPA сущности)
│   ├── dto/                               (Data Transfer Objects)
│   ├── repository/                        (JPA репозитории)
│   ├── security/                          (JWT и Security)
│   ├── config/                            (конфигурация)
│   └── exception/                         (пользовательские исключения)
└── src/main/resources/
    ├── application.properties             (основная конфигурация)
    ├── application-dev.properties         (DEV конфигурация)
    └── db/migration/                      (Flyway миграции)
```

## 🔐 Технические детали безопасности

- **Пароли**: Хранятся как BCrypt хеши (не могут быть восстановлены)
- **JWT токены**: Подписаны с использованием HS512 алгоритма
- **CORS**: Настроена только для localhost (3000, 3001)
- **CSRF**: Отключена для REST API (используется JWT вместо CSRF токенов)
- **Session**: Stateless (все данные в JWT)

## 📱 Использование API

### Регистрация студента:
```bash
curl -X POST http://localhost:8080/api/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "fullName": "Иван Петров",
    "role": "Студент",
    "phone": "+7 900 123-45-67",
    "grade": 8
  }'
```

### Авторизация:
```bash
curl -X POST http://localhost:8080/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Получение профиля (требует токен):
```bash
curl -X GET http://localhost:8080/api/auth/student/profile/1 \
  -H "Authorization: Bearer {token}"
```

## 🚀 Запуск приложения

### Backend:
```bash
cd backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

Сервер запустится на `http://localhost:8080/api`

### Frontend:
```bash
npm install
npm start
```

Приложение откроется на `http://localhost:3000`

## 📋 Данные для тестирования

### Имеющиеся в БД пользователи:
1. **Студент:**
   - Email: `fisina_i@mail.ru`
   - Пароль: `$2a$10$...` (BCrypt хеш - пароль неизвестен)
   - ФИО: Фисина Илья
   - Класс: 3

2. **Репетитор:**
   - Email: `kilas@mail.ru`
   - Пароль: `$2a$10$...` (BCrypt хеш - пароль неизвестен)
   - ФИО: Киласханова Рината Мурадовна
   - Роль: Репетитор

## 🔄 Дальнейшее развитие

### Ближайшие задачи:
- [ ] Контроллеры для работы с уроками (StudentLessonController)
- [ ] Контроллеры для работы с домашними заданиями (StudentHomeworkController)
- [ ] Контроллеры для работы с материалами (StudentMaterialController)
- [ ] Загрузка и скачивание файлов
- [ ] Контроллеры админ панели в папке `controller/admin/`
- [ ] Контроллеры для репетиторов в папке `controller/tutor/`

### Долгосрочные задачи:
- [ ] API для платежей
- [ ] WebSocket для real-time уведомлений
- [ ] Email уведомления
- [ ] Интеграция с системой платежей (Yandex Kassa, Stripe)
- [ ] Масштабирование (кэширование, CDN для файлов)
- [ ] Логирование и мониторинг (ELK stack, Prometheus)

## 📝 Примечания

1. **Логика разделения ролей:**
   - Студент входит → перенаправляется на главную (/)
   - Репетитор входит → перенаправляется на админ панель (/admin)

2. **Стили не изменены** - все CSS остались без изменений, только функциональность обновлена

3. **Разделение по модулям:** 
   - Папка `controller/student/` для контроллеров студентов
   - Папка `controller/admin/` готова для контроллеров админа (другой программист может добавить свою логику)
   - Папка `controller/tutor/` готова для контроллеров репетиторов

## 👨‍💼 Ответственность команды

- Сейчас работаем только с модулем `StudentAccount`
- Другие программисты могут добавить в папки `admin` и `tutor` свою логику без конфликтов

---

**Статус проекта**: ✅ Готов к тестированию и дальнейшему развитию
