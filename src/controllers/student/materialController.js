/**
 * Контроллер для управления учебными материалами студента
 * Содержит логику получения, загрузки и управления материалами
 */

// Начальные данные учебных материалов (stub data)
const initialMaterials = [
  {
    id: 1,
    name: 'Алгебра 8 класс',
    type: 'folder',
    files: [
      { id: 1, name: 'Квадратные уравнения.pdf', size: '2.4 МБ', type: 'pdf', uploadDate: '2024-01-15' },
      { id: 2, name: 'Практикум по алгебре.docx', size: '1.8 МБ', type: 'doc', uploadDate: '2024-01-20' }
    ]
  },
  {
    id: 2,
    name: 'Геометрия',
    type: 'folder',
    files: [
      { id: 3, name: 'Теорема Пифагора.pdf', size: '3.1 МБ', type: 'pdf', uploadDate: '2024-01-25' },
      { id: 4, name: 'Задачи на построение.pptx', size: '4.2 МБ', type: 'ppt', uploadDate: '2024-02-01' }
    ]
  },
  {
    id: 3,
    name: 'Подготовка к ОГЭ',
    type: 'folder',
    files: [
      { id: 5, name: 'Типовые задания ОГЭ.pdf', size: '5.6 МБ', type: 'pdf', uploadDate: '2024-02-05' }
    ]
  }
];

/**
 * Получает все учебные материалы студента
 * @returns {Array} Массив всех материалов (папок)
 */
export const getMaterials = () => {
  return JSON.parse(JSON.stringify(initialMaterials));
};

/**
 * Получает конкретную папку с материалами
 * @param {number} folderId - ID папки
 * @returns {Object|null} Объект папки или null
 */
export const getMaterialById = (folderId) => {
  const folder = initialMaterials.find(m => m.id === folderId);
  return folder ? JSON.parse(JSON.stringify(folder)) : null;
};

/**
 * Получает все файлы из конкретной папки
 * @param {number} folderId - ID папки
 * @returns {Array} Массив файлов
 */
export const getFilesByFolder = (folderId) => {
  const folder = initialMaterials.find(m => m.id === folderId);
  return folder ? [...folder.files] : [];
};
