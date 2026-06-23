import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { getSession } from '../../../lib/session';

const products = [
  { id: 1, name: 'Счетчик электроэнергии CE101 R5 145 M6 однофазный однотарифный', price: 1801.1 },
  { id: 2, name: 'Счетчик газа ЭЛЕХАНТ СГБД-3,2', price: 3400.1 },
  { id: 3, name: 'Модуль дискретного вывода EKF REMF 16 PRO-Logic REMF-D-16Y-R', price: 8221.5 },
  { id: 4, name: 'Панель светодиодная ДУО-4103-L 36Вт 4000К опал 595х595 EKF Basic', price: 1133.3 },
  { id: 5, name: 'Датчик движения ДД-МВ 501 1200Вт угол обз. 180град. 15м IP65 бел. IEK LDD11-501MB-1200-001', price: 2359.2 },
  { id: 6, name: 'Блок аварийного питания БАП120-1.0/3.0 совмещ. для LED IEK LLVPOD-EPK-120-1H-3H', price: 7974.4 },
  { id: 7, name: 'Светильник светодиодный ДКУ 1002-150Д 5000К IP65 сер. IEK LDKU0-1002-150-5000-K03', price: 13433.4 },
  { id: 8, name: 'Светильник светодиодный ДКУ 1002-50Ш 5000К IP65 сер. IEK LDKU1-1002-050-5000-K03', price: 3660.5 },
  { id: 9, name: 'Профиль алюминиевый для LED ленты 2207 встраиваемый трапец. опал (дл.2м) компл. аксессуров IEK LSADD2207-SET1-2-V4-1-08', price: 617.7 },
  { id: 10, name: 'Лента светодиодная LED LSR-2835W60-4.8-IP67-220В (уп.50м) IEK LSR3-2-060-67-0-50', price: 6607.3 },
  { id: 11, name: 'Счетчик воды ЭЛЕХАНТ СВД-15', price: 2852.9 },
  { id: 12, name: 'Счетчик воды ЭЛЕХАНТ СВД-20', price: 3082.4 },
];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await req.json();
    const { type, address, paymentMethod, items, comment } = body;

    if (!address?.trim()) {
      return NextResponse.json({ success: false, message: 'Укажите адрес доставки' }, { status: 400 });
    }

    if (type === 'order') {
      if (!items || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
        return NextResponse.json({ success: false, message: 'Вы ничего не заказали' }, { status: 400 });
      }

      const [orderResult]: any = await db.query(
        'INSERT INTO orders (user_id, address, payment_method, status) VALUES (?, ?, ?, ?)',
        [session.userId, address, paymentMethod, 'new']
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        const currentProduct = products.find((p) => p.id === item.productId);
        if (!currentProduct) continue;

        const quantity = Math.min(50, Math.max(1, Number(item.quantity || 1)));

        await db.query(
          'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
          [orderId, currentProduct.id, currentProduct.name, currentProduct.price, quantity]
        );
      }

      return NextResponse.json({ success: true });
    }

    if (type === 'preorder') {
      if (!comment?.trim()) {
        return NextResponse.json({ success: false, message: 'Заполните текст предзаказа' }, { status: 400 });
      }
      await db.query(
        'INSERT INTO orders (user_id, address, payment_method, status, comment) VALUES (?, ?, ?, ?, ?)',
        [session.userId, address, 'upon_receipt', 'preorder', comment]
      );
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Неверный тип запроса' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}