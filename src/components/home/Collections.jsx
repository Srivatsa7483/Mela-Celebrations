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
                    <h2 className={`collections__title${visible ? " animate-fade-up" : ""}`}>
                        Explore our categories
                    </h2>
                </div>

                <div className="collections__slider">
                    {categories.map((cat, i) => (
                        <button
                            key={cat.id}
                            className={`collections__slide-item${visible ? ` animate-scale-in delay-${Math.min(i + 1, 7)}` : ""}`}
                            onClick={() => setCurrentPage("gallery")}
                            style={{ "--i": i }}
                        >
                            <div className="collections__slide-img-border">
                                <div className="collections__slide-img-wrap">
                                    <img src={cat.image} alt={cat.name} className="collections__slide-img" />
                                </div>
                            </div>
                            <span className="collections__slide-name">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}