'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  productId: number;
  quantity: number;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductId?: number;
  products?: Product[];
}

export default function OrderModal({ isOpen, onClose, selectedProductId, products = [] }: OrderModalProps) {
  const [activeTab, setActiveTab] = useState<'order' | 'preorder'>('order');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [comment, setComment] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'danger' | 'success' } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([{ productId: 1, quantity: 1 }]);

  useEffect(() => {
    if (isOpen) {
      if (selectedProductId) {
        setItems([{ productId: selectedProductId, quantity: 1 }]);
      } else if (products.length > 0) {
        setItems([{ productId: products[0].id, quantity: 1 }]);
      }
      setMsg(null);
      setIsAgreed(false);
    }
  }, [selectedProductId, isOpen, products]);

  if (!isOpen) return null;

  const updateItem = (index: number, fields: Partial<OrderItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...fields };
    setItems(newItems);
  };

  const addRow = () => {
    if (items.length >= 12) return;
    const defaultId = products.length > 0 ? products[0].id : 1;
    setItems([...items, { productId: defaultId, quantity: 1 }]);
  };

  const removeRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  async function handleOrderSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isAgreed) return;
    setMsg(null);

    if (!address.trim() || !paymentMethod) {
      setMsg({ text: 'Пожалуйста, заполните адрес и метод оплаты', type: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          address,
          paymentMethod,
          items,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: 'Заказ успешно оформлен!', type: 'success' });
        setAddress('');
        setItems([{ productId: products[0]?.id || 1, quantity: 1 }]);
        setTimeout(() => onClose(), 2000);
      } else {
        setMsg({ text: data.message || 'Ошибка оформления', type: 'danger' });
      }
    } catch {
      setMsg({ text: 'Ошибка соединения с сервером', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePreorderSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isAgreed) return;
    setMsg(null);

    if (!address.trim() || !comment.trim()) {
      setMsg({ text: 'Заполните адрес и текст предзаказа', type: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'preorder',
          address,
          comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: 'Предзаказ успешно оформлен!', type: 'success' });
        setAddress('');
        setComment('');
        setTimeout(() => onClose(), 2000);
      } else {
        setMsg({ text: data.message || 'Ошибка оформления', type: 'danger' });
      }
    } catch {
      setMsg({ text: 'Ошибка соединения с сервером', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <h2
            onClick={() => { setActiveTab('order'); setMsg(null); }}>
            Заказ товара
          </h2>
          <h2
            onClick={() => { setActiveTab('preorder'); setMsg(null); }}>
            Заявка
          </h2>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {activeTab === 'order' && (
          <form onSubmit={handleOrderSubmit}>
            <label className="form-label">Список товаров в заказе</label>

            {items.map((item, index) => (
              <div className="product-row" key={index}>
                <select
                  className="form-control"
                  value={item.productId}
                  onChange={(e) => updateItem(index, { productId: Number(e.target.value) })}
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price.toLocaleString('ru')} ₽)
                    </option>
                  ))}
                </select>

                <input type="number" className="form-control int" min={1} max={50} value={item.quantity} onChange={(e) => updateItem(index, { quantity: Math.min(50, Math.max(1, Number(e.target.value))) })} required />

                <button
                  type="button"
                  className="btn-remove-row"
                  onClick={() => removeRow(index)}
                  disabled={items.length === 1}>
                  X
                </button>
              </div>
            ))}

            <button type="button" className="btn-primary" onClick={addRow}>
              добавить
            </button>

            <div className="form-group">
              <label className="form-label">Способ оплаты</label>
              <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">Банковская карта</option>
                <option value="money">Наличными при получении</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Адрес доставки </label>
              <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <div className="form-group" >
              <input type="checkbox" id="order-consent" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} required />
              <label className='footer-links'>
                Я согласен с политикой конфиденциальности, пользовательским соглашением и даю разрешение на обработку персональных данных.
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting || !isAgreed}>
              {submitting ? 'Отправка...' : 'Оформить заказ'}
            </button>
          </form>
        )}

        {activeTab === 'preorder' && (
          <form onSubmit={handlePreorderSubmit}>
            <div className="form-group">
              <label className="form-label">Адрес доставки </label>
              <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Комментарий к предзаказу </label>
              <textarea
                className="form-control"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опишите, какие позиции необходимы под заказ..."
                required
              />
            </div>

            <div className="form-group">
              <input type="checkbox" id="preorder-consent" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} required />
              <label className='footer-links'>
                Я согласен с политикой конфиденциальности, пользовательским соглашением и даю разрешение на обработку персональных данных.
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting || !isAgreed}>
              {submitting ? 'Отправка...' : 'Отправить запрос'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}