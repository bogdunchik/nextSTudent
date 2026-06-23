'use client';

import '../styles/globals.css';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
type Tab = 'login' | 'register';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [modalTab, setModalTab] = useState<Tab | null>(null);

  return (
    <html lang="ru">
      <body>
        <div className="site-wrapper">
          <Navbar onOpenAuth={(tab) => setModalTab(tab)} />
          <main>{children}</main>
          <Footer />
        </div>
        {modalTab && (
          <AuthModal initialTab={modalTab} onClose={() => setModalTab(null)} />
        )}
      </body>
    </html>
  );
}
