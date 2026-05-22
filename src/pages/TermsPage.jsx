import { useState } from 'react';
import './TermsPage.css';

export default function TermsPage() {
    const [activeTab, setActiveTab] = useState('terms');

    const termsSections = [
        {
            num: "1",
            title: "About Us",
            content: "Mela Celebrations is an event management company providing services including birthday party planning, corporate events, wedding celebrations, decorations, entertainment activities, catering coordination, photography, and related event services."
        },
        {
            num: "2",
            title: "Booking and Confirmation",
            content: "All bookings are subject to availability. A booking is confirmed only after receipt of the required advance payment. Clients must provide accurate event details during booking to ensure proper preparation."
        },
        {
            num: "3",
            title: "Payments",
            content: "Advance payments are required to confirm services. Remaining payments must be completed before or on the event date as agreed. Additional services requested after confirmation may incur extra charges."
        },
        {
            num: "4",
            title: "Cancellation Policy",
            content: "Cancellations made 30 days before the event may be eligible for a partial refund. Cancellations made within 15 days of the event may not be eligible for a refund. Refund decisions are subject to vendor commitments and incurred expenses. Detailed cancellation parameters are outlined in our Refund Policy."
        },
        {
            num: "5",
            title: "Client Responsibilities",
            content: "Clients must ensure access to the event venue at the agreed time. Necessary permissions from venue authorities must be obtained by the client unless otherwise agreed. Any damage caused by guests to our decor materials or props is the responsibility of the client."
        },
        {
            num: "6",
            title: "Vendor Services",
            content: "Mela Celebrations may engage third-party vendors for catering, photography, entertainment, decoration, and other services. While we strive to ensure quality service, we are not liable for delays or failures caused by third-party vendors."
        },
        {
            num: "7",
            title: "Intellectual Property",
            content: "All website content, logos, photographs, graphics, and designs are the property of Mela Celebrations and may not be copied, reproduced, or used without written permission."
        },
        {
            num: "8",
            title: "Limitation of Liability",
            content: "Mela Celebrations shall not be responsible for losses, damages, delays, or disruptions caused by natural disasters, government restrictions, venue-related issues, technical failures, or force majeure events beyond our control."
        },
        {
            num: "9",
            title: "Changes to Terms",
            content: "We reserve the right to modify these Terms and Conditions at any time. Updated versions will be posted on our website and will take effect immediately upon posting."
        },
        {
            num: "10",
            title: "Contact Us",
            content: "For any questions regarding these Terms and Conditions, please contact Mela Celebrations through the contact information provided on our website."
        }
    ];

    const refundTiers = [
        {
            timeline: "More than 30 days before the event",
            refund: "Up to 80% refund",
            badge: "80% REFUND",
            color: "#2ec4b6"
        },
        {
            timeline: "15–30 days before the event",
            refund: "Up to 50% refund",
            badge: "50% REFUND",
            color: "#ff9f1c"
        },
        {
            timeline: "Less than 15 days before the event",
            refund: "No refund available",
            badge: "NO REFUND",
            color: "#e71d36"
        }
    ];

    return (
        <div className="terms-page">
            <div className="terms-page__header">
                <div className="container">
                    <span className="tag" style={{ color: "rgba(255,255,255,0.6)" }}>AGREEMENTS</span>
                    <h1 className="terms-page__title">Terms & Policies</h1>
                    <p className="terms-page__sub">Effective Date: May 22, 2026. Please read our service agreements, refund matrices, and liability limitations carefully.</p>
                </div>
            </div>

            <div className="container terms-page__nav-container">
                <div className="terms-page__tabs">
                    <button 
                        className={`terms-page__tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('terms')}
                    >
                        📋 Terms & Conditions
                    </button>
                    <button 
                        className={`terms-page__tab-btn ${activeTab === 'refunds' ? 'active' : ''}`}
                        onClick={() => setActiveTab('refunds')}
                    >
                        💸 Refund Policy
                    </button>
                    <button 
                        className={`terms-page__tab-btn ${activeTab === 'disclaimer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('disclaimer')}
                    >
                        ⚖️ Disclaimer
                    </button>
                </div>
            </div>

            <div className="container terms-page__content">
                {activeTab === 'terms' && (
                    <div className="terms-tab-content">
                        <div className="terms-intro-card">
                            <h2>Mela Celebrations Service Agreement</h2>
                            <p>By accessing our website and using our event services, you agree to comply with and be bound by the following Terms and Conditions. These terms govern the relationship between Mela Celebrations and our clients.</p>
                        </div>
                        <div className="terms-list">
                            {termsSections.map((section, index) => (
                                <div key={index} className="terms-section-card">
                                    <div className="terms-section-card__number">{section.num}</div>
                                    <div className="terms-section-card__body">
                                        <h3>{section.title}</h3>
                                        <p>{section.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'refunds' && (
                    <div className="refunds-tab-content">
                        <div className="refunds-intro">
                            <h2>Refund & Cancellation Matrix</h2>
                            <p>We commit resources and materials immediately upon confirmation of booking. Accordingly, our refund schedule operates strictly under the timelines below:</p>
                        </div>
                        
                        <div className="refunds-grid">
                            {refundTiers.map((tier, index) => (
                                <div key={index} className="refund-card" style={{ borderTop: `4px solid ${tier.color}` }}>
                                    <span className="refund-card__badge" style={{ backgroundColor: `${tier.color}15`, color: tier.color }}>
                                        {tier.badge}
                                    </span>
                                    <h3 className="refund-card__timeline">{tier.timeline}</h3>
                                    <p className="refund-card__amount">{tier.refund}</p>
                                </div>
                            ))}
                        </div>

                        <div className="refund-notes-card">
                            <h3>Important Processing Rules</h3>
                            <ul>
                                <li>Refunds, if applicable and approved, will be processed back to the original payment source within <strong>7–14 business days</strong>.</li>
                                <li>Refund decisions are subject to third-party vendor commitments and any customized preparation costs already incurred by Mela Celebrations.</li>
                                <li>Advance payments are generally non-refundable once materials are purchased or event preparation has started.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'disclaimer' && (
                    <div className="disclaimer-tab-content">
                        <div className="disclaimer-container">
                            <div className="disclaimer-icon">⚖️</div>
                            <h2>Legal Disclaimer</h2>
                            <p className="disclaimer-text">
                                Mela Celebrations acts as an event organizer and coordinator. Certain services may be provided through third-party vendors. We make every effort to deliver high-quality services but cannot guarantee uninterrupted performance due to circumstances beyond our control.
                            </p>
                            <p className="disclaimer-text">
                                By booking or using our services, clients acknowledge and accept these limitations, including event cancellations or delays arising from weather anomalies, vendor delays, or force majeure events.
                            </p>
                            <div className="disclaimer-footer">
                                © 2026 Mela Celebrations. All Rights Reserved. 🎉✨
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
