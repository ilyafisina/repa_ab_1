import "../styles/price.css";

export default function Price() {
  return (
    <div className="price-page">
      {/* Header Section */}
      <section className="price-header">
        <h1 className="price-title">Прозрачное ценообразование</h1>
        <h2 className="price-subtitle">Простые и доступные цены</h2>
        <p className="price-description">
          Выберите вариант обучения, который наилучшим образом соответствует вашим потребностям <br />
          и бюджету. Все тарифы включают индивидуальное обучение и постоянную поддержку.
        </p>
      </section>

    
      <section className="pricing-cards">
     
        <div className="price-card">
          <div className="card-header">
            <h3 className="card-title">Онлайн обучение</h3>
            <p className="card-subtitle">Виртуальные сеансы с интерактивными инструментами</p>
          </div>
          
          <div className="card-price">
            <span className="price-amount">1 500 ₽</span>
            <span className="price-period">в час</span>
          </div>

          <ul className="card-features">
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Индивидуальное обучение
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Интерактивная цифровая доска
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Возможность демонстрации экрана
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Доступны записи сеансов
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Гибкое расписание
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Разработка стратегии обучения
            </li>
          </ul>

          <button className="card-button">Выбрать</button>
        </div>

    
        <div className="price-card featured">
          <div className="card-badge">Популярный</div>
          <div className="card-header">
            <h3 className="card-title">Личное обучение</h3>
            <p className="card-subtitle">Индивидуальное очное обучение</p>
          </div>
          
          <div className="card-price">
            <span className="price-amount">2 000 ₽</span>
            <span className="price-period">в час</span>
          </div>

          <ul className="card-features">
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Индивидуальное обучение
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Персонализированные учебные материалы
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Отслеживание прогресса и отчёты
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Помощь с домашними заданиями
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Подготовка к тестам
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Гибкий график
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Общение с родителями
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Разработка стратегии обучения
            </li>
          </ul>

          <button className="card-button primary">Выбрать</button>
        </div>

        <div className="price-card">
          <div className="card-header">
            <h3 className="card-title">Обучение на дому</h3>
            <p className="card-subtitle">Удобное обучение в комфортной для вас обстановке</p>
          </div>
          
          <div className="card-price">
            <span className="price-amount">3 500 ₽</span>
            <span className="price-period">в час</span>
          </div>

          <ul className="card-features">
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Все преимущества личного обучения
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Ученикам не нужно никуда ехать
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Присутствие семьи приветствуется
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Индивидуально организованное учебное пространство
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Предоставляются секции для братьев и сестер
            </li>
          </ul>

          <button className="card-button">Выбрать</button>
        </div>
      </section>


      <section className="discounts-section">
        <h2 className="discounts-title">Скидки на пакеты</h2>
        <p className="discounts-subtitle">Экономьте больше с гибкими вариантами пакета</p>

        <div className="discount-cards">
   
          <div className="discount-card">
            <div className="discount-header">
              <h3 className="discount-name">Еженедельные сессии</h3>
              <div className="discount-percent">5%</div>
            </div>
            <p className="discount-sessions">4 сеанса в месяц</p>
            <p className="discount-description">Самый гибкий вариант</p>
          </div>

     
          <div className="discount-card">
            <div className="discount-header">
              <h3 className="discount-name">Двухнедельные сессии</h3>
              <div className="discount-percent">10%</div>
            </div>
            <p className="discount-sessions">8 сеансов в месяц</p>
            <p className="discount-description">Отлично подходит для регулярной поддержки</p>
          </div>

  
          <div className="discount-card">
            <div className="discount-header">
              <h3 className="discount-name">Интенсивный пакет</h3>
              <div className="discount-percent">15%</div>
            </div>
            <p className="discount-sessions">более 12 сеансов в месяц</p>
            <p className="discount-description">Максимальная прогрессия техники</p>
          </div>
        </div>
      </section>
    </div>
  );
}