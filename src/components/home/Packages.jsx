import { useEffect, useRef, useState, useContext } from "react";
import { DesignContext } from "../../context/DesignContext.jsx";
import "./Packages.css";

function formatPrice(p) {
    return "₹" + p.toLocaleString("en-IN");
}

export default function Packages({ setCurrentPage, setSelectedDesign }) {
    const { designs } = useContext(DesignContext);
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const featured = designs.slice(0, 3);

    return (
        <section className="packages section-sm" ref={ref} style={{ background: "var(--section-bg)" }}>
            <div className="container">
                <div className={`packages__header${visible ? " animate-fade-up" : ""}`}>
                    <span className="tag">THE COLLECTION</span>
                    <h2 className="packages__title">Mela Signature Packages</h2>
                </div>

                <div className="packages__grid">
                    {featured.map((d, i) => (
                        <div
                            key={d.id}
                            className={`pkg-card${visible ? ` animate-fade-up delay-${i + 1}` : ""}`}
                        >
                            <div className="pkg-card__img-wrap">
                                {d.badge && <span className="pkg-card__badge">{d.badge}</span>}
                                <img src={d.image} alt={d.name} className="pkg-card__img" />
                            </div>
                            <div className="pkg-card__body">
                                <h3 className="pkg-card__name">{d.name}</h3>
                                <p className="pkg-card__desc">{d.description}</p>
                                <ul className="pkg-card__features">
                                    {d.features.map((f) => (
                                        <li key={f} className="pkg-card__feature">
                                            <span className="pkg-card__star">✦</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pkg-card__footer">
                                    <div className="pkg-card__price">
                                        <span className="pkg-card__from">From</span>
                                        <span className="pkg-card__amount">{formatPrice(d.price)}</span>
                                    </div>
                                    <button
                                        className="pkg-card__btn"
                                        onClick={() => { setSelectedDesign(d); setCurrentPage("order"); }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="packages__cta">
                    <button className="btn-navy-outline" onClick={() => setCurrentPage("gallery")}>
                        View All Packages →
                    </button>
                </div>
            </div>
        </section>
    );
}