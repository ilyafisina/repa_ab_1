import "../styles/homepage.css";
import Julia from "../img/Julia.png";
import stiker1 from "../img/stiker1.png";
import stiker2 from "../img/stiker2.png";
import stiker3 from "../img/stiker3.png";
import stiker4 from "../img/stiker4.png";
import arrow from "../img/arrow.svg";
import Contacts from "./Contacts";
import { useNavigate } from "react-router-dom";

export default function Homepage() {

  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("../contacts");
  }
  return (
    <>
      <section className="hero-block">
        <div className="hero-content">
          <div className="text-block">
            <h1 className="teacher-info">
              Репетитор <br />
              по математике
            </h1>
            <div className="teacher-details">
              <h2 className="teacher-name">Шадрина Юлия Александровна</h2>
              <h3 className="teacher-description">
                Готовлю к ЕГЭ, ОГЭ и помогаю понять математику без стресса
              </h3>
            </div>
            <div className="btn">
              <button className="btn-start" onClick={handleContactClick}>Начать бесплатно</button>
            </div>
          </div>

          <div className="image-block">
            <img
              className="img-teacher"
              src={Julia}
              alt="Шадрина Юлия Александровна"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="section-description">
          <h2 className="learning">
            Изучайте математику <br />
            в любом формате <br /><h2 className="learning-two">с опытным учителем</h2>
          </h2>

          <h4 className="bio">
            Меня зовут Юлия Шадрина, я репетитор по математике с опытом <br />
            более 5 лет. Работаю с учениками 5–11 классов, готовлю к ОГЭ <br />
            и ЕГЭ. Объясняю просто и доступно — без зазубривания, <br />
            через понимание. Подстраиваюсь под уровень и темп ученика, <br />
            поддерживаю на каждом этапе. Моя цель — не просто натаскать, <br />
            а научить думать и разбираться в математике. <br />
          </h4>
        </div>

     <div className="stikers-container">
        <div className="stikers">
          {/* 5 лет опыта */}
          <div className="exp">
            <h4 className="five-year">5 лет опыта</h4>
            <h4 className="disc">
              преподавания школьникам <br />и выпускникам
            </h4>

            <img className="stik1" src={stiker1} />
          </div>
          {/* 50+ учеников */}
          <div className="students">
            <h4 className="fivtee-plus">50+ учеников</h4>
            <h4 className="disc-students">
              успешно сдали ЕГЭ/ОГЭ
            </h4>

            <img className="stik2" src={stiker2} />
          </div>

          {/* индивидуальный план */}
          <div className="plan">
            <h4 className="education">Индивидуальный план</h4>
            <h4 className="disc-education">
              подбираю материалы и темп <br />обучения
            </h4>

            <img className="stik3" src={stiker3} />
          </div>

          {/* формат занятий */}
          <div className="format">
            <h4 className="format-variant">Формат занятий</h4>
            <h4 className="disc-format">
              онлайн и оффлайн
            </h4>

            <img className="stik4" src={stiker4} />
          </div>
        </div>
        <img className="arrow" src={arrow} />
        </div>
      </section>
    </>
  );
}
