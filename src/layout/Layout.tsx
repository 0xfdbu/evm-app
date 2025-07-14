import { Header } from '../components/main/Header';
import { Footer } from '../components/main/Footer';
import SideMenu from '../components/SideMenu';
import MainContent from '../components/MainContent';

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 home-wrapper">
      <Header />
      <main className="flex-grow-1 py-4">
        <div className="layout-container container">
          <div className="row align-items-start">
            <div className="col-lg-4">
              <SideMenu />
            </div>
            <div className="col-lg-8">
              <MainContent />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
