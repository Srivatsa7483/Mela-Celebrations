import { useState, useEffect, useContext } from "react";
import { designs } from "../data/index.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { OrderContext } from "../context/OrderContext.jsx";
import "./OrderPage.css";

function formatPrice(p) { return "₹" + p.toLocaleString("en-IN"); }

export default function OrderPage({ selectedDesign, setCurrentPage }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { createBooking } = useContext(OrderContext);

  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    date: "", venue: "", message: "",
    designId: selectedDesign?.id || "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errors, setErrors] = useState({});

  // Coupon code states
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFlat, setDiscountFlat] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Add-on states
  const [addOns, setAddOns] = useState({
    ledBoard: false,
    magicShow: false,
    photos: false,
  });

  const addOnDetails = {
    ledBoard: { name: "Neon LED Name Board", price: 2000 },
    magicShow: { name: "Magic Show Entertainment (30min)", price: 3500 },
    photos: { name: "Standard Event Photography (4hrs)", price: 6000 }
  };

  // Custom Planned Event from Estimator Budget Calculator
  const [customPackage, setCustomPackage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pre-fill user data if authenticated, or restore pending booking
  useEffect(() => {
    const pending = sessionStorage.getItem("mela_pending_booking");
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        setForm(parsed.form);
        if (parsed.addOns) setAddOns(parsed.addOns);
        if (parsed.couponCode) {
          setCouponCode(parsed.couponCode);
          validateCouponCode(parsed.couponCode);
        }
        sessionStorage.removeItem("mela_pending_booking"); // clean up
      } catch (err) {
        console.error("Failed to restore pending booking:", err);
      }
    } else if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || ""
      }));
    }
  }, [user]);

  // Load custom planned event from session storage, or check spin-wheel won coupons
  useEffect(() => {
    const custom = sessionStorage.getItem("mela_custom_package");
    if (custom) {
      const parsed = JSON.parse(custom);
      setCustomPackage(parsed);
      setForm(prev => ({ ...prev, designId: "" })); // clear regular designs
    }

    const wonCoupon = localStorage.getItem("mela_spin_won_coupon");
    if (wonCoupon) {
      setCouponCode(wonCoupon);
      // Auto-validate it
      validateCouponCode(wonCoupon);
    }
  }, []);

  const chosen = customPackage ? null : (designs.find((d) => d.id === Number(form.designId)) || selectedDesign);

  // Prices calculation
  const basePrice = customPackage ? customPackage.packagePrice : (chosen ? chosen.price : 0);
  
  const addOnsPrice = Object.keys(addOns).reduce((acc, key) => {
    return acc + (addOns[key] ? addOnDetails[key].price : 0);
  }, 0);

  const subtotal = basePrice + addOnsPrice;
  let discountAmount = 0;
  if (activeCoupon === "SPINPHOTO50" || (createdOrder && createdOrder.activeCoupon === "SPINPHOTO50")) {
    if (addOns.photos) {
      discountAmount = Math.round(addOnDetails.photos.price * 0.5);
    }
  } else if (discountPercent > 0) {
    discountAmount = Math.round(subtotal * (discountPercent / 100));
  } else {
    discountAmount = discountFlat;
  }
  const finalPrice = Math.max(0, subtotal - discountAmount);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.date) e.date = "Please select your event date";
    if (!form.venue.trim()) e.venue = "Venue/location is required";
    return e;
  };

  const validateCouponCode = async (codeToTest = null) => {
    const code = codeToTest || couponCode;
    if (!code) return;
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid coupon");
      }
      
      // Apply discount according to schema: { type: "percentage"|"flat", value: number }
      setActiveCoupon(code);
      if (data.type === "percentage") {
        setDiscountPercent(data.value);
        setDiscountFlat(0);
        setCouponSuccess(`Coupon code applied: ${data.value}% OFF!`);
      } else if (data.type === "flat") {
        setDiscountPercent(0);
        setDiscountFlat(data.value);
        setCouponSuccess(`Coupon code applied: ₹${data.value.toLocaleString("en-IN")} OFF!`);
      } else if (data.type === "photography_50" || code.toUpperCase() === "SPINPHOTO50") {
        setDiscountPercent(0);
        setDiscountFlat(0);
        setCouponSuccess(`Coupon code applied: 50% OFF on Photography add-on! (Note: select the standard Photography add-on above to get the discount)`);
      } else {
        setDiscountPercent(0);
        setDiscountFlat(0);
        setCouponSuccess(`Coupon code applied: ${data.description || "Active Discount"}`);
      }
    } catch (err) {
      setCouponError(err.message);
      setActiveCoupon("");
      setDiscountPercent(0);
      setDiscountFlat(0);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon("");
    setCouponCode("");
    setDiscountPercent(0);
    setDiscountFlat(0);
    setCouponSuccess("");
    setCouponError("");
  };

  const handleAddOnToggle = (key) => {
    setAddOns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Save current booking details in session storage so they aren't lost
      sessionStorage.setItem("mela_pending_booking", JSON.stringify({
        form,
        addOns,
        couponCode
      }));
      sessionStorage.setItem("mela_login_redirect", "order");
      setCurrentPage("login");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const selectedServices = Object.keys(addOns)
      .filter(k => addOns[k])
      .map(k => addOnDetails[k]);

    const bookingData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      venue: form.venue,
      message: form.message,
      packageName: customPackage ? "Custom Planned Event" : (chosen ? chosen.name : "General Consultation"),
      packagePrice: basePrice,
      selectedServices,
      subtotal,
      activeCoupon,
      discountAmount,
      finalPrice
    };

    try {
      // 1. Submit order to local Node/Express database API
      const booking = await createBooking(bookingData);
      setCreatedOrder(booking);

      // 2. Clear custom package cache from session
      sessionStorage.removeItem("mela_custom_package");
      localStorage.removeItem("mela_spin_won_coupon");

      // 3. Format message details for WhatsApp chat confirmation
      const adminPhone = "918147308985";
      const messageText = 
        `*New Event Booking Request* 🎉\n` +
        `-----------------------------\n` +
        `• *Order ID:* ${booking.id}\n` +
        `• *Customer Name:* ${form.name}\n` +
        `• *Phone:* ${form.phone}\n` +
        `• *Event Date:* ${form.date}\n` +
        `• *Venue:* ${form.venue}\n` +
        `• *Setup Name:* ${bookingData.packageName}\n` +
        `• *Subtotal:* ${formatPrice(subtotal)}\n` +
        (activeCoupon ? `• *Coupon Applied:* ${activeCoupon} (-${formatPrice(discountAmount)})\n` : "") +
        `• *Final Bill Amount:* ${formatPrice(finalPrice)}\n` +
        (form.message ? `• *Comments:* ${form.message}\n` : "") +
        `-----------------------------\n` +
        `Please confirm this booking status and send details.`;

      const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(waUrl, "_blank");

      setSubmitted(true);
    } catch (err) {
      console.error("Booking error:", err);
      setErrors({ form: err.message || "Failed to submit booking" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (submitted && createdOrder) {
    return (
      <div className="order-page" style={{ padding: "195px 0 60px 0", backgroundColor: "#f7f4ef" }}>
        <div className="order-success" style={{ maxWidth: "680px", margin: "0 auto", padding: "40px" }} id="printable-invoice">
          <div className="order-success__icon" style={{ backgroundColor: "#25D366", color: "white" }}>
            ✓
          </div>
          <h2 className="order-success__title" style={{ color: "var(--navy)" }}>Booking Confirmed!</h2>
          <p className="order-success__sub" style={{ color: "var(--text-muted)" }}>
            Thank you, {form.name}! We've stored your booking request in our system and opened your inquiry on WhatsApp.
          </p>

          {/* Printable Invoice Block */}
          <div style={{
            backgroundColor: "white",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "24px",
            margin: "24px 0",
            textAlign: "left",
            fontSize: "0.85rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--gold)", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <h4 style={{ margin: 0, color: "var(--navy)", fontSize: "1.1rem" }}>Mela Celebrations Invoice</h4>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Booking Reference: #{createdOrder.id}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>Date:</strong> {createdOrder.date}<br />
                <strong>Venue:</strong> {createdOrder.venue}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <strong>Client:</strong> {createdOrder.name} ({createdOrder.email})
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f0ec", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>Item Description</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f2f0ec" }}>
                    <strong>{createdOrder.packageName}</strong> (Primary Theme Decor)
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", borderBottom: "1px solid #f2f0ec" }}>
                    {formatPrice(createdOrder.packagePrice)}
                  </td>
                </tr>
                {createdOrder.selectedServices && createdOrder.selectedServices.map(srv => (
                  <tr key={srv.name}>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f2f0ec" }}>{srv.name} (Add-on)</td>
                    <td style={{ padding: "8px", textAlign: "right", borderBottom: "1px solid #f2f0ec" }}>{formatPrice(srv.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "220px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(createdOrder.subtotal)}</span>
                </div>
                {createdOrder.discountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#e63946" }}>
                    <span>Coupon ({createdOrder.activeCoupon}):</span>
                    <span>-{formatPrice(createdOrder.discountAmount)}</span>
                  </div>
                )}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                  <span>Total Amount:</span>
                  <span style={{ color: "var(--gold)" }}>{formatPrice(createdOrder.finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }} className="no-print">
            <button className="btn-primary" onClick={handlePrint}>🖨️ PRINT INVOICE</button>
            <button className="btn-navy-outline" onClick={() => setCurrentPage("dashboard")}>VIEW IN DASHBOARD</button>
            <button className="btn-navy-outline" onClick={() => setCurrentPage("home")}>BACK TO HOME</button>
          </div>
        </div>
      </div>
    );
  }

  const selectedDesignObj = designs.find(d => String(d.id) === String(form.designId));

  return (
    <div className="order-page" style={{ fontFamily: "'Jost', sans-serif" }}>
      <div className="order-page__hero">
        <div className="container">
          <span className="tag" style={{ color: "rgba(255,255,255,0.55)" }}>SECURE CONSULTATION</span>
          <h1 className="order-page__title">Book Consultation or Package</h1>
          <p className="order-page__sub">Select a package, customize with activities, and apply coupon codes for automatic discount bills.</p>
        </div>
      </div>

      <div className="container">
        {errors.form && (
          <div style={{ backgroundColor: "rgba(230, 57, 70, 0.1)", border: "1px solid #e63946", padding: "12px", borderRadius: "6px", color: "#e63946", marginBottom: "20px" }}>
            {errors.form}
          </div>
        )}

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

            {/* Design select (if not custom package from Estimator) */}
            {!customPackage ? (
              <div className="order-form__field">
                <label>Select Design Package (Optional)</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      padding: "12px 14px",
                      border: errors.designId ? "1.5px solid #e53e3e" : "1.5px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      color: "var(--navy)",
                      background: "var(--white)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      userSelect: "none"
                    }}
                  >
                    <span>
                      {selectedDesignObj 
                        ? `${selectedDesignObj.name} (${formatPrice(selectedDesignObj.price)})` 
                        : "— Leave blank for general consultation —"}
                    </span>
                    <span style={{ 
                      fontSize: "0.8rem", 
                      transition: "transform 0.2s ease",
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)"
                    }}>
                      ▼
                    </span>
                  </div>
                  
                  {isDropdownOpen && (
                    <>
                      <div 
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999,
                          background: "transparent"
                        }}
                      />
                      
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: "4px",
                        backgroundColor: "var(--white)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        maxHeight: "260px",
                        overflowY: "auto"
                      }}>
                        <div
                          onClick={() => {
                            setForm({ ...form, designId: "" });
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            padding: "10px 14px",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            backgroundColor: !form.designId ? "rgba(201, 168, 76, 0.15)" : "transparent",
                            color: !form.designId ? "var(--navy)" : "var(--text-body)",
                            fontWeight: !form.designId ? "600" : "normal",
                            borderBottom: "1px solid var(--border)",
                            transition: "background-color 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            if (form.designId) e.currentTarget.style.backgroundColor = "rgba(13, 27, 42, 0.05)";
                          }}
                          onMouseLeave={(e) => {
                            if (form.designId) e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          — Leave blank for general consultation —
                        </div>
                        
                        {designs.map((d) => {
                          const isSelected = String(form.designId) === String(d.id);
                          return (
                            <div
                              key={d.id}
                              onClick={() => {
                                setForm({ ...form, designId: String(d.id) });
                                setIsDropdownOpen(false);
                              }}
                              style={{
                                padding: "10px 14px",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                backgroundColor: isSelected ? "rgba(201, 168, 76, 0.15)" : "transparent",
                                color: isSelected ? "var(--navy)" : "var(--text-body)",
                                fontWeight: isSelected ? "600" : "normal",
                                transition: "background-color 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(13, 27, 42, 0.05)";
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>{d.name}</span>
                                <span style={{ fontWeight: "600", color: "var(--navy)" }}>{formatPrice(d.price)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                {errors.designId && <span className="order-form__error">{errors.designId}</span>}
              </div>
            ) : (
              <div style={{
                backgroundColor: "rgba(201, 168, 76, 0.1)",
                border: "1px dashed var(--gold)",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>🛠️ Selected Custom Planned Setup</strong>
                  <button 
                    type="button"
                    onClick={() => setCustomPackage(null)}
                    style={{ background: "none", border: "none", color: "#e63946", cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}
                  >
                    Use standard packages instead
                  </button>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Estimated total: {formatPrice(customPackage.packagePrice)}
                </div>
              </div>
            )}

            {/* Add-on choices selection */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "12px" }}>
                Add-on Services
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.keys(addOnDetails).map((key) => {
                  const srv = addOnDetails[key];
                  return (
                    <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={addOns[key]} 
                        onChange={() => handleAddOnToggle(key)} 
                      />
                      <span>{srv.name} (<strong>+{formatPrice(srv.price)}</strong>)</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Coupon field */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "12px" }}>
                Apply Discount Coupon
              </h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder="WELCOME10, MELA20, SPIN code..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!activeCoupon}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    outline: "none",
                    backgroundColor: activeCoupon ? "#f5f5f5" : "var(--white)",
                    color: activeCoupon ? "var(--text-muted)" : "var(--navy)",
                    cursor: activeCoupon ? "not-allowed" : "text"
                  }}
                />
                {activeCoupon ? (
                  <button 
                    type="button"
                    onClick={handleRemoveCoupon}
                    style={{
                      backgroundColor: "#e63946",
                      color: "white",
                      border: "none",
                      padding: "0 20px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    REMOVE
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => validateCouponCode()}
                    style={{
                      backgroundColor: "var(--navy)",
                      color: "white",
                      border: "none",
                      padding: "0 20px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    APPLY
                  </button>
                )}
              </div>
              {couponError && <p style={{ color: "#e63946", fontSize: "0.8rem", marginTop: "4px" }}>⚠️ {couponError}</p>}
              {couponSuccess && <p style={{ color: "#25D366", fontSize: "0.8rem", marginTop: "4px" }}>✓ {couponSuccess}</p>}
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px" }}>
              CONFIRM BOOKING →
            </button>
          </form>

          {/* Sidebar summary */}
          <aside className="order-sidebar">
            {(chosen || customPackage) ? (
              <div className="order-sidebar__card">
                {chosen && <img src={chosen.image} alt={chosen.name} className="order-sidebar__img" />}
                <div className="order-sidebar__body">
                  <span className="order-sidebar__cat">{customPackage ? "CUSTOM" : chosen.categoryName}</span>
                  <h3 className="order-sidebar__name">{customPackage ? "Custom Planned Setup" : chosen.name}</h3>
                  <p className="order-sidebar__desc">{customPackage ? "Selected through the estimator tool" : chosen.description}</p>
                  
                  {chosen && (
                    <ul className="order-sidebar__features">
                      {chosen.features.map((f) => (
                        <li key={f}><span style={{ color: "var(--gold)" }}>✦</span> {f}</li>
                      ))}
                    </ul>
                  )}
                  {customPackage && (
                    <ul className="order-sidebar__features">
                      {customPackage.features.map((f) => (
                        <li key={f}><span style={{ color: "var(--gold)" }}>✦</span> {f}</li>
                      ))}
                    </ul>
                  )}

                  {/* Summary Pricing block */}
                  <div style={{
                    marginTop: "20px",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "14px",
                    fontSize: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}>
                    <div style={{ display: "flex", justify: "space-between", justifyContent: "space-between" }}>
                      <span>Base Package:</span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                    {addOnsPrice > 0 && (
                      <div style={{ display: "flex", justify: "space-between", justifyContent: "space-between" }}>
                        <span>Add-on Services:</span>
                        <span>{formatPrice(addOnsPrice)}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justify: "space-between", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: "flex", justify: "space-between", justifyContent: "space-between", color: "#e63946", fontWeight: "600" }}>
                        <span>Discount ({activeCoupon}):</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div style={{
                      borderTop: "2px solid var(--gold)",
                      paddingTop: "10px",
                      marginTop: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline"
                    }}>
                      <span style={{ fontWeight: "bold", color: "var(--navy)" }}>Total Cost:</span>
                      <strong style={{ fontSize: "1.3rem", color: "var(--gold)" }}>{formatPrice(finalPrice)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="order-sidebar__empty">
                <p>Select a design package or use the Budget Calculator tool to see the summary here.</p>
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