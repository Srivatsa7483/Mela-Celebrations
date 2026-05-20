import { useState } from "react";

export default function RecentGalleryPage({ setCurrentPage }) {
  const [filter, setFilter] = useState("all");

  const completedProjects = [
    {
      id: 1,
      title: "Pastel Pink Canopy Forest",
      category: "birthday",
      venue: "Whitefield Clubhouse, Bangalore",
      date: "May 12, 2026",
      desc: "A massive balloon archway in rose gold and matte pink with custom LED name boards.",
      image: "/b1.jpg",
      review: "Absolutely stunning! The kids loved the double arch sequin wall. Highly recommend! - Priya S.",
      cost: "₹18,500"
    },
    {
      id: 2,
      title: "Safari Animal Kingdom Kids Setup",
      category: "birthday",
      venue: "Prestige Ferns Residency, Bangalore",
      date: "April 28, 2026",
      desc: "Organic forest balloon combinations with standing cardboard giraffe and lion cutouts.",
      image: "/b2.jpg",
      review: "Very professional team. They finished the setup 1 hour before the party. - Rakesh K.",
      cost: "₹24,000"
    },
    {
      id: 3,
      title: "Golden Sequin Candlelight Romance",
      category: "anniversary",
      venue: "Sheraton Grand, Whitefield",
      date: "May 08, 2026",
      desc: "Glittering sequin walls draped with warm fairy lights and custom rose bouquets.",
      image: "/a1.jpg",
      review: "The candlelight dinner setup was magical. My wife was completely surprised! - Amit V.",
      cost: "₹15,000"
    },
    {
      id: 4,
      title: "Royal Golden Glow Anniversary",
      category: "anniversary",
      venue: "Private Villa, HSR Layout",
      date: "May 18, 2026",
      desc: "Elegant gold metallic balloons with premium white rose floral arrangements.",
      image: "/a2.jpg",
      review: "Splendid execution. The floral arches looked and smelled incredibly fresh. - Divya N.",
      cost: "₹21,000"
    },
    {
      id: 5,
      title: "Luxury Car Boot Surprise Setup",
      category: "surprise",
      venue: "Phoenix Marketcity Parking, Mahadevapura",
      date: "April 15, 2026",
      desc: "Custom surprise banner mounted on sedan trunk with LED lights and heart helium balloons.",
      image: "/c1.jpg",
      review: "Perfect surprise! The photos came out amazing. Very quick setup. - Nikhil P.",
      cost: "₹6,500"
    },
    {
      id: 6,
      title: "Enchanted Garden Baby Shower Canopy",
      category: "babyshower",
      venue: "Acro House, Indiranagar",
      date: "May 02, 2026",
      desc: "Delicate pastel green canopy with butterfly clips and paper flower clusters.",
      image: "/b3.jpg",
      review: "Exactly like the Pinterest references we shared. Loved every detail! - Sneha M.",
      cost: "₹19,000"
    }
  ];

  const filteredProjects = filter === "all" 
    ? completedProjects 
    : completedProjects.filter(p => p.category === filter);

  const startInquiry = (project) => {
    const adminPhone = "918147308985";
    const text = encodeURIComponent(`Hi Mela Celebrations! I saw your recent project: "${project.title}" completed at ${project.venue}. I would like to inquire about a similar setup!`);
    window.open(`https://wa.me/${adminPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="recent-gallery-page" style={{
      padding: "225px 0 60px 0",
      backgroundColor: "#f7f4ef",
      minHeight: "100vh",
      fontFamily: "'Jost', sans-serif"
    }}>
      <div className="container" style={{ maxWidth: "1100px" }}>
        
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="tag" style={{ color: "var(--gold)" }}>COMPLETED PROJECTS</span>
          <h1 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "2.6rem", marginBottom: "16px" }}>
            Our Recent Creations
          </h1>
          <p style={{ color: "var(--text-body)", maxWidth: "600px", margin: "0 auto" }}>
            See real setups completed by our team at venues across Bangalore. Touch or click any setup to ask for availability or customize it for your dates!
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "40px",
          flexWrap: "wrap"
        }}>
          {[
            { id: "all", name: "All Projects" },
            { id: "birthday", name: "Birthdays" },
            { id: "anniversary", name: "Anniversaries" },
            { id: "surprise", name: "Car Boot Surprises" },
            { id: "babyshower", name: "Baby Showers" }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              style={{
                backgroundColor: filter === btn.id ? "var(--navy)" : "white",
                color: filter === btn.id ? "white" : "var(--navy)",
                border: "2px solid var(--navy)",
                padding: "8px 20px",
                borderRadius: "30px",
                fontWeight: "600",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {btn.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "30px"
        }}>
          {filteredProjects.map((proj) => (
            <div 
              key={proj.id}
              className="animate-scale-in"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e2ddd6",
                boxShadow: "var(--shadow-card)",
                transition: "transform 0.3s ease"
              }}
            >
              {/* Image Frame */}
              <div style={{ height: "230px", overflow: "hidden", position: "relative" }}>
                <img src={proj.image} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  backgroundColor: "rgba(13,27,42,0.85)",
                  color: "white",
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  fontWeight: "600"
                }}>
                  {proj.date}
                </span>
                <span style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  backgroundColor: "var(--gold)",
                  color: "var(--navy)",
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  fontWeight: "bold"
                }}>
                  {proj.cost}
                </span>
              </div>

              {/* Details Body */}
              <div style={{ padding: "24px" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold)", fontWeight: "bold" }}>
                  {proj.category}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "1.2rem", margin: "6px 0 10px 0" }}>
                  {proj.title}
                </h3>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
                  📍 {proj.venue}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-body)", marginBottom: "20px" }}>
                  {proj.desc}
                </p>

                {/* Customer Review Quote banner */}
                <div style={{
                  backgroundColor: "#f7f4ef",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  color: "var(--navy)",
                  fontStyle: "italic",
                  borderLeft: "4px solid var(--gold)",
                  marginBottom: "20px"
                }}>
                  "{proj.review}"
                </div>

                {/* WhatsApp Enquiry Button */}
                <button
                  onClick={() => startInquiry(proj)}
                  style={{
                    width: "100%",
                    backgroundColor: "#25D366",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(37,211,102,0.2)"
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm6.069-3.561l.329.195c1.7.1 1.777.962 3.398 1.579l.372.22 3.864-1.012-.414-.24c-1.562-.907-2.613-2.386-3.061-3.125-.333-.55-.034-.847.247-1.123l.805-.83.567-.584-.183-.365c-.138-.276-1.242-2.993-1.703-4.1-.448-1.08-.904-.932-1.243-.932-.32 0-.687-.008-1.054-.008-.368 0-.965.138-1.471.69-.506.552-1.932 1.888-1.932 4.605 0 2.717 1.978 5.342 2.254 5.711.276.368 3.89 5.94 9.424 8.327z"/>
                  </svg>
                  INQUIRE ON WHATSAPP
                </button>

              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <button 
            onClick={() => setCurrentPage("home")}
            style={{
              backgroundColor: "transparent",
              color: "var(--navy)",
              border: "2px solid var(--navy)",
              padding: "12px 30px",
              borderRadius: "30px",
              fontWeight: "600",
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            ← BACK TO HOMEPAGE
          </button>
        </div>

      </div>
    </div>
  );
}
