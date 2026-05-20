import { useEffect, useRef, useState } from "react";
import { testimonials } from "../../data/index.js";
import "./Testimonials.css";

export default function Testimonials() {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="testi section" ref={ref} style={{ background: "var(--section-bg)" }}>
            <div className="container">
                <h2 className={`testi__title${visible ? " animate-fade-up" : ""}`}>
                    Voices of Joy
                </h2>

                <div className="testi__grid">
                    {testimonials.map((t, i) => (
                        <div
                            key={t.id}
                            className={`testi__card${visible ? ` animate-fade-up delay-${i + 1}` : ""}`}
                        >
                            <div className="testi__stars">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <span key={j} className="testi__star">★</span>
                                ))}
                            </div>
                            <p className="testi__text">"{t.text}"</p>
                            <div className="testi__author">
                                <img src={t.avatar} alt={t.name} className="testi__avatar" />
                                <div>
                                    <div className="testi__name">{t.name}</div>
                                    <div className="testi__role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}