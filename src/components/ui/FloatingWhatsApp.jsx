import { useState } from "react";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "918152033967"; // Owner phone number

  const startChat = () => {
    const message = encodeURIComponent("Hi Mela Celebrations! I want to inquire about event decorations.");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="floating-whatsapp" style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: "1000",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* WhatsApp Button Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          border: "none",
          boxShadow: "0 4px 16px rgba(37, 211, 102, 0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          transition: "transform 0.3s ease",
          outline: "none"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
        title="Chat with us on WhatsApp"
      >
        <svg width="34" height="34" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
        {/* Subtle dot to indicate active help */}
        <span style={{
          position: "absolute",
          top: "2px",
          right: "2px",
          width: "12px",
          height: "12px",
          backgroundColor: "#e63946",
          borderRadius: "50%",
          border: "2px solid white",
          display: "block"
        }} />
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div style={{
          position: "absolute",
          bottom: "75px",
          right: "0",
          width: "320px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          animation: "scaleIn 0.3s ease",
          border: "1px solid #e2ddd6"
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: "#0d1b2a",
            padding: "20px",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#0d1b2a",
              fontSize: "1.2rem",
              border: `2px solid var(--gold)`
            }}>
              M
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "1rem", letterSpacing: "0.03em" }}>Mela Celebrations</div>
              <div style={{ fontSize: "0.75rem", color: "#a5b1c2", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#25D366",
                  borderRadius: "50%",
                  display: "inline-block"
                }} />
                Online (Replies in minutes)
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.2rem",
                marginLeft: "auto",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{
            padding: "20px",
            backgroundColor: "#f7f4ef",
            fontSize: "0.9rem",
            color: "#3a4a5c"
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              position: "relative",
              marginBottom: "16px"
            }}>
              Hi there! 👋 Let us know how we can help you celebrate today. We can customize balloon setup, cake tables, and themes for your parties!
            </div>
          </div>

          {/* Footer Action */}
          <div style={{
            padding: "16px 20px",
            backgroundColor: "white",
            borderTop: "1px solid #e2ddd6"
          }}>
            <button 
              onClick={startChat}
              style={{
                width: "100%",
                backgroundColor: "#25D366",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#20ba56"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#25D366"}
            >
              Start Chat on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
