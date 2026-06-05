import { useState } from "react";
import "./ContactPage.css";

export default function ContactPage({ setCurrentPage }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateEmail = (emailStr) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Simple validation
        if (!name.trim()) {
            setError("Name is required.");
            return;
        }
        if (!email.trim() || !validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!subject.trim()) {
            setError("Subject is required.");
            return;
        }
        if (!message.trim()) {
            setError("Message cannot be empty.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, subject, message }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send message. Please try again.");
            }

            setSuccess("Thank you! Your message has been sent successfully. A confirmation receipt has been sent to your email.");
            // Reset form fields
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (err) {
            setError(err.message || "Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page animate-fade-in">
            {/* Header section */}
            <div className="contact-page__header">
                <span className="contact-page__subtitle">Get In Touch</span>
                <h1 className="contact-page__title">Let's Design Your Dream Event</h1>
                <p className="contact-page__desc">
                    Have questions about our setups, pricing, or custom design packages? 
                    Reach out to our boutique planning team. We'd love to bring your vision to life.
                </p>
            </div>

            {/* Grid Container */}
            <div className="container">
                <div className="contact-page__grid">
                    
                    {/* Column 1: Contact Details Panel */}
                    <div className="contact-info-card">
                        <div className="contact-info-card__top">
                            <h2>Bespoke Service</h2>
                            <p>
                                Every celebration deserves to be legendary. Whether it is a romantic anniversary, 
                                a grand birthday, or an elaborate festival décor, our team is ready to assist.
                            </p>
                            
                            <div className="contact-details-list">
                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">📞</div>
                                    <div className="contact-detail-content">
                                        <h4>Phone & WhatsApp</h4>
                                        <a href="tel:+918152033967">+91 81520 33967</a>
                                    </div>
                                </div>
                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">📧</div>
                                    <div className="contact-detail-content">
                                        <h4>Email Support</h4>
                                        <a href="mailto:melacelebrations@gmail.com">melacelebrations@gmail.com</a>
                                    </div>
                                </div>
                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">📍</div>
                                    <div className="contact-detail-content">
                                        <h4>Main Atelier</h4>
                                        <p>BTM 1st Stage, Bengaluru, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-info-card__socials">
                            <h4>Follow Our Celebrations</h4>
                            <a
                                href="https://instagram.com/mela_celebrations"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="instagram-follow-card"
                                aria-label="Follow on Instagram"
                            >
                                <div className="instagram-follow-card__bg" />
                                <div className="instagram-follow-card__inner">
                                    <svg className="instagram-follow-card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                        <circle cx="12" cy="12" r="4"/>
                                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                                    </svg>
                                    <div className="instagram-follow-card__text">
                                        <span className="instagram-follow-card__handle">@mela_celebrations</span>
                                        <span className="instagram-follow-card__cta">Follow us on Instagram ↗</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Form Card */}
                    <div className="contact-form-card">
                        <h3>Send A Message</h3>
                        <p>Fill out the form below and we will respond within 24 hours.</p>

                        {/* Alert Banners */}
                        {error && (
                            <div className="contact-alert contact-alert--error">
                                <span className="contact-alert-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="contact-alert contact-alert--success">
                                <span className="contact-alert-icon">✨</span>
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="contact-form-groups">
                                <div className="contact-form-group">
                                    <label htmlFor="contact-name">Full Name</label>
                                    <input 
                                        type="text" 
                                        id="contact-name" 
                                        className="contact-form-input" 
                                        placeholder="Aisha Patel"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="contact-form-group">
                                    <label htmlFor="contact-email">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="contact-email" 
                                        className="contact-form-input" 
                                        placeholder="aisha@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="contact-form-group full-width">
                                    <label htmlFor="contact-subject">Subject</label>
                                    <input 
                                        type="text" 
                                        id="contact-subject" 
                                        className="contact-form-input" 
                                        placeholder="Custom anniversary inquiry..."
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="contact-form-group full-width">
                                    <label htmlFor="contact-message">Message</label>
                                    <textarea 
                                        id="contact-message" 
                                        className="contact-form-textarea" 
                                        placeholder="Tell us about your event dates, expected guest count, and design vision..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="contact-form-submit-btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "SENDING INQUIRY..." : "SEND MESSAGE"}
                            </button>
                        </form>
                    </div>

                </div>

                {/* Interactive Map Block */}
                <div className="contact-map-section">
                    <div className="contact-mock-map">
                        <div className="map-marker-container">
                            <div className="map-marker">
                                <span>✨</span>
                            </div>
                            <div className="map-marker-shadow"></div>
                        </div>
                        <div className="map-popup-card">
                                <h4>Mela Celebrations Atelier</h4>
                                <p>BTM 1st Stage, Bengaluru</p>
                            </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
