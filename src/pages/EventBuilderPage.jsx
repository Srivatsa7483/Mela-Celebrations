import { useState } from "react";
import "./EventBuilderPage.css";

export default function EventBuilderPage({ setCurrentPage }) {
  const [step, setStep] = useState(1);
  
  // Customization choices
  const [colors, setColors] = useState("Pastel Pink & Chrome Gold");
  const [customColor, setCustomColor] = useState("");
  const [balloonType, setBalloonType] = useState("Full Circular Arch");
  const [photographer, setPhotographer] = useState("Premium Photo + Video Reel");
  const [cakeTable, setCakeTable] = useState("Double Hoop Floral Arch");
  const [ledText, setLedText] = useState("");
  const [needLed, setNeedLed] = useState("Yes");

  const stepsCount = 5;

  const colorPills = [
    "Pastel Pink & Chrome Gold",
    "Royal Blue, White & Chrome Silver",
    "Jungle Green, Chrome Yellow & Gold",
    "Peach, Rose Gold & White",
    "Midnight Black & Gold (Retro)",
    "Custom Colors"
  ];

  const balloonOptions = [
    { name: "Full Circular Arch", desc: "A gorgeous circular balloon ring surrounding the cake table." },
    { name: "Half Arch Garland", desc: "A modern organic side garland cascading down one side." },
    { name: "Balloon Pillars (Pair)", desc: "Two standard standing balloon pillars flanking the entrance." },
    { name: "Ceiling Balloons Grid", desc: "100+ gas/air balloons covering the ceiling with ribbons." }
  ];

  const photographerOptions = [
    "None - I have my own photographer",
    "Standard Photography (4 Hours coverage)",
    "Premium Photo + Video Reel (Full Event)",
    "Luxury Cinema Setup (Inc. Album & Drone)"
  ];

  const cakeTableOptions = [
    { name: "Classic Draped Table", desc: "Simple circular or rectangular table with velvet cloth." },
    { name: "Cylindrical Plinths (Set of 3)", desc: "Modern glossy columns in matching heights and theme colors." },
    { name: "Double Hoop Floral Arch", desc: "Elegant double metal rings draped in matching florals and balloon clusters." },
    { name: "Sequin Shimmer Wall Backdrop", desc: "Gold/silver shimmering panel walls with neon sign accents." }
  ];

  const handleNext = () => {
    if (step < stepsCount) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmitToWhatsApp = () => {
    const finalColors = colors === "Custom Colors" ? customColor : colors;
    const adminPhone = "918152033967";
    
    const messageText = 
      `*Mela Celebrations - Custom Design Request* 🎨✨\n\n` +
      `I have customized my event using the Event Builder! Here are my choices:\n\n` +
      `• *Theme Colors:* ${finalColors || "Not Specified"}\n` +
      `• *Balloon Setup:* ${balloonType}\n` +
      `• *Cake Table backdrop:* ${cakeTable}\n` +
      `• *LED Board Request:* ${needLed === "Yes" ? `Yes ("${ledText || "My Birthday"}")` : "No"}\n` +
      `• *Photographer Package:* ${photographer}\n\n` +
      `Please contact me with quotation and availability!`;

    const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, "_blank");
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "8px" }}>Select Theme Colors</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>Choose one of our popular color themes or enter your own custom combination.</p>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
              {colorPills.map(p => (
                <button
                  key={p}
                  onClick={() => setColors(p)}
                  style={{
                    backgroundColor: colors === p ? "var(--navy)" : "white",
                    color: colors === p ? "white" : "var(--navy)",
                    border: "2px solid var(--navy)",
                    padding: "10px 18px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s"
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {colors === "Custom Colors" && (
              <input
                type="text"
                placeholder="e.g., Lavender, Lilac, Rose gold and Chrome Purple"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            )}
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "8px" }}>Balloon Backdrop Setup</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>Choose how the main balloons should be arranged around your event backdrop.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {balloonOptions.map(opt => (
                <label
                  key={opt.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    borderRadius: "8px",
                    border: balloonType === opt.name ? "2px solid var(--gold)" : "1px solid var(--border)",
                    backgroundColor: balloonType === opt.name ? "rgba(201, 168, 76, 0.05)" : "white",
                    cursor: "pointer",
                    gap: "12px"
                  }}
                >
                  <input
                    type="radio"
                    name="balloonType"
                    checked={balloonType === opt.name}
                    onChange={() => setBalloonType(opt.name)}
                  />
                  <div>
                    <div style={{ fontWeight: "600", color: "var(--navy)" }}>{opt.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "8px" }}>Cake Table Background</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>Define the cake cutting center table design style.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {cakeTableOptions.map(opt => (
                <label
                  key={opt.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    borderRadius: "8px",
                    border: cakeTable === opt.name ? "2px solid var(--gold)" : "1px solid var(--border)",
                    backgroundColor: cakeTable === opt.name ? "rgba(201, 168, 76, 0.05)" : "white",
                    cursor: "pointer",
                    gap: "12px"
                  }}
                >
                  <input
                    type="radio"
                    name="cakeTable"
                    checked={cakeTable === opt.name}
                    onChange={() => setCakeTable(opt.name)}
                  />
                  <div>
                    <div style={{ fontWeight: "600", color: "var(--navy)" }}>{opt.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "8px" }}>Name Board Customization</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>Personalise with an LED Neon Light Name Board (e.g. "Happy Birthday Priya" or "Aarav weds Sneha").</p>
            
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="radio" checked={needLed === "Yes"} onChange={() => setNeedLed("Yes")} /> Yes, add Neon LED Board
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="radio" checked={needLed === "No"} onChange={() => setNeedLed("No")} /> No, standard cardboard/board
              </label>
            </div>

            {needLed === "Yes" && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" }}>LED Neon Text Details:</label>
                <input
                  type="text"
                  placeholder='e.g., "Aisha Turns 5" or "Our Anniversary"'
                  value={ledText}
                  onChange={(e) => setLedText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "8px" }}>Photography Services</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>Do you need a photographer to capture these beautiful decorations?</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {photographerOptions.map(opt => (
                <label
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    borderRadius: "8px",
                    border: photographer === opt ? "2px solid var(--gold)" : "1px solid var(--border)",
                    backgroundColor: photographer === opt ? "rgba(201, 168, 76, 0.05)" : "white",
                    cursor: "pointer",
                    gap: "12px"
                  }}
                >
                  <input
                    type="radio"
                    name="photographer"
                    checked={photographer === opt}
                    onChange={() => setPhotographer(opt)}
                  />
                  <div style={{ fontWeight: "600", color: "var(--navy)" }}>{opt}</div>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="event-builder-page" style={{ paddingTop: "calc(var(--navbar-height, 143px) + 24px)", paddingBottom: "60px", paddingLeft: 0, paddingRight: 0, backgroundColor: "#f7f4ef", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="container" style={{ maxWidth: "700px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="tag" style={{ color: "var(--gold)" }}>CREATIVE WORKSHOP</span>
          <h1 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "2.4rem", marginBottom: "8px" }}>
            Customize Your Event Builder
          </h1>
          <p style={{ color: "var(--text-body)" }}>Design your dream celebration step-by-step and send the customization directly to us via WhatsApp.</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="stepper-container">
          <div className="stepper-progress-line" />
          <div 
            className="stepper-progress-fill" 
            style={{ width: `${((step - 1) / (stepsCount - 1)) * 94}%` }} 
          />
          
          {Array.from({ length: stepsCount }, (_, idx) => idx + 1).map(num => (
            <div 
              key={num} 
              className={`step-circle ${step >= num ? "step-circle--active" : ""}`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Stepper Content Card */}
        <div style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "var(--shadow-card)",
          marginBottom: "24px",
          minHeight: "260px"
        }}>
          {renderStepContent()}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              padding: "12px 24px",
              border: "2px solid var(--navy)",
              background: "transparent",
              color: "var(--navy)",
              fontWeight: "600",
              fontSize: "0.8rem",
              borderRadius: "6px",
              cursor: step === 1 ? "not-allowed" : "pointer",
              opacity: step === 1 ? 0.3 : 1
            }}
          >
            ← BACK
          </button>

          {step < stepsCount ? (
            <button
              onClick={handleNext}
              style={{
                padding: "12px 24px",
                background: "var(--navy)",
                color: "white",
                border: "none",
                fontWeight: "600",
                fontSize: "0.8rem",
                borderRadius: "6px",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--gold)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--navy)"}
            >
              CONTINUE →
            </button>
          ) : (
            <button
              onClick={handleSubmitToWhatsApp}
              style={{
                padding: "12px 28px",
                background: "#25D366",
                color: "white",
                border: "none",
                fontWeight: "bold",
                fontSize: "0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(37,211,102,0.3)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#20ba56"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#25D366"}
            >
              SEND TO WHATSAPP 🚀
            </button>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button 
            onClick={() => setCurrentPage("home")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              textDecoration: "underline",
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            Cancel and return to home
          </button>
        </div>

      </div>
    </div>
  );
}
