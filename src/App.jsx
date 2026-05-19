import { useState } from 'react';
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />;
      case 'gallery':
        return <GalleryPage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />;
      case 'order':
        return <OrderPage setCurrentPage={setCurrentPage} selectedDesign={selectedDesign} />;
      case 'how-it-works':
        return <HowItWorksPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} setActiveCategory={setActiveCategory} />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
