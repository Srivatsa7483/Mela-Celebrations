import { useState, useEffect, useRef } from "react";
import { designs, categories } from "../data/index.js";
import "./GalleryPage.css";

function formatPrice(p) {
    return "₹" + p.toLocaleString("en-IN");
}

function DesignModal({ design, onClose, onOrder }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div className="gmodal" onClick={onClose}>
            <div className="gmodal__box" onClick={(e) => e.stopPropagation()}>
                <button className="gmodal__close" onClick={onClose}>✕</button>
                <div className="gmodal__img-wrap">
                    {design.badge && <span className="pkg-card__badge">{design.badge}</span>}
                    <img src={design.image} alt={design.name} className="gmodal__img" />
                </div>
                <div className="gmodal__body">
                    <span className="gmodal__cat">{design.categoryName}</span>
                    <h2 className="gmodal__name">{design.name}</h2>
                    <p className="gmodal__desc">{design.description}</p>
                    <ul className="gmodal__features">
                        {design.features.map((f) => (
                            <li key={f}><span style={{ color: "var(--gold)" }}>✦</span> {f}</li>
                        ))}
                    </ul>
                    <div className="gmodal__footer">
                        <div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>Starting From</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: "700", color: "var(--navy)" }}>{formatPrice(design.price)}</div>
                        </div>
                        <button className="btn-primary" onClick={() => { onOrder(design); onClose(); }}>
                            Book This Design
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GalleryPage({ setCurrentPage, setSelectedDesign, activeCategory, setActiveCategory }) {
    const [modalDesign, setModalDesign] = useState(null);
    const [search, setSearch] = useState("");
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef({});

    const allCats = [{ id: "all", name: "All Designs" }, ...categories];

    const filtered = designs.filter((d) => {
        const matchCat = activeCategory === "all" || d.category === activeCategory;
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.categoryName.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    useEffect(() => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    setVisibleCards((prev) => new Set([...prev, e.target.dataset.id]));
                }
            });
        }, { threshold: 0.1 });

        Object.values(cardRefs.current).forEach((el) => { if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, [filtered.length]);

    return (
        <div className="gallery-page">
            {/* Page Header */}
            <div className="gallery-page__header">
                <div className="gallery-page__header-overlay"></div>
                <div className="container gallery-page__header-content">
                    <span className="tag animate-fade-in" style={{ color: "rgba(255,255,255,0.7)" }}>OUR PORTFOLIO</span>
                    <h1 className="gallery-page__title animate-fade-up delay-1">Event Gallery</h1>
                    <p className="gallery-page__sub animate-fade-up delay-2">Explore our curated collection of event themes and decorations.</p>
                </div>
            </div>

            <div className="container">
                {/* Search + Filter bar */}
                <div className="gallery-page__controls">
                    <div className="gallery-page__search-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            className="gallery-page__search"
                            placeholder="Search designs…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="gallery-page__count">
                        {filtered.length} design{filtered.length !== 1 ? "s" : ""}
                    </div>
                </div>

                {/* Category Pills */}
                <div className="gallery-page__cats">
                    {allCats.map((c) => (
                        <button
                            key={c.id}
                            className={`gallery-page__cat-pill${activeCategory === c.id ? " active" : ""}`}
                            onClick={() => setActiveCategory(c.id)}
                        >
                            {c.name}
                            {c.count && <span className="gallery-page__cat-count">{c.count}</span>}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="gallery-page__grid">
                    {filtered.length === 0 && (
                        <div className="gallery-page__empty">
                            <p>No designs found. Try a different search.</p>
                        </div>
                    )}
                    {filtered.map((d, i) => {
                        const isVis = visibleCards.has(String(d.id));
                        return (
                            <div
                                key={d.id}
                                data-id={String(d.id)}
                                ref={(el) => { cardRefs.current[d.id] = el; }}
                                className={`gcard${isVis ? " gcard--visible" : ""}`}
                                style={{ "--delay": `${(i % 3) * 0.1}s` }}
                            >
                                <div className="gcard__img-wrap" onClick={() => setModalDesign(d)}>
                                    {d.badge && <span className="gcard__badge">{d.badge}</span>}
                                    <img src={d.image} alt={d.name} className="gcard__img" />
                                    <div className="gcard__view-overlay">
                                        <span>View Details</span>
                                    </div>
                                </div>
                                <div className="gcard__body">
                                    <span className="gcard__cat">{d.categoryName}</span>
                                    <h3 className="gcard__name">{d.name}</h3>
                                    <p className="gcard__desc">{d.description}</p>
                                    <div className="gcard__footer">
                                        <div className="gcard__price">
                                            <span className="gcard__from">From</span>
                                            <span className="gcard__amount">{formatPrice(d.price)}</span>
                                        </div>
                                        <button
                                            className="gcard__btn"
                                            onClick={() => { setSelectedDesign(d); setCurrentPage("order"); }}
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
        </div>
    );
}