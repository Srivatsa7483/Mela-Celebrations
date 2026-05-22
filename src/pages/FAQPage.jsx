import { useState } from 'react';
import './FAQPage.css';

export default function FAQPage({ setCurrentPage }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What services does Mela Celebrations offer?",
            answer: "We provide balloon decorations, birthday party setups, baby shower decor, wedding decorations, corporate event styling, surprise planning, photography, videography, and complete event management services."
        },
        {
            question: "Do you provide customized theme decorations?",
            answer: "Yes! We create fully customized decorations based on your preferred theme, colors, event type, and budget."
        },
        {
            question: "Which areas do you serve?",
            answer: "Mela Celebrations serves Banglore and nearby locations. Outstation bookings are also available depending on the event requirements."
        },
        {
            question: "How early should I book my event?",
            answer: "We recommend booking at least 5–10 days in advance for better planning and availability."
        },
        {
            question: "Do you handle corporate events and office decorations?",
            answer: "Yes, we specialize in professional corporate event setups including office celebrations, product launches, annual events, and team gatherings."
        },
        {
            question: "Can I book only photography or videography services?",
            answer: "Absolutely. Photography and videography services are available separately or as part of event packages."
        },
        {
            question: "What is included in your decoration packages?",
            answer: "Our packages may include: Balloon decorations, Backdrop setup, Welcome boards, Theme props, Cake table decor, Entry decoration, and Lighting arrangements. Package inclusions depend on your selected plan and customization."
        },
        {
            question: "Do you offer budget-friendly decoration packages?",
            answer: "Yes. We offer affordable and flexible packages suitable for small celebrations as well as premium events."
        },
        {
            question: "Do you accept last-minute bookings?",
            answer: "We do accept last-minute bookings based on availability. However, advance booking is highly recommended."
        },
        {
            question: "What are your payment terms?",
            answer: "A booking advance is required to confirm your event. The remaining amount should be cleared before or on the event date."
        },
        {
            question: "What is your cancellation policy?",
            answer: "Advance payments are generally non-refundable once materials are purchased or event preparation has started."
        },
        {
            question: "Why should I choose Mela Celebrations?",
            answer: "We focus on creative designs, quality execution, on-time setup, personalized service, and making every celebration memorable."
        },
        {
            question: "How can I contact Mela Celebrations?",
            answer: "You can contact us via:\nPhone: +91 81520 33967\nInstagram: instagram.com"
        },
        {
            question: "Do you provide complete event management?",
            answer: "Yes. From planning and decoration to coordination and execution, we handle complete event management services."
        },
        {
            question: "Can I share reference images for decoration ideas?",
            answer: "Definitely! You can share Pinterest, Instagram, or reference images, and we’ll create a similar customized setup for your event."
        }
    ];

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (index) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    return (
        <div className="faq-page">
            <div className="faq-page__header">
                <div className="container">
                    <span className="tag" style={{ color: "rgba(255,255,255,0.6)" }}>HAVE QUESTIONS?</span>
                    <h1 className="faq-page__title">Frequently Asked Questions</h1>
                    <p className="faq-page__sub">Find quick answers to common questions about our decoration packages, booking process, policies, and bespoke event management services.</p>
                </div>
            </div>

            <div className="container faq-page__search-container">
                <div className="faq-page__search-wrapper">
                    <span className="faq-page__search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search FAQs (e.g., packages, booking, areas...)" 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setOpenIndex(null); // Reset open states on search change
                        }}
                        className="faq-page__search-input"
                    />
                    {searchQuery && (
                        <button className="faq-page__search-clear" onClick={() => setSearchQuery('')}>✕</button>
                    )}
                </div>
            </div>

            <div className="container faq-page__content">
                {filteredFaqs.length > 0 ? (
                    <div className="faq-list">
                        {filteredFaqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div 
                                    key={index} 
                                    className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                                >
                                    <button 
                                        className="faq-item__question"
                                        onClick={() => toggleFaq(index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span>{faq.question}</span>
                                        <span className="faq-item__arrow"></span>
                                    </button>
                                    <div className="faq-item__answer-wrapper">
                                        <div className="faq-item__answer">
                                            {faq.answer.split('\n').map((paragraph, i) => (
                                                <p key={i}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="faq-page__no-results">
                        <div className="faq-page__no-results-icon">🤷</div>
                        <h3>No matches found</h3>
                        <p>We couldn't find any FAQs matching "{searchQuery}". Please try another search term or contact our support team directly.</p>
                    </div>
                )}

                <div className="faq-page__cta">
                    <h2>Still have questions?</h2>
                    <p>Our client services team is ready to assist you in designing the perfect celebration setup.</p>
                    <div className="faq-page__cta-buttons">
                        <button className="btn-primary" onClick={() => setCurrentPage("contact")}>GET IN TOUCH</button>
                        <a href="https://wa.me/918152033967" target="_blank" rel="noopener noreferrer" className="btn-navy-outline" style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}>WHATSAPP US</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
