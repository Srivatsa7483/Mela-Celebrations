import { useEffect, useRef, useState } from "react";
import "./StatsBanner.css";

const stats = [
    { value: "1,200+", label: "Events Crafted" },
    { value: "8+", label: "Years of Artistry" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "50+", label: "Design Themes" },
];

export default function StatsBanner() {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="stats-banner" ref={ref}>
            <div className="container">
                <div className="stats-banner__grid">
                    {stats.map((s, i) => (
                        <div key={s.label} className={`stats-banner__item${visible ? ` animate-fade-up delay-${i + 1}` : ""}`}>
                            <span className="stats-banner__value">{s.value}</span>
                            <span className="stats-banner__label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}