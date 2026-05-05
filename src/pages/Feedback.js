import "../styles/feedback.css";

export default function Feedback() {
  return (
    <div className="feedback-page">
    
      <section className="feedback-header">
        <h1 className="feedback-title">Отзывы учеников и родителей</h1>
        <h2 className="feedback-subtitle">Реальные истории тех, кто уже добился успеха</h2>
      </section>

   
      <section className="reviews-grid">
 
        <div className="review-card">
          <div className="review-stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <div className="review-author">
            <span className="author-name">Анастасия,</span>
            <span className="author-grade">мама 8-классника</span>
          </div>
          <p className="review-text">
            Сын наконец-то понял алгебру! За полгода с 3 до уверенной 4+. 
            Очень благодарны за терпение и объяснение на простом языке
          </p>
        </div>

       
        <div className="review-card">
          <div className="review-stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <div className="review-author">
            <span className="author-name">Полина,</span>
            <span className="author-grade">11 класс</span>
          </div>
          <p className="review-text">
            Готовились к ЕГЭ, балл — 84! До занятий были проблемы по 60. 
            Отличный подход и структура.
          </p>
        </div>

      
        <div className="review-card">
          <div className="review-stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <div className="review-author">
            <span className="author-name">Игорь,</span>
            <span className="author-grade">студент колледжа</span>
          </div>
          <p className="review-text">
            Нужно было подтянуть математику к сессии — думал, не успею. 
            За месяц всё разобрали, сдал на 4!
          </p>
        </div>

      
        <div className="review-card">
          <div className="review-stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <div className="review-author">
            <span className="author-name">Денис,</span>
            <span className="author-grade">10 класс</span>
          </div>
          <p className="review-text">
            Раньше математика казалась чем-то невозможным. Благодаря занятиям 
            наконец начал понимать темы с первого раза. Успеваемость...
          </p>
        </div>

      
        <div className="review-card">
          <div className="review-stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <div className="review-author">
            <span className="author-name">Полина,</span>
            <span className="author-grade">11 класс</span>
          </div>
          <p className="review-text">
            Готовились к ЕГЭ, балл — 84! До занятий были проблемы по 60. 
            Отличный подход и структура.
          </p>
        </div>
      </section>

 
      <section className="feedback-cta">
        <div className="cta-content">
          <h3 className="cta-title">
            Ценю обратную связь о своей работе<br />
            и уделяю внимание деталям.
          </h3>
          <p className="cta-subtitle">Хотите оставить отзыв?</p>
          <button className="cta-button">Оставить отзыв</button>
        </div>
      </section>
    </div>
  );
}