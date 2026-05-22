import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function SpinWheelModal({ isOpen, onClose, onWinCoupon }) {
  const { user } = useContext(AuthContext);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [chancesLeft, setChancesLeft] = useState(3);
  const canvasRef = useRef(null);

  const options = [
    { label: "10% OFF", code: "SPINWIN10", color: "#0d1b2a", textColor: "#ffffff" },
    { label: "TRY AGAIN", code: null, color: "#f7f4ef", textColor: "#0d1b2a" },
    { label: "20% OFF", code: "SPINWIN20", color: "#c9a84c", textColor: "#ffffff" },
    { label: "50% OFF ON\nPHOTOGRAPHY", code: "SPINPHOTO50", color: "#1e2e42", textColor: "#ffffff" },
    { label: "TRY AGAIN", code: null, color: "#f7f4ef", textColor: "#0d1b2a" },
    { label: "₹2,000 FLAT OFF", code: "SUPER2", color: "#c9a84c", textColor: "#ffffff" },
  ];

  const numSegments = options.length;
  const segmentAngle = 360 / numSegments;
  let startAngle = 0;
  let spinAngleStart = 10;
  let spinTime = 0;
  let spinTimeTotal = 0;
  let rotationAngle = 0;

  useEffect(() => {
    if (isOpen) {
      drawWheel(0);
      setPrize(null);
      setSpinning(false);
      if (user?.email) {
        const stored = localStorage.getItem(`mela_spin_chances_${user.email}`);
        if (stored !== null) {
          setChancesLeft(parseInt(stored, 10));
        } else {
          localStorage.setItem(`mela_spin_chances_${user.email}`, "3");
          setChancesLeft(3);
        }
      } else {
        setChancesLeft(3);
      }
    }
  }, [isOpen, user]);

  const drawWheel = (angleOffset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    // Draw outer gold ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#c9a84c";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0d1b2a";
    ctx.stroke();

    for (let i = 0; i < numSegments; i++) {
      const angle = (startAngle + angleOffset + (i * segmentAngle)) * Math.PI / 180;
      const endAngle = (startAngle + angleOffset + ((i + 1) * segmentAngle)) * Math.PI / 180;

      // Draw segment slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, endAngle);
      ctx.fillStyle = options[i].color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#e2ddd6";
      ctx.stroke();

      // Text label drawing
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Calculate the middle angle of this segment in degrees (normalized to [0, 360))
      let midAngle = (startAngle + angleOffset + (i * segmentAngle) + (segmentAngle / 2)) % 360;
      if (midAngle < 0) midAngle += 360;
      
      ctx.fillStyle = options[i].textColor;
      const lines = options[i].label.split("\n");
      const isMultiLine = lines.length > 1;

      ctx.font = isMultiLine 
        ? "bold 10px 'Jost', sans-serif" 
        : (options[i].label.length > 15 ? "bold 9px 'Jost', sans-serif" : "bold 12px 'Jost', sans-serif");
      ctx.textBaseline = "middle";
      
      if (midAngle > 90 && midAngle < 270) {
        // Left side of the wheel: flip the text 180 degrees so it's readable (not upside down)
        ctx.rotate(midAngle * Math.PI / 180 + Math.PI);
        ctx.textAlign = "left";
        if (isMultiLine) {
          ctx.fillText(lines[0], -(radius - 12), -6);
          ctx.fillText(lines[1], -(radius - 12), 6);
        } else {
          ctx.fillText(options[i].label, -(radius - 18), 0);
        }
      } else {
        // Right side of the wheel: draw normally
        ctx.rotate(midAngle * Math.PI / 180);
        ctx.textAlign = "right";
        if (isMultiLine) {
          ctx.fillText(lines[0], radius - 12, -6);
          ctx.fillText(lines[1], radius - 12, 6);
        } else {
          ctx.fillText(options[i].label, radius - 18, 0);
        }
      }
      ctx.restore();
    }

    // Draw center gold pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#c9a84c";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  };

  const spin = () => {
    if (spinning || chancesLeft <= 0) return;
    const newChances = chancesLeft - 1;
    setChancesLeft(newChances);
    if (user?.email) {
      localStorage.setItem(`mela_spin_chances_${user.email}`, String(newChances));
    }
    setSpinning(true);
    setPrize(null);
    spinAngleStart = Math.random() * 10 + 15;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // spin for 4-7 seconds
    animateWheel();
  };

  const animateWheel = () => {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      stopRotate();
      return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    rotationAngle += spinAngle;
    drawWheel(rotationAngle);
    requestAnimationFrame(animateWheel);
  };

  const stopRotate = () => {
    setSpinning(false);
    const finalAngle = rotationAngle % 360;
    
    // Canvas arcs start from 0 angle (3 o'clock). Segments go clockwise.
    // The pointer is at 12 o'clock (270 degrees).
    // Let's compute which slice aligns with the indicator at top (270 deg / -90 deg offset)
    const degrees = (270 - finalAngle + 360) % 360;
    const index = Math.floor(degrees / segmentAngle);
    const won = options[index];
    setPrize(won);

    if (won.code) {
      // Save code in localStorage
      localStorage.setItem("mela_spin_won_coupon", won.code);
      if (onWinCoupon) onWinCoupon(won.code);
    }
  };

  const easeOut = (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(13, 27, 42, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      fontFamily: "'Jost', sans-serif",
      padding: "20px",
      overflowY: "auto"
    }}>
      <div className="animate-scale-in" style={{
        backgroundColor: "white",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "460px",
        padding: "30px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        position: "relative",
        textAlign: "center",
        maxHeight: "90vh",
        overflowY: "auto",
        margin: "auto"
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          disabled={spinning}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            border: "none",
            background: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--navy)"
          }}
        >
          ×
        </button>

        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: "8px" }}>
          Spin & Win Offers! 🥳
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "12px" }}>
          Spin the wheel of celebrations to win exclusive packages discount coupons!
        </p>
        <div style={{
          display: "inline-block",
          backgroundColor: "rgba(201, 168, 76, 0.12)",
          color: "var(--gold)",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "0.85rem",
          fontWeight: "700",
          marginBottom: "20px",
          fontFamily: "'Jost', sans-serif"
        }}>
          Spins Remaining: {chancesLeft}
        </div>

        {/* Spinner canvas container */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "24px" }}>
          {/* Top Indicator Arrow */}
          <div style={{
            position: "absolute",
            top: "-15px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderTop: "20px solid #e63946",
            zIndex: 10
          }} />
          <canvas 
            ref={canvasRef} 
            width={320} 
            height={320} 
            style={{ display: "block" }} 
          />
        </div>

        {/* Action Button */}
        <div>
          {!prize ? (
            <button
              onClick={spin}
              disabled={spinning || chancesLeft <= 0}
              style={{
                backgroundColor: (spinning || chancesLeft <= 0) ? "var(--text-muted)" : "var(--navy)",
                color: "white",
                border: "none",
                padding: "14px 40px",
                fontSize: "0.9rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: "600",
                borderRadius: "30px",
                cursor: (spinning || chancesLeft <= 0) ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(13, 27, 42, 0.2)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { if (!spinning && chancesLeft > 0) e.currentTarget.style.backgroundColor = "var(--gold)"; }}
              onMouseLeave={(e) => { if (!spinning && chancesLeft > 0) e.currentTarget.style.backgroundColor = "var(--navy)"; }}
            >
              {spinning ? "Spinning..." : chancesLeft <= 0 ? "No Spins Left" : "SPIN THE WHEEL 🎉"}
            </button>
          ) : (
            <div className="animate-fade-in">
              {prize.code ? (
                <div style={{
                  backgroundColor: "rgba(201, 168, 76, 0.15)",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px dashed var(--gold)",
                  marginBottom: "16px"
                }}>
                  <span style={{ fontSize: "2rem" }}>🎉</span>
                  <h3 style={{ color: "var(--navy)", margin: "8px 0" }}>You Won: {prize.label.replace("\n", " ")}!</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-body)" }}>Use Coupon Code: </p>
                  <div style={{
                    fontFamily: "monospace",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    padding: "6px 12px",
                    display: "inline-block",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    margin: "8px 0",
                    color: "var(--navy)"
                  }}>
                    {prize.code}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>This discount code will be automatically applied at checkout!</p>
                </div>
              ) : (
                <div style={{
                  backgroundColor: "rgba(107, 122, 141, 0.1)",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "16px"
                }}>
                  <span style={{ fontSize: "2rem" }}>😢</span>
                  <h3 style={{ color: "var(--navy)", margin: "8px 0" }}>Hard Luck!</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-body)" }}>
                    {chancesLeft > 0 
                      ? "Don't worry, you can try again!" 
                      : "You have run out of spin attempts!"}
                  </p>
                </div>
              )}
              {chancesLeft > 0 && (
                <button
                  onClick={() => setPrize(null)}
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--navy)",
                    border: "2px solid var(--navy)",
                    padding: "12px 28px",
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    borderRadius: "30px",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                >
                  Try Again
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  backgroundColor: "var(--navy)",
                  color: "white",
                  border: "none",
                  padding: "14px 28px",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  borderRadius: "30px",
                  cursor: "pointer"
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
