/**
 * Контроллер для управления расписанием занятий студента
 * Содержит логику получения, оплаты и управления занятиями
 */

// Начальные данные расписания (stub data)
const initialLessons = [
  {
    id: 1,
    date: '2024-02-15',
    time: '15:00',
    duration: '1.5 часа',
    subject: 'Алгебра',
    topic: 'Квадратные уравнения',
    type: 'online',
    status: 'upcoming',
    price: 1500
  },
  {
    id: 2,
    date: '2024-02-17',
    time: '16:30',
    duration: '2 часа',
    subject: 'Геометрия',
    topic: 'Теорема Пифагора',
    type: 'offline',
    location: 'г. Владимир ул. Кукуевка д. 10',
    status: 'upcoming',
    price: 2000
  },
  {
    id: 3,
    date: '2024-02-10',
    time: '14:00',
    duration: '1 час',
    subject: 'Алгебра',
    topic: 'Линейные уравнения',
    type: 'online',
    status: 'completed',
    price: 1000
  }
];

/**
 * Получает все уроки студента
 * @returns {Array} Массив всех уроков
 */
export const getLessons = () => {
  return [...initialLessons];
};

/**
 * Получает уроки по статусу
 * @param {string} status - Статус урока (upcoming, completed, paid)
 * @returns {Array} Массив уроков с указанным статусом
 */
export const getLessonsByStatus = (status) => {
  return initialLessons.filter(lesson => lesson.status === status);
};

/**
 * Получает следующий предстоящий урок
 * @returns {Object|null} Объект следующего урока или null
 */
export const getNextLesson = () => {
  const upcomingLessons = initialLessons.filter(lesson => lesson.status === 'upcoming');
  return upcomingLessons.length > 0 ? upcomingLessons[0] : null;
};

/**
 * Оплачивает урок
 * @param {number} lessonId - ID урока для оплаты
 * @param {number} currentBalance - Текущий баланс студента
 * @returns {Object} Результат операции {success: boolean, message: string}
 */
export const payLesson = (lessonId, currentBalance) => {
  const lesson = initialLessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return { success: false, message: 'Урок не найден' };
  }

  if (lesson.status !== 'upcoming') {
    return { success: false, message: 'Этот урок уже оплачен или завершен' };
  }

  if (currentBalance < lesson.price) {
    return { 
      success: false, 
      message: `Недостаточно средств. Требуется: ${lesson.price} ₽, на счете: ${currentBalance} ₽` 
    };
  }

  // Обновляем статус урока
  const lessonIndex = initialLessons.findIndex(l => l.id === lessonId);
  if (lessonIndex !== -1) {
    initialLessons[lessonIndex].status = 'paid';
  }

  return {
    success: true,
    message: `Урок "${lesson.subject}" успешно оплачен!`,
    amount: lesson.price,
    lesson: initialLessons[lessonIndex]
  };
};

/**
 * Получает статистику по урокам
 * @returns {Object} Статистика {total, upcoming, completed, paid}
 */
export const getLessonsStats = () => {
  return {
    total: initialLessons.length,
    upcoming: initialLessons.filter(l => l.status === 'upcoming').length,
    completed: initialLessons.filter(l => l.status === 'completed').length,
    paid: initialLessons.filter(l => l.status === 'paid').length
  };
};
