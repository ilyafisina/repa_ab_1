import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import "../styles/header.css";

export default function Header({ user, onLogout }) {
  const isAdmin = user?.role === 'Репетитор';

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    window.location.href = '/';
  };

  return (
    <header>
      <div className="header-top">
        <div className="logo-container">
          <img src={logo} alt="Логотип" className="logo" />
        </div>
      </div>

      <nav>
        <Link to="/">Обо мне</Link>
        <Link to="/price">Цены</Link>
        <Link to="/feedback">Отзывы</Link>
        <Link to="/contacts">Контакты</Link>
        
        {isAdmin ? (
          // Если репетитор - показываем ссылку на админ панель
          <Link
            style={{
              background: "#FE8200",
              borderRadius: "80px",
              color: "white",
            }}
            to="/admin"
          >
            Админ панель
          </Link>
        ) : user ? (
          // Если авторизован студент - показываем ссылку на кабинет
          <>
            <Link
              to="/student-account"
              style={{
                background: "#FE8200",
                borderRadius: "80px",
                color: "white",
                textDecoration: "none",
                padding: "10px 20px",
                marginRight: "10px",
              }}
            >
              Мой кабинет
            </Link>
          </>
        ) : (
          // Если не авторизован - показываем ссылку на вход
          <Link
            style={{
              background: "#CB5602",
              borderRadius: "80px",
              color: "white",
            }}
            to="/signin"
          >
            Личный кабинет
          </Link>
        )}
      </nav>
    </header>
  );
}