import '../styles/signin.css';
import { useState } from 'react';
import { authAPI, setToken, setUserData } from '../api/authAPI';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

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

      // Если репетитор - логируем как администратор
      if (response.role === 'Репетитор') {
        // Перезагружаем страницу, чтобы App.js обновил состояние
        window.location.href = '/admin';
      } else {
        // Если студент - перенаправляем в личный кабинет с полной перезагрузкой
        window.location.href = '/student-account';
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа. Проверьте email и пароль.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1 className="signin-title">Вход</h1>
        <form className="signin-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`signin-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>

          <p className="signin-link">
            Нет аккаунта? <a href="/signup">Зарегистрироваться</a>
          </p>
        </form>
      </div>
    </div>
  );
}