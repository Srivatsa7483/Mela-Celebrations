import "./AboutPage.css";

export default function AboutPage({ setCurrentPage }) {
    return (
        <div className="about-page">
            {/* Header Banner */}
            <div className="about-page__header">
                <div className="container">
                    <span className="tag" style={{ color: "rgba(255,255,255,0.6)" }}>OUR STORY</span>
                    <h1 className="about-page__title">About Mela Celebrations</h1>
                    <p className="about-page__sub">
                        Bengaluru's premier boutique event decorator. Crafting luxury, artisanal aesthetics to transform your celebrations into memorable experiences.
                    </p>
                </div>
            </div>

            {/* Brand Story Section */}
            <div className="container about-page__content">
                <div className="about-story-section">
                    <div className="about-story-body">
                        <h2>Crafting Extraordinary Moments</h2>
                        <p>
                            At Mela Celebrations, we believe that every event is a blank canvas waiting to be transformed into a masterpiece. What started as a passion project for premium, organic balloon styling in Bengaluru has evolved into a full-scale boutique event design atelier.
                        </p>
                        <p>
                            We specialize in modern, high-end balloon artistry, premium wedding styling, corporate decor, and intimate birthday set-ups. Unlike mass-market decorators, we treat every installation as a unique work of art, custom-tailored to suit the venue, lighting, and our clients' unique personalities.
                        </p>
                        <p>
                            Our team of skilled artisans is dedicated to taking the stress out of event planning. From detailed 3D design visualizations to the final teardown, we offer a seamless, worry-free process so you can focus entirely on celebrating with your loved ones.
                        </p>
                    </div>
                    <div className="about-story-media">
                        <img 
                            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80" 
                            alt="Luxury Celebration Decor" 
                            className="about-story-img"
                        />
                    </div>
                </div>

                {/* Core values */}
                <div className="about-values-section">
                    <h2 className="about-values-heading">Our Core Pillars</h2>
                    <div className="about-values-grid">
                        <div className="value-card">
                            <div className="value-card__icon">🎨</div>
                            <h3>Bespoke Artistry</h3>
                            <p>No cookie-cutter packages. Every palette and backdrop structure is custom designed to tell your story.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-card__icon">💎</div>
                            <h3>Premium Quality</h3>
                            <p>We use double-stuffed, 100% biodegradable latex balloons for rich colors, high shine, and structural longevity.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-card__icon">⏰</div>
                            <h3>Reliable Setup</h3>
                            <p>Punctuality is our promise. Our professional team finishes early so you can enjoy your event stress-free.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-card__icon">🌱</div>
                            <h3>Eco-Conscious</h3>
                            <p>We care about the planet. We use premium, biodegradable latex balloons and prioritize reusable decorative backdrops.</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Link / Call to Action */}
                <div className="about-page__cta">
                    <h2>Want to create something beautiful together?</h2>
                    <p>Get in touch with our design atelier to discuss your vision, themes, and customized budget estimates.</p>
                    <div className="about-cta-buttons">
                        <button className="btn-primary" onClick={() => setCurrentPage("order")}>REQUEST CONSULTATION</button>
                        <button className="btn-secondary" onClick={() => setCurrentPage("gallery")}>BROWSE COLLECTIONS</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
