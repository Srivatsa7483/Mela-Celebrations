import "./HowItWorksPage.css";

export default function HowItWorksPage({ setCurrentPage }) {
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
                        <h2>Explore & Choose</h2>
                        <p>Browse our curated Event Gallery and select a design package that fits your celebration. Not sure what to pick? You can request a custom consultation.</p>
                    </div>
                </div>

                <div className="hiw-step">
                    <div className="hiw-step__number">02</div>
                    <div className="hiw-step__body">
                        <h2>WhatsApp Inquiry</h2>
                        <p>Fill out our simple booking form with your event date and venue details. Once submitted, your inquiry will be sent directly to our team via WhatsApp for an immediate response.</p>
                    </div>
                </div>

                <div className="hiw-step">
                    <div className="hiw-step__number">03</div>
                    <div className="hiw-step__body">
                        <h2>Site Visit & Confirmation</h2>
                        <p>We will contact you to finalize the details, accommodate any special requests, and potentially schedule a site visit to ensure everything will fit perfectly.</p>
                    </div>
                </div>

                <div className="hiw-step">
                    <div className="hiw-step__number">04</div>
                    <div className="hiw-step__body">
                        <h2>The Big Day</h2>
                        <p>Our professional artisan team arrives on time to set up the decor, transforming your venue into a living work of art. You just sit back and enjoy the celebration!</p>
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
