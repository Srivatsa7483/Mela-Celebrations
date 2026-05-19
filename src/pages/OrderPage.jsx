import { useState } from "react";
import { designs } from "../data/index.js";
import "./OrderPage.css";

function formatPrice(p) { return "₹" + p.toLocaleString("en-IN"); }

export default function OrderPage({ selectedDesign, setCurrentPage }) {
    const [form, setForm] = useState({
        name: "", phone: "", email: "",
        date: "", venue: "", message: "",
        designId: selectedDesign?.id || "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const chosen = designs.find((d) => d.id === Number(form.designId)) || selectedDesign;

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone";
        if (!form.email.includes("@")) e.email = "Enter a valid email";
        if (!form.date) e.date = "Please select your event date";
        if (!form.venue.trim()) e.venue = "Venue/location is required";
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        // Format the message for WhatsApp
        const adminPhone = "918147308985"; // User's actual WhatsApp number
        let messageText = "";

        if (chosen) {
            // Package Booking Format
            messageText = `*New Package Booking* 🎉\n\n` +
                `*Name:* ${form.name}\n` +
                `*Phone:* ${form.phone}\n` +
                `*Date:* ${form.date}\n` +
                `*Venue:* ${form.venue}\n` +
                `*Design Package:* ${chosen.name}\n` +
                `*Category:* ${chosen.categoryName}\n` +
                (form.message ? `\n*Message/Requests:*\n${form.message}` : "");
        } else {
            // General Consultation Format
            messageText = `*New Consultation Request* 📅\n\n` +
                `*Name:* ${form.name}\n` +
                `*Phone:* ${form.phone}\n` +
                `*Date:* ${form.date}\n` +
                `*Venue:* ${form.venue}\n` +
                (form.message ? `\n*Message/Requests:*\n${form.message}` : "");
        }

        const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageText)}`;

        // Open WhatsApp in a new tab
        window.open(waUrl, "_blank");

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="order-page">
                <div className="order-success">
                    <div className="order-success__icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" />
                        </svg>
                    </div>
                    <h2 className="order-success__title">Booking Confirmed!</h2>
                    <p className="order-success__sub">Thank you, {form.name}! Our team will contact you within 24 hours to discuss the details and confirm your event.</p>
                    <div className="order-success__detail">
                        <div><span>Design</span><strong>{chosen?.name}</strong></div>
                        <div><span>Event Date</span><strong>{form.date}</strong></div>
                        <div><span>Venue</span><strong>{form.venue}</strong></div>
                        <div><span>Starting From</span><strong>{chosen ? formatPrice(chosen.price) : ""}</strong></div>
                    </div>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                        <button className="btn-primary" onClick={() => setCurrentPage("home")}>Back to Home</button>
                        <button className="btn-navy-outline" onClick={() => setCurrentPage("gallery")}>Explore More</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-page">
            <div className="order-page__hero">
                <div className="container">
                    <span className="tag" style={{ color: "rgba(255,255,255,0.55)" }}>FREE CONSULTATION</span>
                    <h1 className="order-page__title">Book Consultation or Package</h1>
                    <p className="order-page__sub">Select a package or request a custom consultation. We'll craft something extraordinary for you.</p>
                </div>
            </div>

            <div className="container">
                <div className="order-layout">
                    {/* Form */}
                    <form className="order-form" onSubmit={handleSubmit} noValidate>
                        <h2 className="order-form__heading">Your Details</h2>

                        <div className="order-form__row">
                            <div className="order-form__field">
                                <label>Full Name *</label>
                                <input
                                    type="text" placeholder="Priya Sharma"
                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={errors.name ? "error" : ""}
                                />
                                {errors.name && <span className="order-form__error">{errors.name}</span>}
                            </div>
                            <div className="order-form__field">
                                <label>Phone Number *</label>
                                <input
                                    type="tel" placeholder="9876543210"
                                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className={errors.phone ? "error" : ""}
                                />
                                {errors.phone && <span className="order-form__error">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="order-form__field">
                            <label>Email Address *</label>
                            <input
                                type="email" placeholder="you@example.com"
                                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={errors.email ? "error" : ""}
                            />
                            {errors.email && <span className="order-form__error">{errors.email}</span>}
                        </div>

                        <div className="order-form__row">
                            <div className="order-form__field">
                                <label>Event Date *</label>
                                <input
                                    type="date"
                                    value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className={errors.date ? "error" : ""}
                                    min={new Date().toISOString().slice(0, 10)}
                                />
                                {errors.date && <span className="order-form__error">{errors.date}</span>}
                            </div>
                            <div className="order-form__field">
                                <label>Venue / Location *</label>
                                <input
                                    type="text" placeholder="Home, Hall name, Koramangala…"
                                    value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
                                    className={errors.venue ? "error" : ""}
                                />
                                {errors.venue && <span className="order-form__error">{errors.venue}</span>}
                            </div>
                        </div>

                        <div className="order-form__field">
                            <label>Select Design Package (Optional)</label>
                            <select
                                value={form.designId}
                                onChange={(e) => setForm({ ...form, designId: e.target.value })}
                                className={errors.designId ? "error" : ""}
                            >
                                <option value="">— Leave blank for general consultation —</option>
                                {designs.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name} ({formatPrice(d.price)})</option>
                                ))}
                            </select>
                            {errors.designId && <span className="order-form__error">{errors.designId}</span>}
                        </div>

                        <div className="order-form__field">
                            <label>Special Requests / Message</label>
                            <textarea
                                rows={4} placeholder="Any special requirements, colour preferences, guest count…"
                                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px" }}>
                            CONFIRM BOOKING →
                        </button>
                    </form>

                    {/* Sidebar summary */}
                    <aside className="order-sidebar">
                        {chosen ? (
                            <div className="order-sidebar__card">
                                <img src={chosen.image} alt={chosen.name} className="order-sidebar__img" />
                                <div className="order-sidebar__body">
                                    <span className="order-sidebar__cat">{chosen.categoryName}</span>
                                    <h3 className="order-sidebar__name">{chosen.name}</h3>
                                    <p className="order-sidebar__desc">{chosen.description}</p>
                                    <ul className="order-sidebar__features">
                                        {chosen.features.map((f) => (
                                            <li key={f}><span style={{ color: "var(--gold)" }}>✦</span> {f}</li>
                                        ))}
                                    </ul>
                                    <div className="order-sidebar__price">
                                        <span>Starting From</span>
                                        <strong>{formatPrice(chosen.price)}</strong>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="order-sidebar__empty">
                                <p>Select a design package to see the summary here.</p>
                                <p style={{ marginTop: "12px", color: "var(--navy)", fontWeight: "500" }}>Or leave it blank to request a custom consultation!</p>
                            </div>
                        )}

                        <div className="order-sidebar__trust">
                            {[["✓", "Free on-site consultation"], ["✓", "Transparent pricing, no hidden costs"], ["✓", "Professional setup team"], ["✓", "100% satisfaction guarantee"]].map(([icon, text]) => (
                                <div key={text} className="order-sidebar__trust-item">
                                    <span className="order-sidebar__trust-icon">{icon}</span>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}