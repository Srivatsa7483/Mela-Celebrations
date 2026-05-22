import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { OrderContext } from "../context/OrderContext.jsx";
import { DesignContext } from "../context/DesignContext.jsx";
import "./DashboardPage.css";

export default function DashboardPage({ setCurrentPage, setSelectedDesign }) {
  const { user, logout } = useContext(AuthContext);
  const { orders, wishlist, toggleWishlist, updateBookingStatusAdmin } = useContext(OrderContext);
  const { designs } = useContext(DesignContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // List of wishlist design items
  const savedItems = designs.filter(d => wishlist.map(String).includes(String(d.id)));

  const handlePrintInvoice = () => {
    window.print();
  };

  // Helper to map status to timeline indexes
  const getStatusIndex = (status) => {
    switch (status) {
      case "Pending": return 0;
      case "Confirmed": return 1;
      case "In Progress": return 2;
      case "Completed": return 3;
      default: return 0;
    }
  };

  const trackingSteps = [
    { label: "Request Received", desc: "Consultation details submitted" },
    { label: "Confirmed", desc: "Design & date secured" },
    { label: "In Setup", desc: "Decorating venue" },
    { label: "Celebration Live!", desc: "Event successfully completed" }
  ];

  return (
    <div className="dashboard-page">
      <div className="container" style={{ maxWidth: "1100px" }}>
        
        {/* Dashboard Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <span className="tag" style={{ color: "var(--gold)" }}>CUSTOMER PORTAL</span>
            <h1 className="dashboard__title">
              Welcome back, {user?.name || "Customer"}!
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Manage your bookings, invoices, and saved decoration setups.</p>
          </div>
          <div className="dashboard__header-actions">
            <button 
              onClick={() => setCurrentPage("gallery")} 
              className="btn-primary" 
            >
              EXPLORE DESIGNS
            </button>
            <button 
              onClick={logout} 
              className="btn-navy-outline" 
            >
              LOG OUT
            </button>
          </div>
        </div>

        {/* main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
          
          {/* Section 1: Active Bookings and Timeline Tracker */}
          <div>
            <h2 className="dashboard__title-sub">
              Active Bookings & Tracker
            </h2>

            {orders.length === 0 ? (
              <div style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid #e2ddd6",
                boxShadow: "var(--shadow-card)"
              }}>
                <span style={{ fontSize: "2.5rem" }}>📅</span>
                <h3 style={{ color: "var(--navy)", marginTop: "12px" }}>No Bookings Yet</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "8px 0 20px 0" }}>
                  You haven't scheduled any consultation or packages yet. Ready to design?
                </p>
                <button className="btn-primary" onClick={() => setCurrentPage("gallery")}>Book A Package Now</button>
              </div>
            ) :               <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {orders.map((booking) => {
                  const currentIndex = getStatusIndex(booking.status);
                  return (
                    <div 
                      key={booking.id}
                      className="dashboard__booking-card"
                    >
                      {/* Booking ID Header */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e2ddd6",
                        paddingBottom: "16px",
                        marginBottom: "24px",
                        flexWrap: "wrap",
                        gap: "12px"
                      }}>
                        <div>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "600" }}>ORDER ID</span>
                          <h3 className="booking-card__header-id">
                            {booking.id}
                          </h3>
                        </div>
                        <div className="booking-card__header-cost">
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "600" }}>TOTAL COST</span>
                          <div style={{ color: "var(--gold)", fontWeight: "bold", fontSize: "1.1rem" }}>
                            ₹{booking.finalPrice.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="booking-card__invoice-btn-wrap">
                          <button 
                            onClick={() => setSelectedInvoice(booking)}
                            className="btn-navy-outline booking-card__invoice-btn"
                          >
                            📄 VIEW INVOICE
                          </button>
                        </div>
                      </div>

                      {/* Detail row */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px", fontSize: "0.9rem" }}>
                        <div>
                          <span style={{ color: "var(--text-muted)", display: "block" }}>Selected Design:</span>
                          <strong style={{ color: "var(--navy)" }}>{booking.packageName}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)", display: "block" }}>Event Date:</span>
                          <strong style={{ color: "var(--navy)" }}>{booking.date}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)", display: "block" }}>Venue Location:</span>
                          <strong style={{ color: "var(--navy)" }}>{booking.venue}</strong>
                        </div>
                      </div>

                      {/* Booking Tracker */}
                      <div>
                        <h4 style={{ color: "var(--navy)", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
                          Booking Progress Tracker
                        </h4>

                        {/* Desktop Horizontal Tracker */}
                        <div className="tracker__desktop">
                          {/* Background line */}
                          <div style={{
                            position: "absolute",
                            top: "14px",
                            left: "30px",
                            right: "30px",
                            height: "3px",
                            backgroundColor: "#e2ddd6",
                            zIndex: 1
                          }} />
                          
                          {/* Active colored line */}
                          <div style={{
                            position: "absolute",
                            top: "14px",
                            left: "30px",
                            width: `${(currentIndex / (trackingSteps.length - 1)) * 90}%`,
                            height: "3px",
                            backgroundColor: "var(--gold)",
                            zIndex: 2,
                            transition: "width 0.4s ease"
                          }} />

                          {trackingSteps.map((step, idx) => (
                            <div 
                              key={step.label}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                zIndex: 3,
                                width: "120px"
                              }}
                            >
                              <div style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: currentIndex >= idx ? "var(--gold)" : "white",
                                border: currentIndex >= idx ? "2px solid var(--gold)" : "2px solid #e2ddd6",
                                color: currentIndex >= idx ? "white" : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                                marginBottom: "8px",
                                transition: "all 0.3s ease"
                              }}>
                                {currentIndex >= idx ? "✓" : idx + 1}
                              </div>
                              <span style={{ 
                                fontSize: "0.8rem", 
                                fontWeight: currentIndex >= idx ? "bold" : "500", 
                                color: currentIndex >= idx ? "var(--navy)" : "var(--text-muted)" 
                              }}>
                                {step.label}
                              </span>
                              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px", width: "95px" }}>
                                {step.desc}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Mobile Vertical Tracker */}
                        <div className="tracker__mobile">
                          {trackingSteps.map((step, idx) => (
                            <div 
                              key={step.label}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "16px",
                                textAlign: "left",
                                marginBottom: idx === trackingSteps.length - 1 ? 0 : "8px"
                              }}
                            >
                              {/* Left Column: Circle and vertical line */}
                              <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "30px"
                              }}>
                                <div style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: currentIndex >= idx ? "var(--gold)" : "white",
                                  border: currentIndex >= idx ? "2px solid var(--gold)" : "2px solid #e2ddd6",
                                  color: currentIndex >= idx ? "white" : "var(--text-muted)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "bold",
                                  fontSize: "0.8rem",
                                  zIndex: 2,
                                  transition: "all 0.3s ease"
                                }}>
                                  {currentIndex >= idx ? "✓" : idx + 1}
                                </div>
                                {idx < trackingSteps.length - 1 && (
                                  <div style={{
                                    width: "3px",
                                    height: "32px",
                                    backgroundColor: currentIndex > idx ? "var(--gold)" : "#e2ddd6",
                                    zIndex: 1,
                                    transition: "background-color 0.3s ease",
                                    marginTop: "4px",
                                    marginBottom: "4px"
                                  }} />
                                )}
                              </div>
                              
                              {/* Right Column: Text content */}
                              <div style={{ paddingTop: "4px" }}>
                                <span style={{ 
                                  fontSize: "0.85rem", 
                                  fontWeight: currentIndex >= idx ? "bold" : "500", 
                                  color: currentIndex >= idx ? "var(--navy)" : "var(--text-muted)",
                                  display: "block"
                                }}>
                                  {step.label}
                                </span>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", display: "block" }}>
                                  {step.desc}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>

          {/* Section 2: Saved Designs Wishlist */}
          <div>
            <h2 className="dashboard__title-sub">
              My Saved Designs Wishlist ({savedItems.length})
            </h2>

            {savedItems.length === 0 ? (
              <div style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid #e2ddd6",
                boxShadow: "var(--shadow-card)"
              }}>
                <span style={{ fontSize: "2rem" }}>❤️</span>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "10px" }}>
                  Your wishlist is empty. Tap the heart icon on any design in the Gallery to save it here!
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px"
              }}>
                {savedItems.map((d) => (
                  <div 
                    key={d.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #e2ddd6",
                      boxShadow: "var(--shadow-card)"
                    }}
                  >
                    <div style={{ position: "relative", height: "180px" }}>
                      <img src={d.image} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button 
                        onClick={() => toggleWishlist(d.id)}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer"
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#e63946" stroke="#e63946" strokeWidth="2">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                    <div style={{ padding: "16px" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: "600", textTransform: "uppercase" }}>{d.categoryName}</span>
                      <h4 style={{ color: "var(--navy)", margin: "4px 0", fontSize: "0.95rem" }}>{d.name}</h4>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                        <span style={{ fontWeight: "bold", color: "var(--navy)" }}>₹{d.price.toLocaleString("en-IN")}</span>
                        <button 
                          onClick={() => { setSelectedDesign(d); setCurrentPage("order"); }}
                          className="btn-navy-outline"
                          style={{ padding: "6px 12px", fontSize: "0.7rem" }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Collapsible Admin Testing Panel */}
          {orders.length > 0 && (
            <div className="dashboard__admin-panel">
              <button 
                onClick={() => setAdminPanelOpen(!adminPanelOpen)}
                className="admin-panel__toggle"
              >
                <span>🛠️ Developer Admin Control Panel</span>
                <span>{adminPanelOpen ? "▲" : "▼"}</span>
              </button>
              {adminPanelOpen && (
                <div style={{ marginTop: "16px", borderTop: "1px solid #e2ddd6", paddingTop: "16px" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-body)", marginBottom: "12px" }}>
                    Since this is a client application, you can use these admin buttons to advance the status of your bookings and see the horizontal tracker update instantly above!
                  </p>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Current Status</th>
                        <th>Advance Tracker Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: "600" }}>
                            <span className="admin-table__mobile-label">ID:</span>
                            {order.id}
                          </td>
                          <td>
                            <span className="admin-table__mobile-label">Status:</span>
                            <span style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              fontSize: "0.75rem",
                              backgroundColor: order.status === "Completed" ? "#25D366" : order.status === "In Progress" ? "#3498db" : "#f1c40f",
                              color: "white" 
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <div className="admin-table__actions">
                              {["Pending", "Confirmed", "In Progress", "Completed"].map(status => (
                                <button
                                  key={status}
                                  onClick={() => updateBookingStatusAdmin(order.id, status)}
                                  style={{
                                    backgroundColor: order.status === status ? "var(--navy)" : "white",
                                    color: order.status === status ? "white" : "var(--navy)"
                                  }}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Invoice Modal Overlay */}
      {selectedInvoice && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(13,27,42,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1200,
          padding: "20px"
        }}>
          <div className="animate-scale-in invoice-modal__card">
            {/* Header print area */}
            <div id="print-area" className="invoice-modal__print-area">
              <div className="invoice-modal__header">
                <div>
                  <h2 className="invoice-modal__header-title">Mela Celebrations</h2>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Bangalore, India | mela@celebrations.com</span>
                </div>
                <div className="invoice-modal__header-meta">
                  <h3 style={{ margin: 0, color: "var(--navy)", fontSize: "1.4rem" }}>INVOICE</h3>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>#{selectedInvoice.id}</span>
                </div>
              </div>

              {/* Invoice details */}
              <div className="invoice-modal__details">
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontWeight: "bold" }}>Billed To:</span>
                  <strong>{selectedInvoice.name}</strong><br />
                  {selectedInvoice.email}<br />
                  Phone: {selectedInvoice.phone}
                </div>
                <div className="invoice-modal__details-right">
                  <span style={{ color: "var(--text-muted)", display: "block", fontWeight: "bold" }}>Event Details:</span>
                  Date: <strong>{selectedInvoice.date}</strong><br />
                  Venue: <strong>{selectedInvoice.venue}</strong><br />
                  Status: <strong>{selectedInvoice.status.toUpperCase()}</strong>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f2f0ec", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Service / Package</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f2f0ec" }}>
                      <strong>{selectedInvoice.packageName}</strong><br />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Primary theme decoration setup</span>
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #f2f0ec" }}>
                      ₹{selectedInvoice.packagePrice.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  
                  {selectedInvoice.selectedServices && selectedInvoice.selectedServices.map(srv => (
                    <tr key={srv.name}>
                      <td style={{ padding: "10px", borderBottom: "1px solid #f2f0ec" }}>
                        <span>{srv.name}</span>
                      </td>
                      <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #f2f0ec" }}>
                        ₹{srv.price.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "0.85rem" }}>
                <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Subtotal:</span>
                    <span>₹{selectedInvoice.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  
                  {selectedInvoice.discountAmount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#e63946" }}>
                      <span>Discount ({selectedInvoice.activeCoupon}):</span>
                      <span>-₹{selectedInvoice.discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "4px 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.05rem" }}>
                    <span style={{ color: "var(--navy)" }}>Total Paid:</span>
                    <span style={{ color: "var(--gold)" }}>₹{selectedInvoice.finalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: "40px", borderTop: "1px solid var(--border)", paddingTop: "20px", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Thank you for choosing Mela Celebrations! We look forward to lighting up your event.
              </div>
            </div>

            {/* Modal Controls */}
            <div className="invoice-modal__controls">
              <button 
                onClick={handlePrintInvoice}
                style={{
                  backgroundColor: "var(--navy)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                🖨️ PRINT / DOWNLOAD
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--navy)",
                  border: "1px solid var(--navy)",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                CLOSE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
