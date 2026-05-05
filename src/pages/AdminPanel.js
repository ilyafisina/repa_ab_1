import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaUsers, FaMoneyBill, FaBook, FaBars, FaTimes, FaEdit, FaTrash, FaCheck, FaTimes as FaClose, FaFolder, FaFile, FaUpload, FaDownload, FaPlus, FaUserGraduate, FaTasks } from 'react-icons/fa';
import '../styles/adminPanel.css';
import '../styles/lessonModal.css';
import '../styles/sidebar.css';
import { adminAPI } from '../api/adminAPI';
import { tutorMaterialAPI } from '../api/tutorMaterialAPI';
import { getUserData } from '../api/authAPI';

// Модальное окно для добавления домашнего задания (вынесено за пределы компонента)
const AddHomeworkModal = React.memo(({
  isOpen,
  onClose,
  selectedStudent,
  homeworkFormData,
  handleHomeworkInputChange,
  handleCreateHomework,
  studentLessons,
  materials,
  setHomeworkFormData
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content homework-modal-large">
        <div className="modal-header">
          <h2>Добавить домашнее задание</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleCreateHomework} className="homework-form">
          <div className="student-info-banner">
            <FaUserGraduate />
            <div>
              <strong>Ученик:</strong> {selectedStudent?.fullName || selectedStudent?.name}
              <span className="student-grade">{selectedStudent?.grade ? ` • ${selectedStudent.grade} класс` : ''}</span>
            </div>
          </div>

          <div className="form-section">
            <h4>Основная информация</h4>

            <div className="form-group">
              <label>Название задания *</label>
              <input
                type="text"
                name="title"
                value={homeworkFormData.title}
                onChange={handleHomeworkInputChange}
                placeholder="Например: Решить квадратные уравнения"
                required
              />
            </div>

            <div className="form-group">
              <label>Урок *</label>
              <select
                name="lessonId"
                value={homeworkFormData.lessonId}
                onChange={handleHomeworkInputChange}
                required
              >
                <option value="">Выберите урок</option>
                {studentLessons.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.subject} - {lesson.topic} ({new Date(lesson.lessonDate).toLocaleDateString('ru-RU')})
                  </option>
                ))}
              </select>
              <small className="form-hint">Выберите урок, к которому относится это задание</small>
            </div>
          </div>

          <div className="form-section">
            <h4>Сроки выполнения</h4>

            <div className="form-row">
              <div className="form-group">
                <label>Дата выдачи</label>
                <input
                  type="date"
                  name="assignedDate"
                  value={homeworkFormData.assignedDate}
                  onChange={handleHomeworkInputChange}
                  disabled
                />
                <small className="form-hint">Автоматически устанавливается сегодняшняя дата</small>
              </div>
              <div className="form-group">
                <label>Срок выполнения *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={homeworkFormData.dueDate}
                  onChange={handleHomeworkInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <small className="form-hint">До какой даты нужно выполнить задание</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Описание задания</h4>

            <div className="form-group">
              <label>Подробное описание</label>
              <textarea
                name="description"
                value={homeworkFormData.description}
                onChange={handleHomeworkInputChange}
                placeholder="Опишите задание подробно: что нужно сделать, какие материалы использовать, на что обратить внимание..."
                rows="6"
              />
              <small className="form-hint">Чем подробнее описание, тем лучше ученик поймет задание</small>
            </div>
          </div>

          <div className="form-section">
            <h4>Материалы для выполнения (опционально)</h4>

            <div className="materials-attach-section">
              <p className="section-description">
                Вы можете прикрепить материалы из ваших папок, которые помогут ученику выполнить задание.
                Материалы будут доступны студенту в его личном кабинете.
              </p>

              <div className="materials-preview">
                {materials.length === 0 ? (
                  <div className="no-materials-message">
                    <FaFolder style={{ fontSize: '2rem', color: '#95a5a6', marginBottom: '10px' }} />
                    <p>У вас пока нет материалов</p>
                    <small>Создайте папки и загрузите материалы в разделе "Материалы"</small>
                  </div>
                ) : (
                  <div className="materials-folders-list">
                    {materials.map(folder => (
                      <div key={folder.id} className="material-folder-item">
                        <div className="folder-header-compact">
                          <FaFolder style={{ color: '#FE8200' }} />
                          <span className="folder-name">{folder.name}</span>
                          <span className="folder-files-count">({folder.files.length} файлов)</span>
                        </div>
                        {folder.files.length > 0 && (
                          <div className="folder-files-compact">
                            {folder.files.map(file => (
                              <label key={file.id} className="file-checkbox-item">
                                <input
                                  type="checkbox"
                                  checked={homeworkFormData.selectedMaterials.some(m => m.id === file.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setHomeworkFormData(prev => ({
                                        ...prev,
                                        selectedMaterials: [...prev.selectedMaterials, { id: file.id, name: file.originalName || file.title || file.name, folderId: folder.id }]
                                      }));
                                    } else {
                                      setHomeworkFormData(prev => ({
                                        ...prev,
                                        selectedMaterials: prev.selectedMaterials.filter(m => m.id !== file.id)
                                      }));
                                    }
                                  }}
                                />
                                <FaFile style={{ color: '#7f8c8d', fontSize: '0.9rem' }} />
                                <span className="file-name-compact">{file.originalName || file.title || file.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {homeworkFormData.selectedMaterials.length > 0 && (
                <div className="selected-materials-summary">
                  <strong>Выбрано материалов: {homeworkFormData.selectedMaterials.length}</strong>
                  <div className="selected-materials-list">
                    {homeworkFormData.selectedMaterials.map(material => (
                      <div key={material.id} className="selected-material-chip">
                        <FaFile />
                        <span>{material.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setHomeworkFormData(prev => ({
                              ...prev,
                              selectedMaterials: prev.selectedMaterials.filter(m => m.id !== material.id)
                            }));
                          }}
                          className="remove-material-btn"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="save-btn">
              <FaPlus /> Создать задание
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Модальное окно для создания папки (вынесено за пределы компонента)
const AddFolderModal = React.memo(({ isOpen, onClose, newFolderName, setNewFolderName, handleCreateFolder }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Создать новую папку</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleCreateFolder} className="folder-form">
          <div className="form-group">
            <label>Название папки *</label>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Например: Алгебра 8 класс"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="save-btn">
              Создать папку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Модальное окно для добавления/редактирования занятия (вынесено за пределы компонента)
const LessonModal = React.memo(({
  isOpen,
  onClose,
  isEdit = false,
  lesson = null,
  lessonFormData,
  handleLessonInputChange,
  handleLessonSubmit,
  students,
  studentsWithLessons,
  lessonTypes,
  durations
}) => {
  if (!isOpen) return null;

  // Генерируем варианты времени с шагом 30 минут
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      timeOptions.push(timeStr);
    }
  }

  // Обработчик добавления студента для групповых занятий
  const handleAddStudent = () => {
    const currentStudentIds = lessonFormData.studentIds || [];
    if (lessonFormData.studentId && !currentStudentIds.includes(lessonFormData.studentId)) {
      const event = {
        target: {
          name: 'studentIds',
          value: [...currentStudentIds, lessonFormData.studentId]
        }
      };
      handleLessonInputChange(event);
    }
  };

  // Обработчик удаления студента из группы
  const handleRemoveStudent = (studentId) => {
    const event = {
      target: {
        name: 'studentIds',
        value: (lessonFormData.studentIds || []).filter(id => id !== studentId)
      }
    };
    handleLessonInputChange(event);
  };

  const isGroupLesson = lessonFormData.type === 'group';
  const selectedStudentIds = lessonFormData.studentIds || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content homework-modal-large lesson-modal-enhanced">
        <div className="modal-header">
          <h2>{isEdit ? 'Редактировать занятие' : 'Создать новое занятие'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleLessonSubmit} className="lesson-form-enhanced">
          {/* Секция: Дата и время */}
          <div className="form-section lesson-section-datetime">
            <div className="section-icon">
              <FaCalendarAlt />
            </div>
            <div className="section-content">
              <h4>Дата и время занятия</h4>
              <div className="form-row">
                <div className="lesson-form-group">
                  <label>Дата *</label>
                  <input
                    type="date"
                    name="date"
                    value={lessonFormData.date}
                    onChange={handleLessonInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="lesson-form-group">
                  <label>Время *</label>
                  <select
                    name="time"
                    value={lessonFormData.time}
                    onChange={handleLessonInputChange}
                    required
                  >
                    <option value="">Выберите время</option>
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="lesson-form-group">
                  <label>Продолжительность *</label>
                  <select
                    name="duration"
                    value={lessonFormData.duration}
                    onChange={handleLessonInputChange}
                    required
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Секция: Формат занятия */}
          <div className="form-section lesson-section-format">
            <div className="section-icon">
              <FaBook />
            </div>
            <div className="section-content">
              <h4>Формат занятия</h4>
              <div className="lesson-type-cards">
                {lessonTypes.map(type => (
                  <label key={type.value} className={`lesson-type-card ${lessonFormData.type === type.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={lessonFormData.type === type.value}
                      onChange={handleLessonInputChange}
                    />
                    <div className="card-content">
                      <span className="card-icon">
                        {type.value === 'offline' && '🏠'}
                        {type.value === 'online' && '💻'}
                        {type.value === 'group' && '👥'}
                      </span>
                      <span className="card-label">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Для групповых занятий добавляем выбор формата проведения */}
              {lessonFormData.type === 'group' && (
                <div className="group-format-selector">
                  <label className="group-format-label">Как будет проводиться групповое занятие? *</label>
                  <div className="group-format-options">
                    <label className={`format-option-card ${lessonFormData.groupFormat === 'offline' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="groupFormat"
                        value="offline"
                        checked={lessonFormData.groupFormat === 'offline'}
                        onChange={handleLessonInputChange}
                      />
                      <span className="option-icon">🏠</span>
                      <span className="option-text">Очно</span>
                    </label>
                    <label className={`format-option-card ${lessonFormData.groupFormat === 'online' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="groupFormat"
                        value="online"
                        checked={lessonFormData.groupFormat === 'online'}
                        onChange={handleLessonInputChange}
                      />
                      <span className="option-icon">💻</span>
                      <span className="option-text">Онлайн</span>
                    </label>
                  </div>
                </div>
              )}

              {(lessonFormData.type === 'offline' || (lessonFormData.type === 'group' && lessonFormData.groupFormat === 'offline')) && (
                <div className="form-group location-input">
                  <label>Адрес проведения</label>
                  <input
                    type="text"
                    name="location"
                    value={lessonFormData.location}
                    onChange={handleLessonInputChange}
                    placeholder="г. Владимир, ул. Кукуевка, д. 10"
                  />
                </div>
              )}

              {(lessonFormData.type === 'online' || (lessonFormData.type === 'group' && lessonFormData.groupFormat === 'online')) && (
                <div className="form-group location-input">
                  <label>Ссылка на занятие</label>
                  <input
                    type="url"
                    name="onlineLink"
                    value={lessonFormData.onlineLink}
                    onChange={handleLessonInputChange}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Секция: Ученики */}
          <div className="form-section lesson-section-students">
            <div className="section-icon">
              <FaUsers />
            </div>
            <div className="section-content">
              <h4>{isGroupLesson ? 'Ученики (группа)' : 'Ученик'}</h4>

              {isGroupLesson ? (
                <>
                  <div className="group-student-selector">
                    <select
                      name="studentId"
                      value={lessonFormData.studentId}
                      onChange={handleLessonInputChange}
                      className="student-select-group"
                    >
                      <option value="">Выберите ученика</option>
                      {students.filter(s => !selectedStudentIds.includes(s.id.toString())).map(student => (
                        <option key={student.id} value={student.id}>
                          {student.fullName}, {student.grade} класс
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="add-student-btn"
                      onClick={handleAddStudent}
                      disabled={!lessonFormData.studentId}
                    >
                      <FaPlus /> Добавить
                    </button>
                  </div>

                  {selectedStudentIds.length > 0 && (
                    <div className="selected-students-list">
                      <p className="list-label">Выбрано учеников: {selectedStudentIds.length}</p>
                      {selectedStudentIds.map(studentId => {
                        const student = students.find(s => s.id.toString() === studentId);
                        return student ? (
                          <div key={studentId} className="selected-student-chip">
                            <FaUserGraduate />
                            <span>{student.fullName}, {student.grade} класс</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveStudent(studentId)}
                              className="remove-student-btn"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  {selectedStudentIds.length === 0 && (
                    <p className="no-students-message">Добавьте хотя бы одного ученика для группового занятия</p>
                  )}
                </>
              ) : (
                <div className="lesson-form-group">
                  <select
                    name="studentId"
                    value={lessonFormData.studentId}
                    onChange={handleLessonInputChange}
                    required
                  >
                    <option value="">Выберите ученика</option>
                    {studentsWithLessons.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.fullName}, {student.grade} класс
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Секция: Тема и предмет */}
          <div className="form-section lesson-section-topic">
            <div className="section-icon">
              <FaBook />
            </div>
            <div className="section-content">
              <h4>Тема занятия</h4>
              <div className="lesson-form-group">
                <label>Предмет *</label>
                <input
                  type="text"
                  name="subject"
                  value={lessonFormData.subject}
                  onChange={handleLessonInputChange}
                  placeholder="Математика, Алгебра, Геометрия..."
                  required
                />
              </div>

              <div className="lesson-form-group">
                <label>Тема урока *</label>
                <textarea
                  name="topic"
                  value={lessonFormData.topic}
                  onChange={handleLessonInputChange}
                  placeholder="Опишите тему занятия: что будете изучать, какие задачи решать..."
                  rows="4"
                  required
                />
              </div>
            </div>
          </div>

          {/* Секция: Стоимость */}
          <div className="form-section lesson-section-price">
            <div className="section-icon">
              <FaMoneyBill />
            </div>
            <div className="section-content">
              <h4>Стоимость</h4>
              <div className="lesson-form-group">
                <label>Цена занятия (₽)</label>
                <input
                  type="number"
                  name="price"
                  value={lessonFormData.price}
                  onChange={handleLessonInputChange}
                  placeholder="2000"
                  min="0"
                  step="100"
                />
                <small className="form-hint">Оставьте пустым, если занятие бесплатное</small>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="save-btn">
              {isEdit ? 'Сохранить изменения' : 'Создать занятие'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

const AdminPanel = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('schedule');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddHomeworkModal, setShowAddHomeworkModal] = useState(false);
  const [showCheckHomeworkModal, setShowCheckHomeworkModal] = useState(false);
  const [checkingHomework, setCheckingHomework] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [visibleLessonsCount, setVisibleLessonsCount] = useState(5);
  const fileInputRef = useRef(null);

  // Состояния для фильтров расписания
  const [lessonFilters, setLessonFilters] = useState({
    studentId: 'all',
    type: 'all',
    paymentStatus: 'all',
    dateRange: 'all'
  });

  // Получаем информацию о пользователе
  const userData = getUserData() || {
    fullName: 'Репетитор',
    email: 'tutor@example.com',
    role: 'Репетитор'
  };

  // Состояния для загрузки данных
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState(null);

  // Состояния для форм
  const [lessonFormData, setLessonFormData] = useState({
    date: '',
    time: '',
    duration: '1 час',
    studentId: '',
    studentIds: [], // Для групповых занятий
    type: 'offline',
    groupFormat: 'offline', // Формат для групповых занятий
    location: '',
    onlineLink: '',
    subject: '',
    topic: '',
    price: ''
  });

  const [homeworkFormData, setHomeworkFormData] = useState({
    title: '',
    subject: 'Математика',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    lessonId: '',
    attachments: [],
    selectedMaterials: [] // Для хранения выбранных материалов из папок
  });

  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const homeworkSubjects = ['Математика', 'Алгебра', 'Геометрия', 'Математический анализ', 'Теория вероятностей', 'Подготовка к ЕГЭ'];

  // Состояние для уроков студента (для выбора при создании ДЗ)
  const [studentLessons, setStudentLessons] = useState([]);

  const [lessons, setLessons] = useState([]);

  // Фильтруем учеников - показываем только тех, у кого есть занятия с этим преподавателем
  const studentsWithLessons = students.filter(student =>
    lessons.some(lesson => lesson.studentId === student.id)
  );

  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: 'Алгебра 8 класс',
      type: 'folder',
      files: [
        { id: 1, name: 'Квадратные уравнения.pdf', size: '2.4 МБ', type: 'pdf', uploadDate: '2024-01-15' }
      ]
    }
  ]);

  const lessonTypes = [
    { value: 'offline', label: 'Репетиторство на дому' },
    { value: 'online', label: 'Онлайн занятие' },
    { value: 'group', label: 'Групповое занятие' }
  ];

  const durations = ['30 минут', '1 час', '1.5 часа', '2 часа', '2.5 часа', '3 часа'];

  // Загружаем учеников при монтировании компонента
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const data = await adminAPI.getStudents();

        // Загружаем домашние задания для каждого ученика
        const studentsWithHomeworks = await Promise.all(
          (data || []).map(async (student) => {
            try {
              const homeworks = await adminAPI.getStudentHomeworks(student.id);
              return { ...student, homeworks: homeworks || [] };
            } catch (error) {
              console.error(`Ошибка при загрузке ДЗ для ученика ${student.id}:`, error);
              return { ...student, homeworks: [] };
            }
          })
        );

        setStudents(studentsWithHomeworks);
        setStudentsError(null);
      } catch (error) {
        console.error('Ошибка при загрузке учеников:', error);
        setStudentsError(error.message);
        setStudents([]);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    const loadMaterials = async () => {
      try {
        const folders = await tutorMaterialAPI.getFolders();
        setMaterials(folders || []);
      } catch (error) {
        console.error('Ошибка при загрузке материалов:', error);
      }
    };

    const loadLessons = async () => {
      try {
        const lessonsData = await adminAPI.getTutorLessons();
        setLessons(lessonsData || []);
      } catch (error) {
        console.error('Ошибка при загрузке занятий:', error);
      }
    };

    loadLessons();
    loadMaterials();
    loadStudents();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    window.location.href = '/';
  };

  // Функции для расписания
  const handleAddLesson = () => {
    // Сохраняем текущие данные формы, только сбрасываем обязательные поля
    setLessonFormData(prev => ({
      ...prev,
      date: '',
      time: '',
      student: '',
      topic: ''
    }));
    setShowAddLessonModal(true);
  };

  const handleEditLesson = (lesson) => {
    setCurrentLesson(lesson);

    // Извлекаем дату и время из lessonDate
    const lessonDateTime = new Date(lesson.lessonDate);
    // Вычитаем 3 часа для компенсации московского времени
    lessonDateTime.setHours(lessonDateTime.getHours() - 3);
    const date = lessonDateTime.toISOString().split('T')[0];
    const time = lessonDateTime.toTimeString().slice(0, 5);

    // Преобразуем минуты в текст продолжительности
    const durationMap = {
      30: '30 минут',
      60: '1 час',
      90: '1.5 часа',
      120: '2 часа',
      150: '2.5 часа',
      180: '3 часа'
    };

    setLessonFormData({
      date: date,
      time: time,
      duration: durationMap[lesson.durationMin] || '1 час',
      studentId: lesson.studentId.toString(),
      type: lesson.format,
      location: lesson.location || '',
      onlineLink: lesson.onlineLink || '',
      subject: lesson.subject,
      topic: lesson.topic,
      price: lesson.price.toString()
    });
    setShowEditLessonModal(true);
  };

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Вы уверены, что хотите удалить это занятие?')) {
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      setShowSuccessPopup('Занятие успешно удалено!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const toggleLessonStatus = async (lessonId) => {
    try {
      await adminAPI.toggleLessonPayment(lessonId);

      // Перезагружаем список занятий после успешного обновления
      const lessonsData = await adminAPI.getTutorLessons();
      setLessons(lessonsData || []);

      setShowSuccessPopup('Статус оплаты обновлен!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      alert('Ошибка при изменении статуса оплаты: ' + error.message);
    }
  };

  const getLessonStatusBadge = (status) => {
    return status === 'paid' 
      ? <span className="status-badge paid">Оплачено</span>
      : <span className="status-badge not-paid">Не оплачено</span>;
  };

  const getLessonStatusIcon = (status) => {
    return status === 'paid' 
      ? <FaCheck className="status-icon paid" />
      : <FaClose className="status-icon not-paid" />;
  };

  // Функции для управления материалами
  const handleAddFolder = () => {
    setNewFolderName('');
    setShowAddFolderModal(true);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      alert('Введите название папки');
      return;
    }

    try {
      const folderData = {
        name: newFolderName,
        description: '',
        subject: ''
      };

      const created = await tutorMaterialAPI.createFolder(folderData);
      setMaterials([...materials, created]);
      setShowAddFolderModal(false);
      setShowSuccessPopup('Папка успешно создана!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      alert('Ошибка при создании папки: ' + error.message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту папку? Все файлы внутри также будут удалены.')) {
      try {
        await tutorMaterialAPI.deleteFolder(folderId);
        setMaterials(materials.filter(material => material.id !== folderId));
        if (currentFolder?.id === folderId) {
          setCurrentFolder(null);
        }
        setShowSuccessPopup('Папка успешно удалена!');
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (error) {
        alert('Ошибка при удалении папки: ' + error.message);
      }
    }
  };

  const handleOpenFolder = (folder) => {
    setCurrentFolder(folder);
  };

  const handleBackToFolders = () => {
    setCurrentFolder(null);
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadFiles = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length || !currentFolder) {
      alert('Выберите файлы для загрузки');
      return;
    }

    try {
      // Загружаем каждый файл
      const uploadPromises = selectedFiles.map(file =>
        tutorMaterialAPI.uploadFile(currentFolder.id, file)
      );

      const uploadedFiles = await Promise.all(uploadPromises);

      // Обновляем текущую папку
      const updatedFolder = {
        ...currentFolder,
        files: [...(currentFolder.files || []), ...uploadedFiles],
        fileCount: (currentFolder.fileCount || 0) + uploadedFiles.length
      };

      // Обновляем список материалов
      const updatedMaterials = materials.map(material =>
        material.id === currentFolder.id ? updatedFolder : material
      );

      setMaterials(updatedMaterials);
      setCurrentFolder(updatedFolder);
      setShowUploadModal(false);
      setSelectedFiles([]);
      setShowSuccessPopup('Файлы успешно загружены!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      alert('Ошибка при загрузке файлов: ' + error.message);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      try {
        await tutorMaterialAPI.deleteFile(fileId);

        const updatedFolder = {
          ...currentFolder,
          files: currentFolder.files.filter(file => file.id !== fileId),
          fileCount: (currentFolder.fileCount || 0) - 1
        };

        const updatedMaterials = materials.map(material =>
          material.id === currentFolder.id ? updatedFolder : material
        );

        setMaterials(updatedMaterials);
        setCurrentFolder(updatedFolder);
        setShowSuccessPopup('Файл успешно удален!');
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (error) {
        alert('Ошибка при удалении файла: ' + error.message);
      }
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      await tutorMaterialAPI.downloadFile(file.id, file.originalName || file.title || file.name);
    } catch (error) {
      alert('Ошибка при скачивании файла: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (typeof bytes === 'string') return bytes;
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      pdf: 'pdf',
      doc: 'doc',
      docx: 'doc',
      xls: 'xlsx',
      xlsx: 'xlsx',
      ppt: 'ppt',
      pptx: 'ppt',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      txt: 'txt'
    };
    return types[ext] || 'file';
  };

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

  // Функции для управления учениками и домашними заданиями
  const handleSelectStudent = async (student) => {
    try {
      // Загружаем домашние задания ученика из БД
      const homeworks = await adminAPI.getStudentHomeworks(student.id);
      
      // Добавляем домашние задания к ученику
      const studentWithHomeworks = {
        ...student,
        homeworks: homeworks || []
      };
      
      setSelectedStudent(studentWithHomeworks);
    } catch (error) {
      console.error('Ошибка при загрузке домашних заданий:', error);
      // Используем ученика без домашних заданий, если произошла ошибка
      const studentWithEmptyHomeworks = {
        ...student,
        homeworks: []
      };
      setSelectedStudent(studentWithEmptyHomeworks);
      alert('Ошибка при загрузке домашних заданий: ' + error.message);
    }
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
  };

  const handleDownloadStudentFile = async (fileId, fileName) => {
    try {
      const response = await adminAPI.downloadHomeworkFile(fileId);

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

  const handleAddHomework = async () => {
    // Загружаем уроки студента для выбора
    try {
      console.log('Загрузка уроков для студента:', selectedStudent.id);
      const lessons = await adminAPI.getStudentLessons(selectedStudent.id);
      console.log('Загружено уроков:', lessons);
      setStudentLessons(lessons || []);
    } catch (error) {
      console.error('Ошибка при загрузке уроков:', error);
      setStudentLessons([]);
      alert('Ошибка при загрузке уроков: ' + error.message);
    }

    // Сбрасываем форму
    setHomeworkFormData({
      title: '',
      subject: 'Математика',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: '',
      lessonId: '',
      attachments: [],
      selectedMaterials: []
    });
    setShowAddHomeworkModal(true);
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    if (!homeworkFormData.title || !homeworkFormData.dueDate || !homeworkFormData.lessonId) {
      alert('Пожалуйста, заполните все обязательные поля (название, срок выполнения и урок)');
      return;
    }

    try {
      const newHomework = {
        title: homeworkFormData.title,
        description: homeworkFormData.description,
        dueDate: homeworkFormData.dueDate,
        lessonId: parseInt(homeworkFormData.lessonId),
        status: 'assigned',
        materialIds: homeworkFormData.selectedMaterials.map(m => m.id) // Добавляем ID материалов
      };

      await adminAPI.createHomework(selectedStudent.id, newHomework);

      // Обновляем список домашних заданий студента
      const updatedHomeworks = await adminAPI.getStudentHomeworks(selectedStudent.id);
      setSelectedStudent(prev => ({
        ...prev,
        homeworks: updatedHomeworks || []
      }));

      // Обновляем также в общем списке студентов
      setStudents(prevStudents =>
        prevStudents.map(s =>
          s.id === selectedStudent.id
            ? { ...s, homeworks: updatedHomeworks || [] }
            : s
        )
      );

      setShowAddHomeworkModal(false);
      setShowSuccessPopup('Домашнее задание успешно создано!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      alert('Ошибка при создании домашнего задания: ' + error.message);
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    if (window.confirm('Вы уверены, что хотите удалить это домашнее задание?')) {
      try {
        await adminAPI.deleteHomework(homeworkId);
        
        // Обновляем список домашних заданий студента
        const updatedHomeworks = await adminAPI.getStudentHomeworks(selectedStudent.id);
        setSelectedStudent(prev => ({
          ...prev,
          homeworks: updatedHomeworks || []
        }));

        setShowSuccessPopup('Домашнее задание успешно удалено!');
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (error) {
        alert('Ошибка при удалении домашнего задания: ' + error.message);
      }
    }
  };

  const handleAddScore = (homeworkId, score) => {
    const updatedStudents = studentsWithLessons.map(student =>
      student.id === selectedStudent.id
        ? {
            ...student,
            homeworks: student.homeworks.map(hw =>
              hw.id === homeworkId ? { ...hw, score: score } : hw
            )
          }
        : student
    );

    setStudents(updatedStudents);
    setSelectedStudent(updatedStudents.find(s => s.id === selectedStudent.id));
    setShowSuccessPopup('Оценка добавлена!');
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleCheckHomework = (homework) => {
    setCheckingHomework(homework);
    setShowCheckHomeworkModal(true);
  };

  const handleSubmitHomeworkCheck = async (grade, comment) => {
    try {
      await adminAPI.checkHomework(checkingHomework.id, grade, comment);

      // Обновляем статус задания на "checked"
      const updatedStudents = studentsWithLessons.map(student =>
        student.id === selectedStudent.id
          ? {
              ...student,
              homeworks: student.homeworks.map(hw =>
                hw.id === checkingHomework.id
                  ? { ...hw, status: 'checked', score: `${grade}/5`, comment: comment }
                  : hw
              )
            }
          : student
      );

      setStudents(updatedStudents);
      setSelectedStudent(updatedStudents.find(s => s.id === selectedStudent.id));
      setShowCheckHomeworkModal(false);
      setCheckingHomework(null);
      setShowSuccessPopup('Задание проверено!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      alert('Ошибка при проверке задания: ' + error.message);
    }
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

  const getHomeworkStats = (student) => {
    if (!student.homeworks) {
      return { total: 0, completed: 0, inProgress: 0, newCount: 0 };
    }
    const total = student.homeworks.length;
    const completed = student.homeworks.filter(hw => hw.status === 'checked').length;
    const inProgress = student.homeworks.filter(hw => hw.status === 'submitted').length;
    const newCount = student.homeworks.filter(hw => hw.status === 'assigned').length;
    
    return { total, completed, inProgress, newCount };
  };

  // Обработчики для форм
  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setLessonFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHomeworkInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setHomeworkFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();

    // Проверка для групповых занятий
    const isGroupLesson = lessonFormData.type === 'group';
    const studentIds = isGroupLesson ? lessonFormData.studentIds : [lessonFormData.studentId];

    if (!lessonFormData.date || !lessonFormData.time || !lessonFormData.topic || !lessonFormData.subject) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (studentIds.length === 0 || (studentIds.length === 1 && !studentIds[0])) {
      alert('Пожалуйста, выберите хотя бы одного ученика');
      return;
    }

    try {
      // Создаем дату и время и добавляем 3 часа для компенсации московского времени
      const localDateTime = new Date(`${lessonFormData.date}T${lessonFormData.time}:00`);
      localDateTime.setHours(localDateTime.getHours() + 3);

      // Форматируем в строку для backend
      const year = localDateTime.getFullYear();
      const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
      const day = String(localDateTime.getDate()).padStart(2, '0');
      const hours = String(localDateTime.getHours()).padStart(2, '0');
      const minutes = String(localDateTime.getMinutes()).padStart(2, '0');
      const dateTime = `${year}-${month}-${day}T${hours}:${minutes}:00`;

      // Преобразуем продолжительность в минуты
      const durationMap = {
        '30 минут': 30,
        '1 час': 60,
        '1.5 часа': 90,
        '2 часа': 120,
        '2.5 часа': 150,
        '3 часа': 180
      };

      const lessonData = {
        subject: lessonFormData.subject,
        topic: lessonFormData.topic,
        lessonDate: dateTime,
        durationMin: durationMap[lessonFormData.duration] || 60,
        format: lessonFormData.type === 'group' ? lessonFormData.groupFormat : lessonFormData.type,
        location: (lessonFormData.type === 'offline' || (lessonFormData.type === 'group' && lessonFormData.groupFormat === 'offline')) ? lessonFormData.location : null,
        onlineLink: (lessonFormData.type === 'online' || (lessonFormData.type === 'group' && lessonFormData.groupFormat === 'online')) ? lessonFormData.onlineLink : null,
        price: lessonFormData.price ? parseFloat(lessonFormData.price) : 0
      };

      // Создаем занятие для каждого студента
      const createPromises = studentIds.map(studentId =>
        adminAPI.createLesson(parseInt(studentId), lessonData)
      );

      await Promise.all(createPromises);

      // Перезагружаем список уроков
      const lessonsData = await adminAPI.getTutorLessons();
      setLessons(lessonsData || []);

      const message = isGroupLesson
        ? `Групповое занятие успешно создано для ${studentIds.length} учеников!`
        : 'Занятие успешно добавлено!';

      setShowSuccessPopup(message);
      setShowAddLessonModal(false);

      // Сбрасываем форму
      setLessonFormData({
        date: '',
        time: '',
        duration: '1 час',
        studentId: '',
        studentIds: [],
        type: 'offline',
        groupFormat: 'offline',
        location: '',
        onlineLink: '',
        subject: '',
        topic: '',
        price: ''
      });

      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      alert('Ошибка при создании занятия: ' + error.message);
    }
  };

  // Модальное окно для загрузки файлов
  const UploadModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Загрузить файлы в {currentFolder?.name}</h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleUploadFiles} className="upload-form">
            <div className="form-group">
              <label>Выберите файлы *</label>
              <div 
                className="file-drop-zone"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload className="upload-icon" />
                <p>Нажмите для выбора файлов или перетащите их сюда</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Выбранные файлы:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="selected-file">
                      <span>{file.name}</span>
                      <span className="file-size">({formatFileSize(file.size)})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="save-btn" disabled={!selectedFiles.length}>
                Загрузить файлы
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CheckHomeworkModal = ({ isOpen, onClose, homework, onSubmit }) => {
    const [grade, setGrade] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen || !homework) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(grade, comment);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content homework-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Проверка домашнего задания</h3>
            <button className="close-btn" onClick={onClose}>
              <FaClose />
            </button>
          </div>

          <div className="homework-info">
            <h4>{homework.title}</h4>
            <p className="subject">{homework.subject}</p>
            <p className="student-name">Ученик: {selectedStudent?.name}</p>
            <p className="assigned-info">Выдал: {homework.assignedBy} • Выдано: {new Date(homework.assignedDate).toLocaleDateString('ru-RU')} • Срок: {new Date(homework.dueDate).toLocaleDateString('ru-RU')}</p>
            {homework.description && (
              <div className="homework-description-preview">
                <strong>Описание:</strong>
                <p>{homework.description}</p>
              </div>
            )}
          </div>

          {homework.studentWork && homework.studentWork.length > 0 && (
            <div className="submitted-work">
              <h4>Работа ученика:</h4>
              <div className="work-files">
                {homework.studentWork.map(work => (
                  <div key={work.id} className="work-file">
                    <FaFile />
                    <span>{work.name}</span>
                    <span className="submit-date">Отправлено: {work.submittedDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Оценка *</label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value))}
                required
              >
                <option value={5}>5 - Отлично</option>
                <option value={4}>4 - Хорошо</option>
                <option value={3}>3 - Удовлетворительно</option>
                <option value={2}>2 - Неудовлетворительно</option>
                <option value={1}>1 - Плохо</option>
              </select>
            </div>

            <div className="form-group">
              <label>Комментарий</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Оставьте комментарий к работе ученика..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="save-btn">
                <FaCheck /> Завершить проверку
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const sections = {
    schedule: {
      title: 'Расписание занятий',
      icon: <FaCalendarAlt />,
      content: (
        <div className="schedule-content">
          <div className="section-header-actions">
            <h2></h2>
            <div className="header-buttons-group">
              <button
                className={`archive-toggle-btn ${showArchive ? 'active' : ''}`}
                onClick={() => setShowArchive(!showArchive)}
              >
                 {showArchive ? 'Текущие' : 'Архив'}
              </button>
              <button className="add-lesson-btn" onClick={handleAddLesson}>
                + Добавить занятие
              </button>
            </div>
          </div>

          {/* Фильтры для расписания */}
          <div className="lesson-filters">
            <div className="filter-group">
              <label>Ученик:</label>
              <select
                value={lessonFilters.studentId}
                onChange={(e) => setLessonFilters({...lessonFilters, studentId: e.target.value})}
              >
                <option value="all">Все ученики</option>
                {studentsWithLessons.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Тип занятия:</label>
              <select
                value={lessonFilters.type}
                onChange={(e) => setLessonFilters({...lessonFilters, type: e.target.value})}
              >
                <option value="all">Все типы</option>
                <option value="offline">Репетиторство на дому</option>
                <option value="online">Онлайн занятие</option>
                <option value="group">Групповое занятие</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Оплата:</label>
              <select
                value={lessonFilters.paymentStatus}
                onChange={(e) => setLessonFilters({...lessonFilters, paymentStatus: e.target.value})}
              >
                <option value="all">Все</option>
                <option value="paid">Оплачено</option>
                <option value="not_paid">Не оплачено</option>
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
                studentId: 'all',
                type: 'all',
                paymentStatus: 'all',
                dateRange: 'all'
              })}
            >
              Сбросить фильтры
            </button>
          </div>

          <div className="upcoming-lessons">
            <h3>{showArchive ? 'Архив занятий' : 'Ближайшие занятия'}</h3>
            {(() => {
              const now = new Date();
              let filteredLessons = showArchive
                ? lessons.filter(l => new Date(l.lessonDate) < now)
                : lessons.filter(l => new Date(l.lessonDate) >= now);

              // Применяем фильтры
              if (lessonFilters.studentId !== 'all') {
                filteredLessons = filteredLessons.filter(l => l.studentId === parseInt(lessonFilters.studentId));
              }

              if (lessonFilters.type !== 'all') {
                filteredLessons = filteredLessons.filter(l => l.format === lessonFilters.type);
              }

              if (lessonFilters.paymentStatus !== 'all') {
                const isPaid = lessonFilters.paymentStatus === 'paid';
                filteredLessons = filteredLessons.filter(l => l.isPaid === isPaid);
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
                    {!showArchive && (
                      <button className="add-lesson-btn" onClick={handleAddLesson}>
                        + Добавить первое занятие
                      </button>
                    )}
                  </div>
                );
              }

              const sortedLessons = filteredLessons.sort((a, b) => {
                const dateA = new Date(a.lessonDate);
                const dateB = new Date(b.lessonDate);
                return showArchive ? dateB - dateA : dateA - dateB;
              });

              const visibleLessons = sortedLessons.slice(0, visibleLessonsCount);
              const hasMore = sortedLessons.length > visibleLessonsCount;

              return (
                <>
                  {visibleLessons.map(lesson => {
                    // Форматируем дату и время из lessonDate
                    const lessonDateTime = new Date(lesson.lessonDate);
                    // Вычитаем 3 часа для компенсации московского времени
                    lessonDateTime.setHours(lessonDateTime.getHours() - 3);
                    const formattedDate = lessonDateTime.toLocaleDateString('ru-RU');
                    const formattedTime = lessonDateTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                    const durationText = lesson.durationMin ? `${lesson.durationMin} мин` : '';

                    // Находим студента по ID
                    const student = students.find(s => s.id === lesson.studentId);
                    const studentName = student ? `${student.fullName}, ${student.grade} класс` : 'Неизвестный ученик';

                    // Форматируем тип занятия
                    const formatMap = {
                      'online': 'Онлайн занятие',
                      'offline': 'Репетиторство на дому',
                      'group': 'Групповое занятие'
                    };
                    const formatText = formatMap[lesson.format] || lesson.format;

                    return (
                      <div key={lesson.id} className="lesson-card">
                        <div className="lesson-header">
                          <div className="lesson-date-time">
                            <span className="lesson-date">{formattedDate}</span>
                            <span className="lesson-time">{formattedTime} ({durationText})</span>
                          </div>
                          <div className="lesson-actions">
                            <button
                              className="status-toggle-btn"
                              onClick={() => toggleLessonStatus(lesson.id)}
                              title={lesson.isPaid ? 'Отметить как неоплаченное' : 'Отметить как оплаченное'}
                            >
                              {getLessonStatusIcon(lesson.isPaid ? 'paid' : 'not_paid')}
                            </button>
                            {getLessonStatusBadge(lesson.isPaid ? 'paid' : 'not_paid')}
                            <button
                              className="edit-btn"
                              onClick={() => handleEditLesson(lesson)}
                              title="Редактировать"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              title="Удалить"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <div className="lesson-details">
                          <div className="lesson-student"><strong>Ученик:</strong> {studentName}</div>
                          <div className="lesson-type"><strong>Предмет:</strong> {lesson.subject}</div>
                          <div className="lesson-type"><strong>Формат:</strong> {formatText}</div>
                          <div className="lesson-location"><strong>Место:</strong> {lesson.location || lesson.onlineLink || 'Не указано'}</div>
                          <div className="lesson-topic"><strong>Тема:</strong> {lesson.topic}</div>
                          <div className="lesson-price"><strong>Стоимость:</strong> {lesson.price} ₽</div>
                        </div>
                      </div>
                    );
                  })}

                  {hasMore && (
                    <div className="load-more-container">
                      <button
                        className="load-more-btn"
                        onClick={() => setVisibleLessonsCount(prev => prev + 5)}
                      >
                        Показать еще ({sortedLessons.length - visibleLessonsCount})
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )
    },
    students: {
      title: 'Мои ученики',
      icon: <FaUsers />,
      content: (
        <div className="students-content">
          {!selectedStudent ? (
            // Вид списка учеников
            <>
              <div className="section-header-actions">
                <h2>Мои ученики</h2>
              </div>

              {isLoadingStudents ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Загрузка учеников...</p>
                </div>
              ) : studentsError ? (
                <div className="error-state">
                  <p className="error-message">Ошибка при загрузке учеников: {studentsError}</p>
                  <button 
                    className="retry-btn"
                    onClick={() => {
                      setIsLoadingStudents(true);
                      adminAPI.getStudents()
                        .then(data => {
                          setStudents(data || []);
                          setStudentsError(null);
                        })
                        .catch(error => {
                          setStudentsError(error.message);
                        })
                        .finally(() => setIsLoadingStudents(false));
                    }}
                  >
                    Попробовать снова
                  </button>
                </div>
              ) : students.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>Учеников нет</h3>
                  <p>У вас пока нет учеников. Когда студенты зарегистрируются, они появятся здесь.</p>
                </div>
              ) : (
                <>
                  <div className="students-stats">
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-number">{students.length}</span>
                        <span className="stat-label">Всего учеников</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">
                          {students.reduce((total, student) => total + (student.homeworks ? student.homeworks.length : 0), 0)}
                        </span>
                        <span className="stat-label">Всего заданий</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">
                          {students.reduce((total, student) => 
                            total + (student.homeworks ? student.homeworks.filter(hw => hw.status === 'checked').length : 0), 0
                          )}
                        </span>
                        <span className="stat-label">Выполнено</span>
                      </div>
                    </div>
                  </div>

                  <div className="students-grid">
                    {studentsWithLessons.map(student => {
                      if (!student || !student.id) return null;
                      const stats = getHomeworkStats(student);
                      return (
                        <div key={student.id} className="student-card">
                          <div className="student-header">
                            <div className="student-avatar">
                              <FaUserGraduate />
                            </div>
                            <div className="student-info">
                              <h4>{student.fullName || student.name || 'Неизвестный ученик'}</h4>
                              <p>{student.grade ? `${student.grade} класс` : ''}</p>
                              <p className="student-contact">{student.phone}</p>
                            </div>
                          </div>
                          
                          <div className="homework-stats">
                            <div className="stat-mini">
                              <span className="stat-number">{stats.total}</span>
                              <span className="stat-label">Всего</span>
                            </div>
                            <div className="stat-mini">
                              <span className="stat-number">{stats.completed}</span>
                              <span className="stat-label">Выполнено</span>
                            </div>
                            <div className="stat-mini">
                              <span className="stat-number">{stats.inProgress}</span>
                              <span className="stat-label">В работе</span>
                            </div>
                          </div>

                          <div className="student-actions">
                            <button 
                              className="view-btn"
                              onClick={() => handleSelectStudent(student)}
                            >
                              <FaTasks /> Домашние задания
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            // Вид домашних заданий ученика
            <>
              <div className="student-detail-header">
                <button className="back-btn" onClick={handleBackToStudents}>
                  ← Назад к ученикам
                </button>
                <div className="student-detail-info">
                  <div className="student-avatar large">
                    <FaUserGraduate />
                  </div>
                  <div>
                    <h2>{selectedStudent.fullName || selectedStudent.name}</h2>
                    <p>{selectedStudent.grade ? `${selectedStudent.grade} класс` : ''} • {selectedStudent.phone}</p>
                    <p>Email: {selectedStudent.email}</p>
                  </div>
                </div>
                <button className="add-homework-btn" onClick={handleAddHomework}>
                  <FaPlus /> Новое задание
                </button>
              </div>

              <div className="homeworks-list">
                <div className="section-header-actions">
                  <h3>Домашние задания</h3>
                  <div className="homework-actions-header">
                    <div className="homework-stats-detailed">
                      <span>Всего: {(selectedStudent.homeworks || []).length}</span>
                      <span>Выполнено: {(selectedStudent.homeworks || []).filter(hw => hw.status === 'checked').length}</span>
                      <span>Отправлено: {(selectedStudent.homeworks || []).filter(hw => hw.status === 'submitted').length}</span>
                    </div>
                    <button 
                      className="update-statuses-btn"
                      onClick={async () => {
                        try {
                          await adminAPI.updateHomeworkStatuses();
                          setShowSuccessPopup('Статусы обновлены!');
                          setTimeout(() => setShowSuccessPopup(false), 3000);
                        } catch (error) {
                          alert('Ошибка при обновлении статусов: ' + error.message);
                        }
                      }}
                      title="Обновить статусы домашних заданий"
                    >
                      <FaCheck /> Обновить статусы
                    </button>
                  </div>
                </div>

{(selectedStudent.homeworks || []).length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>Заданий пока нет</h3>
                    <p>Добавьте первое домашнее задание для этого ученика</p>
                    <button className="add-homework-btn" onClick={handleAddHomework}>
                      <FaPlus /> Добавить задание
                    </button>
                  </div>
) : (
                  (selectedStudent.homeworks || []).map(homework => (
                    <div key={homework.id} className="homework-card">
                      <div className="homework-header">
                        <div className="homework-title">
                          <h4>{homework.title}</h4>
                          {homework.subject && <span className="homework-subject">{homework.subject}</span>}
                          {homework.assignedBy && <span className="homework-assigned-by">Выдал: {homework.assignedBy}</span>}
                        </div>
                        <div className="homework-meta">
                          {getHomeworkStatusBadge(homework.status)}
                          {homework.score && (
                            <span className="homework-score">{homework.score}</span>
                          )}
                        </div>
                      </div>

                      <div className="homework-dates">
                        <div className="date-item">
                          <strong>Выдано:</strong> {new Date(homework.assignedDate).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="date-item">
                          <strong>Срок:</strong> {new Date(homework.dueDate).toLocaleDateString('ru-RU')}
                        </div>
                        {(homework.studentWork || []).length > 0 && homework.studentWork[0].submittedDate && (
                          <div className="date-item">
                            <strong>Отправлено:</strong> {new Date(homework.studentWork[0].submittedDate).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                      </div>

                      {homework.description && (
                        <div className="homework-description">
                          <p>{homework.description}</p>
                        </div>
                      )}

                      {(homework.attachments || []).length > 0 && (
                        <div className="homework-attachments">
                          <strong>Материалы для выполнения:</strong>
                          <div className="attachments-list">
                            {(homework.attachments || []).map(attachment => (
                              <div key={attachment.id} className="attachment-item">
                                <FaFile />
                                <span>{attachment.fileName}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(homework.studentWork || []).length > 0 && (
                        <div className="student-work">
                          <strong>Работа ученика:</strong>
                          <div className="attachments-list">
                            {homework.studentWork.map(work => (
                              <div key={work.id} className="attachment-item submitted">
                                <FaFile />
                                <div className="file-details">
                                  <span className="file-name">{work.fileName || work.name}</span>
                                  <span className="submit-date">Отправлено: {new Date(work.uploadedAt || work.submittedDate).toLocaleDateString('ru-RU')}</span>
                                </div>
                                <button
                                  className="download-btn"
                                  onClick={() => handleDownloadStudentFile(work.id, work.fileName || work.name)}
                                  title="Скачать файл"
                                >
                                  <FaDownload />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {homework.comment && (
                        <div className="homework-comment">
                          <strong>Комментарий преподавателя:</strong>
                          <p>{homework.comment}</p>
                        </div>
                      )}

                      <div className="homework-actions">
                        <div className="status-actions">
                          {homework.status === 'submitted' && (
                            <button 
                              className="check-btn"
                              onClick={() => handleCheckHomework(homework)}
                            >
                              <FaCheck /> Проверить
                            </button>
                          )}
                        </div>
                        
                        <div className="action-buttons">
                          {homework.status === 'checked' && !homework.score && (
                            <select 
                              className="score-select"
                              onChange={(e) => handleAddScore(homework.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="">Оценить</option>
                              <option value="5/5">5/5</option>
                              <option value="4/5">4/5</option>
                              <option value="3/5">3/5</option>
                              <option value="2/5">2/5</option>
                              <option value="1/5">1/5</option>
                            </select>
                          )}
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteHomework(homework.id)}
                            title="Удалить задание"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )
    },
    income: {
      title: 'Доходы',
      icon: <FaMoneyBill />,
      content: (
        <div className="income-content">
          <h2>Финансы и доходы</h2>
          <div className="income-stats">
            <div className="stat-card">
              <h3>Общий доход</h3>
              <div className="stat-amount">{lessons.reduce((sum, lesson) => sum + (lesson.price || 0), 0)} ₽</div>
              <p>за все время</p>
            </div>
          </div>
        </div>
      )
    },
    materials: {
      title: 'Материалы',
      icon: <FaBook />,
      content: (
        <div className="materials-content">
          {!currentFolder ? (
            // Вид списка папок
            <>
              <div className="section-header-actions">
                <h2>Учебные материалы</h2>
                <button className="add-folder-btn" onClick={handleAddFolder}>
                  <FaPlus /> Новая папка
                </button>
              </div>
              
              <div className="materials-stats">
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">{materials.length}</span>
                    <span className="stat-label">Папок</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {materials.reduce((total, folder) => total + folder.files.length, 0)}
                    </span>
                    <span className="stat-label">Всего файлов</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {(materials.reduce((total, folder) =>
                        total + (folder.files || []).reduce((size, file) =>
                          size + (file.fileSizeKb || 0), 0
                        ), 0) / 1024).toFixed(2)} МБ
                    </span>
                    <span className="stat-label">Общий размер</span>
                  </div>
                </div>
              </div>

              <div className="folders-grid">
                {materials.map(folder => (
                  <div key={folder.id} className="folder-card">
                    <div className="folder-icon">
                      <FaFolder />
                    </div>
                    <div className="folder-info">
                      <h4>{folder.name}</h4>
                      <p>{folder.fileCount || folder.files.length} файлов</p>
                      <p className="folder-size">
                        {folder.totalSize ? (folder.totalSize / (1024 * 1024)).toFixed(2) : '0.00'} МБ
                      </p>
                    </div>
                    <div className="folder-actions">
                      <button 
                        className="open-btn"
                        onClick={() => handleOpenFolder(folder)}
                        title="Открыть папку"
                      >
                        Открыть
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteFolder(folder.id)}
                        title="Удалить папку"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                
                {materials.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <h3>Папок пока нет</h3>
                    <p>Создайте первую папку для хранения учебных материалов</p>
                    <button className="add-folder-btn" onClick={handleAddFolder}>
                      <FaPlus /> Создать папку
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Вид содержимого папки
            <>
              <div className="folder-header">
                <button className="back-btn" onClick={handleBackToFolders}>
                  ← Назад к папкам
                </button>
                <div className="folder-title">
                  <FaFolder className="folder-title-icon" />
                  <h2>{currentFolder.name}</h2>
                </div>
                <button className="upload-btn" onClick={handleUploadClick}>
                  <FaUpload /> Загрузить файлы
                </button>
              </div>

              <div className="files-list">
                <div className="files-header">
                  <span>Название файла</span>
                  <span>Размер</span>
                  <span>Дата загрузки</span>
                  <span>Действия</span>
                </div>
                
                {currentFolder.files.length === 0 ? (
                  <div className="empty-folder">
                    <div className="empty-icon">📄</div>
                    <h3>Папка пуста</h3>
                    <p>Загрузите файлы в эту папку</p>
                    <button className="upload-btn" onClick={handleUploadClick}>
                      <FaUpload /> Загрузить файлы
                    </button>
                  </div>
                ) : (
                  currentFolder.files.map(file => (
                    <div key={file.id} className="file-item">
                      <div className="file-info">
                        <span className="file-icon">{getFileIcon(file.fileType || file.type)}</span>
                        <span className="file-name">{file.originalName || file.title || file.name}</span>
                      </div>
                      <span className="file-size">{file.fileSizeKb ? `${(file.fileSizeKb / 1024).toFixed(2)} МБ` : (file.size || 'N/A')}</span>
                      <span className="file-date">{file.createdAt ? new Date(file.createdAt).toLocaleDateString('ru-RU') : (file.uploadDate || 'N/A')}</span>
                      <div className="file-actions">
                        <button
                          className="download-btn"
                          onClick={() => handleDownloadFile(file)}
                          title="Скачать"
                        >
                          <FaDownload />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteFile(file.id)}
                          title="Удалить"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )
    }
  };

  return (
    <div className="admin-panel">
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
            <div className="app-user-avatar">{userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'Р'}</div>
            {sidebarOpen && (
              <div className="app-user-details">
                <h3>{userData.fullName || 'Репетитор'}</h3>
                <p>Репетитор по математике</p>
                <p className="admin-status">🔐 {userData.role || 'Администратор'}</p>
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
                // Фильтруем только будущие занятия
                const now = new Date();
                const upcomingLessons = lessons
                  .filter(l => new Date(l.lessonDate) > now)
                  .sort((a, b) => new Date(a.lessonDate) - new Date(b.lessonDate));

                if (upcomingLessons.length > 0) {
                  const nextLesson = upcomingLessons[0];
                  const lessonDateTime = new Date(nextLesson.lessonDate);
                  // Вычитаем 3 часа для компенсации московского времени
                  lessonDateTime.setHours(lessonDateTime.getHours() - 3);
                  const formattedDate = lessonDateTime.toLocaleDateString('ru-RU');
                  const formattedTime = lessonDateTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <>
                      <p>{formattedDate} в {formattedTime}</p>
                      <small>{nextLesson.location || nextLesson.onlineLink || 'Онлайн'}</small>
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
            <h1>{userData.fullName}, готовы к работе?</h1>
            <p>Сегодня: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
          <div className="header-actions">
            <button className="action-btn">Настройки</button>
            <button className="action-btn logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </header>

        <div className="content-area">
          <div className="current-section">
            <div className="section-header">
              <span className="section-icon">
                {sections[activeSection].icon}
              </span>
              <h2>{sections[activeSection].title}</h2>
            </div>
            {sections[activeSection].content}
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <LessonModal
        isOpen={showAddLessonModal}
        onClose={() => setShowAddLessonModal(false)}
        isEdit={false}
        lessonFormData={lessonFormData}
        handleLessonInputChange={handleLessonInputChange}
        handleLessonSubmit={handleLessonSubmit}
        students={students}
        studentsWithLessons={studentsWithLessons}
        lessonTypes={lessonTypes}
        durations={durations}
      />
      <LessonModal
        isOpen={showEditLessonModal}
        onClose={() => setShowEditLessonModal(false)}
        isEdit={true}
        lesson={currentLesson}
        lessonFormData={lessonFormData}
        handleLessonInputChange={handleLessonInputChange}
        handleLessonSubmit={handleLessonSubmit}
        students={students}
        studentsWithLessons={studentsWithLessons}
        lessonTypes={lessonTypes}
        durations={durations}
      />
      <AddFolderModal
        isOpen={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        handleCreateFolder={handleCreateFolder}
      />
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
      <AddHomeworkModal
        isOpen={showAddHomeworkModal}
        onClose={() => setShowAddHomeworkModal(false)}
        selectedStudent={selectedStudent}
        homeworkFormData={homeworkFormData}
        handleHomeworkInputChange={handleHomeworkInputChange}
        handleCreateHomework={handleCreateHomework}
        studentLessons={studentLessons}
        materials={materials}
        setHomeworkFormData={setHomeworkFormData}
      />
      <CheckHomeworkModal 
        isOpen={showCheckHomeworkModal} 
        onClose={() => setShowCheckHomeworkModal(false)} 
        homework={checkingHomework}
        onSubmit={handleSubmitHomeworkCheck}
      />
    </div>
  );
};

export default AdminPanel;