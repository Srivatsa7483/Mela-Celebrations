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
                    
                    <h3 style={{ fontSize: "1.1rem", color: "var(--navy)", marginBottom: "12px", fontFamily: "var(--font-sans)", fontWeight: "600" }}>Inclusions</h3>
                    <ul className="gmodal__features" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                        {design.features && design.features.map((f, i) => {
                            // Trim whitespace just in case
                            const text = f.trim();
                            
                            // Check if this feature is specifically meant to be crossed out
                            // Adding support for '!' (with or without space), 'x ', or 'no '
                            const isExclusion = text.startsWith("!") || text.toLowerCase().startsWith("x ") || text.toLowerCase().startsWith("no ");
                            
                            // Clean the text by removing the prefix notation (e.g., "!", "! ", "X ", "No ")
                            const cleanText = isExclusion
                                ? text.replace(/^(!\s*|x\s+|X\s+|No\s+)/i, "") 
                                : text.replace(/^(v\s+|ok\s+)/i, "");

                            return (
                                <li key={i} style={{ 
                                    display: "flex", 
                                    gap: "12px", 
                                    alignItems: "flex-start", 
                                    fontSize: "0.95rem", 
                                    color: isExclusion ? "#e63946" : "var(--text-body)" 
                                }}>
                                    <span style={{ 
                                        color: isExclusion ? "#e63946" : "#10b981", 
                                        minWidth: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginTop: "2px"
                                    }}>
                                        {isExclusion ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </span> 
                                    <span style={{ textDecoration: isExclusion ? "line-through" : "none", color: isExclusion ? "#8b8882" : "inherit" }}>{cleanText}</span>
                                </li>
                            );
                        })}
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
