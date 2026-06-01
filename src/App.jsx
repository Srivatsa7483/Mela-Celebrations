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
import ProductDetailPage from './pages/ProductDetailPage.jsx';

// Import Contexts
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { DesignProvider, DesignContext } from './context/DesignContext.jsx';

// Import New Widgets
import FloatingWhatsApp from './components/ui/FloatingWhatsApp.jsx';
import SpinWheelModal from './components/ui/SpinWheelModal.jsx';

function FullscreenLoader() {
  const [dots, setDots] = useState("");
  const [showWakeupMessage, setShowWakeupMessage] = useState(false);

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".");
    }, 500);

    const messageTimer = setTimeout(() => {
      setShowWakeupMessage(true);
    }, 3000);

    return () => {
      clearInterval(dotsTimer);
      clearTimeout(messageTimer);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px',
      padding: '40px',
      textAlign: 'center',
      fontFamily: "'DM Sans', sans-serif",
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
      color: '#f8fafc',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.02); } }
      `}</style>
      
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid rgba(201, 168, 76, 0.1)',
          borderTopColor: '#c9a84c',
          borderRadius: '50%',
          animation: 'spin 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          border: '3px solid rgba(255, 255, 255, 0.05)',
          borderBottomColor: '#ffffff',
          borderRadius: '50%',
          animation: 'spin 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) reverse infinite'
        }} />
      </div>

      <div style={{ animation: 'pulse 2s infinite', marginTop: '10px' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5">
          <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" fill="#c9a84c" />
        </svg>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '12px 0 0 0', letterSpacing: '0.05em', color: '#ffffff' }}>
          Mela Celebrations
        </h2>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500', margin: 0 }}>
        {showWakeupMessage ? `☕ Waking up database server${dots}` : `Loading catalog details${dots}`}
      </p>

      {showWakeupMessage && (
        <div style={{
          background: 'rgba(201, 168, 76, 0.1)',
          border: '1px solid rgba(201, 168, 76, 0.3)',
          borderRadius: '12px',
          padding: '16px 28px',
          maxWidth: '440px',
          lineHeight: '1.6',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.5s ease'
        }}>
          <p style={{ margin: 0, color: '#f1f5f9', fontWeight: '600', fontSize: '0.88rem' }}>
            Our free-tier server sleeps after 15 minutes of inactivity. Please wait 10–30 seconds while it wakes up.
          </p>
        </div>
      )}
    </div>
  );
}

function ClientRenderWakeupError({ onRetry }) {
  const [countdown, setCountdown] = useState(25);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    const dotsTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => { clearInterval(timer); clearInterval(dotsTimer); };
  }, [onRetry]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px',
      padding: '40px',
      textAlign: 'center',
      fontFamily: "'DM Sans', sans-serif",
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
      color: '#f8fafc',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ width: '64px', height: '64px', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <h2 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
        ☕ Database is Waking Up{dots}
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '440px', lineHeight: '1.7', margin: '0' }}>
        The backend server goes to sleep when idle. It's now starting up — this takes <strong>30–60 seconds</strong> on the first visit.
      </p>
      <div style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1.5px solid #c9a84c', borderRadius: '12px', padding: '14px 28px' }}>
        <p style={{ margin: 0, color: '#ffffff', fontWeight: '700', fontSize: '1rem' }}>
          Auto-retrying in <span style={{ color: '#c9a84c', fontSize: '1.3rem' }}>{countdown}s</span>
        </p>
      </div>
      <button
        onClick={onRetry}
        style={{
          background: '#c9a84c',
          color: '#ffffff',
          border: 'none',
          borderRadius: '30px',
          padding: '12px 28px',
          fontSize: '0.9rem',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(201, 168, 76, 0.3)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        🔄 Retry Now
      </button>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const { loading, error } = useContext(DesignContext);
  
  const getInitialPage = () => {
    if (typeof window === "undefined") return "home";
    const path = window.location.pathname.replace(/^\//, "");
    if (path.startsWith('product/')) return 'product-detail';
    const validPages = ['home', 'gallery', 'order', 'how-it-works', 'login', 'dashboard', 'calculator', 'customizer', 'recent-gallery', 'admin', 'admin-dashboard', 'contact', 'faqs', 'privacy', 'terms', 'product-detail'];
    return validPages.includes(path) ? path : "home";
  };

  // Extract product ID from URL on load (e.g. /product/101)
  const getInitialProductId = () => {
    if (typeof window === "undefined") return null;
    const path = window.location.pathname.replace(/^\//, "");
    if (path.startsWith('product/')) {
      const id = path.split('/')[1];
      return id || null;
    }
    return null;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(getInitialProductId);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [spinModalOpen, setSpinModalOpen] = useState(false);

  // Handle auto-opening spin wheel after successful login redirect
  useEffect(() => {
    const pendingSpin = sessionStorage.getItem("mela_spin_pending");
    if (pendingSpin === "true" && isAuthenticated) {
      sessionStorage.removeItem("mela_spin_pending");
      setSpinModalOpen(true);
    }
  }, [isAuthenticated]);



  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.productId) {
          setSelectedProductId(event.state.productId);
        }
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
      window.scrollTo(0, 0);
    }
  };

  const navigateToProduct = (productId) => {
    setSelectedProductId(productId);
    window.history.pushState({ page: 'product-detail', productId }, '', `/product/${productId}`);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
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
            navigateToProduct={navigateToProduct}
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
            navigateToProduct={navigateToProduct}
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
      case 'product-detail':
        return (
          <ProductDetailPage
            productId={selectedProductId}
            setCurrentPage={navigateToPage}
            setSelectedDesign={setSelectedDesign}
            navigateToProduct={navigateToProduct}
          />
        );
      default:
        return (
          <HomePage 
            setCurrentPage={navigateToPage} 
            setSelectedDesign={setSelectedDesign} 
            setActiveCategory={setActiveCategory} 
            setSearchQuery={setSearchQuery}
            navigateToProduct={navigateToProduct}
          />
        );
    }
  };

  if (loading) {
    return <FullscreenLoader />;
  }

  if (error) {
    return <ClientRenderWakeupError onRetry={() => window.location.reload()} />;
  }

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
          fontFamily: "'DM Sans', sans-serif"
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
