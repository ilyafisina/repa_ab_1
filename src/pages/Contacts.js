// Contacts.jsx
import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaTelegram, FaEnvelope, FaClock, FaTimes } from 'react-icons/fa';
import '../styles/contacts.css';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    username: '',
    comment: '',
    agreement: false
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Данные формы:', formData);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);

    setFormData({
      name: '',
      phone: '',
      username: '',
      comment: '',
      agreement: false
    });
  };

  return (
    <div className="contact-page">
      <div className="content-wrapper">
        <section className="price-header">
          <h1 className="price-title">Свяжитесь со мной</h1>
          <h2 className="price-subtitle">Начните свое математическое <br /> путешествие сегодня</h2>
          <p className="price-description">
            Готовы улучшить свои математические навыки? Запишитесь на бесплатную консультацию, <br />
            и мы обсудим, как я могу помочь вам достичь ваших целей.
          </p>
        </section>

        <div className="main-content">
          <section className="form-section">
            <div className="form-header">
              <h3>Быстрая запись</h3>
              <p className="response-time">Я свяжусь с вами в течение 24 часов</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Введите имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иван"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Введите номер телефона</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7-777-777-77"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Введите имя (вёрстка для связи)</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="@vamushka33"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment">Введите комментарий (необязательно)</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Позвоните после 13:00"
                  rows="3"
                />
              </div>

              <div className="agreement-group">
                <input
                  type="checkbox"
                  id="agreement"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreement">
                  Я даю согласие на обработку персональных данных в соответствии с <a href="#privacy-policy" className="privacy-link">[Политикой конфиденциальности]</a>
                </label>
              </div>

              <button type="submit" className="submit-btn" disabled={!formData.agreement}>
                Записаться
              </button>
            </form>
          </section>

          <section className="contact-info">
            <h3>Контактная информация</h3>
            
            <div className="contact-item">
              <div className="contact-icon">
                <FaPhone />
                <FaWhatsapp />
                <FaTelegram />
              </div>
              <div className="contact-details">
                <span>Телефон / WhatsApp / Telegram:</span>
                <p>+7 (XXX) XXX-XX-XX</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-details">
                <span>Email:</span>
                <p>youmame@example.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaTelegram />
              </div>
              <div className="contact-details">
                <span>Соцсети:</span>
                <p>Telegram-канал</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaClock />
              </div>
              <div className="contact-details">
                <span>Время для связи:</span>
                <p>Пн–Сб: 10:00 — 20:00 (МСК)</p>
                <p className="response-info">Ответ обычно в течение 1–2 часов</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Всплывающее окно */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={closePopup}>
              <FaTimes />
            </button>
            <div className="popup-icon">✅</div>
            <h3>Спасибо за заявку!</h3>
            <p>Я свяжусь с вами в течение 24 часов для бесплатной консультации.</p>
            <button className="popup-confirm-btn" onClick={closePopup}>
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;