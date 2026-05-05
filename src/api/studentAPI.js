const API_BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
  if (!token) {
    console.warn('⚠️ No auth token found! User may not be logged in.');
  }
  return {
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json',
  };
};

/**
 * API для работы с данными студента
 */
export const studentAPI = {
  /**
   * Получить все занятия студента
   */
  getLessons: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/lessons`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('🔴 401 Unauthorized - Invalid or missing token');
          console.error('   Token value:', localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING');
        }
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке занятий:', error);
      throw error;
    }
  },

  /**
   * Получить все платежи студента
   */
  getPayments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/payments`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке платежей:', error);
      throw error;
    }
  },

  /**
   * Получить баланс студента
   */
  getBalance: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/balance`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке баланса:', error);
      throw error;
    }
  },

  /**
   * Оплатить занятие
   */
  payLesson: async (lessonId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/lessons/${lessonId}/pay`, {
        method: 'POST',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при оплате занятия:', error);
      throw error;
    }
  },

  /**
   * Получить все домашние задания студента
   */
  getHomeworks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/homeworks`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке домашних заданий:', error);
      throw error;
    }
  },

  /**
   * Получить все материалы для студента
   */
  getMaterials: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/materials`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке материалов:', error);
      throw error;
    }
  },

  /**
   * Загрузить решение домашнего задания
   */
  uploadHomeworkAnswer: async (homeworkId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/student/homeworks/${homeworkId}/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке решения:', error);
      throw error;
    }
  },

  /**
   * Скачать файл домашнего задания
   */
  downloadHomeworkFile: async (fileId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/homeworks/files/${fileId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка ${response.status}`);
      }

      const blob = await response.blob();
      return {
        data: blob,
        headers: {
          'content-type': response.headers.get('content-type'),
          'content-disposition': response.headers.get('content-disposition'),
        }
      };
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      throw error;
    }
  },

  /**
   * Пополнить баланс
   */
  addBalance: async (amount, description) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/balance/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          amount,
          description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при пополнении баланса:', error);
      throw error;
    }
  },
};
