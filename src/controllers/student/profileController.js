/**
 * Контроллер для управления профилем студента
 * Содержит логику получения и обновления информации о студенте
 */

// Начальные данные студента (stub data)
let studentData = {
  id: 1,
  name: 'Иванов Иван Иванович',
  grade: '8 класс',
  phone: '+7 (900) 123-45-67',
  email: 'ivanov@example.com',
  balance: 0,
  registrationDate: '2024-01-15',
  subjects: ['Алгебра', 'Геометрия'],
  tutorName: 'Петров Петр Петрович',
  tutorPhone: '+7 (900) 987-65-43',
  status: 'active'
};

/**
 * Получает информацию о студенте
 * @returns {Object} Объект с данными студента
 */
export const getStudentInfo = () => {
  return { ...studentData };
};

/**
 * Получает полное имя студента
 * @returns {string} Полное имя
 */
export const getStudentName = () => {
  return studentData.name;
};

/**
 * Получает класс студента
 * @returns {string} Класс
 */
export const getStudentGrade = () => {
  return studentData.grade;
};

/**
 * Выходит из системы (logout)
 * @returns {Object} Результат операции
 */
export const logout = () => {
  // Очищаем localStorage
  localStorage.removeItem('isStudent');
  localStorage.removeItem('studentLoginTime');

  return {
    success: true,
    message: 'Вы успешно вышли из системы'
  };
};

/**
 * Получает полный профиль студента (все данные)
 * @returns {Object} Полный объект профиля
 */
export const getFullProfile = () => {
  return {
    student: { ...studentData }
  };
};
