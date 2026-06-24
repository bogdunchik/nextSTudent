'use client';

import { useState } from 'react';

type Tab = 'login' | 'register';

interface Props {
  initialTab: Tab;
  onClose: () => void;
}

export default function AuthModal({ initialTab, onClose }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [msg, setMsg] = useState<{ text: string; type: 'danger' | 'success' } | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPass2, setRegPass2] = useState('');
  const [regConsent, setRegConsent] = useState(false);

  function validateEmail(oneelement: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(oneelement);
  }
  const formaPhone = (value: string) => {
    const maxInt = value.replace(/\D/g, '');
    if (!maxInt) return '';

    let mainmaxInt = maxInt;
    if (maxInt[0] === '7' || maxInt[0] === '8') {
      mainmaxInt = maxInt.slice(1);
    }
    mainmaxInt = mainmaxInt.slice(0, 10);

    let formatted = '+7';
    if (mainmaxInt.length > 0) {
      formatted += '(' + mainmaxInt.slice(0, 3);
    }
    if (mainmaxInt.length >= 3) {
      formatted += ')';
    }
    if (mainmaxInt.length > 3) {
      formatted += mainmaxInt.slice(3, 6);
    }
    if (mainmaxInt.length > 6) {
      formatted += ' ' + mainmaxInt.slice(6, 8);
    }
    if (mainmaxInt.length > 8) {
      formatted += ' ' + mainmaxInt.slice(8, 10);
    }

    return formatted;
  };

  async function doLogin() {
    setMsg(null);
    if (!loginEmail || !loginPass) { setMsg({ text: 'Заполните все поля', type: 'danger' }); return; }
    if (!validateEmail(loginEmail)) { setMsg({ text: 'Некорректный email', type: 'danger' }); return; }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPass }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg({ text: 'Вход выполнен', type: 'success' });
      setTimeout(() => { onClose(); window.location.reload(); }, 800);
    } else {
      setMsg({ text: data.message || 'Ошибка', type: 'danger' });
    }
  }

  async function doRegister() {
    setMsg(null);
    if (!regEmail || !regPass || !regPass2) { setMsg({ text: 'Email и пароль обязательны', type: 'danger' }); return; }
    if (!validateEmail(regEmail)) { setMsg({ text: 'Некорректный email', type: 'danger' }); return; }
    const digitsOnly = regPhone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
      setMsg({ text: 'Введите номер телефона полностью', type: 'danger' });
      return;
    }

    if (regPass.length < 8) { setMsg({ text: 'Пароль — минимум 8 символов', type: 'danger' }); return; }
    if (regPass !== regPass2) { setMsg({ text: 'Пароли не совпадают', type: 'danger' }); return; }
    if (!regConsent) { setMsg({ text: 'Необходимо согласие на обработку персональных данных', type: 'danger' }); return; }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: regName, surname: regSurname, phone: regPhone, email: regEmail, password: regPass }),
    });
    if (!res.ok) {
      setMsg({ text: `Ошибка: статус ${res.status}`, type: 'danger' });
      return;
    }
    const data = await res.json();
    if (data.success) {
      setMsg({ text: 'Аккаунт создан', type: 'success' });
      setTimeout(() => { onClose(); window.location.reload(); }, 800);
    } else {
      setMsg({ text: data.message || 'Ошибка', type: 'danger' });
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setMsg(null);
  }

  return (
    <div className="modal-backdrop" onClick={(oneelement) => { if (oneelement.target === oneelement.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>Аккаунт</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="tabs">
          <button className={`tab-btn${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>Войти</button>
          <button className={`tab-btn${tab === 'register' ? ' active' : ''}`} onClick={() => switchTab('register')}>Регистрация</button>
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {tab === 'login' && (
          <div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={loginEmail} onChange={(oneelement) => setLoginEmail(oneelement.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input className="form-control" type="password" value={loginPass} onChange={(oneelement) => setLoginPass(oneelement.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={doLogin}>Войти</button>
          </div>
        )}
        {tab === 'register' && (
          <div>
            <div className="form-row form-group">
              <div>
                <label className="form-label">Имя</label>
                <input className="form-control" type="text" value={regName} onChange={(oneelement) => setRegName(oneelement.target.value)} />
              </div>
              <div>
                <label className="form-label">Фамилия</label>
                <input className="form-control" type="text" value={regSurname} onChange={(oneelement) => setRegSurname(oneelement.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Телефон</label>
              <input
                className="form-control"
                type="tel"
                placeholder="+7(999)999 99 99"
                value={regPhone}
                onChange={(oneelement) => setRegPhone(formaPhone(oneelement.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={regEmail} onChange={(oneelement) => setRegEmail(oneelement.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Пароль (минимум 8 символов)</label>
              <input className="form-control" type="password" value={regPass} onChange={(oneelement) => setRegPass(oneelement.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Повторите пароль</label>
              <input className="form-control" type="password" value={regPass2} onChange={(oneelement) => setRegPass2(oneelement.target.value)} />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={regConsent} onChange={(oneelement) => setRegConsent(oneelement.target.checked)} />
                Я согласен с политикой конфиденциальности, пользовательским соглашением и даю разрешение на обработку персональных данных.
              </label>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={doRegister}>Создать аккаунт</button>
          </div>
        )}
      </div>
    </div>
  );
}