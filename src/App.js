import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Homepage from './pages/Homepage';
import Price from './pages/Price';
import Feedback from './pages/Feedback';
import Contacts from './pages/Contacts';
import SignIn from './pages/SignIn';
import Header from './componets/Header';
import SignUp from './pages/SignUp';
import AdminPanel from './pages/AdminPanel';
import StudentsAccount from './pages/StudentsAccount';
import { getToken, getUserData, removeToken, removeUserData } from './api/authAPI';

function AppContent({ user, handleAdminLogout }) {
  const location = useLocation();
  const hideHeader = location.pathname === '/admin' || location.pathname === '/student-account';

  return (
    <>
      {!hideHeader && <Header user={user} onLogout={handleAdminLogout} />}

      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/price" element={<Price />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contacts" element={<Contacts />} />

          {/* Маршрут входа */}
          <Route
            path="/signin"
            element={
              user ? (
                user.role === 'Репетитор' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student-account" replace />
                )
              ) : (
                <SignIn />
              )
            }
          />

          {/* Маршрут регистрации */}
          <Route
            path='/signup'
            element={
              user ? (
                user.role === 'Репетитор' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student-account" replace />
                )
              ) : (
                <SignUp />
              )
            }
          />

          {/* Личный кабинет студента */}
          <Route
            path="/student-account"
            element={
              user?.role === 'Студент' ? (
                <StudentsAccount onLogout={handleAdminLogout} />
              ) : user ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />

          {/* Админ панель репетитора */}
          <Route
            path="/admin"
            element={
              user?.role === 'Репетитор' ? (
                <AdminPanel onLogout={handleAdminLogout} />
              ) : user ? (
                <Navigate to="/student-account" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  // Восстанавливаем состояние при загрузке приложения
  useEffect(() => {
    const token = getToken();
    const userData = getUserData();

    if (token && userData) {
      setUser(userData);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleAdminLogout = () => {
    setUser(null);
    removeToken();
    removeUserData();
  };

  // Пока проверяем авторизацию, показываем заглушку
  if (isCheckingAuth) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Загрузка...</div>;
  }

  return (
    <Router>
      <AppContent user={user} handleAdminLogout={handleAdminLogout} />
    </Router>
  );
}

export default App;