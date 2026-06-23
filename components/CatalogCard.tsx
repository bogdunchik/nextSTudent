'use client';

import { useState, useEffect } from 'react';
import OrderModal from './OrderModal';
import AuthModal from './AuthModal';

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Счетчик электроэнергии CE101 R5 145 M6 однофазный однотарифный',
    image: '/images/catalogCard/item1.webp',
    description: 'Однофазный многотарифный электросчетчик серии «СЕ».',
    price: 1801.1,
  },
  {
    id: 2,
    name: 'Счетчик газа ЭЛЕХАНТ СГБД-3,2',
    image: '/images/catalogCard/item2.jpg',
    description: 'Счетчик газа СГБМ-3,2 предназначен для измерения объема газа при учете потребления газа индивидуальными потребителями.',
    price: 3400.1,
  },
  {
    id: 3,
    name: 'Модуль дискретного вывода EKF REMF 16 PRO-Logic REMF-D-16Y-R',
    image: '/images/catalogCard/item3.jpeg',
    description: 'устройство из серии PRO-Logic, предназначенное для создания автоматических систем управления.',
    price: 8221.5,
  },
  {
    id: 4,
    name: 'Панель светодиодная ДУО-4103-L 36Вт 4000К опал 595х595 EKF Basic',
    image: '/images/catalogCard/item4.webp',
    description: 'Панель предназначена для общего и местного освещения в офисах, учебных заведениях.',
    price: 1133.3,
  },
  {
    id: 5,
    name: 'Датчик движения ДД-МВ 501 1200Вт угол обз. 180град. 15м IP65 бел. IEK LDD11-501MB-1200-001',
    image: '/images/catalogCard/item5.webp',
    description: 'Благодаря широкому углу датчик может контролировать несколько зон одновременно.',
    price: 2359.2,
  },
  {
    id: 6,
    name: 'Блок аварийного питания БАП120-1.0/3.0 совмещ. для LED IEK LLVPOD-EPK-120-1H-3H',
    image: '/images/catalogCard/item6.webp',
    description: 'Предначен для обеспечения бесперебойного освещения помещений светодиодными светильниками.',
    price: 7974.4,
  },
  {
    id: 7,
    name: 'Светильник светодиодный ДКУ 1002-150Д 5000К IP65 сер. IEK LDKU0-1002-150-5000-K03',
    image: '/images/catalogCard/item7.jpg',
    description: 'Предначены для наружного освещения таких объектов как: дороги со средней и низкой интенсивностью.',
    price: 13433.4,
  },
  {
    id: 8,
    name: 'Светильник светодиодный ДКУ 1002-50Ш 5000К IP65 сер. IEK LDKU1-1002-050-5000-K03',
    image: '/images/catalogCard/item8.png',
    description: 'Светодиодные уличные свенильники для установки на консоль ГКУ.',
    price: 3660.5,
  },
  {
    id: 9,
    name: 'Профиль алюминиевый для LED ленты 2207 встраиваемый трапец. опал (дл.2м) компл. аксессуров IEK LSADD2207-SET1-2-V4-1-08',
    image: '/images/catalogCard/item9.webp',
    description: 'Алюминиевый профиль предназначен для монтажа светодиодных лент.',
    price: 617.7,
  },
  {
    id: 10,
    name: 'Лента светодиодная LED LSR-2835W60-4.8-IP67-220В (уп.50м) IEK LSR3-2-060-67-0-50',
    image: '/images/catalogCard/item10.jpg',
    description: 'Светодиодная лента высокой степени защиты.',
    price: 6607.3,
  },
  {
    id: 11,
    name: 'Счетчик воды ЭЛЕХАНТ СВД-15',
    image: '/images/catalogCard/item11.webp',
    description: 'Устройство подсчёта потребления горячей и холодной воды.',
    price: 2852.9,
  },
  {
    id: 12,
    name: 'Счетчик воды ЭЛЕХАНТ СВД-20',
    image: '/images/catalogCard/item12.webp',
    description: 'Счетчик для измерения объема холодной и горячей воды.',
    price: 3082.4,
  },
];

export default function ProductCatalog() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => setIsLoggedIn(!!data.success))
      .catch(() => setIsLoggedIn(false));
  }, []);

  function handleOrderClick(productId: number) {
    setSelectedProductId(productId);
    if (isLoggedIn) {
      setIsOrderOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  }

  return (
    <>
      <div className="contacts-grid productCard">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img className="ProductImg" src={product.image} alt="product" />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p>{product.description}</p>
              <div className="priceText">{product.price.toLocaleString('ru')} ₽</div>
            </div>
            <button
              type="button"
              className="buttonProductCard"
              onClick={() => handleOrderClick(product.id)}
            >
              Заказать
            </button>
          </div>
        ))}
      </div>

      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        selectedProductId={selectedProductId}
        products={products}
      />

      {isAuthOpen && (
        <AuthModal
          initialTab="login"
          onClose={() => {
            setIsAuthOpen(false);
            fetch('/api/me')
              .then((r) => r.json())
              .then((data) => setIsLoggedIn(!!data.success));
          }}
        />
      )}
    </>
  );
}