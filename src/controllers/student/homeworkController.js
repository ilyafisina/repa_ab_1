/**
 * Контроллер для управления домашними заданиями студента
 * Содержит логику получения, загрузки и управления домашними работами
 */

// Начальные данные домашних заданий (stub data)
const initialHomeworks = [
  {
    id: 1,
    title: 'Квадратные уравнения',
    subject: 'Алгебра',
    assignedDate: '2024-02-01',
    dueDate: '2024-02-15',
    description: 'Решить задачи №1-15 из учебника, страница 45. Особое внимание уделить задачам с параметрами.',
    status: 'completed',
    score: '5/5',
    attachments: [
      { id: 1, name: 'Задание.pdf', type: 'pdf' },
      { id: 2, name: 'Примеры решения.docx', type: 'doc' }
    ],
    studentWork: [
      { id: 1, name: 'Решение Ивана.pdf', type: 'pdf', submittedDate: '2024-02-14' }
    ],
    teacherComment: 'Отличная работа! Все задачи решены верно.'
  },
  {
    id: 2,
    title: 'Геометрические построения',
    subject: 'Геометрия',
    assignedDate: '2024-02-05',
    dueDate: '2024-02-19',
    description: 'Построить треугольник по заданным параметрам: сторона a=5см, угол α=60°, сторона b=7см.',
    status: 'in_progress',
    score: null,
    attachments: [
      { id: 3, name: 'Задание по геометрии.pdf', type: 'pdf' },
      { id: 4, name: 'Чертежи.png', type: 'image' }
    ],
    studentWork: [],
    teacherComment: null
  },
  {
    id: 3,
    title: 'Задачи на вероятность',
    subject: 'Теория вероятностей',
    assignedDate: '2024-02-12',
    dueDate: '2024-02-26',
    description: 'Решить задачи из сборника: №15-25, страницы 34-38.',
    status: 'new',
    score: null,
    attachments: [
      { id: 5, name: 'Сборник задач.pdf', type: 'pdf' }
    ],
    studentWork: [],
    teacherComment: null
  }
];

/**
 * Получает все домашние задания студента
 * @returns {Array} Массив всех домашних заданий
 */
export const getHomeworks = () => {
  return [...initialHomeworks];
};

/**
 * Получает домашние задания по статусу
 * @param {string} status - Статус задания (new, in_progress, completed, overdue)
 * @returns {Array} Массив заданий с указанным статусом
 */
export const getHomeworksByStatus = (status) => {
  return initialHomeworks.filter(hw => hw.status === status);
};

/**
 * Получает конкретное домашнее задание по ID
 * @param {number} homeworkId - ID задания
 * @returns {Object|null} Объект задания или null
 */
export const getHomeworkById = (homeworkId) => {
  return initialHomeworks.find(hw => hw.id === homeworkId) || null;
};

/**
 * Загружает работу студента для домашнего задания
 * @param {number} homeworkId - ID домашнего задания
 * @param {Object} workData - Данные работы {name, type, submittedDate}
 * @returns {Object} Результат операции {success: boolean, message: string, homework: Object}
 */
export const uploadStudentWork = (homeworkId, workData) => {
  const homeworkIndex = initialHomeworks.findIndex(hw => hw.id === homeworkId);
  
  if (homeworkIndex === -1) {
    return { success: false, message: 'Домашнее задание не найдено' };
  }

  const homework = initialHomeworks[homeworkIndex];

  if (homework.status === 'completed') {
    return { success: false, message: 'Задание уже проверено преподавателем, загрузка невозможна' };
  }

  // Создаем новую работу
  const newWork = {
    id: Date.now(),
    name: workData.name,
    type: workData.type || 'file',
    submittedDate: workData.submittedDate || new Date().toISOString().split('T')[0]
  };

  // Обновляем статус если это первая загрузка
  if (homework.status === 'new') {
    homework.status = 'in_progress';
  }

  // Добавляем работу в массив
  homework.studentWork.push(newWork);

  return {
    success: true,
    message: 'Работа успешно загружена!',
    homework: { ...homework }
  };
};

/**
 * Получает статистику по домашним заданиям
 * @returns {Object} Статистика {total, new, in_progress, completed, overdue}
 */
export const getHomeworkStats = () => {
  return {
    total: initialHomeworks.length,
    new: initialHomeworks.filter(hw => hw.status === 'new').length,
    in_progress: initialHomeworks.filter(hw => hw.status === 'in_progress').length,
    completed: initialHomeworks.filter(hw => hw.status === 'completed').length,
    overdue: initialHomeworks.filter(hw => hw.status === 'overdue').length
  };
};
