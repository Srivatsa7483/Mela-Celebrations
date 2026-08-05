import { useEffect } from 'react';
import './HowItWorksPage.css';

export default function HowItWorksPage({ setCurrentPage }) {
    useEffect(() => {
        let howtoScript = document.getElementById('seo-howto-schema');
        if (!howtoScript) {
            howtoScript = document.createElement('script');
            howtoScript.id = 'seo-howto-schema';
            howtoScript.type = 'application/ld+json';
            document.head.appendChild(howtoScript);
        }

        howtoScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Book Event Decoration with Mela Celebrations",
            "description": "Follow four simple, transparent steps to select event decor themes, customize colors, request a quote, lock your booking slot, and get your venue decorated.",
            "step": [
                {
                    "@type": "HowToStep",
                    "url": "https://www.melacelebrations.com/how-it-works",
                    "name": "Customize Your Décor Theme",
                    "text": "Use our online Customizer to pick your event type, color palette, and add-ons. Preview your theme instantly before requesting a quote.",
                    "image": "https://www.melacelebrations.com/og-banner.jpg"
                },
                {
                    "@type": "HowToStep",
                    "url": "https://www.melacelebrations.com/how-it-works",
                    "name": "Get a Free Quote",
                    "text": "Submit your customized theme and event details. Mela Celebrations sends a transparent quote with no hidden charges, usually within 24 hours.",
                    "image": "https://www.melacelebrations.com/og-banner.jpg"
                },
                {
                    "@type": "HowToStep",
                    "url": "https://www.melacelebrations.com/how-it-works",
                    "name": "Confirm Your Booking",
                    "text": "Confirm your date and pay the booking amount to lock in your theme, materials, and event slot.",
                    "image": "https://www.melacelebrations.com/og-banner.jpg"
                },
                {
                    "@type": "HowToStep",
                    "url": "https://www.melacelebrations.com/how-it-works",
                    "name": "Setup on Your Event Day",
                    "text": "Our team arrives ahead of your event to set up the full décor and handles takedown after, so you can focus on the celebration.",
                    "image": "https://www.melacelebrations.com/og-banner.jpg"
                }
            ]
        });

        return () => {
            const el = document.getElementById('seo-howto-schema');
            if (el) el.remove();
        };
    }, []);

    return (
        <div className="hiw-page">
            <div className="hiw-page__header">
                <div className="container">
                    <span className="tag" style={{ color: "rgba(255,255,255,0.6)" }}>SIMPLE & SEAMLESS</span>
                    <h1 className="hiw-page__title">How Booking Works</h1>
                    <p className="hiw-page__sub">From your first inquiry to the final magical setup, here is how we bring your celebration to life.</p>
                </div>
            </div>

            <div className="container hiw-page__content">
                <div className="hiw-step">
                    <div className="hiw-step__number">01</div>
                    <div className="hiw-step__body">
                        <h2>Customize Your Décor Theme</h2>
                        <p>Use our online Customizer to pick your event type, color palette, and add-ons. Preview your theme instantly before requesting a quote.</p>
                    </div>
                </div>

                <div className="hiw-step">
                    <div className="hiw-step__number">02</div>
                    <div className="hiw-step__body">
                        <h2>Get a Free Quote</h2>
                        <p>Submit your customized theme and event details. Mela Celebrations sends a transparent quote with no hidden charges, usually within 24 hours.</p>
                    </div>
                </div>

                <div className="hiw-step">
                    <div className="hiw-step__number">03</div>
                    <div className="hiw-step__body">
                        <h2>Confirm Your Booking</h2>
                        <p>Confirm your date and pay the booking amount to lock in your theme, materials, and event slot.</p>
                    </div>
                </div>

                <div className="hiw-step">
                    <div className="hiw-step__number">04</div>
                    <div className="hiw-step__body">
                        <h2>Setup on Your Event Day</h2>
                        <p>Our team arrives ahead of your event to set up the full décor and handles takedown after, so you can focus on the celebration.</p>
                    </div>
                </div>

                <div className="hiw-page__cta">
                    <h2>Ready to get started?</h2>
                    <button className="btn-primary" onClick={() => setCurrentPage("gallery")}>EXPLORE DESIGNS</button>
                </div>
            </div>
        </div>
    );
}
