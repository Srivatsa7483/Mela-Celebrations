import { useState } from 'react';
import './Footer.css';

export default function Footer({ setCurrentPage }) {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
            setSubscribed(true);
            setNewsletterEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="footer__newsletter">
                <div className="container footer__nl-inner">
                    <div>
                        <h3 className="footer__nl-heading">Subscribe to Mela</h3>
                        <p className="footer__nl-sub">
                            Get early access to bespoke design templates, festival packages, and exclusive discount coupons.
                        </p>
                    </div>
                    
                    {subscribed ? (
                        <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '1rem' }}>
                            ✨ Thank you! You have successfully subscribed to our newsletter.
                        </div>
                    ) : (
                        <form className="footer__nl-form" onSubmit={handleSubscribe}>
                            <input 
                                type="email" 
                                className="footer__nl-input" 
                                placeholder="Your email address" 
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                required 
                            />
                            <button type="submit" className="footer__nl-btn">SUBSCRIBE</button>
                        </form>
                    )}
                </div>
            </div>

            {/* Main Footer Directory */}
            <div className="footer__main">
                <div className="container footer__grid">
                    
                    {/* Brand Profile Column */}
                    <div>
                        <h4 className="footer__brand-name">Mela Celebrations</h4>
                        <p className="footer__brand-tagline">
                            Bengaluru's premier boutique event decorator. Crafting luxury, artisanal aesthetics 
                            for birthdays, anniversaries, candlelights, and festive celebrations.
                        </p>
                        <div className="footer__social">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-icon" aria-label="Instagram">📸</a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-icon" aria-label="Facebook">👤</a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer__social-icon" aria-label="Pinterest">📌</a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-icon" aria-label="YouTube">🎥</a>
                        </div>
                    </div>

                    {/* Column 2: Explore */}
                    <div>
                        <h5 className="footer__col-heading">Explore</h5>
                        <ul className="footer__col-list">
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("home")}>
                                    Home
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("gallery")}>
                                    Design Gallery
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("calculator")}>
                                    Budget Estimator
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("customizer")}>
                                    Bespoke Customizer
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("recent-gallery")}>
                                    Recent Work
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h5 className="footer__col-heading">Company</h5>
                        <ul className="footer__col-list">
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("how-it-works")}>
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("contact")}>
                                    Contact Us
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("faqs")}>
                                    FAQs
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("privacy")}>
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button className="footer__col-link" onClick={() => setCurrentPage("terms")}>
                                    Terms of Service
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact info summary */}
                    <div>
                        <h5 className="footer__col-heading">Contact Atelier</h5>
                        <ul className="footer__col-list" style={{ gap: '14px' }}>
                            <li style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)', lineHeight: '1.5' }}>
                                📍 BTM 1st Stage,<br /> Bengaluru - 560068
                            </li>
                            <li style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>
                                📞 +91 81520 33967
                            </li>
                            <li style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>
                                📧 melacelebrations@gmail.com
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Row */}
                <div className="container footer__bottom">
                    <p>&copy; {new Date().getFullYear()} Mela Celebrations. All rights reserved.</p>
                    <p>Designed with ❤️ for luxury events</p>
                </div>
            </div>
        </footer>
    );
}