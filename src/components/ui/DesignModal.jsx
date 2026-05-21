import { useEffect } from "react";
import "./DesignModal.css";

function formatPrice(p) {
    return "₹" + p.toLocaleString("en-IN");
}

export default function DesignModal({ design, onClose, onOrder }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div className="gmodal" onClick={onClose}>
            <div className="gmodal__box" onClick={(e) => e.stopPropagation()}>
                <button className="gmodal__close" onClick={onClose}>✕</button>
                <div className="gmodal__img-wrap">
                    {design.badge && <span className="gmodal__badge">{design.badge}</span>}
                    <img src={design.image} alt={design.name} className="gmodal__img" />
                </div>
                <div className="gmodal__body">
                    <span className="gmodal__cat">{design.categoryName}</span>
                    <h2 className="gmodal__name">{design.name}</h2>
                    <p className="gmodal__desc">{design.description}</p>
                    <ul className="gmodal__features">
                        {design.features && design.features.map((f) => (
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
