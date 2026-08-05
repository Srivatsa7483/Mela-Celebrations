import { useState, useEffect, useContext, useRef } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import GalleryPage, { getParentCategory } from './pages/GalleryPage.jsx';
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
import AboutPage from './pages/AboutPage.jsx';
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
import { testimonials as staticTestimonials, categories as staticCategories } from './data/index.js';
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
      {/* Event decoration animation canvas */}
      <div className="loader-page__3d-bg">
        <Celebration3DCanvas />
      </div>

      {/* Scrollable content container */}
      <div className="loader-page__scrollable">
        
        {/* Section 1: Hero / Connection Splash */}
        <section className="loader-hero">
          <div className="container loader-hero__container">
            <div className="loader-hero__content">
              {/* Brand highlights & wakeup status */}
              <div className="loader-status">
                <span className="loader-status__dot" />
                <span className="loader-status__text">Syncing Luxury Collections...</span>
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
                  Curating luxury balloon installations and bespoke decorations...
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
    <div className="loader-page">
      {/* 3D background canvas */}
      <div className="loader-page__3d-bg">
        <Celebration3DCanvas />
      </div>

      {/* Decoration handled by animation canvas */}

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box'
      }}>
        <div className="loader-progress-card animate-fade-up" style={{
          maxWidth: '500px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '40px 32px'
        }}>
          {/* Animated Ornament Spinner */}
          <div className="loader-error-spinner">
            <span className="loader-error-spinner__icon">✨</span>
          </div>

          <h2 style={{ color: 'var(--navy)', fontSize: '1.5rem', fontWeight: '800', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            Connecting to Mela World{dots}
          </h2>

          <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: '1.7', margin: '0', fontFamily: "'DM Sans', sans-serif" }}>
            We are preparing our bespoke design catalogs and pricing details for your celebration.
          </p>

          <div style={{
            background: 'rgba(201, 168, 76, 0.06)',
            border: '1.5px solid rgba(201, 168, 76, 0.35)',
            borderRadius: '16px',
            padding: '12px 24px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <p style={{ margin: 0, color: 'var(--navy)', fontWeight: '700', fontSize: '0.92rem', letterSpacing: '0.04em' }}>
              Optimizing catalog in <span style={{ color: 'var(--gold)', fontSize: '1.25rem', fontWeight: '800' }}>{countdown}s</span>
            </p>
          </div>

          <button
            onClick={onRetry}
            className="loader-retry-btn"
          >
            🔄 Refresh Catalog
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper utilities for dynamic category alias routing
const getAllCategoryIds = (cats) => {
  const ids = [];
  const recurse = (list) => {
    if (!list) return;
    list.forEach(item => {
      if (item.id) ids.push(item.id);
      if (item.dropdown) recurse(item.dropdown);
    });
  };
  recurse(cats);
  return ids;
};

const normalizeCategoryString = (str) => {
  return str.toLowerCase()
    .replace(/^1st-/, "first-")
    .replace(/-(decorations|decoration|setups|setup|decor|party|events|event|activities|activity)$/g, "");
};

const findMatchedCategory = (path, cats) => {
  if (!cats || !path) return null;
  const allIds = getAllCategoryIds(cats);
  const normPath = normalizeCategoryString(path);
  
  if (normPath === "balloon") return "decorations";
  
  // Find exact match or normalized match
  const matched = allIds.find(id => {
    return id.toLowerCase() === path.toLowerCase() || 
           normalizeCategoryString(id) === normPath;
  });
  
  return matched || null;
};

// Mapping tables for dynamic SEO categories
const categoryIdToSlug = {
  'all': '',
  'birthday': 'birthday-decorations',
  'decorations': 'decorations',
  'anniversary': 'anniversary-decorations',
  'kidsactivities': 'kids-activities',
  'flower': 'flower-decorations',
  'festival': 'festival-decor',
  'corporate': 'corporate-events',
  'photography': 'photography'
};

const subcategoryIdToSlug = {
  'decorations-anniversary': 'anniversary-decoration',
  'baby-shower-decorations': 'baby-shower-decoration',
  'welcome-baby-decorations': 'welcome-baby-decoration',
  'naming-ceremony-decorations': 'naming-ceremony-decoration',
  'room-decorations': 'room-decoration',
  'haldi-decorations': 'haldi-decoration',
  'retirement-party-decorations': 'retirement-party-decoration',
  'bachelorette-party-decorations': 'bachelorette-party-decoration',
  'first-night-decorations': 'first-night-decoration',
  'valentines-decorations': 'valentines-decoration',
  'mothers-decorations': 'mothers-decoration',
  'romantic-room': 'romantic-room-decoration',
  'simple-anniversary': 'simple-anniversary-setup',
  'premium-luxury': 'premium-luxury-decoration',
};

const slugToCategoryId = {
  'birthday-decorations': 'birthday',
  'birthday-decoration': 'birthday',
  'birthday': 'birthday',
  'birthday-decoration-bangalore': 'birthday',
  'birthday-decorations-bangalore': 'birthday',
  'decorations': 'decorations',
  'balloon-decoration': 'decorations',
  'balloon-decorations': 'decorations',
  'balloon-decoration-bangalore': 'decorations',
  'balloon-decorations-bangalore': 'decorations',
  'anniversary-decorations': 'anniversary',
  'anniversary-decoration': 'anniversary',
  'anniversary': 'anniversary',
  'anniversary-decoration-bangalore': 'anniversary',
  'anniversary-decorations-bangalore': 'anniversary',
  'kids-activities': 'kidsactivities',
  'kidsactivities': 'kidsactivities',
  'flower-decorations': 'flower',
  'flower-decoration': 'flower',
  'flower': 'flower',
  'festival-decor': 'festival',
  'festival': 'festival',
  'corporate-events': 'corporate',
  'corporate': 'corporate',
  'photography': 'photography'
};

const slugToSubcategoryId = {
  'baby-shower-decoration-bangalore': 'baby-shower-decorations',
  'baby-shower-decorations-bangalore': 'baby-shower-decorations',
  'anniversary-decoration': 'decorations-anniversary',
  'baby-shower-decoration': 'baby-shower-decorations',
  'baby-shower-decorations': 'baby-shower-decorations',
  'welcome-baby-decoration': 'welcome-baby-decorations',
  'welcome-baby-decorations': 'welcome-baby-decorations',
  'naming-ceremony-decoration': 'naming-ceremony-decorations',
  'naming-ceremony-decorations': 'naming-ceremony-decorations',
  'room-decoration': 'room-decorations',
  'room-decorations': 'room-decorations',
  'haldi-decoration': 'haldi-decorations',
  'haldi-decorations': 'haldi-decorations',
  'retirement-party-decoration': 'retirement-party-decorations',
  'retirement-party-decorations': 'retirement-party-decorations',
  'bachelorette-party-decoration': 'bachelorette-party-decorations',
  'bachelorette-party-decorations': 'bachelorette-party-decorations',
  'first-night-decoration': 'first-night-decorations',
  'first-night-decorations': 'first-night-decorations',
  'valentines-decoration': 'valentines-decorations',
  'valentines-decorations': 'valentines-decorations',
  'mothers-decoration': 'mothers-decorations',
  'mothers-decorations': 'mothers-decorations',
  '1st-birthday-decoration': 'first-birthday-decorations',
  'first-birthday-decorations': 'first-birthday-decorations',
  'romantic-room-decoration': 'romantic-room',
  'romantic-room': 'romantic-room',
  'simple-anniversary-setup': 'simple-anniversary',
  'simple-anniversary': 'simple-anniversary',
  'premium-luxury-decoration': 'premium-luxury',
  'premium-luxury': 'premium-luxury'
};

const getSlugFromCategoryId = (id) => {
  return categoryIdToSlug[id] || id.toLowerCase().replace(/_/g, '-');
};

const getCategoryIdFromSlug = (slug) => {
  return slugToCategoryId[slug.toLowerCase()] || slug.toLowerCase().replace(/-/g, '_');
};

const getSlugFromSubcategoryId = (id) => {
  return subcategoryIdToSlug[id] || id.toLowerCase().replace(/_/g, '-').replace(/-decorations$/, '-decoration');
};

const getSubcategoryIdFromSlug = (slug) => {
  return slugToSubcategoryId[slug.toLowerCase()] || slug.toLowerCase().replace(/-/g, '_');
};

const parseCurrentPath = () => {
  if (typeof window === "undefined") {
    return { page: 'home', category: 'all', subcategory: null };
  }
  const pathParts = window.location.pathname.replace(/^\//, "").split("/");
  const firstSegment = pathParts[0] || 'home';
  
  if (firstSegment === 'gallery') {
    const categorySlug = pathParts[1] || null;
    const subcategorySlug = pathParts[2] || null;
    
    let activeCat = 'all';
    let activeSub = null;
    
    if (categorySlug) {
      activeCat = getCategoryIdFromSlug(categorySlug);
    }
    if (subcategorySlug) {
      activeSub = getSubcategoryIdFromSlug(subcategorySlug);
    }
    
    return { page: 'gallery', category: activeCat, subcategory: activeSub };
  }
  
  // Legacy aliases
  if (firstSegment === 'services' || firstSegment === 'themes') {
    return { page: 'gallery', category: 'all', subcategory: null };
  }
  
  const matchedCat = findMatchedCategory(firstSegment, staticCategories);
  if (matchedCat) {
    const parent = getParentCategory(matchedCat);
    if (parent !== matchedCat) {
      return { page: 'gallery', category: parent, subcategory: matchedCat };
    }
    return { page: 'gallery', category: matchedCat, subcategory: null };
  }
  
  if (firstSegment.startsWith('product/')) {
    return { page: 'product-detail', category: 'all', subcategory: null };
  }
  
  const validPages = ['home', 'gallery', 'order', 'how-it-works', 'login', 'dashboard', 'calculator', 'customizer', 'recent-gallery', 'admin', 'admin-dashboard', 'contact', 'faqs', 'privacy', 'terms', 'product-detail', 'about'];
  const page = validPages.includes(firstSegment) ? firstSegment : 'home';
  return { page, category: 'all', subcategory: null };
};

// Dynamic SEO Metadata Configuration
const seoData = {
  // Main Static Pages
  'home': {
    title: 'Mela Celebrations | Premium Event Decor & Balloon Artistry in Bengaluru',
    description: "Bengaluru's premier boutique event decorator. Crafting luxury balloon setups, romantic anniversary room decor, custom theme birthday backdrops, and traditional flower arrangements."
  },
  'about': {
    title: 'About Us | Mela Celebrations',
    description: 'Learn about Mela Celebrations, our bespoke custom design philosophy, our strict quality control standards, and sustainable event styling in Bengaluru.'
  },
  'gallery': {
    title: 'Bespoke Event Design Gallery | Mela Celebrations',
    description: 'Explore our catalog of luxury balloon backdrops, kids theme parties, wedding stages, and traditional setups in Bengaluru. Filter by occasion or colors.'
  },
  'order': {
    title: 'Book a Consultation | Mela Celebrations',
    description: 'Schedule a personalized consultation with our event planning designers to construct a custom decor package for your celebrations in Bengaluru.'
  },
  'how-it-works': {
    title: 'How It Works | Mela Celebrations',
    description: 'Understand our event decoration process from booking consultations and 3D event customizer design matching to setup delivery and dismantle.'
  },
  'contact': {
    title: 'Contact Us | Mela Celebrations',
    description: 'Get in touch with the design coordinators at Mela Celebrations in Bengaluru to query custom event quotes, packages, and booking availability.'
  },
  'calculator': {
    title: 'Event Budget Estimator | Mela Celebrations',
    description: 'Estimate your event decoration pricing dynamically with our interactive budget calculator. Balance balloons, backdrops, and lighting props.'
  },
  'customizer': {
    title: '3D Event Builder & Customizer | Mela Celebrations',
    description: 'Bespoke design customizer tool to interactively visualize and build your balloon arches, colors, and setups for personalized bookings.'
  },
  'recent-gallery': {
    title: 'Recent Projects & Portfolio | Mela Celebrations',
    description: 'A visual showcase of our recent high-end events, luxury balloon designs, and floral decorations setup across Bengaluru.'
  },
  'login': {
    title: 'Client Login | Mela Celebrations',
    description: 'Log into your Mela Celebrations account to track booking status, browse wishlists, and manage event design projects.'
  },
  'dashboard': {
    title: 'Client Dashboard | Mela Celebrations',
    description: 'Manage your active bookings, view custom designer moodboards, check event status, and review order invoices.'
  },
  'faqs': {
    title: 'Frequently Asked Questions | Mela Celebrations',
    description: 'Find answers regarding booking timelines, customization limits, payment conditions, and setup execution across Bengaluru.'
  },
  'privacy': {
    title: 'Privacy Policy | Mela Celebrations',
    description: 'Privacy Policy and data protection terms for users and clients booking services through Mela Celebrations.'
  },
  'terms': {
    title: 'Terms of Service | Mela Celebrations',
    description: 'Terms of service, delivery policies, booking cancellation conditions, and contract terms for Mela Celebrations event decor.'
  },
  'product-detail': {
    title: 'Premium Design Setup Details | Mela Celebrations',
    description: 'Bespoke package pricing, measurements, options, and inclusion specifications for high-end balloon and event setups in Bengaluru.'
  },

  // City-Specific Bangalore Landing Pages
  'birthday-decoration-bangalore': {
    title: 'Birthday Party Decorations & Theme Setups in Bangalore | Mela Celebrations',
    description: 'Bespoke birthday party balloon decorations, grand stage backdrops, and theme setups in Bangalore. Inquire on WhatsApp for packages.'
  },
  'birthday-decorations-bangalore': {
    title: 'Birthday Party Decorations & Theme Setups in Bangalore | Mela Celebrations',
    description: 'Bespoke birthday party balloon decorations, grand stage backdrops, and theme setups in Bangalore. Inquire on WhatsApp for packages.'
  },
  'balloon-decoration-bangalore': {
    title: 'Bespoke Balloon Decoration Services in Bangalore | Mela Celebrations',
    description: 'Premium balloon decoration in Bangalore for baby showers, room surprises, store launches, and private celebrations.'
  },
  'balloon-decorations-bangalore': {
    title: 'Bespoke Balloon Decoration Services in Bangalore | Mela Celebrations',
    description: 'Premium balloon decoration in Bangalore for baby showers, room surprises, store launches, and private celebrations.'
  },
  'anniversary-decoration-bangalore': {
    title: 'Romantic Anniversary Room & Stage Decoration Bangalore | Mela Celebrations',
    description: 'Surprise anniversary room setups, LED marquee letters, and balloon decoration in Bangalore. High-end custom styling.'
  },
  'anniversary-decorations-bangalore': {
    title: 'Romantic Anniversary Room & Stage Decoration Bangalore | Mela Celebrations',
    description: 'Surprise anniversary room setups, LED marquee letters, and balloon decoration in Bangalore. High-end custom styling.'
  },
  'baby-shower-decoration-bangalore': {
    title: 'Premium Baby Shower Balloon & Flower Decor in Bangalore | Mela Celebrations',
    description: 'Cute pastel baby shower themes, cradle decoration, and maternity photoshoot backgrounds in Bangalore.'
  },
  'baby-shower-decorations-bangalore': {
    title: 'Premium Baby Shower Balloon & Flower Decor in Bangalore | Mela Celebrations',
    description: 'Cute pastel baby shower themes, cradle decoration, and maternity photoshoot backgrounds in Bangalore.'
  },

  // Primary Occasions / Category IDs
  'birthday': {
    title: 'Birthday Party Decorations & Theme Setups in Bengaluru | Mela Celebrations',
    description: 'Explore custom birthday party themes, grand entrance arches, backdrops, neon sign panels, and table decorations for all age milestones.'
  },
  'decorations': {
    title: 'Bespoke Event Decorations & Balloon Art | Mela Celebrations',
    description: 'Luxury balloon arrangements, custom backdrop panels, fairy lights, floral arches, and thematic installations for premium private events.'
  },
  'anniversary': {
    title: 'Romantic Anniversary Room Decor & Stage Setups | Mela Celebrations',
    description: 'Surprise your partner with premium romantic room setups, glowing marquee lights, heart-shaped balloon arches, and red rose designs in Bengaluru.'
  },
  'kidsactivities': {
    title: 'Premium Kids Party Activities & Play Zones | Mela Celebrations',
    description: 'Keep your young guests entertained with cartoon character mascots, interactive craft corners, bouncy castles, and kids event coordinators.'
  },
  'flower': {
    title: 'Traditional Flower Decorations & Marigold Setups | Mela Celebrations',
    description: 'Auspicious fresh flower backdrops, traditional marigold hangings, and temple setups for housewarmings, naming ceremonies, and engagements.'
  },
  'festival': {
    title: 'Festive & Seasonal Theme Event Styling | Mela Celebrations',
    description: 'Celebrate Indian festivals with traditional setups for Diwali, Ganesh Chaturthi mandaps, New Year balloon drops, and Christmas decor.'
  },
  'corporate': {
    title: 'Corporate Event Styling & Balloon Branding | Mela Celebrations',
    description: 'Professional event decor for office launches, corporate seminars, retail shop openings, custom balloon branding, and media backdrop panels.'
  },
  'photography': {
    title: 'Professional Event Photography Services in Bengaluru | Mela Celebrations',
    description: 'Capture special memories with Mela Celebrations professional event photography. Birthday party shoots, anniversaries, baby showers, and grand celebrations.'
  },

  // Subcategory IDs
  'wall-decorations': {
    title: 'Bespoke Wall Balloon Backdrops & Arches | Mela Celebrations',
    description: 'Stunning wall balloon designs, elegant organic balloon arches, and customized backdrop frames to fit any living room or stage layout.'
  },
  'kids-theme': {
    title: 'Kids Theme Birthday Party Decor | Mela Celebrations',
    description: 'Creative and immersive theme birthday decorations for boys and girls including jungle safari, space explorer, and construction setups.'
  },
  'jungle-theme': {
    title: 'Jungle Safari Theme Birthday Backdrop | Mela Celebrations',
    description: 'Wild jungle theme setups with animal foil balloons, lush green foliage arches, and safari adventure backdrops for kids birthdays.'
  },
  'superman-theme': {
    title: 'Superman Theme Party Decor in Bengaluru | Mela Celebrations',
    description: 'Heroic Superman themed birthday setups in bold blue, red, and yellow colors with city skyline cutouts and custom shields.'
  },
  'cars-theme': {
    title: 'Racing Cars Theme Kids Birthday Setup | Mela Celebrations',
    description: 'Start your engines with checkerboard racing flags, red-black balloon arches, and Disney Cars themed photo booths.'
  },
  'mickey-theme': {
    title: 'Mickey Mouse Theme Birthday Backdrop | Mela Celebrations',
    description: 'Classic Mickey Mouse backdrop setups featuring ear silhouettes, red and black organic balloon garlands, and custom props.'
  },
  'football-theme': {
    title: 'Football & Sports Theme Birthday Setup | Mela Celebrations',
    description: 'Celebrate their passion for sports with turf carpets, stadium arches, football nets, and black-and-white theme balloon decor.'
  },
  'boss-baby-theme': {
    title: 'Boss Baby Theme Birthday Decorations | Mela Celebrations',
    description: 'Sleek black, blue, and silver Boss Baby setups with baby suit silhouettes, business props, and custom text panels.'
  },
  'space-theme': {
    title: 'Outer Space & Astronaut Theme Decor | Mela Celebrations',
    description: 'Blast off with galaxy themed backgrounds, astronaut foil balloons, metallic planet garlands, and cosmic LED starry projections.'
  },
  'construction-theme': {
    title: 'Under Construction Theme Kids Birthday | Mela Celebrations',
    description: 'Fun builder construction theme birthday designs featuring yellow road signs, warning cones, toy trucks, and caution tapes.'
  },
  'aeroplane-theme': {
    title: 'Aviation & Aeroplane Theme Party Setup | Mela Celebrations',
    description: 'Take flight with custom clouds, aeroplane backdrops, blue-sky balloon arches, and captain mascot cutouts.'
  },
  'paw-patrol-theme': {
    title: 'Paw Patrol Theme Balloon Decorations | Mela Celebrations',
    description: 'Vibrant Paw Patrol rescue team theme birthday backdrops with colorful bone print cutouts, badges, and balloon pillars.'
  },
  'car-boot-decorations': {
    title: 'Surprise Car Boot Balloon & Flower Decor | Mela Celebrations',
    description: 'Bespoke car trunk decorations for surprise proposals, birthday gifts, or anniversaries with fairy lights and custom text.'
  },
  'first-birthday-decorations': {
    title: '1st Birthday Grand Theme Setups in Bengaluru | Mela Celebrations',
    description: 'Create lasting memories for your child’s first milestone with grand pastel setups, light-up numbers, and cute theme arches.'
  },
  'decorations-anniversary': {
    title: 'Anniversary Balloon Backdrops & Garlands | Mela Celebrations',
    description: 'Celebrate marriage milestones with gold-themed organic balloon arches, luxury drape panels, and customized name rings.'
  },
  'baby-shower-decorations': {
    title: 'Premium Baby Shower Balloon & Canopy Setups | Mela Celebrations',
    description: 'Pastel pink, blue, and cream baby shower decorations with teddy bear props, flower canopies, and gender reveal backdrops.'
  },
  'welcome-baby-decorations': {
    title: 'Welcome Baby Home Surprise Balloon Decor | Mela Celebrations',
    description: 'Welcome mother and newborn home with cute baby carriages, infant bottle balloons, pastel archways, and greeting banners.'
  },
  'naming-ceremony-decorations': {
    title: 'Traditional Cradle & Naming Ceremony Setups | Mela Celebrations',
    description: 'Premium naming ceremony cradles decorated with fresh marigolds, roses, jasmine drapes, and elegant background setups.'
  },
  'room-decorations': {
    title: 'Surprise Bedroom Balloon Decorations | Mela Celebrations',
    description: 'Transform bedrooms into stunning surprise destinations with helium ceiling balloons, hanging polaroid photos, and custom lettering.'
  },
  'haldi-decorations': {
    title: 'Traditional Haldi & Mehndi Event Decoration | Mela Celebrations',
    description: 'Vibrant yellow and orange background frames with clay pots, swing stages, and fresh marigold hangings for haldi and mehndi rituals.'
  },
  'retirement-party-decorations': {
    title: 'Retirement Celebration Theme Party Setups | Mela Celebrations',
    description: 'Mark a lifelong achievement with elegant gold-and-black balloon backdrops, memory walls, and custom celebration arches.'
  },
  'bachelorette-party-decorations': {
    title: 'Bride-To-Be & Bachelorette Balloon Setups | Mela Celebrations',
    description: 'Fun bachelorette parties featuring champagne bottle arches, bride-to-be pink balloons, satin photo zones, and props.'
  },
  'first-night-decorations': {
    title: 'Romantic First Night Bedroom Decoration | Mela Celebrations',
    description: 'Elegant canopy curtains, red rose heart shaped beds, glowing candles, and helium balloons for a dreamlike wedding night setup.'
  },
  'valentines-decorations': {
    title: "Valentine's Day Proposal & Room Decor | Mela Celebrations",
    description: 'Romantic proposals, rose paths, marquee LOVE letters, and heart-themed balloons for the ultimate Valentine surprise in Bengaluru.'
  },
  'mothers-decorations': {
    title: "Mother's Day Celebration Stage Decor | Mela Celebrations",
    description: 'Express your gratitude with warm gold theme backdrops, floral photo spots, and custom Mother’s Day banners.'
  },
  'simple-anniversary': {
    title: 'Simple & Elegant Anniversary Stage Decor | Mela Celebrations',
    description: 'Minimalistic and sophisticated anniversary setups using neat arch frames, simple balloon garlands, and neon lettering.'
  },
  'romantic-room': {
    title: 'Surprise Romantic Room Decor with Helium Balloons | Mela Celebrations',
    description: 'Premium romantic room decorations with rose petals, LED candles, custom photos, and floating ceiling balloons.'
  },
  'premium-luxury': {
    title: 'Grand Premium Luxury Stage Decoration | Mela Celebrations',
    description: 'Luxury event decorations featuring large double-arch structures, cascading balloon paths, pampas grass, and golden frames.'
  },
  'house-warming': {
    title: 'Traditional Gruhapravesham Flower Decor | Mela Celebrations',
    description: 'Bespoke housewarming decor with fresh mango leaves, jasmine creepers, banana plants, and elegant entry rangoli setups.'
  },
  'chhapara': {
    title: 'Wedding Chhapara Traditional Flower Tent | Mela Celebrations',
    description: 'Authentic wedding chhapara entry tents styled with traditional marigolds, banana trunks, and copper bells.'
  },
  'new-year': {
    title: "New Year's Eve Gold & Black Theme Setup | Mela Celebrations",
    description: 'Ring in the New Year with custom midnight countdown arches, gold confetti balloons, and glamorous photo booths.'
  },
  'diwali': {
    title: 'Diwali Festive Flower & Diya Mandap Decor | Mela Celebrations',
    description: 'Traditional Deepavali light arches, hanging brass diyas, marigold chains, and floor rangolis for festive celebrations.'
  },
  'ganesh-festival': {
    title: 'Ganesh Chaturthi Traditional Mandap Decor | Mela Celebrations',
    description: 'Eco-friendly and traditional Ganesh pandal backdrops, fresh flower garlands, and ornate mandaps for home celebrations.'
  },
  'christmas': {
    title: 'Christmas Theme Party Balloon Decor | Mela Celebrations',
    description: 'Festive red-white-green Christmas decor with giant candy canes, balloon Christmas trees, and snowflake ceiling grids.'
  }
};

function AppContent() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { loading, error } = useContext(DesignContext);
  
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

  const initialRoute = parseCurrentPath();
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [activeCategory, setActiveCategory] = useState(initialRoute.category);
  const [activeSubcategory, setActiveSubcategory] = useState(initialRoute.subcategory);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(getInitialProductId);
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
      const currentRoute = parseCurrentPath();
      setCurrentPage(currentRoute.page);
      setActiveCategory(currentRoute.category);
      setActiveSubcategory(currentRoute.subcategory);
      if (event.state && event.state.productId) {
        setSelectedProductId(event.state.productId);
      }
    };

    const initialPage = initialRoute.page;
    if (!window.history.state) {
      let initialPath = window.location.pathname;
      window.history.replaceState({ page: initialPage, category: initialRoute.category, subcategory: initialRoute.subcategory }, '', initialPath);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Meta Title and Description Update
  useEffect(() => {
    let seoKey = 'home';
    let titleStr = '';
    let descStr = '';

    if (currentPage === 'product-detail' && selectedProductId) {
      titleStr = `Luxury Design Setup #${selectedProductId} | Mela Celebrations`;
      descStr = `Check out design inclusions, pricing packages, and customization details for Mela Celebrations event layout #${selectedProductId}.`;
    } else {
      if (currentPage === 'gallery') {
        seoKey = activeSubcategory || activeCategory || 'gallery';
      } else {
        seoKey = currentPage || 'home';
      }
      const meta = seoData[seoKey] || seoData['home'];
      titleStr = meta.title;
      descStr = meta.description;
    }

    // Update Page Title
    document.title = titleStr;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', descStr);
    }

    // Update Canonical URL and OG URL
    const currentUrl = window.location.href;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', currentUrl);
    }
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', currentUrl);
    }

    // Update OG Title and Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', titleStr);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', descStr);
    }

    // Dynamic OG and Twitter Image
    let imageUrl = 'https://www.melacelebrations.com/og-banner.jpg';
    if (currentPage === 'gallery' && activeCategory && activeCategory !== 'all') {
      const bannerMap = {
        'birthday': 'birthday-banner.jpg',
        'anniversary': 'anniversary-banner.jpg',
        'kidsactivities': 'kids-banner.jpg',
        'flower': 'flower-banner.jpg',
        'festival': 'festive-banner.jpg',
        'corporate': 'corporate-banner.jpg',
        'photography': 'photography-banner.jpg',
        'decorations': 'decorations-banner.jpg'
      };
      if (bannerMap[activeCategory]) {
        imageUrl = `https://www.melacelebrations.com/${bannerMap[activeCategory]}`;
      }
    }
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', imageUrl);
    }
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', imageUrl);
    }

    // Dynamic Breadcrumb JSON-LD Injection
    let breadcrumbScript = document.getElementById('seo-breadcrumbs');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'seo-breadcrumbs';
      breadcrumbScript.type = 'application/ld+json';
      document.head.appendChild(breadcrumbScript);
    }

    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.melacelebrations.com/"
      }
    ];

    if (currentPage !== 'home') {
      if (currentPage === 'gallery') {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Gallery",
          "item": "https://www.melacelebrations.com/gallery"
        });

        if (activeCategory && activeCategory !== 'all') {
          const catSlug = getSlugFromCategoryId(activeCategory);
          const catName = seoData[activeCategory]?.title.split(' | ')[0] || activeCategory;
          items.push({
            "@type": "ListItem",
            "position": 3,
            "name": catName,
            "item": `https://www.melacelebrations.com/gallery/${catSlug}`
          });

          if (activeSubcategory) {
            const subSlug = getSlugFromSubcategoryId(activeSubcategory);
            const subName = seoData[activeSubcategory]?.title.split(' | ')[0] || activeSubcategory;
            items.push({
              "@type": "ListItem",
              "position": 4,
              "name": subName,
              "item": `https://www.melacelebrations.com/gallery/${catSlug}/${subSlug}`
            });
          }
        }
      } else if (currentPage === 'product-detail' && selectedProductId) {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Gallery",
          "item": "https://www.melacelebrations.com/gallery"
        });
        items.push({
          "@type": "ListItem",
          "position": 3,
          "name": `Design #${selectedProductId}`,
          "item": `https://www.melacelebrations.com/product/${selectedProductId}`
        });
      } else {
        const pageName = seoData[currentPage] ? (seoData[currentPage].title ? seoData[currentPage].title.split(' | ')[0] : currentPage) : currentPage;
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": pageName,
          "item": `https://www.melacelebrations.com/${currentPage}`
        });
      }
    }

    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    });
  }, [currentPage, activeCategory, activeSubcategory, selectedProductId]);

  const navigateToGallery = (cat, sub = null) => {
    let resolvedCat = cat || 'all';
    let resolvedSub = sub;
    
    // Resolve if cat is actually a subcategory ID
    const parent = getParentCategory(resolvedCat);
    if (parent !== resolvedCat) {
      resolvedSub = resolvedCat;
      resolvedCat = parent;
    }
    
    const catSlug = resolvedCat !== 'all' ? getSlugFromCategoryId(resolvedCat) : '';
    const subSlug = resolvedSub ? getSlugFromSubcategoryId(resolvedSub) : '';
    
    let path = '/gallery';
    if (catSlug) {
      path += `/${catSlug}`;
      if (subSlug) {
        path += `/${subSlug}`;
      }
    }
    
    window.history.pushState({ page: 'gallery', category: resolvedCat, subcategory: resolvedSub }, '', path);
    setCurrentPage('gallery');
    setActiveCategory(resolvedCat);
    setActiveSubcategory(resolvedSub);
    window.scrollTo(0, 0);
  };

  const navigateToPage = (page) => {
    if (page === 'gallery') {
      if (!window.location.pathname.startsWith('/gallery')) {
        navigateToGallery('all', null);
      }
      return;
    }
    if (page !== currentPage) {
      window.history.pushState({ page }, '', `/${page === 'home' ? '' : page}`);
      setCurrentPage(page);
      setActiveCategory('all');
      setActiveSubcategory(null);
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
            setActiveCategory={navigateToGallery} 
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
            setActiveCategory={navigateToGallery} 
            activeSubcategory={activeSubcategory}
            setActiveSubcategory={(subId) => navigateToGallery(activeCategory, subId)}
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
      case 'about':
        return <AboutPage setCurrentPage={navigateToPage} />;
      case 'terms':
        return <TermsPage setCurrentPage={navigateToPage} />;
      case 'admin':
        return <LoginPage setCurrentPage={navigateToPage} initialMode="admin" />;
      case 'admin-dashboard':
        if (!isAuthenticated || !user || user.role !== 'admin') {
          return <LoginPage setCurrentPage={navigateToPage} initialMode="admin" />;
        }
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
            setActiveCategory={navigateToGallery} 
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
        setActiveCategory={navigateToGallery} 
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
