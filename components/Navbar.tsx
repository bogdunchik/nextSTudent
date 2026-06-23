'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type User = { id: number; name: string; email: string } | null;

export default function Navbar({ onOpenAuth }: { onOpenAuth: (tab: 'login' | 'register') => void }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => { if (data.success) setUser(data.user); })
      .catch(() => { });
  }, []);

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    window.location.reload();
  }

  const links = [
    { href: '/', label: 'Главная' },
    { href: '/about', label: 'О нас' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/contacts', label: 'Контакты' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/"><img className='navbar-logo' src="/images/logo.png" alt="Логотип компании" /></Link>
        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={pathname === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="navbar-auth">
          {user ? (
            <>
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>{user.name || user.email}</span>
              <button className="btn btn-danger-outline" onClick={logout}>Выйти</button>
            </>
          ) : (
            <>

              <button className="btn btn-outline" onClick={() => onOpenAuth('login')}>Войти</button>
              <button className="btn btn-primary" onClick={() => onOpenAuth('register')}>Регистрация</button>

            </>
          )}
        </div>
      </div>
    </nav>
  );
}
