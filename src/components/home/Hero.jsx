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

    return (
        <section className="hero">
            {slides.map((s, i) => (
                <div 
                    key={i} 
                    className={`hero__slide${i === active ? " hero__slide--active" : ""}`}
                    onClick={() => setCurrentPage("gallery")}
                    style={{ cursor: "pointer" }}
                >
                    <img src={s.image} alt={s.heading} className="hero__img" />
                    {/* Overlay removed to keep banners bright */}
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
        </section>
    );
}