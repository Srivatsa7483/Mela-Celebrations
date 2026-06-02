import { useState, useEffect, useContext, useRef } from 'react';
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

// Loader Redesign Imports
import Celebration3DCanvas from './components/home/Celebration3DCanvas.jsx';
import { testimonials as staticTestimonials } from './data/index.js';
import './styles/loader.css';

// Helper component for counting numbers when scrolled into view
function AnimatedCounter({ value, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTimestamp = null;
    const numberMatch = value.replace(/,/g, "").match(/\d+/);
    if (!numberMatch) {
      setCount(value);
      return;
    }
    const target = parseInt(numberMatch[0]);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * target);
      setCount(currentVal);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [started, value, duration]);

  const displayVal = typeof count === 'number' 
    ? count.toLocaleString() + value.replace(/[\d,]/g, "") 
    : value;

  return <span ref={ref}>{started ? displayVal : "0"}</span>;
}

function FullscreenLoader() {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  const phases = [
    "Curating your celebration experience",
    "Loading premium collections",
    "Preparing something beautiful",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase(p => (p + 1) % phases.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Simulate progress bar moving up to 95% (it will snap to 100% when loading finishes)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) return p;
        return p + Math.floor(Math.random() * 3) + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-page">
      {/* 3D background canvas */}
      <div className="loader-page__3d-bg">
        <Celebration3DCanvas />
      </div>

      {/* Floating particles and glowing orbs */}
      <div className="loader-page__glow loader-page__glow--1" />
      <div className="loader-page__glow loader-page__glow--2" />

      {/* Scrollable content container */}
      <div className="loader-page__scrollable">
        
        {/* Section 1: Hero / Connection Splash */}
        <section className="loader-hero">
          <div className="container loader-hero__container">
            <div className="loader-hero__content">
              {/* Brand highlights & wakeup status */}
              <div className="loader-status">
                <span className="loader-status__dot" />
                <span className="loader-status__text">Connecting to Secure Server...</span>
              </div>

              <h1 className="loader-hero__title">
                Mela <span className="loader-hero__title-gold">Celebrations</span>
              </h1>
              <p className="loader-hero__subtitle">
                Premium Event Décor & Balloon Artistry
              </p>

              {/* Progress bar and wakeup message */}
              <div className="loader-progress-card">
                <div className="loader-progress-info">
                  <span className="loader-progress-phase">{phases[phase]}</span>
                  <span className="loader-progress-percent">{progress}%</span>
                </div>
                <div className="loader-progress-bar-track">
                  <div className="loader-progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="loader-progress-tip">
                  Database server is waking up from sleep mode. This takes around 20-30 seconds.
                </p>
              </div>

              {/* Scroll down indicator */}
              <div className="loader-scroll-indicator">
                <span className="loader-scroll-indicator__text">Explore Mela while we load</span>
                <span className="loader-scroll-indicator__arrow">↓</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Features Grid */}
        <section className="loader-section loader-features">
          <div className="container">
            <div className="loader-section__header">
              <span className="loader-section__tag">Why Choose Us</span>
              <h2 className="loader-section__title">The Premium Difference</h2>
            </div>
            <div className="loader-grid">
              <div className="loader-card">
                <div className="loader-card__icon">🎈</div>
                <h3>Bespoke Balloon Artistry</h3>
                <p>Custom themes, organic arches, and sculptures styled to fit your venue perfectly.</p>
              </div>
              <div className="loader-card">
                <div className="loader-card__icon">💎</div>
                <h3>Luxury Quality Materials</h3>
                <p>100% biodegradable, double-stuffed balloons for rich colors and long-lasting shine.</p>
              </div>
              <div className="loader-card">
                <div className="loader-card__icon">✨</div>
                <h3>End-to-End Styling</h3>
                <p>From visual 3D design mapping and venue setup to final event teardown.</p>
              </div>
              <div className="loader-card">
                <div className="loader-card__icon">⏰</div>
                <h3>On-Time Setup Promise</h3>
                <p>Our professional decorators finish early, ensuring your venue is ready before guests arrive.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Statistics Counters */}
        <section className="loader-section loader-stats">
          <div className="container">
            <div className="loader-stats-grid">
              <div className="loader-stat-item">
                <div className="loader-stat-number">
                  <AnimatedCounter value="15,000+" />
                </div>
                <div className="loader-stat-label">Events Managed</div>
              </div>
              <div className="loader-stat-item">
                <div className="loader-stat-number">
                  <AnimatedCounter value="350+" />
                </div>
                <div className="loader-stat-label">Exclusive Themes</div>
              </div>
              <div className="loader-stat-item">
                <div className="loader-stat-number">
                  <AnimatedCounter value="99.8%" />
                </div>
                <div className="loader-stat-label">Client Satisfaction</div>
              </div>
              <div className="loader-stat-item">
                <div className="loader-stat-number">
                  <AnimatedCounter value="12+" />
                </div>
                <div className="loader-stat-label">Cities Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Testimonials Carousel */}
        <section className="loader-section loader-testimonials">
          <div className="container">
            <div className="loader-section__header">
              <span className="loader-section__tag">Client Reviews</span>
              <h2 className="loader-section__title">Voices of Joy</h2>
            </div>
          </div>
          <div className="loader-testimonials__wrapper">
            <div className="loader-testimonials__track">
              {staticTestimonials.concat(staticTestimonials).map((t, idx) => (
                <div key={idx} className="loader-testimonial-card">
                  <div className="loader-testimonial-stars">★★★★★</div>
                  <p className="loader-testimonial-text">"{t.text}"</p>
                  <div className="loader-testimonial-author">
                    <img src={t.avatar} alt={t.name} />
                    <div>
                      <h4>{t.name}</h4>
                      <p>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="loader-section loader-cta">
          <div className="container">
            <div className="loader-cta__card">
              <h3>Have Questions?</h3>
              <p>Connect directly with our planning experts on WhatsApp for immediate support.</p>
              <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="loader-cta__btn">
                <span>💬 Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

      </div>
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
