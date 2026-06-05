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
                            for birthdays, anniversaries, and festive celebrations.
                        </p>
                        <div className="footer__social">
                            <a 
                                href="https://www.instagram.com/mela_celebrations/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="footer__social-icon" 
                                aria-label="Instagram"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a 
                                href="https://www.facebook.com/profile.php?id=61578640421672" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="footer__social-icon" 
                                aria-label="Facebook"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a 
                                href="https://pin.it/5TmkYfFIm" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="footer__social-icon" 
                                aria-label="Pinterest"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.017 0C5.396 0 .03 5.367.03 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.166-1.495-.69-2.433-2.878-2.433-4.617 0-3.77 2.738-7.237 7.91-7.237 4.154 0 7.375 2.96 7.375 6.9 0 4.127-2.599 7.453-6.214 7.453-1.214 0-2.356-.632-2.748-1.382 0 0-.6 2.278-.745 2.837-.27 1.028-1.002 2.316-1.493 3.111 1.12.347 2.309.539 3.541.539 6.63 0 12-5.37 12-11.996C23.997 5.367 18.63 0 12.017 0z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://youtube.com/@melacelebrations?si=rvRlVl2U87wXnr-v" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="footer__social-icon" 
                                aria-label="YouTube"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
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