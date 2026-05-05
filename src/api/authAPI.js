const API_BASE_URL = 'http://localhost:8080/api';

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/student/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка регистрации');
    }

    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/student/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Если есть тело ответа - парсим его
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || `Ошибка: ${response.status} ${response.statusText}`);
    }

    return data;
  },

  getProfile: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/student/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка получения профиля');
    }

    return await response.json();
  },
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUserData = () => {
  return JSON.parse(localStorage.getItem('userData') || 'null');
};

export const setUserData = (userData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const removeUserData = () => {
  localStorage.removeItem('userData');
};
