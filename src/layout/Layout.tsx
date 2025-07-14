import { Outlet } from 'react-router-dom';
import { Header } from '../components/main/Header';
import { Footer } from '../components/main/Footer';

const Layout = () => {

  return (
    <div className={`d-flex flex-column min-vh-100 home-wrapper`}>
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
