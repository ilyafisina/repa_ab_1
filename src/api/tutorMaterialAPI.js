const API_BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json',
  };
};

const getHeadersForFile = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token || ''}`,
  };
};

/**
 * API для работы с материалами преподавателя
 */
export const tutorMaterialAPI = {
  /**
   * Получить все папки преподавателя
   */
  getFolders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/materials/folders`, {
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
      console.error('Ошибка при загрузке папок:', error);
      throw error;
    }
  },

  /**
   * Создать новую папку
   */
  createFolder: async (folderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/materials/folders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(folderData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при создании папки:', error);
      throw error;
    }
  },

  /**
   * Удалить папку
   */
  deleteFolder: async (folderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/materials/folders/${folderId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении папки:', error);
      throw error;
    }
  },

  /**
   * Получить файлы в папке
   */
  getFolderFiles: async (folderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/materials/folders/${folderId}/files`, {
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
      console.error('Ошибка при загрузке файлов:', error);
      throw error;
    }
  },

  /**
   * Загрузить файл в папку
   */
  uploadFile: async (folderId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/tutor/materials/folders/${folderId}/files`, {
        method: 'POST',
        headers: getHeadersForFile(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }
  },

  /**
   * Удалить файл
   */
  deleteFile: async (fileId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/materials/files/${fileId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      throw error;
    }
  },

  /**
   * Скачать файл материала
   */
  downloadFile: async (fileId, fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/materials/files/${fileId}/download`, {
        method: 'GET',
        headers: getHeadersForFile(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Ошибка ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      throw error;
    }
  },
};
