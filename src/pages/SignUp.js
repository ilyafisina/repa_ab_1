import "../styles/signup.css";
import { useState } from "react";
import { authAPI, setToken, setUserData } from "../api/authAPI";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    grade: "",
    role: "Студент",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeConsent, setAgreeConsent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (!formData.fullName) {
      setError("Пожалуйста, введите ФИО");
      return;
    }

    if (!formData.email) {
      setError("Пожалуйста, введите email");
      return;
    }

    if (!formData.password) {
      setError("Пожалуйста, введите пароль");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!agreeConsent) {
      setError("Пожалуйста, примите согласие на обработку данных");
      return;
    }

    if (formData.role === "Студент" && !formData.grade) {
      setError("Пожалуйста, выберите класс");
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        phone: formData.phone || null,
        grade: formData.role === "Студент" ? parseInt(formData.grade) : null,
      };

      const response = await authAPI.register(registerData);
      
      // Сохраняем токен и данные пользователя
      setToken(response.token);
      setUserData({
        userId: response.userId,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        grade: response.grade,
        phone: response.phone,
      });

      // Перенаправляем в зависимости от роли с полной перезагрузкой
      if (response.role === 'Репетитор') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/student-account';
      }
    } catch (err) {
      setError(err.message || "Ошибка при регистрации. Попробуйте позже.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1 className="signin-title">Регистрация</h1>
        <form className="signin-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}

          <div className="form-group">
            <label className="form-label">ФИО</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              placeholder="Иван Петров"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Минимум 6 символов"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Подтверждение пароля</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Повторите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Телефон (опционально)</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+7 900 123-45-67"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Роль</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Студент">Студент</option>
              <option value="Репетитор">Репетитор</option>
            </select>
          </div>

          {formData.role === "Студент" && (
            <div className="form-group">
              <label className="form-label">Класс</label>
              <select
                name="grade"
                className="form-input"
                value={formData.grade}
                onChange={handleChange}
              >
                <option value="">Выберите класс</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade} класс
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="consent-section">
            <p className="consent-title">
              Согласие на обработку персональных данных
            </p>
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={agreeConsent}
                onChange={(e) => setAgreeConsent(e.target.checked)}
              />
              <span className="checkmark"></span>Я даю согласие на обработку
              персональных данных в соответствии с
              <a href="/privacy" className="privacy-link">
                {" "}
                Политикой конфиденциальности
              </a>
            </label>
          </div>

          <button
            type="submit"
            className={`signin-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>

          <p className="signin-link">
            Уже есть аккаунт? <a href="/signin">Войти</a>
          </p>
        </form>
      </div>
    </div>
  );
}
