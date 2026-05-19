import { useEffect, useRef, useState } from "react";
import "./HowItWorks.css";

const steps = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
            </svg>
        ),
        title: "Browse",
        desc: "Explore our curated galleries and select a signature theme or build a custom vision.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        ),
        title: "Book",
        desc: "Reserve your date with a simple click. Our planners will reach out for a detailed consultation.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
        ),
        title: "We Decorate",
        desc: "Sit back and relax. Our artistry team arrives early to transform your venue into a masterpiece.",
    },
];

export default function HowItWorks() {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="hiw section" ref={ref}>
            <div className="container">
                <h2 className={`hiw__title${visible ? " animate-fade-up" : ""}`}>
                    From Vision to Celebration
                </h2>

                <div className="hiw__steps">
                    {steps.map((s, i) => (
                        <div key={s.title} className={`hiw__step${visible ? ` animate-fade-up delay-${i + 2}` : ""}`}>
                            <div className="hiw__icon-wrap">
                                {s.icon}
                            </div>
                            <h3 className="hiw__step-title">{s.title}</h3>
                            <p className="hiw__step-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}