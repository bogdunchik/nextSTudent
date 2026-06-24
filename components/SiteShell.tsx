'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import AuthModal from './AuthModal';

type Tab = 'login' | 'register';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [modalTab, setModalTab] = useState<Tab | null>(null);

  return (
    <>
      <Navbar onOpenAuth={(tab) => setModalTab(tab)} />
      <main>{children}</main>
      {modalTab && (
        <AuthModal initialTab={modalTab} onClose={() => setModalTab(null)} />
      )}
    </>
  );
}
