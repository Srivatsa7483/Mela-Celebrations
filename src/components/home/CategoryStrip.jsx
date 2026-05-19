import { useEffect, useRef, useState } from "react";
import DesignModal from "../ui/DesignModal.jsx";
import "./CategoryStrip.css";

export default function CategoryStrip({ title, categoryId, designs, setCurrentPage, setActiveCategory, setSelectedDesign }) {
    const [visible, setVisible] = useState(false);
    const [modalDesign, setModalDesign] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    // Helper to calculate discount percentage
    const calculateDiscount = (price, originalPrice) => {
        if (!originalPrice || originalPrice <= price) return null;
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        return discount > 0 ? `${discount}% OFF` : null;
    };

    return (
        <section className="category-strip section" ref={ref}>
            <div className="container">
                <div className="category-strip__header">
                    <h2 className={`category-strip__title${visible ? " animate-fade-right" : ""}`}>
                        {title}
                    </h2>
                    <button 
                        className={`category-strip__view-all${visible ? " animate-fade-left" : ""}`}
                        onClick={() => { setActiveCategory(categoryId); setCurrentPage("gallery"); }} 
                    >
                        View All
                    </button>
                </div>

                <div className="category-strip__slider">
                    {designs.slice(0, 8).map((design, i) => {
                        const discount = calculateDiscount(design.price, design.originalPrice);
                        return (
                            <div 
                                key={design.id} 
                                className={`category-strip__card${visible ? ` animate-fade-up delay-${Math.min(i + 1, 7)}` : ""}`}
                                style={{ "--i": i }}
                            >
                                <div 
                                    className="category-strip__img-wrap"
                                    onClick={() => setModalDesign(design)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img src={design.image} alt={design.name} className="category-strip__img" />
                                    {discount && (
                                        <div className="category-strip__badge">
                                            {discount}
                                        </div>
                                    )}
                                </div>
                                <div className="category-strip__content">
                                    <h3 className="category-strip__name">{design.name}</h3>
                                    <div className="category-strip__bottom">
                                        <div className="category-strip__pricing">
                                            <span className="category-strip__price">₹{design.price}</span>
                                            {design.originalPrice && design.originalPrice > design.price && (
                                                <span className="category-strip__original-price">₹{design.originalPrice}</span>
                                            )}
                                        </div>
                                        <button 
                                            className="category-strip__book-btn"
                                            onClick={() => { setSelectedDesign(design); setCurrentPage("order"); }}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {modalDesign && (
                <DesignModal
                    design={modalDesign}
                    onClose={() => setModalDesign(null)}
                    onOrder={(d) => { setSelectedDesign(d); setCurrentPage("order"); }}
                />
            )}
        </section>
    );
}
