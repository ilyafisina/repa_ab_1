/**
 * Контроллер для управления платежами и финансами студента
 * Содержит логику работы с балансом, платежами и историей операций
 */

// Начальные данные платежей (stub data)
const initialPayments = [
  {
    id: 1,
    date: '2024-02-01',
    amount: 5000,
    description: 'Пополнение баланса',
    type: 'deposit',
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-02-05',
    amount: -1500,
    description: 'Оплата занятия - Алгебра',
    type: 'payment',
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-02-10',
    amount: -2000,
    description: 'Оплата занятия - Геометрия',
    type: 'payment',
    status: 'completed'
  }
];

/**
 * Получает все платежи студента
 * @returns {Array} Массив всех платежей
 */
export const getPayments = () => {
  return [...initialPayments];
};

/**
 * Пополняет баланс студента
 * @param {number} amount - Сумма для пополнения
 * @param {string} description - Описание операции (опционально)
 * @returns {Object} Результат операции {success: boolean, message: string, payment: Object}
 */
export const addBalance = (amount, description = 'Пополнение баланса') => {
  if (amount <= 0) {
    return { 
      success: false, 
      message: 'Сумма должна быть больше 0' 
    };
  }

  if (!Number.isInteger(amount)) {
    return { 
      success: false, 
      message: 'Сумма должна быть целым числом' 
    };
  }

  const newPayment = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    amount: amount,
    description: description,
    type: 'deposit',
    status: 'completed'
  };

  initialPayments.unshift(newPayment);

  return {
    success: true,
    message: `Баланс пополнен на ${amount} ₽!`,
    payment: { ...newPayment },
    newBalance: calculateBalance()
  };
};

/**
 * Снимает средства со счета (при оплате занятия)
 * @param {number} amount - Сумма к списанию
 * @param {string} description - Описание платежа
 * @returns {Object} Результат операции
 */
export const withdrawBalance = (amount, description) => {
  const currentBalance = calculateBalance();

  if (amount <= 0) {
    return { 
      success: false, 
      message: 'Сумма должна быть больше 0' 
    };
  }

  if (currentBalance < amount) {
    return { 
      success: false, 
      message: `Недостаточно средств. Требуется: ${amount} ₽, на счете: ${currentBalance} ₽` 
    };
  }

  const newPayment = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    amount: -amount,
    description: description,
    type: 'payment',
    status: 'completed'
  };

  initialPayments.unshift(newPayment);

  return {
    success: true,
    message: `Платеж выполнен на сумму ${amount} ₽`,
    payment: { ...newPayment },
    newBalance: calculateBalance()
  };
};

/**
 * Рассчитывает текущий баланс студента
 * @returns {number} Текущий баланс
 */
export const calculateBalance = () => {
  return initialPayments.reduce((balance, payment) => balance + payment.amount, 0);
};

/**
 * Получает текущий баланс студента
 * @returns {number} Баланс
 */
export const getBalance = () => {
  return calculateBalance();
};
