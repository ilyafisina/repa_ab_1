# MathTutor Backend

Java-based REST API backend для платформы MathTutor - онлайн-школы по математике.

## Технологии

- **Java 17.0.2**
- **Spring Boot 3.2.4**
- **MySQL 8.0**
- **Spring Security** с JWT
- **Spring Data JPA/Hibernate**
- **Flyway** для миграции БД
- **Maven** для сборки

## Структура проекта

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/mathtutor/
│   │   │   ├── MathTutorApplication.java          # Точка входа приложения
│   │   │   ├── controller/
│   │   │   │   └── student/                       # Контроллеры для студентов
│   │   │   │       └── StudentAuthController.java # Регистрация и авторизация
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java               # Бизнес-логика аутентификации
│   │   │   │   └── CustomUserDetailsService.java  # UserDetails имплементация
│   │   │   ├── entity/                            # Entity классы (JPA)
│   │   │   │   ├── User.java
│   │   │   │   ├── Lesson.java
│   │   │   │   ├── Homework.java
│   │   │   │   ├── HomeworkFile.java
│   │   │   │   ├── Material.java
│   │   │   │   └── Payment.java
│   │   │   ├── dto/                               # Data Transfer Objects
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   └── UserDTO.java
│   │   │   ├── repository/                        # Repository интерфейсы
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── LessonRepository.java
│   │   │   │   ├── HomeworkRepository.java
│   │   │   │   ├── HomeworkFileRepository.java
│   │   │   │   ├── MaterialRepository.java
│   │   │   │   └── PaymentRepository.java
│   │   │   ├── security/                          # Security конфигурация
│   │   │   │   ├── JwtTokenProvider.java          # JWT генерация и валидация
│   │   │   │   └── JwtAuthenticationFilter.java   # Фильтр для JWT
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java            # Spring Security конфигурация
│   │   │   │   └── GlobalExceptionHandler.java    # Глобальная обработка ошибок
│   │   │   └── exception/                         # Custom Exception классы
│   │   │       ├── ResourceNotFoundException.java
│   │   │       └── UserAlreadyExistsException.java
│   │   └── resources/
│   │       ├── application.properties             # Основная конфигурация
│   │       ├── application-dev.properties         # Конфигурация для разработки
│   │       └── db/migration/                      # Flyway миграции
│   └── test/                                      # Тесты
└── pom.xml                                        # Maven конфигурация

```

## Требования

- JDK 17.0.2 или выше
- Maven 3.6+
- MySQL 8.0 с БД `repa_ab_1`

## Конфигурация БД

Убедитесь, что MySQL запущен и доступен по адресу:
```
Host: localhost
Port: 3307
Database: repa_ab_1
Username: root
Password: 228abc228
```

## Установка и запуск

### 1. Перейдите в папку backend
```bash
cd backend
```

### 2. Установите зависимости
```bash
mvn clean install
```

### 3. Запустите приложение
```bash
# Для разработки (с DEV профилем)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Или без профиля (используется application.properties)
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\BellSoft\LibericaJDK-17", "Process") ; cd backend ; mvn spring-boot:run
```

Приложение запустится на `http://localhost:8080/api`

## API Endpoints

### Регистрация и авторизация студентов

#### Регистрация
```http
POST /api/auth/student/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "fullName": "Иван Петров",
  "role": "Студент",
  "phone": "+7 900 123-45-67",
  "grade": 8
}
```

**Успешный ответ (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "student@example.com",
  "fullName": "Иван Петров",
  "role": "Студент",
  "grade": 8,
  "phone": "+7 900 123-45-67"
}
```

#### Авторизация
```http
POST /api/auth/student/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

**Успешный ответ (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "student@example.com",
  "fullName": "Иван Петров",
  "role": "Студент",
  "grade": 8,
  "phone": "+7 900 123-45-67"
}
```

#### Получение профиля пользователя
```http
GET /api/auth/student/profile/{userId}
Authorization: Bearer {token}
```

## Использование JWT токена

После успешной аутентификации используйте токен в заголовке Authorization для всех защищенных маршрутов:

```http
GET /api/protected/endpoint
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## Коды ошибок

- **400 Bad Request** - Некорректные данные, ошибка валидации
- **401 Unauthorized** - Отсутствует или неверный токен
- **404 Not Found** - Ресурс не найден
- **409 Conflict** - Пользователь с таким email уже существует
- **500 Internal Server Error** - Внутренняя ошибка сервера

## Структура ответов об ошибках

```json
{
  "timestamp": "2026-04-20T10:30:00",
  "status": 409,
  "error": "Конфликт",
  "message": "Пользователь с таким email уже существует",
  "path": "/api/auth/student/register"
}
```

## Примечания

- Пароли хранятся в виде BCrypt хешей
- JWT токены имеют срок действия 24 часа (86400000 миллисекунд)
- Приложение использует CORS для работы с фронтенд приложением на портах 3000 и 3001
- В будущем будут добавлены папки `controller/admin` и `controller/tutor` для других ролей

## Дальнейшее развитие

- [ ] Контроллеры и сервисы для работы с уроками
- [ ] Контроллеры и сервисы для работы с домашними заданиями
- [ ] Контроллеры и сервисы для работы с материалами
- [ ] Контроллеры и сервисы для работы с платежами
- [ ] Загрузка и скачивание файлов
- [ ] Админ панель контроллеры
- [ ] Интеграция с системой платежей
