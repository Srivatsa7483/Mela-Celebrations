import { useEffect, useRef, useState } from "react";
import { categories } from "../../data/index.js";
import "./Collections.css";

export default function Collections({ setCurrentPage, setActiveCategory }) {
    const [visible, setVisible] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const handleCategoryClick = (cat) => {
        if (cat.dropdown) {
            if (selectedCat && selectedCat.id === cat.id) {
                setSelectedCat(null);
                setSelectedSub(null);
            } else {
                setSelectedCat(cat);
                setSelectedSub(null);
            }
        } else {
            if (setActiveCategory) setActiveCategory(cat.id);
            setCurrentPage("gallery");
            setSelectedCat(null);
            setSelectedSub(null);
        }
    };

    return (
        <section className="collections section" ref={ref}>
            <div className="container">
                <div className="collections__header">
                    <h2 className={`collections__title${visible ? " animate-fade-up" : ""}`}>
                        Explore our categories
                    </h2>
                </div>

                <div className="collections__slider">
                    {categories.map((cat, i) => {
                        const isSelected = selectedCat && selectedCat.id === cat.id;
                        return (
                            <button
                                key={cat.id}
                                className={`collections__slide-item${visible ? ` animate-scale-in delay-${Math.min(i + 1, 7)}` : ""}${isSelected ? " collections__slide-item--selected" : ""}`}
                                onClick={() => handleCategoryClick(cat)}
                                style={{ "--i": i }}
                            >
                                <div className="collections__slide-img-border" style={isSelected ? { background: "var(--gold)" } : {}}>
                                    <div className="collections__slide-img-wrap">
                                        <img src={cat.image} alt={cat.name} className="collections__slide-img" />
                                    </div>
                                </div>
                                <span className="collections__slide-name" style={isSelected ? { color: "var(--gold)" } : {}}>
                                    {cat.name}
                                    {cat.dropdown && <span className="collections__arrow-indicator"> {isSelected ? "▲" : "▼"}</span>}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Subcategory Expandable Drawer */}
                {selectedCat && (
                    <div className="collections__drawer animate-fade-up">
                        <div className="collections__drawer-header">
                            <h3 className="collections__drawer-title">{selectedCat.name} Subcategories</h3>
                            <button 
                                className="collections__drawer-view-all"
                                onClick={() => {
                                    if (setActiveCategory) setActiveCategory(selectedCat.id);
                                    setCurrentPage("gallery");
                                    setSelectedCat(null);
                                    setSelectedSub(null);
                                }}
                            >
                                View All {selectedCat.name} →
                            </button>
                        </div>

                        <div className="collections__drawer-subcategories">
                            {selectedCat.dropdown.map((sub) => {
                                const isSubSelected = selectedSub && selectedSub.id === sub.id;
                                return (
                                    <div key={sub.id} className="collections__drawer-sub-group">
                                        <button
                                            className={`collections__sub-pill${isSubSelected ? " active" : ""}`}
                                            onClick={() => {
                                                if (sub.dropdown) {
                                                    setSelectedSub(isSubSelected ? null : sub);
                                                } else {
                                                    if (setActiveCategory) setActiveCategory(sub.id);
                                                    setCurrentPage("gallery");
                                                    setSelectedCat(null);
                                                    setSelectedSub(null);
                                                }
                                            }}
                                            style={sub.price ? { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" } : {}}
                                        >
                                            <span>{sub.label}</span>
                                            {sub.price && <span style={{ fontWeight: "600", color: "var(--gold)", marginLeft: "auto" }}>₹{sub.price}</span>}
                                            {sub.dropdown && <span className="collections__sub-arrow"> {isSubSelected ? "▲" : "▼"}</span>}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Child Subcategories (e.g. Kids Themes) */}
                        {selectedSub && selectedSub.dropdown && (
                            <div className="collections__drawer-nested animate-fade-up">
                                <h4 className="collections__nested-title">{selectedSub.label} Themes:</h4>
                                <div className="collections__nested-grid">
                                    {selectedSub.dropdown.map((nested) => (
                                        <button
                                            key={nested.id}
                                            className="collections__nested-pill"
                                            onClick={() => {
                                                if (setActiveCategory) setActiveCategory(nested.id);
                                                setCurrentPage("gallery");
                                                setSelectedCat(null);
                                                setSelectedSub(null);
                                            }}
                                        >
                                            {nested.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}