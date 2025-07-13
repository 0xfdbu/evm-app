import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/main/Header';
import { Footer } from '../components/main/Footer';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`d-flex flex-column min-vh-100 ${isHome ? 'home-wrapper' : ''}`}>
      <Header />
      <main className="flex-grow-1 py-4">
        <div className="layout-container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
