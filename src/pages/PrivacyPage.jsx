import './PrivacyPage.css';

export default function PrivacyPage({ setCurrentPage }) {
    const sections = [
        {
            title: "Information We Collect",
            description: "To deliver our luxury event services seamlessly, we collect the following personal and event-related details when you make an inquiry or book with us:",
            items: [
                { label: "Identity", detail: "Full Name" },
                { label: "Contact", detail: "Mobile Number & Email Address" },
                { label: "Event", detail: "Event Details (Date, Venue, Occasion, Preferences)" },
                { label: "Billing", detail: "Billing and Transaction Information" },
                { label: "Location", detail: "General Venue Location Details" }
            ],
            icon: "📋"
        },
        {
            title: "How We Use Your Information",
            description: "Your information is used strictly to curate and execute your celebrations. Specifically, we use it to:",
            items: [
                { label: "Bookings", detail: "Process, configure, and confirm your design reservations" },
                { label: "Execution", detail: "Manage event logistics, decoration setups, and vendor coordination" },
                { label: "Support", detail: "Provide immediate customer support and respond to WhatsApp inquiries" },
                { label: "Updates", detail: "Send booking updates, reminders, and design details" },
                { label: "Quality", detail: "Improve our services, website experience, and design templates" }
            ],
            icon: "✨"
        },
        {
            title: "Information Sharing",
            description: "At Mela Celebrations, we respect your privacy. We do not sell, rent, or trade your personal information. Information is only shared with trusted third-party service providers (such as catering partners, site surveyors, or delivery coordinators) when strictly necessary to deliver the requested event services.",
            icon: "🤝"
        },
        {
            title: "Data Security",
            description: "We employ reasonable security measures, administrative protocols, and technical guardrails to safeguard your personal data against unauthorized access, alteration, disclosure, loss, or misuse. All transaction-related data is handled securely.",
            icon: "🛡️"
        },
        {
            title: "Cookies & Tracking",
            description: "Our website may use cookies and web tracking technologies to analyze site traffic, understand user behavior, and customize your experience. You can choose to disable cookies through your browser settings, though some interactive website features may become unavailable.",
            icon: "🍪"
        },
        {
            title: "Your Rights & Contacts",
            description: "You retain the right to access, correct, update, or request the complete deletion of your personal data from our systems. If you wish to execute any of these rights, please contact our support team directly. We will process all valid requests within a reasonable timeframe.",
            icon: "⚖️"
        }
    ];

    return (
        <div className="privacy-page">
            <div className="privacy-page__header">
                <div className="container">
                    <span className="tag" style={{ color: "rgba(255,255,255,0.6)" }}>LEGAL & SAFETY</span>
                    <h1 className="privacy-page__title">Privacy Policy</h1>
                    <p className="privacy-page__sub">Effective Date: May 22, 2026. Your privacy and trust are paramount. Learn how Mela Celebrations collects, uses, and protects your information.</p>
                </div>
            </div>

            <div className="container privacy-page__content">
                <div className="privacy-grid">
                    {sections.map((section, index) => (
                        <div key={index} className="privacy-card">
                            <div className="privacy-card__header">
                                <span className="privacy-card__icon">{section.icon}</span>
                                <h2>{section.title}</h2>
                            </div>
                            <p className="privacy-card__desc">{section.description}</p>
                            {section.items && (
                                <ul className="privacy-card__list">
                                    {section.items.map((item, i) => (
                                        <li key={i}>
                                            <strong>{item.label}:</strong> {item.detail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                <div className="privacy-page__footer">
                    <h2>Questions about our privacy guidelines?</h2>
                    <p>We are fully committed to resolving any inquiries regarding how we handle your personal data. Get in touch with our security administrator.</p>
                    <button className="btn-primary" onClick={() => setCurrentPage("contact")}>CONTACT SUPPORT</button>
                </div>
            </div>
        </div>
    );
}
