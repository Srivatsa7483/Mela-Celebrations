import { useState, useEffect, useContext } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

// Import New Pages
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BudgetCalculatorPage from './pages/BudgetCalculatorPage.jsx';
import EventBuilderPage from './pages/EventBuilderPage.jsx';
import RecentGalleryPage from './pages/RecentGalleryPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
// AdminLogin.jsx deprecated — admin login is now integrated into LoginPage
import AdminDashboardPage from './components/admin/AdminDashboard.jsx';

// Import Contexts
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { DesignProvider } from './context/DesignContext.jsx';

// Import New Widgets
import FloatingWhatsApp from './components/ui/FloatingWhatsApp.jsx';
import SpinWheelModal from './components/ui/SpinWheelModal.jsx';

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);
  
  const getInitialPage = () => {
    if (typeof window === "undefined") return "home";
    const path = window.location.pathname.replace(/^\//, "");
    const validPages = ['home', 'gallery', 'order', 'how-it-works', 'login', 'dashboard', 'calculator', 'customizer', 'recent-gallery', 'admin', 'admin-dashboard', 'contact', 'faqs', 'privacy', 'terms'];
    return validPages.includes(path) ? path : "home";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [countdownText, setCountdownText] = useState("02:15:10");
  const [spinModalOpen, setSpinModalOpen] = useState(false);

  // Handle auto-opening spin wheel after successful login redirect
  useEffect(() => {
    const pendingSpin = sessionStorage.getItem("mela_spin_pending");
    if (pendingSpin === "true" && isAuthenticated) {
      sessionStorage.removeItem("mela_spin_pending");
      setSpinModalOpen(true);
    }
  }, [isAuthenticated]);

  // Countdown timer logic
  useEffect(() => {
    // Set mock target to 2 hours 15 minutes from now on load, and keep counting down
    let totalSeconds = 2 * 3600 + 15 * 60 + 10;
    
    const interval = setInterval(() => {
      if (totalSeconds <= 0) {
        // Reset to 3 hours to simulate continuous offer
        totalSeconds = 3 * 3600;
      } else {
        totalSeconds--;
      }

      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      const timeString = [
        hrs.toString().padStart(2, '0'),
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
      ].join(':');

      setCountdownText(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        setCurrentPage('home');
      }
    };

    const initialPage = getInitialPage();
    if (!window.history.state) {
      window.history.replaceState({ page: initialPage }, '', `/${initialPage === 'home' ? '' : initialPage}`);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (page) => {
    if (page !== currentPage) {
      window.history.pushState({ page }, '', `/${page === 'home' ? '' : page}`);
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on navigation
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            setCurrentPage={navigateToPage} 
            setSelectedDesign={setSelectedDesign} 
            setActiveCategory={setActiveCategory} 
            setSearchQuery={setSearchQuery} 
          />
        );
      case 'gallery':
        return (
          <GalleryPage 
            setCurrentPage={navigateToPage} 
            setSelectedDesign={setSelectedDesign} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        );
      case 'order':
        return (
          <OrderPage 
            setCurrentPage={navigateToPage} 
            selectedDesign={selectedDesign} 
          />
        );
      case 'how-it-works':
        return <HowItWorksPage setCurrentPage={navigateToPage} />;
      case 'contact':
        return <ContactPage setCurrentPage={navigateToPage} />;
      case 'login':
        return <LoginPage setCurrentPage={navigateToPage} />;
      case 'dashboard':
        return <DashboardPage setCurrentPage={navigateToPage} setSelectedDesign={setSelectedDesign} />;
      case 'calculator':
        return <BudgetCalculatorPage setCurrentPage={navigateToPage} />;
      case 'customizer':
        return <EventBuilderPage setCurrentPage={navigateToPage} />;
      case 'recent-gallery':
        return <RecentGalleryPage setCurrentPage={navigateToPage} />;
      case 'faqs':
        return <FAQPage setCurrentPage={navigateToPage} />;
      case 'privacy':
        return <PrivacyPage setCurrentPage={navigateToPage} />;
      case 'terms':
        return <TermsPage setCurrentPage={navigateToPage} />;
      case 'admin':
        return <LoginPage setCurrentPage={navigateToPage} initialMode="admin" />;
      case 'admin-dashboard':
        return <AdminDashboardPage setCurrentPage={navigateToPage} />;
      default:
        return (
          <HomePage 
            setCurrentPage={navigateToPage} 
            setSelectedDesign={setSelectedDesign} 
            setActiveCategory={setActiveCategory} 
            setSearchQuery={setSearchQuery} 
          />
        );
    }
  };

  const isAdminPage = currentPage === 'admin-dashboard';

  if (isAdminPage) {
    return (
      <div className="app">
        {renderPage()}
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={navigateToPage} 
        setActiveCategory={setActiveCategory} 
        setSearchQuery={setSearchQuery} 
        countdownText={countdownText}
      />
      
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {renderPage()}
      </main>

      <Footer setCurrentPage={navigateToPage} />
      
      {/* Floating Interactive Widget */}
      <FloatingWhatsApp />

      {/* Floating Spin Wheel Badge */}
      <button 
        onClick={() => {
          if (!isAuthenticated) {
            sessionStorage.setItem("mela_spin_pending", "true");
            sessionStorage.setItem("mela_login_redirect", currentPage);
            navigateToPage("login");
          } else {
            setSpinModalOpen(true);
          }
        }}
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: "1000",
          backgroundColor: "#c9a84c",
          color: "white",
          border: "none",
          borderRadius: "30px",
          padding: "12px 20px",
          fontSize: "0.85rem",
          fontWeight: "600",
          letterSpacing: "0.05em",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(201, 168, 76, 0.4)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "transform 0.3s ease",
          fontFamily: "'Jost', sans-serif"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
      >
        🎁 SPIN & WIN
      </button>

      {/* Spin Wheel Modal */}
      <SpinWheelModal 
        isOpen={spinModalOpen} 
        onClose={() => setSpinModalOpen(false)}
        onWinCoupon={(coupon) => {
          // Triggers visual notification
          console.log("Won coupon code:", coupon);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <DesignProvider>
          <AppContent />
        </DesignProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
