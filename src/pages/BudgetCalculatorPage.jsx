import { useState } from "react";

export default function BudgetCalculatorPage({ setCurrentPage }) {
  const [decor, setDecor] = useState(10000); // default Deluxe
  const [cakeTable, setCakeTable] = useState(6000); // default Premium Arch
  const [activities, setActivities] = useState({
    magic: false,
    puppet: false,
    facepaint: false,
    mascot: false
  });
  const [media, setMedia] = useState(0); // default None

  const decorOptions = [
    { name: "None", price: 0, desc: "No decoration setup" },
    { name: "Standard (Balloons & Banner)", price: 4000, desc: "A simple, beautiful balloon arch & backdrop." },
    { name: "Deluxe (Pastel Balloons, Backdrop, LED)", price: 10000, desc: "Stunning theme balloons with premium backdrop & sign." },
    { name: "Premium (Grand Canopy, Lights & Floral)", price: 25000, desc: "Extraordinary setups with flowers, drapes & light grids." }
  ];

  const cakeTableOptions = [
    { name: "None", price: 0, desc: "No cake table setup" },
    { name: "Simple Table Setup", price: 2000, desc: "Basic cloth and stand table decorations." },
    { name: "Premium Floral Arch Setup", price: 6000, desc: "Surrounding archway decorated with theme flowers/balloons." },
    { name: "Double Arch Sequin Backdrop", price: 12000, desc: "Luxury double arches with high-gloss sequin backdrops." }
  ];

  const mediaOptions = [
    { name: "None", price: 0, desc: "No media coverage" },
    { name: "Standard Photography (4 hrs)", price: 6000, desc: "Professional high-res digital event photography." },
    { name: "Premium Photo & Video Highlight", price: 14000, desc: "Complete photo coverage + 3min event highlight reel." },
    { name: "Luxury Cinematic Shoot (Drone + Album)", price: 28000, desc: "Cinematography, album, full coverage & aerial drone shots." }
  ];

  const activityPrices = {
    magic: { name: "Magic Show (30 mins)", price: 3500 },
    puppet: { name: "Puppet Show (30 mins)", price: 3000 },
    facepaint: { name: "Face Painting & Tattoos", price: 2000 },
    mascot: { name: "Mascot Character (2 hrs)", price: 2500 }
  };

  const handleActivityToggle = (key) => {
    setActivities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate sum
  const decorPrice = decor;
  const cakePrice = cakeTable;
  const mediaPrice = media;
  const activitiesPrice = Object.keys(activities).reduce((acc, key) => {
    return acc + (activities[key] ? activityPrices[key].price : 0);
  }, 0);

  const grandTotal = decorPrice + cakePrice + mediaPrice + activitiesPrice;

  const handleProceedToBooking = () => {
    // Save selected items in session storage so OrderPage can load it as a custom package
    const customSummary = {
      isCustom: true,
      packageName: "Custom Planned Event",
      packagePrice: grandTotal,
      features: [
        `Decoration: ${decorOptions.find(o => o.price === decor).name}`,
        `Cake Table: ${cakeTableOptions.find(o => o.price === cakeTable).name}`,
        `Media: ${mediaOptions.find(o => o.price === media).name}`,
        ...Object.keys(activities).filter(k => activities[k]).map(k => activityPrices[k].name)
      ],
      details: {
        decorPrice,
        cakePrice,
        mediaPrice,
        activitiesPrice,
        activitiesList: Object.keys(activities).filter(k => activities[k]).map(k => activityPrices[k].name)
      }
    };
    sessionStorage.setItem("mela_custom_package", JSON.stringify(customSummary));
    
    // Redirect to order page with custom design ID trigger
    setCurrentPage("order");
  };

  return (
    <div className="budget-calculator-page" style={{ padding: "225px 0 60px 0", backgroundColor: "#f7f4ef", minHeight: "100vh", fontFamily: "'Jost', sans-serif" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* Title Section */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="tag" style={{ color: "var(--gold)" }}>SMART ESTIMATOR</span>
          <h1 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "2.5rem", marginBottom: "16px" }}>
            Event Budget Estimator
          </h1>
          <p style={{ color: "var(--text-body)", maxWidth: "600px", margin: "0 auto" }}>
            Plan your event budget by choosing individual services. Estimates are updated in real-time and help us understand your specific needs!
          </p>
        </div>

        {/* Content Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>
          
          {/* Options Panels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Decor Tier Card */}
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "var(--shadow-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", margin: 0 }}>🎈 Step 1: Decoration Tier</h3>
                <span style={{ fontWeight: "bold", color: "var(--navy)", fontSize: "1.1rem" }}>
                  ₹{decor.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {decorOptions.map((opt) => (
                  <label 
                    key={opt.name} 
                    style={{
                      display: "flex",
                      padding: "16px",
                      borderRadius: "8px",
                      border: decor === opt.price ? "2px solid var(--gold)" : "1px solid var(--border)",
                      backgroundColor: decor === opt.price ? "rgba(201, 168, 76, 0.05)" : "white",
                      cursor: "pointer",
                      gap: "12px"
                    }}
                  >
                    <input 
                      type="radio" 
                      name="decor" 
                      value={opt.price} 
                      checked={decor === opt.price} 
                      onChange={() => setDecor(opt.price)}
                      style={{ marginTop: "4px" }}
                    />
                    <div>
                      <div style={{ fontWeight: "600", color: "var(--navy)" }}>{opt.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>{opt.desc}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontWeight: "bold", color: "var(--navy)", fontSize: "0.95rem" }}>
                      {opt.price === 0 ? "Free" : `₹${opt.price.toLocaleString("en-IN")}`}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cake Table Card */}
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "var(--shadow-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", margin: 0 }}>🎂 Step 2: Cake Table Decor</h3>
                <span style={{ fontWeight: "bold", color: "var(--navy)", fontSize: "1.1rem" }}>
                  ₹{cakeTable.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {cakeTableOptions.map((opt) => (
                  <label 
                    key={opt.name} 
                    style={{
                      display: "flex",
                      padding: "16px",
                      borderRadius: "8px",
                      border: cakeTable === opt.price ? "2px solid var(--gold)" : "1px solid var(--border)",
                      backgroundColor: cakeTable === opt.price ? "rgba(201, 168, 76, 0.05)" : "white",
                      cursor: "pointer",
                      gap: "12px"
                    }}
                  >
                    <input 
                      type="radio" 
                      name="cakeTable" 
                      value={opt.price} 
                      checked={cakeTable === opt.price} 
                      onChange={() => setCakeTable(opt.price)}
                      style={{ marginTop: "4px" }}
                    />
                    <div>
                      <div style={{ fontWeight: "600", color: "var(--navy)" }}>{opt.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>{opt.desc}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontWeight: "bold", color: "var(--navy)", fontSize: "0.95rem" }}>
                      {opt.price === 0 ? "Free" : `₹${opt.price.toLocaleString("en-IN")}`}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Activities Card */}
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "var(--shadow-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", margin: 0 }}>🎪 Step 3: Entertainment Activities</h3>
                <span style={{ fontWeight: "bold", color: "var(--navy)", fontSize: "1.1rem" }}>
                  ₹{activitiesPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {Object.keys(activityPrices).map((key) => {
                  const item = activityPrices[key];
                  const active = activities[key];
                  return (
                    <label 
                      key={key} 
                      style={{
                        display: "flex",
                        padding: "16px",
                        borderRadius: "8px",
                        border: active ? "2px solid var(--gold)" : "1px solid var(--border)",
                        backgroundColor: active ? "rgba(201, 168, 76, 0.05)" : "white",
                        cursor: "pointer",
                        gap: "10px",
                        alignItems: "center"
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={active} 
                        onChange={() => handleActivityToggle(key)}
                      />
                      <div>
                        <div style={{ fontWeight: "600", color: "var(--navy)", fontSize: "0.9rem" }}>{item.name}</div>
                        <div style={{ fontWeight: "bold", color: "var(--gold)", fontSize: "0.85rem", marginTop: "2px" }}>
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Photography Card */}
            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "var(--shadow-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", margin: 0 }}>📸 Step 4: Photography & Videography</h3>
                <span style={{ fontWeight: "bold", color: "var(--navy)", fontSize: "1.1rem" }}>
                  ₹{media.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {mediaOptions.map((opt) => (
                  <label 
                    key={opt.name} 
                    style={{
                      display: "flex",
                      padding: "16px",
                      borderRadius: "8px",
                      border: media === opt.price ? "2px solid var(--gold)" : "1px solid var(--border)",
                      backgroundColor: media === opt.price ? "rgba(201, 168, 76, 0.05)" : "white",
                      cursor: "pointer",
                      gap: "12px"
                    }}
                  >
                    <input 
                      type="radio" 
                      name="media" 
                      value={opt.price} 
                      checked={media === opt.price} 
                      onChange={() => setMedia(opt.price)}
                      style={{ marginTop: "4px" }}
                    />
                    <div>
                      <div style={{ fontWeight: "600", color: "var(--navy)" }}>{opt.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>{opt.desc}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontWeight: "bold", color: "var(--navy)", fontSize: "0.95rem" }}>
                      {opt.price === 0 ? "Free" : `₹${opt.price.toLocaleString("en-IN")}`}
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Total Summary */}
          <aside style={{ position: "sticky", top: "210px" }}>
            <div style={{
              backgroundColor: "var(--navy)",
              color: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 8px 30px rgba(13,27,42,0.15)"
            }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--gold)", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
                Estimate Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Decoration Base</span>
                  <span style={{ fontWeight: "500" }}>₹{decorPrice.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Cake Table Style</span>
                  <span style={{ fontWeight: "500" }}>₹{cakePrice.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Activities Total</span>
                  <span style={{ fontWeight: "500" }}>₹{activitiesPrice.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Media & Photos</span>
                  <span style={{ fontWeight: "500" }}>₹{mediaPrice.toLocaleString("en-IN")}</span>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.15)", margin: "10px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: "600", fontSize: "1.05rem", color: "var(--gold)" }}>Estimated Total</span>
                  <span style={{ fontWeight: "bold", fontSize: "1.5rem", color: "var(--gold)" }}>
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleProceedToBooking}
                disabled={grandTotal === 0}
                style={{
                  width: "100%",
                  backgroundColor: grandTotal === 0 ? "rgba(255,255,255,0.2)" : "var(--gold)",
                  color: grandTotal === 0 ? "rgba(255,255,255,0.4)" : "var(--navy)",
                  border: "none",
                  padding: "16px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: "24px",
                  cursor: grandTotal === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { if (grandTotal > 0) e.currentTarget.style.backgroundColor = "white"; }}
                onMouseLeave={(e) => { if (grandTotal > 0) e.currentTarget.style.backgroundColor = "var(--gold)"; }}
              >
                PROCEED TO BOOKING →
              </button>
            </div>
            
            <button 
              onClick={() => setCurrentPage("home")}
              style={{
                width: "100%",
                background: "transparent",
                border: "2px solid var(--navy)",
                color: "var(--navy)",
                padding: "12px",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.8rem",
                marginTop: "16px",
                cursor: "pointer"
              }}
            >
              ← Back to Homepage
            </button>
          </aside>

        </div>
        
      </div>
    </div>
  );
}
