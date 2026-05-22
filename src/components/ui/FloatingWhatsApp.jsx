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
      fontFamily: "'Jost', sans-serif"
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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 2c-5.514 0-9.969 4.456-9.969 9.971 0 1.764.459 3.42 1.261 4.877l-1.323 4.832 4.947-1.298c1.397.763 2.977 1.199 4.654 1.199 5.515 0 9.97-4.457 9.97-9.971 0-5.515-4.455-9.971-9.97-9.971zm6.07 13.916c-.253.708-1.472 1.304-2.029 1.353-.51.045-1.18.067-1.895-.162-.714-.229-2.909-1.077-4.816-2.792-1.636-1.47-2.613-3.238-2.934-3.791-.32-.553-.034-.852.243-1.127.249-.247.552-.642.829-.963.277-.32.369-.548.553-.915.184-.367.092-.687-.046-.963-.138-.276-1.242-2.993-1.703-4.1-.449-1.079-.904-.932-1.243-.932-.32 0-.687-.008-1.054-.008-.368 0-.965.138-1.471.69-.506.552-1.932 1.888-1.932 4.605 0 2.717 1.978 5.342 2.254 5.711.276.368 3.89 5.94 9.424 8.327 1.316.567 2.344.906 3.146 1.16.115.037.23.072.345.107 1.096.347 2.083.298 2.87.18 1.057-.159 2.029-.619 2.502-1.217.472-.598.472-1.111.332-1.218-.141-.107-.52-.296-.98-.526z"/>
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
