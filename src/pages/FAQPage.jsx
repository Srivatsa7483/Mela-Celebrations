import { useState, useEffect } from 'react';
import './FAQPage.css';

export default function FAQPage({ setCurrentPage }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How much does birthday decoration cost in Bengaluru?",
            answer: "Birthday decoration with Mela Celebrations typically starts from a base package price and scales with theme complexity, balloon volume, and add-ons like backdrops or floral work. Request a custom quote through our Customizer for an exact price based on your event size and theme."
        },
        {
            question: "How far in advance should I book event decoration?",
            answer: "We recommend booking at least 5–7 days in advance for standard packages, and 2–3 weeks in advance for weddings or large corporate events to secure your preferred date and theme materials."
        },
        {
            question: "Does Mela Celebrations do balloon decoration for corporate events?",
            answer: "Yes. We provide balloon and theme décor for corporate events including product launches, office celebrations, and brand activations across Bengaluru, with options to match brand colors and logos."
        },
        {
            question: "What areas in Bengaluru does Mela Celebrations serve?",
            answer: "Mela Celebrations serves Electronic City, Pragathi Nagar, and surrounding areas across Bengaluru. Contact us to confirm coverage for your specific location."
        },
        {
            question: "What types of events does Mela Celebrations decorate?",
            answer: "We decorate birthdays, weddings, baby showers, anniversaries, corporate events, and baby-welcome or naming ceremonies, with customizable themes for each."
        },
        {
            question: "Can I customize my own decoration theme?",
            answer: "Yes. Use our online Customizer to choose colors, themes, and add-ons and preview your décor package before booking."
        },
        {
            question: "Does Mela Celebrations handle setup and takedown?",
            answer: "Yes, setup and takedown are included as part of our standard decoration packages, so you don't have to manage anything on the day of the event."
        },
        {
            question: "What is included in a balloon arch decoration package?",
            answer: "A standard balloon arch package includes the balloon structure in your chosen colors, on-site setup, and basic styling. Additional elements like florals, backdrops, or props can be added during customization."
        },
        {
            question: "What services does Mela Celebrations offer?",
            answer: "We provide balloon decorations, birthday party setups, baby shower decor, wedding decorations, corporate event styling, surprise planning, photography, videography, and complete event management services."
        },
        {
            question: "Do you provide customized theme decorations?",
            answer: "Yes! We create fully customized decorations based on your preferred theme, colors, event type, and budget."
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

    useEffect(() => {
        let faqScript = document.getElementById('seo-faq-schema');
        if (!faqScript) {
            faqScript = document.createElement('script');
            faqScript.id = 'seo-faq-schema';
            faqScript.type = 'application/ld+json';
            document.head.appendChild(faqScript);
        }

        const mainFaqs = faqs.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }));

        faqScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": mainFaqs
        });

        return () => {
            const el = document.getElementById('seo-faq-schema');
            if (el) el.remove();
        };
    }, []);

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
                                    <h3 style={{ margin: 0, padding: 0 }}>
                                        <button 
                                            className="faq-item__question"
                                            onClick={() => toggleFaq(index)}
                                            aria-expanded={isOpen}
                                        >
                                            <span>{faq.question}</span>
                                            <span className="faq-item__arrow"></span>
                                        </button>
                                    </h3>
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
