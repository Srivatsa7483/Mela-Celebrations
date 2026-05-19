import { useEffect, useRef, useState } from "react";
import { categories } from "../../data/index.js";
import "./Collections.css";

export default function Collections({ setCurrentPage }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="collections section" ref={ref}>
            <div className="container">
                <div className="collections__header">
                    <div>
                        <h2 className={`collections__title${visible ? " animate-fade-up" : ""}`}>
                            Curated Collections
                        </h2>
                        <p className={`collections__sub${visible ? " animate-fade-up delay-1" : ""}`}>
                            Tailored decoration themes for every milestone.
                        </p>
                    </div>
                    <button
                        className={`btn-navy-outline${visible ? " animate-fade-in delay-2" : ""}`}
                        onClick={() => setCurrentPage("gallery")}
                    >
                        View All Categories →
                    </button>
                </div>

                <div className="collections__grid">
                    {categories.map((cat, i) => (
                        <button
                            key={cat.id}
                            className={`collections__card${visible ? ` animate-scale-in delay-${Math.min(i + 1, 7)}` : ""}`}
                            onClick={() => setCurrentPage("gallery")}
                            style={{ "--i": i }}
                        >
                            <div className="collections__card-img-wrap">
                                <img src={cat.image} alt={cat.name} className="collections__card-img" />
                                <div className="collections__card-overlay" />
                            </div>
                            <span className="collections__card-name">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}