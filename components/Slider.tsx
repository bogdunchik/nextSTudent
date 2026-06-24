'use client';

import { useState, useEffect, useRef } from 'react';

const reviews = [
  {
    name: 'Иван Руднев',
    avatar: '/images/comment/profilePicture/man1.jpg',
    date: '12 мая 2026',
    photo: '/images/comment/product/comm1.png',
    product: 'Cчетчик электроэнергии 3ф НЕВА MT324 1.0AR E4BS26',
    text: 'Отличное УЗО для квартиры, частного дома или офиса. Надёжная защита от поражения током и возгорания из-за утечек. Рекомендую к покупке, особенно если нужен тип А для современной техники.',
  },
  {
    name: 'Саша Весёлый',
    avatar: '/images/comment/profilePicture/man2.jpg',
    date: '3 апреля 2026',
    photo: '/images/comment/product/comm2.png',
    product: 'Автоматический выключатель EKF 2п 25А С ВА47-29 4,5 кА',
    text: 'Автомат рабочий, фирма нормальная. Цена приемлемая. Стоит такой же давно на улице в щитке учета, никаких проблем не возникало. Брал для монтажа вводного щитка в гараж. Рекомендую! ',
  },
  {
    name: 'Сергей Иванов',
    avatar: '/images/comment/profilePicture/man3.jpg',
    date: '1 марта 2026',
    photo: '/images/comment/product/comm3.png',
    product: 'Дифференциальный автомат АД-32 (селективный) 3P+N 50А/100мА EKF PROxima',
    text: 'Установил автомат , кнопкой тест проверил . Все работает.',
  },
];
export default function ReviewsSlider() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function goTo(newIndex: number) {
    setAnimating(false);
    setTimeout(() => {
      setIndex(newIndex);
      setAnimating(true);
    }, 150);
  }

  function prev() {
    goTo((index - 1 + reviews.length) % reviews.length);
  }

  function next() {
    goTo((index + 1) % reviews.length);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % reviews.length);
        setAnimating(true);
      }, 150);
    }, 100000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const review = reviews[index];

  return (
    <div className='commentContainer'>
      <div >
        <div className='review-header'>
          <img className='avatar' src={review.avatar} alt={review.name} />
          <div>
            <p className='com-text'>{review.name}</p>
            <p className='com-text small' >{review.date}</p>
          </div>
        </div>
        <div className='review-content-area'>
          <p className='com-text small'>{review.product}</p>
          <p className='com-text'>{review.text}</p>
          <img className='com-photo' src={review.photo} alt={review.product} />
        </div>
      </div>
      <div className='review-controls'>
        <span className='review-counter'>{index + 1} из {reviews.length}</span>
        <button onClick={prev} className='nav-button prev'>‹</button>
        <button onClick={next} className='nav-button next'>›</button>
      </div>

    </div>
  );
}