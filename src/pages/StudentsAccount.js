import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTasks, FaMoneyBill, FaBook, FaBars, FaTimes, FaDownload, FaUpload, FaCheck, FaClock, FaUserGraduate, FaFile, FaPaperclip } from 'react-icons/fa';
import '../styles/stydentAccount.css';
import '../styles/sidebar.css';
import { removeToken, removeUserData, getUserData } from '../api/authAPI';
import { studentAPI } from '../api/studentAPI';

const StudentsAccount = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('schedule');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Данные с БД
  const [lessons, setLessons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [balance, setBalance] = useState(0);

  // Состояния для фильтров
  const [homeworkFilters, setHomeworkFilters] = useState({
    status: 'all',
    subject: 'all',
    dateRange: 'all'
  });

  const [paymentFilters, setPaymentFilters] = useState({
    status: 'all',
    dateRange: 'all'
  });

  const [lessonFilters, setLessonFilters] = useState({
    status: 'all',
    subject: 'all',
    dateRange: 'all'
  });

  // Получаем информацию о пользователе
  const userData = getUserData() || {
    fullName: 'Студент',
    email: 'student@example.com',
    userId: null,
  };

  // Загружаем данные с backend при загрузке компонента
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setIsLoading(true);
        const [lessonsData, paymentsData, balanceData, homeworksData, materialsData] = await Promise.all([
          studentAPI.getLessons(),
          studentAPI.getPayments(),
          studentAPI.getBalance(),
          studentAPI.getHomeworks(),
          studentAPI.getMaterials(),
        ]);

        console.log('Lessons data received:', lessonsData);
        setLessons(lessonsData || []);
        setPayments(paymentsData || []);
        setBalance(balanceData?.balance || 0);
        // Инициализируем attachments и studentWork как пустые массивы для каждого homework
        const processedHomeworks = (homeworksData || []).map(hw => ({
          ...hw,
          attachments: hw.attachments || [],
          studentWork: hw.studentWork || []
        }));
        setHomeworks(processedHomeworks);
        setMaterials(materialsData || []);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    removeToken();
    removeUserData();
    if (onLogout) {
      onLogout();
    }
    window.location.href = '/';
  };

  // Функции для домашних заданий
  const handleSelectHomework = (homework) => {
    setSelectedHomework(homework);
  };

  const handleBackToHomeworks = () => {
    setSelectedHomework(null);
  };

  const handleUploadClick = (homework) => {
    setSelectedHomework(homework);
    setShowUploadModal(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Допустимые расширения для домашних заданий
    const allowedExtensions = ['.doc', '.docx', '.pdf'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

    // Проверяем расширение
    if (!allowedExtensions.includes(fileExtension)) {
      alert('Допускаются только файлы Word (.doc, .docx) и PDF');
      e.target.value = '';
      return;
    }

    // Проверяем размер файла (максимум 10MB)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      alert('Размер файла не должен превышать 10MB');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadWork = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedHomework) {
      alert('Выберите файл для загрузки');
      return;
    }

    try {
      await studentAPI.uploadHomeworkAnswer(selectedHomework.id, selectedFile);
      setShowUploadModal(false);
      setSelectedFile(null);
      setShowSuccessPopup('Работа успешно загружена!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      
      // Перезагружаем домашние задания
      const updatedHomeworks = await studentAPI.getHomeworks();
      setHomeworks(updatedHomeworks);
      
      // Обновляем selectedHomework с актуальными данными
      const updatedSelectedHomework = updatedHomeworks.find(hw => hw.id === selectedHomework.id);
      if (updatedSelectedHomework) {
        setSelectedHomework(updatedSelectedHomework);
      }
    } catch (error) {
      alert('Ошибка при загрузке: ' + error.message);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await studentAPI.downloadHomeworkFile(fileId);
      
      // Создаем blob из ответа
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Очищаем URL
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      alert('Ошибка при скачивании файла: ' + error.message);
    }
  };

  // Функции для оплат
  const handleAddBalance = async () => {
    const amount = prompt('Введите сумму для пополнения (₽):');
    if (amount && !isNaN(amount) && amount > 0) {
      try {
        await studentAPI.addBalance(parseInt(amount), 'Пополнение баланса');
        const balanceData = await studentAPI.getBalance();
        setBalance(balanceData?.balance || 0);
        const paymentsData = await studentAPI.getPayments();
        setPayments(paymentsData);
        setShowSuccessPopup('Баланс успешно пополнен!');
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (error) {
        alert('Ошибка при пополнении: ' + error.message);
      }
    }
  };

  const handlePayLesson = async (lesson) => {
    if (lesson.isPaid) {
      alert('Это занятие уже оплачено');
      return;
    }

    if (balance < lesson.price) {
      alert('Недостаточно средств на балансе');
      return;
    }

    if (window.confirm(`Оплатить занятие "${lesson.subject}" за ${lesson.price} ₽?`)) {
      try {
        await studentAPI.payLesson(lesson.id);
        // Обновляем конкретный урок в списке
        setLessons(prevLessons => 
          prevLessons.map(l => 
            l.id === lesson.id ? { ...l, isPaid: true, status: 'paid' } : l
          )
        );
        // Обновляем баланс и платежи
        const [balanceData, paymentsData] = await Promise.all([
          studentAPI.getBalance(),
          studentAPI.getPayments(),
        ]);
        setBalance(balanceData?.balance || 0);
        setPayments(paymentsData);
        setShowSuccessPopup('Занятие успешно оплачено!');
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (error) {
        alert('Ошибка при оплате: ' + error.message);
      }
    }
  };

  // Вспомогательные функции
  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📕',
      doc: '📄',
      xlsx: '📊',
      ppt: '📽️',
      image: '🖼️',
      txt: '📝',
      file: '📎'
    };
    return icons[fileType] || '📎';
  };

  const getHomeworkStatusBadge = (status) => {
    const statusConfig = {
      assigned: { label: 'Назначено', className: 'status-new' },
      submitted: { label: 'Отправлено', className: 'status-in-progress' },
      checked: { label: 'Проверено', className: 'status-completed' },
      overdue: { label: 'Просрочено', className: 'status-overdue' }
    };
    
    const config = statusConfig[status] || statusConfig.assigned;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const getLessonStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { label: 'Предстоит', className: 'status-upcoming' },
      completed: { label: 'Завершено', className: 'status-completed' },
      missed: { label: 'Пропущен', className: 'status-missed' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const getLessonStatus = (lesson) => {
    // Основной статус = status из БД (upcoming, completed)
    // Но если время урока + длительность прошло и статус не 'completed' → 'missed'
    if (lesson.status !== 'completed') {
      const lessonDateTime = new Date(lesson.lessonDate);
      if (lessonDateTime && !lessonDateTime.toString().includes('Z') && !lesson.lessonDate.includes('+')) {
        lessonDateTime.setHours(lessonDateTime.getHours() - 3);
      }
      const lessonEndTime = new Date(lessonDateTime.getTime() + (lesson.durationMin || 0) * 60000);
      const now = new Date();
      
      if (now > lessonEndTime) {
        return 'missed'; // Урок прошел полностью, но статус не completed
      }
    }
    
    return lesson.status; // upcoming, completed и т.д.
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'success': { class: 'payment-status-success', label: 'Успешно' },
      'completed': { class: 'payment-status-success', label: 'Успешно' },
      'pending': { class: 'payment-status-pending', label: 'В обработке' }
    };
    
    const config = statusMap[status] || { class: 'payment-status-pending', label: status };
    return <span className={`payment-status-badge ${config.class}`}>{config.label}</span>;
  };

  // Форматирование даты и времени из lesson_date
  const formatLessonDate = (lessonDate) => {
    if (!lessonDate) return 'N/A';
    try {
      const date = new Date(lessonDate);
      if (isNaN(date.getTime())) return 'N/A';
      // Если время приходит без Z, значит это локальное время сервера (Moscow +3)
      // Вычитаем 3 часа чтобы вернуться к истинному UTC
      if (lessonDate && !lessonDate.endsWith('Z') && !lessonDate.includes('+')) {
        date.setHours(date.getHours() - 3);
      }
      return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const formatLessonTime = (lessonDate) => {
    if (!lessonDate) return 'N/A';
    try {
      const date = new Date(lessonDate);
      if (isNaN(date.getTime())) return 'N/A';
      // Если время приходит без Z, значит это локальное время сервера (Moscow +3)
      // Вычитаем 3 часа чтобы вернуться к истинному UTC
      if (lessonDate && !lessonDate.endsWith('Z') && !lessonDate.includes('+')) {
        date.setHours(date.getHours() - 3);
      }
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'N/A';
    }
  };

  const formatLessonDuration = (durationMin) => {
    if (!durationMin) return 'N/A';
    if (durationMin >= 60) {
      const hours = Math.floor(durationMin / 60);
      const mins = durationMin % 60;
      return `${hours}ч ${mins > 0 ? mins + 'мин' : ''}`.trim();
    }
    return `${durationMin}мин`;
  };

  const formatPaymentDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' }) + ' ' + 
           d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  // Модальное окно загрузки работы
  const UploadModal = ({ isOpen, onClose, homework, onSubmit, selectedFile, onFileSelect }) => {
    if (!isOpen || !homework) return null;

    const hasStudentWork = homework.studentWork && homework.studentWork.length > 0;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Загрузить работу: {homework?.title}</h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Отображение загруженных файлов */}
          {hasStudentWork && (
            <div className="uploaded-files-section">
              <h4>Загруженные файлы:</h4>
              <div className="files-list">
                {homework.studentWork.map((file, index) => (
                  <div key={index} className="file-item">
                    <FaFile className="file-icon" />
                    <div className="file-info">
                      <p className="file-name">{file.fileName}</p>
                      <span className="file-date">
                        {new Date(file.uploadedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <button 
                      className="download-btn-small"
                      onClick={() => handleDownloadFile(file.id, file.fileName)}
                      title="Скачать файл"
                    >
                      <FaDownload />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="upload-form">
            <div className="form-group">
              <label>Выберите файл *</label>
              <div className="file-upload-area">
                <label htmlFor="file-input-upload" className="file-input-label">
                  <input
                    id="file-input-upload"
                    type="file"
                    onChange={onFileSelect}
                    className="file-input"
                    accept=".pdf,.doc,.docx"
                  />
                  {selectedFile ? (
                    <div className="selected-file">
                      <FaFile />
                      <span>{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <FaUpload className="upload-icon" />
                      <p>Нажмите для выбора файла</p>
                      <small>Поддерживаются: PDF, DOC, DOCX</small>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="save-btn" disabled={!selectedFile}>
                {hasStudentWork ? 'Загрузить еще' : 'Загрузить работу'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Модальное окно подробной информации об уроке
  const LessonDetailModal = ({ isOpen, onClose, lesson }) => {
    if (!isOpen || !lesson) return null;

    const currentStatus = getLessonStatus(lesson);

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content lesson-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2>{lesson.subject}</h2>
              <p className="modal-subtitle">{lesson.topic}</p>
            </div>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="lesson-detail-content">
            <div className="detail-section">
              <h3>Дата и время</h3>
              <div className="detail-info">
                <p><strong>Дата:</strong> {formatLessonDate(lesson.lessonDate)}</p>
                <p><strong>Время:</strong> {formatLessonTime(lesson.lessonDate)}</p>
                <p><strong>Продолжительность:</strong> {formatLessonDuration(lesson.durationMin)}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3>Формат и место</h3>
              <div className="detail-info">
                <p>
                  <strong>Формат:</strong>{' '}
                  <span className="lesson-format">
                    {lesson.format === 'online' ? '💻 Онлайн' : '🏠 Очно'}
                  </span>
                </p>
                {lesson.format === 'online' && lesson.onlineLink && (
                  <p>
                    <strong>Ссылка на урок:</strong>{' '}
                    <a href={lesson.onlineLink} target="_blank" rel="noopener noreferrer" className="online-link">
                      {lesson.onlineLink}
                    </a>
                  </p>
                )}
                {lesson.format === 'offline' && lesson.location && (
                  <p>
                    <strong>Адрес:</strong> {lesson.location}
                  </p>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Информация об оплате</h3>
              <div className="detail-info">
                <p>
                  <strong>Стоимость:</strong> <span className="price-text">{lesson.price} ₽</span>
                </p>
                <p>
                  <strong>Статус оплаты:</strong>{' '}
                  {lesson.isPaid ? (
                    <span className="paid-badge">✓ Оплачено</span>
                  ) : (
                    <span className="unpaid-badge">✗ Не оплачено</span>
                  )}
                </p>
                <p>
                  <strong>Статус урока:</strong>{' '}
                  {getLessonStatusBadge(currentStatus)}
                </p>
              </div>
            </div>

            {lesson.notes && (
              <div className="detail-section">
                <h3>Заметки</h3>
                <div className="detail-info">
                  <p>{lesson.notes}</p>
                </div>
              </div>
            )}

            <div className="detail-section">
              <h3>👨‍🏫 Преподаватель</h3>
              <div className="detail-info">
                <p>
                  <strong>ФИО:</strong> {lesson.tutorName || 'Не указано'}
                </p>
                {lesson.tutorPhone && (
                  <p>
                    <strong>Телефон:</strong>{' '}
                    <a href={`tel:${lesson.tutorPhone}`} className="phone-link">
                      {lesson.tutorPhone}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="modal-actions">
              {!lesson.isPaid && currentStatus === 'upcoming' && (
                <button 
                  className={`save-btn ${balance >= lesson.price ? '' : 'disabled'}`}
                  onClick={() => {
                    handlePayLesson(lesson);
                    onClose();
                  }}
                  disabled={balance < lesson.price}
                >
                  Оплатить занятие
                </button>
              )}
              <button className="cancel-btn" onClick={onClose}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Секции личного кабинета
  const sections = {
    schedule: {
      title: 'Расписание',
      icon: <FaCalendarAlt />,
      content: (
        <div className="schedule-content">
          <div className="section-header">
            <h2>Мое расписание</h2>
            <div className="header-right-group">
              <button
                className={`archive-toggle-btn ${showArchive ? 'active' : ''}`}
                onClick={() => setShowArchive(!showArchive)}
              >
                📦 {showArchive ? 'Текущие' : 'Архив'}
              </button>
              <div className="balance-info">
                <span>Баланс: <strong>{balance} ₽</strong></span>
              </div>
            </div>
          </div>

          {/* Фильтры для расписания */}
          <div className="lesson-filters">
            <div className="filter-group">
              <label>Статус:</label>
              <select
                value={lessonFilters.status}
                onChange={(e) => setLessonFilters({...lessonFilters, status: e.target.value})}
              >
                <option value="all">Все статусы</option>
                <option value="upcoming">Предстоит</option>
                <option value="completed">Завершено</option>
                <option value="missed">Пропущено</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Предмет:</label>
              <select
                value={lessonFilters.subject}
                onChange={(e) => setLessonFilters({...lessonFilters, subject: e.target.value})}
              >
                <option value="all">Все предметы</option>
                {[...new Set(lessons.map(l => l.subject))].map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Период:</label>
              <select
                value={lessonFilters.dateRange}
                onChange={(e) => setLessonFilters({...lessonFilters, dateRange: e.target.value})}
              >
                <option value="all">Все время</option>
                <option value="today">Сегодня</option>
                <option value="week">Эта неделя</option>
                <option value="month">Этот месяц</option>
              </select>
            </div>

            <button
              className="reset-filters-btn"
              onClick={() => setLessonFilters({
                status: 'all',
                subject: 'all',
                dateRange: 'all'
              })}
            >
              Сбросить фильтры
            </button>
          </div>

          {isLoading && <div className="empty-state"><p>Загрузка данных...</p></div>}
          {error && <div className="empty-state"><p style={{ color: '#e53e3e' }}>Ошибка: {error}</p></div>}

          <div className="lessons-list">
            {!isLoading && (() => {
              const now = new Date();
              let filteredLessons = showArchive
                ? lessons.filter(l => new Date(l.lessonDate) < now)
                : lessons.filter(l => new Date(l.lessonDate) >= now);

              // Применяем фильтры
              if (lessonFilters.status !== 'all') {
                filteredLessons = filteredLessons.filter(l => getLessonStatus(l) === lessonFilters.status);
              }

              if (lessonFilters.subject !== 'all') {
                filteredLessons = filteredLessons.filter(l => l.subject === lessonFilters.subject);
              }

              if (lessonFilters.dateRange !== 'all') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (lessonFilters.dateRange === 'today') {
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  filteredLessons = filteredLessons.filter(l => {
                    const lessonDate = new Date(l.lessonDate);
                    return lessonDate >= today && lessonDate < tomorrow;
                  });
                } else if (lessonFilters.dateRange === 'week') {
                  const nextWeek = new Date(today);
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  filteredLessons = filteredLessons.filter(l => {
                    const lessonDate = new Date(l.lessonDate);
                    return lessonDate >= today && lessonDate < nextWeek;
                  });
                } else if (lessonFilters.dateRange === 'month') {
                  const nextMonth = new Date(today);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  filteredLessons = filteredLessons.filter(l => {
                    const lessonDate = new Date(l.lessonDate);
                    return lessonDate >= today && lessonDate < nextMonth;
                  });
                }
              }

              if (filteredLessons.length === 0) {
                return (
                  <div className="empty-state">
                    <p>{showArchive ? 'Архив пуст' : 'Нет запланированных занятий'}</p>
                  </div>
                );
              }

              return filteredLessons
                .sort((a, b) => {
                  const dateA = new Date(a.lessonDate);
                  const dateB = new Date(b.lessonDate);
                  return showArchive ? dateB - dateA : dateA - dateB;
                })
                .map(lesson => {
                const currentStatus = getLessonStatus(lesson);
                return (
                <div key={lesson.id} className="lesson-card" onClick={() => setSelectedLesson(lesson)} style={{ cursor: 'pointer' }}>
                  <div className="lesson-header">
                    <div className="lesson-main-info">
                      <h4>{lesson.subject}</h4>
                      <span className="lesson-topic">{lesson.topic}</span>
                    </div>
                    <div className="lesson-meta">
                      {getLessonStatusBadge(currentStatus)}
                      {!lesson.isPaid && currentStatus === 'upcoming' && (
                        <button 
                          className={`pay-btn ${balance >= lesson.price ? '' : 'disabled'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayLesson(lesson);
                          }}
                          disabled={balance < lesson.price}
                        >
                          {`Оплатить ${lesson.price} ₽`}
                        </button>
                      )}
                      {lesson.isPaid && (
                        <button className="pay-btn paid-btn" disabled onClick={(e) => e.stopPropagation()}>
                          <FaCheck /> Оплачено
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="lesson-details">
                    <div className="detail-item">
                      <FaClock />
                      <span>{formatLessonDate(lesson.lessonDate)} в {formatLessonTime(lesson.lessonDate)} ({formatLessonDuration(lesson.durationMin)})</span>
                    </div>
                    <div className="detail-item">
                      <span className="lesson-type">
                        {lesson.format === 'online' ? '💻 Онлайн' : '🏠 Очно'}
                      </span>
                      {lesson.format === 'online' && (lesson.onlineLink || lesson.online_link) && <span><a href={lesson.onlineLink || lesson.online_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Ссылка на урок</a></span>}
                      {lesson.format === 'offline' && lesson.location && <span>{lesson.location}</span>}
                    </div>
                  </div>
                </div>
              );
              });
            })()}
          </div>
        </div>
      )
    },
    homework: {
      title: 'Домашние задания',
      icon: <FaTasks />,
      content: (
        <div className="homework-content">
          {!selectedHomework ? (
            <>
              <div className="section-header">
                <h2>Мои домашние задания</h2>
                <div className="homework-stats">
                  <div className="stat-card stat-total">
                    <div className="stat-icon"></div>
                    <div className="stat-info">
                      <span className="stat-label">Всего</span>
                      <span className="stat-value">{homeworks.length}</span>
                    </div>
                  </div>
                  <div className="stat-card stat-checked">
                    <div className="stat-icon"></div>
                    <div className="stat-info">
                      <span className="stat-label">Проверено</span>
                      <span className="stat-value">{homeworks.filter(hw => hw.status === 'checked').length}</span>
                    </div>
                  </div>
                  <div className="stat-card stat-submitted">
                    <div className="stat-icon"></div>
                    <div className="stat-info">
                      <span className="stat-label">Отправлено</span>
                      <span className="stat-value">{homeworks.filter(hw => hw.status === 'submitted').length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Фильтры для домашних заданий */}
              <div className="lesson-filters">
                <div className="filter-group">
                  <label>Статус:</label>
                  <select
                    value={homeworkFilters.status}
                    onChange={(e) => setHomeworkFilters({...homeworkFilters, status: e.target.value})}
                  >
                    <option value="all">Все статусы</option>
                    <option value="assigned">Назначено</option>
                    <option value="submitted">Отправлено</option>
                    <option value="checked">Проверено</option>
                    <option value="overdue">Просрочено</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Предмет:</label>
                  <select
                    value={homeworkFilters.subject}
                    onChange={(e) => setHomeworkFilters({...homeworkFilters, subject: e.target.value})}
                  >
                    <option value="all">Все предметы</option>
                    {[...new Set(homeworks.map(hw => hw.subject))].map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Период:</label>
                  <select
                    value={homeworkFilters.dateRange}
                    onChange={(e) => setHomeworkFilters({...homeworkFilters, dateRange: e.target.value})}
                  >
                    <option value="all">Все время</option>
                    <option value="week">Эта неделя</option>
                    <option value="month">Этот месяц</option>
                  </select>
                </div>

                <button
                  className="reset-filters-btn"
                  onClick={() => setHomeworkFilters({
                    status: 'all',
                    subject: 'all',
                    dateRange: 'all'
                  })}
                >
                  Сбросить фильтры
                </button>
              </div>

              <div className="homeworks-grid">
                {(() => {
                  let filteredHomeworks = [...homeworks];

                  // Применяем фильтры
                  if (homeworkFilters.status !== 'all') {
                    filteredHomeworks = filteredHomeworks.filter(hw => hw.status === homeworkFilters.status);
                  }

                  if (homeworkFilters.subject !== 'all') {
                    filteredHomeworks = filteredHomeworks.filter(hw => hw.subject === homeworkFilters.subject);
                  }

                  if (homeworkFilters.dateRange !== 'all') {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (homeworkFilters.dateRange === 'week') {
                      const nextWeek = new Date(today);
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      filteredHomeworks = filteredHomeworks.filter(hw => {
                        const dueDate = new Date(hw.dueDate);
                        return dueDate >= today && dueDate < nextWeek;
                      });
                    } else if (homeworkFilters.dateRange === 'month') {
                      const nextMonth = new Date(today);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      filteredHomeworks = filteredHomeworks.filter(hw => {
                        const dueDate = new Date(hw.dueDate);
                        return dueDate >= today && dueDate < nextMonth;
                      });
                    }
                  }

                  return filteredHomeworks.map(homework => (
                  <div key={homework.id} className="homework-card">
                    <div className="homework-header">
                      <div className="homework-title">
                        <h4>{homework.title}</h4>
                        <span className="homework-subject">{homework.subject}</span>
                      </div>
                      <div className="homework-meta">
                        {getHomeworkStatusBadge(homework.status)}
                        {homework.grade && (
                          <span className="homework-score">{homework.grade}/5</span>
                        )}
                      </div>
                    </div>

                    <div className="homework-info">
                      <div className="info-item">
                        <FaUserGraduate className="info-icon" />
                        <span><strong>Преподаватель:</strong> {homework.tutorName}</span>
                      </div>
                      <div className="info-item">
                        <FaCalendarAlt className="info-icon" />
                        <span><strong>Выдано:</strong> {homework.assignedDate ? new Date(homework.assignedDate).toLocaleDateString('ru-RU') : 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <FaBook className="info-icon" />
                        <span><strong>Урок:</strong> {homework.lessonTopic || 'Без темы'}</span>
                      </div>
                      <div className="info-item">
                        <FaClock className="info-icon" />
                        <span><strong>Срок:</strong> {homework.dueDate ? new Date(homework.dueDate).toLocaleDateString('ru-RU') : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="homework-description-preview">
                      <p>{homework.description && homework.description.length > 100 
                        ? homework.description.substring(0, 100) + '...' 
                        : homework.description}</p>
                    </div>

                    <div className="homework-actions">
                      <button 
                        className="view-btn"
                        onClick={() => handleSelectHomework(homework)}
                      >
                        Подробнее
                      </button>
                      {homework.status !== 'checked' && (
                        <button 
                          className="upload-work-btn"
                          onClick={() => handleUploadClick(homework)}
                        >
                          <FaUpload /> {homework.studentWork && homework.studentWork.length > 0 ? 'Загрузить еще' : 'Загрузить работу'}
                        </button>
                      )}
                    </div>
                  </div>
                  ));
                })()}
              </div>
            </>
          ) : (
            <>
              <div className="homework-detail-header">
                <button className="back-btn" onClick={handleBackToHomeworks}>
                  ← Назад к заданиям
                </button>
                <div className="homework-detail-title">
                  <h2>{selectedHomework.title}</h2>
                  <span className="homework-subject">{selectedHomework.subject}</span>
                </div>
                {selectedHomework.status !== 'checked' && (
                  <button 
                    className="upload-work-btn"
                    onClick={() => handleUploadClick(selectedHomework)}
                  >
                    <FaUpload /> {selectedHomework.studentWork && selectedHomework.studentWork.length > 0 ? 'Загрузить еще' : 'Загрузить работу'}
                  </button>
                )}
              </div>

              <div className="homework-detail-content">
                <div className="detail-section">
                  <h4>Информация о задании</h4>
                  <div className="homework-info-grid">
                    <div className="info-card">
                      <FaUserGraduate className="info-card-icon" />
                      <div className="info-card-content">
                        <span className="info-card-label">Преподаватель</span>
                        <span className="info-card-value">{selectedHomework.tutorName}</span>
                      </div>
                    </div>
                    <div className="info-card">
                      <FaBook className="info-card-icon" />
                      <div className="info-card-content">
                        <span className="info-card-label">Предмет</span>
                        <span className="info-card-value">{selectedHomework.subject}</span>
                      </div>
                    </div>
                    <div className="info-card">
                      <FaCalendarAlt className="info-card-icon" />
                      <div className="info-card-content">
                        <span className="info-card-label">Дата выдачи</span>
                        <span className="info-card-value">
                          {selectedHomework.assignedDate ? new Date(selectedHomework.assignedDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="info-card">
                      <FaClock className="info-card-icon" />
                      <div className="info-card-content">
                        <span className="info-card-label">Срок выполнения</span>
                        <span className="info-card-value">
                          {selectedHomework.dueDate ? new Date(selectedHomework.dueDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    {selectedHomework.lessonTopic && (
                      <div className="info-card">
                        <FaTasks className="info-card-icon" />
                        <div className="info-card-content">
                          <span className="info-card-label">Тема урока</span>
                          <span className="info-card-value">{selectedHomework.lessonTopic}</span>
                        </div>
                      </div>
                    )}
                    <div className="info-card">
                      <FaCheck className="info-card-icon" />
                      <div className="info-card-content">
                        <span className="info-card-label">Статус</span>
                        <span className="info-card-value">{getHomeworkStatusBadge(selectedHomework.status)}</span>
                      </div>
                    </div>
                    {selectedHomework.grade && (
                      <div className="info-card">
                        <FaCheck className="info-card-icon" />
                        <div className="info-card-content">
                          <span className="info-card-label">Оценка</span>
                          <span className="info-card-value homework-score">{selectedHomework.grade}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Описание задания</h4>
                  <p>{selectedHomework.description}</p>
                </div>

                {selectedHomework.attachments && selectedHomework.attachments.length > 0 && (
                  <div className="detail-section">
                    <h4>Материалы для выполнения</h4>
                    <div className="attachments-list">
                      {selectedHomework.attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                          <FaFile className="file-icon" />
                          <div className="file-details">
                            <p className="file-name">{file.fileName}</p>
                            <span className="file-size">
                              {file.fileSize ? `${(file.fileSize / (1024 * 1024)).toFixed(2)} МБ` : 'N/A'}
                            </span>
                          </div>
                          <button
                            className="download-btn"
                            onClick={() => handleDownloadFile(file.id, file.fileName)}
                            title="Скачать файл"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHomework.studentWork && selectedHomework.studentWork.length > 0 && (
                  <div className="detail-section">
                    <h4>Загруженные работы:</h4>
                    <div className="uploaded-files-list">
                      {selectedHomework.studentWork.map((file, index) => (
                        <div key={index} className="uploaded-file-item">
                          <FaFile className="file-icon" />
                          <div className="file-details">
                            <p className="file-name">{file.fileName}</p>
                            <span className="file-date">
                              {new Date(file.uploadedAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <button 
                            className="download-btn"
                            onClick={() => handleDownloadFile(file.id, file.fileName)}
                            title="Скачать файл"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHomework.teacherComment && (
                  <div className="detail-section">
                    <h4>Комментарий преподавателя</h4>
                    <div className="teacher-comment">
                      <p>{selectedHomework.teacherComment}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )
    },
    payments: {
      title: 'Оплаты',
      icon: <FaMoneyBill />,
      content: (
        <div className="payments-content">
          <div className="section-header">
            <h2>Финансы и оплаты</h2>
            <button className="add-balance-btn" onClick={handleAddBalance}>
              + Пополнить баланс
            </button>
          </div>

          <div className="balance-card">
            <h3>Текущий баланс</h3>
            <div className="balance-amount">{balance} ₽</div>
          </div>

          {/* Фильтры для оплат */}
          <div className="lesson-filters">
            <div className="filter-group">
              <label>Тип операции:</label>
              <select
                value={paymentFilters.status}
                onChange={(e) => setPaymentFilters({...paymentFilters, status: e.target.value})}
              >
                <option value="all">Все операции</option>
                <option value="credit">Пополнение</option>
                <option value="debit">Расход</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Период:</label>
              <select
                value={paymentFilters.dateRange}
                onChange={(e) => setPaymentFilters({...paymentFilters, dateRange: e.target.value})}
              >
                <option value="all">Все время</option>
                <option value="week">Эта неделя</option>
                <option value="month">Этот месяц</option>
              </select>
            </div>

            <button
              className="reset-filters-btn"
              onClick={() => setPaymentFilters({
                status: 'all',
                dateRange: 'all'
              })}
            >
              Сбросить фильтры
            </button>
          </div>

          <div className="payments-history">
            <h3>История операций</h3>
            {isLoading && <div className="empty-state"><p>Загрузка данных...</p></div>}
            {error && <div className="empty-state"><p style={{ color: '#e53e3e' }}>Ошибка: {error}</p></div>}
            {!isLoading && payments.length === 0 ? (
              <div className="empty-state">
                <p>Нет операций</p>
              </div>
            ) : (
              <div className="payments-list">
                {(() => {
                  let filteredPayments = [...payments];

                  // Применяем фильтры
                  if (paymentFilters.status !== 'all') {
                    filteredPayments = filteredPayments.filter(p => p.direction === paymentFilters.status);
                  }

                  if (paymentFilters.dateRange !== 'all') {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (paymentFilters.dateRange === 'week') {
                      const nextWeek = new Date(today);
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      filteredPayments = filteredPayments.filter(p => {
                        const paymentDate = new Date(p.createdAt);
                        return paymentDate >= today && paymentDate < nextWeek;
                      });
                    } else if (paymentFilters.dateRange === 'month') {
                      const nextMonth = new Date(today);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      filteredPayments = filteredPayments.filter(p => {
                        const paymentDate = new Date(p.createdAt);
                        return paymentDate >= today && paymentDate < nextMonth;
                      });
                    }
                  }

                  return filteredPayments.map(payment => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-info">
                      <div className="payment-description">
                        <strong>{payment.description || (payment.direction === 'debit' ? 'Расход' : 'Пополнение')}</strong>
                        <span className="payment-date">Оплачено: {formatPaymentDate(payment.createdAt)}</span>
                      </div>
                      <div className="payment-amount">
                        <span className={payment.direction === 'credit' ? 'amount-positive' : 'amount-negative'}>
                          {payment.direction === 'credit' ? '+' : '-'}{Math.abs(payment.amount)} ₽
                        </span>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                    </div>
                  </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      )
    },
    materials: {
      title: 'Материалы',
      icon: <FaBook />,
      content: (
        <div className="materials-content">
          <div className="section-header">
            <h2>Учебные материалы</h2>
          </div>

          {isLoading && <div className="empty-state"><p>Загрузка данных...</p></div>}
          {error && <div className="empty-state"><p style={{ color: '#e53e3e' }}>Ошибка: {error}</p></div>}

          <div className="materials-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{materials.length}</span>
                <span className="stat-label">Материалов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{materials.filter(m => m.material_type === 'file').length}</span>
                <span className="stat-label">Файлов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{materials.filter(m => m.material_type === 'link').length}</span>
                <span className="stat-label">Ссылок</span>
              </div>
            </div>
          </div>

          {!isLoading && materials.length === 0 ? (
            <div className="empty-state">
              <p>Нет материалов</p>
            </div>
          ) : (
            <div className="materials-grid">
              {materials.map(material => (
                <div key={material.id} className="material-folder">
                  <div className="folder-header">
                    <FaBook className="folder-icon" />
                    <h4>{material.title}</h4>
                    <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto' }}>
                      {material.subject && `(${material.subject})`}
                    </span>
                  </div>
                  <div className="folder-content">
                    {material.description && (
                      <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
                        {material.description}
                      </p>
                    )}
                    {material.material_type === 'file' && material.original_name && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '8px',
                        backgroundColor: '#fffaf5',
                        borderRadius: '6px',
                        marginTop: '8px'
                      }}>
                        <span style={{ fontSize: '12px' }}>{getFileIcon(material.file_type)}</span>
                        <span style={{ fontSize: '13px', flex: 1 }}>{material.original_name}</span>
                        {material.file_size_kb && <span style={{ fontSize: '11px', color: '#999' }}>({material.file_size_kb} KB)</span>}
                        <button className="download-btn">
                          <FaDownload />
                        </button>
                      </div>
                    )}
                    {material.material_type === 'link' && material.external_url && (
                      <div style={{ marginTop: '8px' }}>
                        <a 
                          href={material.external_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#FE8200', textDecoration: 'none' }}
                        >
                          → Перейти по ссылке
                        </a>
                      </div>
                    )}
                    {material.material_type === 'text' && material.content && (
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#fff5eb',
                        borderRadius: '6px',
                        marginTop: '8px',
                        fontSize: '13px',
                        color: '#333'
                      }}>
                        {material.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    profile: {
      title: 'Личный кабинет',
      icon: <FaUserGraduate />,
      content: (
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <FaUserGraduate />
              </div>
              <div className="profile-info">
                <h1>{userData.fullName}</h1>
                <p className="profile-role">📚 Студент</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ID Профиля:</span>
                <span className="detail-value">{userData.userId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Статус:</span>
                <span className="detail-value status-active">✓ Активен</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Баланс:</span>
                <span className="detail-value balance">{balance} ₽</span>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-value">{lessons.length}</div>
                <div className="stat-label">Занятий</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{homeworks.length}</div>
                <div className="stat-label">Домашних работ</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{payments.length}</div>
                <div className="stat-label">Платежей</div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="action-btn secondary-btn">Редактировать профиль</button>
              <button className="action-btn logout-btn-profile" onClick={handleLogout}>Выйти из аккаунта</button>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="students-account">
      {/* Success попап */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-content">
            <FaCheck className="success-icon" />
            <span>{showSuccessPopup}</span>
          </div>
        </div>
      )}

      {/* Боковая панель */}
      <div className={`app-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="app-sidebar-header">
          <div className="app-user-info">
            <div className="app-user-avatar">
              <FaUserGraduate />
            </div>
            {sidebarOpen && (
              <div className="app-user-details">
                <h3>{userData.fullName}</h3>
                <p className="student-status">🎓 Студент</p>
              </div>
            )}
          </div>
          <button className="app-toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="app-sidebar-navigation">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              className={`app-nav-item ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
            >
              <span className="app-nav-icon">{section.icon}</span>
              {sidebarOpen && <span className="app-nav-text">{section.title}</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="app-sidebar-bottom">
            <div className="app-next-lesson-card">
              <h4>Ближайшее занятие:</h4>
              {(() => {
                // Фильтруем только "Предстоит" (upcoming), исключая 'missed' и 'completed'
                const upcomingLessons = lessons
                  .filter(l => getLessonStatus(l) === 'upcoming')
                  .sort((a, b) => new Date(a.lessonDate) - new Date(b.lessonDate)); // Сортируем по возрастанию (ближайший первый)

                if (upcomingLessons.length > 0) {
                  const nextLesson = upcomingLessons[0];
                  return (
                    <>
                      <p>{formatLessonDate(nextLesson.lessonDate)} в {formatLessonTime(nextLesson.lessonDate)}</p>
                      <small>{nextLesson.subject} - {nextLesson.topic}</small>
                    </>
                  );
                } else {
                  return <p>Нет предстоящих занятий</p>;
                }
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Основной контент */}
      <div className="main-content">
        <header className="content-header">
          <div className="welcome-message">
            <h1>Привет, {userData.fullName} !</h1>
            <p>Сегодня: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
          <div className="header-actions">
            <div className="balance-display">
              Баланс: <strong>{balance} ₽</strong>
            </div>
            <button className="action-btn">Настройки</button>
            <button className="action-btn logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </header>

        <div className="content-area">
          <div className="current-section">
            {sections[activeSection].content}
          </div>
        </div>
      </div>

      {/* Модальное окно загрузки */}
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        homework={selectedHomework}
        onSubmit={handleUploadWork}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
      />

      {/* Модальное окно подробной информации об уроке */}
      <LessonDetailModal
        isOpen={selectedLesson !== null}
        onClose={() => setSelectedLesson(null)}
        lesson={selectedLesson}
      />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-content">
            <FaCheck />
            <span>{showSuccessPopup}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsAccount;