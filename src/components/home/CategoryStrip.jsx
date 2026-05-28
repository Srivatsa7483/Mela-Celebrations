import { useEffect, useRef, useState } from "react";
import "./CategoryStrip.css";

export default function CategoryStrip({ title, categoryId, designs, setCurrentPage, setActiveCategory, setSelectedDesign, navigateToProduct }) {
    const [visible, setVisible] = useState(false);
    const [canScrollLeft, setCanScrollLeft]   = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const ref       = useRef(null);
    const sliderRef = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    // Update arrow visibility whenever scroll position changes
    const updateArrows = () => {
        const el = sliderRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows, { passive: true });
        return () => {
            el.removeEventListener("scroll", updateArrows);
            window.removeEventListener("resize", updateArrows);
        };
    }, []);

    const scrollBy = (dir) => {
        sliderRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
    };

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

                {/* Slider wrapped in relative div so arrows can be absolutely positioned */}
                <div className="category-strip__slider-wrap">
                    {/* Left arrow */}
                    <button
                        className={`category-strip__arrow category-strip__arrow--left${!canScrollLeft ? " category-strip__arrow--hidden" : ""}`}
                        onClick={() => scrollBy(-1)}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>

                    <div className="category-strip__slider" ref={sliderRef}>
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
                                        onClick={() => navigateToProduct(design.id)}
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
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right arrow */}
                    <button
                        className={`category-strip__arrow category-strip__arrow--right${!canScrollRight ? " category-strip__arrow--hidden" : ""}`}
                        onClick={() => scrollBy(1)}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
