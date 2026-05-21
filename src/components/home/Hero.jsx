import { useState, useEffect } from "react";
import "./Hero.css";

const slides = [
    {
        image: "/banner1_new.png?v=4",
        heading: "Baby Shower",
    },
    {
        image: "/banner2_new.png?v=4",
        heading: "Housewarming",
    },
    {
        image: "/banner3_new.png?v=4",
        heading: "Event Planning",
    },
    {
        image: "/banner4_new.png?v=4",
        heading: "Anniversary",
    },
    {
        image: "/banner5_new.jpg?v=4",
        heading: "Mela Celebrations",
    },
];

export default function Hero({ setCurrentPage }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setActive((p) => (p + 1) % slides.length), 5500);
        return () => clearInterval(timer);
    }, []);

    const scrollToContent = (e) => {
        e.stopPropagation();
        const target = document.querySelector(".homepage__marquee") || document.querySelector(".collections");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="hero-wrapper">
            {/* Left Decorative Elements */}
            <div className="hero-decor hero-decor--left" aria-hidden="true">
                <svg className="hero-decor__balloon hero-decor__balloon--1" width="56" height="74" viewBox="0 0 56 74">
                    <ellipse cx="28" cy="29" rx="25" ry="29" fill="rgba(201,168,76,0.38)" stroke="rgba(201,168,76,0.65)" strokeWidth="1.8" />
                    <line x1="28" y1="58" x2="28" y2="74" stroke="rgba(201,168,76,0.6)" strokeWidth="1.8" />
                </svg>
                <svg className="hero-decor__balloon hero-decor__balloon--2" width="44" height="60" viewBox="0 0 44 60">
                    <ellipse cx="22" cy="23" rx="20" ry="23" fill="rgba(13,27,42,0.34)" stroke="rgba(13,27,42,0.55)" strokeWidth="1.5" />
                    <line x1="22" y1="46" x2="22" y2="60" stroke="rgba(13,27,42,0.5)" strokeWidth="1.5" />
                </svg>
                <svg className="hero-decor__balloon hero-decor__balloon--5" width="48" height="66" viewBox="0 0 48 66">
                    <ellipse cx="24" cy="25" rx="22" ry="25" fill="rgba(201,168,76,0.32)" stroke="rgba(201,168,76,0.58)" strokeWidth="1.6" />
                    <line x1="24" y1="50" x2="24" y2="66" stroke="rgba(201,168,76,0.5)" strokeWidth="1.6" />
                </svg>
                <svg className="hero-decor__star hero-decor__star--1" width="34" height="34" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" fill="rgba(201,168,76,0.48)" />
                </svg>
                <svg className="hero-decor__star hero-decor__star--2" width="26" height="26" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" fill="rgba(13,27,42,0.36)" />
                </svg>
                <svg className="hero-decor__star hero-decor__star--5" width="28" height="28" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" fill="rgba(13,27,42,0.42)" />
                </svg>
                <div className="hero-decor__confetti hero-decor__confetti--1"></div>
                <div className="hero-decor__confetti hero-decor__confetti--2"></div>
                <div className="hero-decor__confetti hero-decor__confetti--3"></div>
                <div className="hero-decor__confetti hero-decor__confetti--7"></div>
                <div className="hero-decor__sparkle hero-decor__sparkle--1">✦</div>
                <div className="hero-decor__sparkle hero-decor__sparkle--2">✧</div>
                <div className="hero-decor__sparkle hero-decor__sparkle--5">✦</div>
            </div>

            {/* Right Decorative Elements */}
            <div className="hero-decor hero-decor--right" aria-hidden="true">
                <svg className="hero-decor__balloon hero-decor__balloon--3" width="52" height="70" viewBox="0 0 52 70">
                    <ellipse cx="26" cy="27" rx="23" ry="27" fill="rgba(201,168,76,0.35)" stroke="rgba(201,168,76,0.6)" strokeWidth="1.8" />
                    <line x1="26" y1="54" x2="26" y2="70" stroke="rgba(201,168,76,0.55)" strokeWidth="1.8" />
                </svg>
                <svg className="hero-decor__balloon hero-decor__balloon--4" width="38" height="52" viewBox="0 0 38 52">
                    <ellipse cx="19" cy="20" rx="17" ry="20" fill="rgba(13,27,42,0.28)" stroke="rgba(13,27,42,0.48)" strokeWidth="1.5" />
                    <line x1="19" y1="40" x2="19" y2="52" stroke="rgba(13,27,42,0.42)" strokeWidth="1.5" />
                </svg>
                <svg className="hero-decor__balloon hero-decor__balloon--6" width="46" height="62" viewBox="0 0 46 62">
                    <ellipse cx="23" cy="24" rx="20" ry="24" fill="rgba(201,168,76,0.3)" stroke="rgba(201,168,76,0.55)" strokeWidth="1.6" />
                    <line x1="23" y1="48" x2="23" y2="62" stroke="rgba(201,168,76,0.48)" strokeWidth="1.6" />
                </svg>
                <svg className="hero-decor__star hero-decor__star--3" width="30" height="30" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" fill="rgba(201,168,76,0.42)" />
                </svg>
                <svg className="hero-decor__star hero-decor__star--4" width="22" height="22" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" fill="rgba(13,27,42,0.3)" />
                </svg>
                <svg className="hero-decor__star hero-decor__star--6" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" fill="rgba(13,27,42,0.38)" />
                </svg>
                <div className="hero-decor__confetti hero-decor__confetti--4"></div>
                <div className="hero-decor__confetti hero-decor__confetti--5"></div>
                <div className="hero-decor__confetti hero-decor__confetti--6"></div>
                <div className="hero-decor__confetti hero-decor__confetti--8"></div>
                <div className="hero-decor__sparkle hero-decor__sparkle--3">✦</div>
                <div className="hero-decor__sparkle hero-decor__sparkle--4">✧</div>
                <div className="hero-decor__sparkle hero-decor__sparkle--6">✧</div>
            </div>

            {/* Hero Banner */}
            <section className="hero">
                {slides.map((s, i) => (
                    <div 
                        key={i} 
                        className={`hero__slide${i === active ? " hero__slide--active" : ""}`}
                        onClick={() => setCurrentPage("gallery")}
                        style={{ cursor: "pointer" }}
                    >
                        <img src={s.image} alt={s.heading} className="hero__img" />
                    </div>
                ))}

                {/* Dots */}
                <div className="hero__dots">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`hero__dot${i === active ? " hero__dot--active" : ""}`}
                            onClick={() => setActive(i)}
                        />
                    ))}
                </div>

                {/* Elegant curved transition cutout */}
                <div className="hero__curve-container" onClick={scrollToContent}>
                    <div className="hero__curve">
                        <svg className="hero__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </section>
        </div>
    );
}