import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        setCurrentPage('home');
      }
    };

    // Initialize state on first load
    if (!window.history.state) {
      window.history.replaceState({ page: 'home' }, '');
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (page) => {
    if (page !== currentPage) {
      window.history.pushState({ page }, '', `/${page === 'home' ? '' : page}`);
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={navigateToPage} setSelectedDesign={setSelectedDesign} setActiveCategory={setActiveCategory} />;
      case 'gallery':
        return <GalleryPage setCurrentPage={navigateToPage} setSelectedDesign={setSelectedDesign} activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'order':
        return <OrderPage setCurrentPage={navigateToPage} selectedDesign={selectedDesign} />;
      case 'how-it-works':
        return <HowItWorksPage setCurrentPage={navigateToPage} />;
      default:
        return <HomePage setCurrentPage={navigateToPage} setSelectedDesign={setSelectedDesign} setActiveCategory={setActiveCategory} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={navigateToPage} setActiveCategory={setActiveCategory} setSearchQuery={setSearchQuery} />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
