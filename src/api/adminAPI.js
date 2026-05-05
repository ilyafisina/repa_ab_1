const API_BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json',
  };
};

/**
 * API для работы с данными преподавателя
 */
export const adminAPI = {
  /**
   * Получить всех учеников преподавателя
   */
  getStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/students`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Ошибка при загрузке учеников:', error);
      throw error;
    }
  },

  /**
   * Получить домашние задания ученика
   */
  getStudentHomeworks: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/students/${studentId}/homeworks`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Ошибка при загрузке домашних заданий:', error);
      throw error;
    }
  },

  /**
   * Получить уроки ученика
   */
  getStudentLessons: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/students/${studentId}/lessons`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Ошибка при загрузке уроков:', error);
      throw error;
    }
  },

  /**
   * Создать новое домашнее задание
   */
  createHomework: async (studentId, homeworkData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/students/${studentId}/homeworks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(homeworkData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при создании домашнего задания:', error);
      throw error;
    }
  },

  /**
   * Обновить домашнее задание
   */
  updateHomework: async (homeworkId, homeworkData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/homeworks/${homeworkId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(homeworkData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении домашнего задания:', error);
      throw error;
    }
  },

  /**
   * Удалить домашнее задание
   */
  deleteHomework: async (homeworkId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/homeworks/${homeworkId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении домашнего задания:', error);
      throw error;
    }
  },

  /**
   * Проверить домашнее задание
   */
  checkHomework: async (homeworkId, grade, comment) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/homeworks/${homeworkId}/check?grade=${grade}&comment=${comment || ''}`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при проверке задания:', error);
      throw error;
    }
  },

  /**
   * Обновить статусы домашних заданий
   */
  updateHomeworkStatuses: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/homeworks/update-statuses`, {
        method: 'POST',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении статусов:', error);
      throw error;
    }
  },

  /**
   * Скачать файл домашнего задания студента
   */
  downloadHomeworkFile: async (fileId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/homework-files/${fileId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const blob = await response.blob();
      const contentType = response.headers.get('content-type');

      return {
        data: blob,
        headers: {
          'content-type': contentType
        }
      };
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      throw error;
    }
  },

  /**
   * Создать новое занятие для студента
   */
  createLesson: async (studentId, lessonData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/students/${studentId}/lessons`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при создании занятия:', error);
      throw error;
    }
  },

  /**
   * Получить все занятия преподавателя
   */
  getTutorLessons: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/lessons`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Ошибка при загрузке занятий:', error);
      throw error;
    }
  },

  /**
   * Переключить статус оплаты занятия
   */
  toggleLessonPayment: async (lessonId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/lessons/${lessonId}/toggle-payment`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при изменении статуса оплаты:', error);
      throw error;
    }
  },
};