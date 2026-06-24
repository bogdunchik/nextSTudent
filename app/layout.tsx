import '../styles/globals.css';
import Footer from '../components/Footer';
import SiteShell from '../components/SiteShell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="site-wrapper">
          <SiteShell>
            {children}
          </SiteShell>
          <Footer />
        </div>
      </body>
    </html>
  );
}
