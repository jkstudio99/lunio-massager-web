import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 ${isHome ? '' : 'pt-[68px]'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
