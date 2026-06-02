import { useEffect, useRef, useState } from "react";

/* ─── Event Decoration Scene ──────────────────────────────────────────────── 
   A pure CSS/SVG animation scene. No heavy 3D library. Fast on mobile & desktop.
   Shows: fairy lights, garland draping in, floating petals, ribbon streamers,
   confetti, gift boxes sliding in, and twinkling stars — like decorators setting
   up a celebration event. Matches the cream / gold / navy theme perfectly.
─────────────────────────────────────────────────────────────────────────── */

const GOLD   = "#c9a84c";
const NAVY   = "#0d1b2a";
const CREAM  = "#f7f4ef";
const GOLD_L = "#e8c97a";
const PINK   = "#f9c6c6";
const LILAC  = "#d9c6f9";
const TEAL   = "#c6f9e8";

/* ── Fairy light bulb positions along two strings ── */
const lightStrings = [
  { bulbs: 12, curve: "top-left",  startDelay: 0   },
  { bulbs: 10, curve: "top-right", startDelay: 0.4 },
];

/* ── Garland swag control points (SVG path) ── */
const garlands = [
  { d: "M0,0 Q25,70 50,20 Q75,70 100,0", color: GOLD,   strokeW: 3, delay: 0   },
  { d: "M0,0 Q25,90 50,30 Q75,90 100,0", color: GOLD_L, strokeW: 2, delay: 0.3 },
];

/* ── Floating elements: petals, ribbons, stars, confetti ── */
const floaters = [
  // petals (leaf-like SVG)
  { type:"petal",   x:8,  y:15, color:PINK,   size:22, dur:9,  delay:0   },
  { type:"petal",   x:82, y:8,  color:LILAC,  size:18, dur:11, delay:1.5 },
  { type:"petal",   x:45, y:5,  color:GOLD_L, size:20, dur:8,  delay:3   },
  { type:"petal",   x:20, y:30, color:TEAL,   size:16, dur:12, delay:0.8 },
  { type:"petal",   x:70, y:22, color:PINK,   size:24, dur:10, delay:2.2 },
  { type:"petal",   x:60, y:40, color:GOLD_L, size:14, dur:9,  delay:4   },
  { type:"petal",   x:30, y:55, color:LILAC,  size:18, dur:13, delay:1   },
  // stars
  { type:"star",    x:12, y:20, color:GOLD,   size:18, dur:6,  delay:0.5 },
  { type:"star",    x:88, y:15, color:GOLD_L, size:14, dur:7,  delay:1.8 },
  { type:"star",    x:50, y:12, color:GOLD,   size:20, dur:8,  delay:0.2 },
  { type:"star",    x:75, y:38, color:GOLD_L, size:12, dur:5,  delay:3.1 },
  { type:"star",    x:25, y:45, color:GOLD,   size:16, dur:7,  delay:2   },
  // ribbons (thin lines that rotate and drift)
  { type:"ribbon",  x:5,  y:10, color:GOLD,   size:30, dur:10, delay:0.6 },
  { type:"ribbon",  x:90, y:25, color:LILAC,  size:24, dur:12, delay:2.5 },
  { type:"ribbon",  x:60, y:5,  color:PINK,   size:28, dur:9,  delay:1.2 },
  { type:"ribbon",  x:35, y:50, color:TEAL,   size:20, dur:11, delay:3.5 },
  // confetti squares
  { type:"confetti",x:15, y:5,  color:GOLD,   size:8,  dur:8,  delay:0.3 },
  { type:"confetti",x:40, y:8,  color:PINK,   size:6,  dur:9,  delay:1.1 },
  { type:"confetti",x:65, y:3,  color:LILAC,  size:10, dur:7,  delay:2.0 },
  { type:"confetti",x:80, y:12, color:TEAL,   size:7,  dur:10, delay:0.7 },
  { type:"confetti",x:22, y:18, color:GOLD_L, size:8,  dur:11, delay:3.4 },
  { type:"confetti",x:55, y:20, color:PINK,   size:6,  dur:8,  delay:1.9 },
];

/* ── Gift boxes that slide in from sides ── */
const gifts = [
  { side:"left",  x:-15, y:72, w:56, h:60, bodyColor:"#f7e9c8", lidColor:GOLD,   ribbonColor:NAVY,  delay:0.5  },
  { side:"right", x:110, y:78, w:44, h:48, bodyColor:"#e8d5f5", lidColor:LILAC,  ribbonColor:GOLD,  delay:1.2  },
  { side:"left",  x:-10, y:80, w:36, h:38, bodyColor:"#c6f9e8", lidColor:TEAL,   ribbonColor:NAVY,  delay:2.0  },
];

/* ── Decoration poles (like event frame sides) ── */
const poles = [
  { x:3,  topY:0, botY:100, color:GOLD   },
  { x:97, topY:0, botY:100, color:GOLD   },
];

/* ─── SVG Star ────────────────────────────────────────────────────────────── */
function StarSvg({ color, size }) {
  const half = size / 2;
  const pts  = Array.from({ length: 5 }).map((_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    const ai = ((i * 72 + 36) - 90) * (Math.PI / 180);
    return `${half + half * 0.9 * Math.cos(a)},${half + half * 0.9 * Math.sin(a)} ${half + half * 0.38 * Math.cos(ai)},${half + half * 0.38 * Math.sin(ai)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <polygon points={pts} fill={color} opacity="0.85" />
    </svg>
  );
}

/* ─── SVG Petal ───────────────────────────────────────────────────────────── */
function PetalSvg({ color, size }) {
  const s = size;
  return (
    <svg width={s} height={s * 1.5} viewBox="0 0 40 60" style={{ overflow: "visible" }}>
      <ellipse cx="20" cy="30" rx="14" ry="26" fill={color} opacity="0.75"
        transform="rotate(-20 20 30)" />
      <line x1="20" y1="10" x2="20" y2="50" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ─── SVG Ribbon ──────────────────────────────────────────────────────────── */
function RibbonSvg({ color, size }) {
  return (
    <svg width={size * 0.3} height={size} viewBox="0 0 10 40" style={{ overflow: "visible" }}>
      <path d="M5,0 Q10,10 5,20 Q0,30 5,40" stroke={color} strokeWidth="2.5"
        fill="none" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

/* ─── SVG Gift Box ────────────────────────────────────────────────────────── */
function GiftSvg({ w, h, bodyColor, lidColor, ribbonColor }) {
  const lidH = h * 0.25;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      {/* Body */}
      <rect x="0" y={lidH} width={w} height={h - lidH} fill={bodyColor} rx="3"
        stroke={ribbonColor} strokeWidth="1.5" opacity="0.9" />
      {/* Lid */}
      <rect x="-3" y="0" width={w + 6} height={lidH + 2} fill={lidColor} rx="3"
        stroke={ribbonColor} strokeWidth="1.5" opacity="0.9" />
      {/* Vertical ribbon */}
      <rect x={w / 2 - 4} y="0" width="8" height={h} fill={ribbonColor} opacity="0.35" />
      {/* Horizontal ribbon */}
      <rect x="0" y={lidH - 4} width={w} height="8" fill={ribbonColor} opacity="0.35" />
      {/* Bow */}
      <ellipse cx={w / 2 - 8} cy={lidH / 2} rx="8" ry="5"
        fill={ribbonColor} opacity="0.7" transform={`rotate(-20 ${w / 2 - 8} ${lidH / 2})`} />
      <ellipse cx={w / 2 + 8} cy={lidH / 2} rx="8" ry="5"
        fill={ribbonColor} opacity="0.7" transform={`rotate(20 ${w / 2 + 8} ${lidH / 2})`} />
      <circle cx={w / 2} cy={lidH / 2} r="5" fill={ribbonColor} opacity="0.9" />
    </svg>
  );
}

/* ─── Fairy Light Bulb ────────────────────────────────────────────────────── */
function FairyBulb({ x, y, color, delay, size = 8 }) {
  return (
    <g style={{ animation: `bulbGlow ${1.8 + delay * 0.3}s ${delay}s ease-in-out infinite alternate` }}>
      {/* Wire drop */}
      <line x1={x} y1={0} x2={x} y2={y} stroke="#888" strokeWidth="0.8" opacity="0.4" />
      {/* Glow halo */}
      <circle cx={x} cy={y} r={size * 1.6} fill={color} opacity="0.12" />
      {/* Bulb body */}
      <ellipse cx={x} cy={y} rx={size * 0.55} ry={size * 0.72} fill={color} opacity="0.9" />
      {/* Bulb cap */}
      <rect x={x - size * 0.28} y={y - size * 0.72 - size * 0.25} width={size * 0.56}
        height={size * 0.3} fill="#aaa" rx="1" opacity="0.7" />
    </g>
  );
}

/* ─── Garland SVG Path ────────────────────────────────────────────────────── */
function GarlandPath({ d, color, strokeW, totalLen }) {
  return (
    <path d={d} fill="none" stroke={color} strokeWidth={strokeW}
      strokeLinecap="round" opacity="0.65"
      style={{
        strokeDasharray: totalLen,
        strokeDashoffset: totalLen,
        animation: `garlandDraw 2.4s 0.2s cubic-bezier(.4,0,.2,1) forwards`
      }}
    />
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function Celebration3DCanvas() {
  const [mounted, setMounted] = useState(false);
  const svgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
        y: ((e.clientY - rect.top ) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const parallax = (factor) => ({
    transform: `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`,
    transition: "transform 0.8s cubic-bezier(.4,0,.2,1)",
  });

  return (
    <div style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", overflow: "hidden",
      zIndex: 3,
    }}>
      {/* ── Keyframe CSS injected once ── */}
      <style>{`
        @keyframes bulbGlow {
          0%   { opacity:.55; filter: drop-shadow(0 0 2px #c9a84c); }
          100% { opacity:1;   filter: drop-shadow(0 0 8px #e8c97a) drop-shadow(0 0 14px #c9a84c80); }
        }
        @keyframes garlandDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0)   rotate(0deg)  opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes driftDown {
          0%   { transform: translateY(-30px) rotate(0deg); opacity:0; }
          8%   { opacity: 1; }
          90%  { opacity: .8; }
          100% { transform: translateY(110vh) rotate(720deg); opacity:0; }
        }
        @keyframes sway {
          0%,100% { transform: translateX(0) rotate(-6deg); }
          50%      { transform: translateX(14px) rotate(6deg); }
        }
        @keyframes giftSlideLeft {
          0%   { transform: translateX(0%); opacity:0; }
          40%  { opacity: 1; }
          100% { transform: translateX(80px); }
        }
        @keyframes giftSlideRight {
          0%   { transform: translateX(0%); opacity:0; }
          40%  { opacity: 1; }
          100% { transform: translateX(-80px); }
        }
        @keyframes poleGrow {
          0%   { transform: scaleY(0); transform-origin: bottom; opacity:0; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity:1; }
        }
        @keyframes twinkle {
          0%,100% { opacity:.3; transform:scale(.8)  rotate(0deg); }
          50%      { opacity:1;  transform:scale(1.2) rotate(180deg); }
        }
        @keyframes ribbonDrift {
          0%   { transform:translateY(0) rotate(0deg); opacity:0; }
          10%  { opacity:.85; }
          100% { transform:translateY(105vh) rotate(540deg); opacity:0; }
        }
        @keyframes confettiFall {
          0%   { transform:translateY(-5%) rotate(0deg) scaleX(1);  opacity:0; }
          10%  { opacity:.9; }
          50%  { transform:translateY(50vh) rotate(300deg) scaleX(-1); }
          100% { transform:translateY(108vh) rotate(720deg) scaleX(1); opacity:0; }
        }
        @keyframes petalFloat {
          0%   { transform:translate(0,0) rotate(0deg) scale(.8); opacity:0; }
          8%   { opacity:.85; }
          100% { transform:translate(30px,110vh) rotate(-320deg) scale(1.1); opacity:0; }
        }
        @keyframes bowDecor {
          0%,100% { transform: scale(1) rotate(-3deg); }
          50%      { transform: scale(1.07) rotate(3deg); }
        }
      `}</style>

      {/* ── SVG canvas ── */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        {/* === DECORATION POLES === */}
        {poles.map((p, i) => (
          <g key={i} style={{ animation: `poleGrow 0.8s ${i * 0.25}s ease-out both` }}>
            {/* Pole */}
            <rect x={p.x - 0.7} y={p.topY} width={1.4} height={p.botY - p.topY}
              rx="0.7" fill={`url(#poleGrad${i})`} opacity="0.55" />
            {/* Top finial ball */}
            <circle cx={p.x} cy={p.topY + 1.5} r="2" fill={GOLD} opacity="0.8" />
            {/* Gradient defs */}
            <defs>
              <linearGradient id={`poleGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor={GOLD} stopOpacity="0.6" />
                <stop offset="50%"  stopColor={GOLD_L} stopOpacity="0.9" />
                <stop offset="100%" stopColor={GOLD} stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </g>
        ))}

        {/* === TOP GARLAND SWAG === */}
        <g style={parallax(-1.5)}>
          {/* Main garland from pole to pole */}
          <path
            d="M3,2 Q20,28 35,18 Q50,30 65,18 Q80,28 97,2"
            fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round"
            opacity="0.6"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 300,
              animation: "garlandDraw 2.6s 0.3s cubic-bezier(.4,0,.2,1) forwards"
            }}
          />
          {/* Leaf bunches along garland */}
          {[15, 35, 50, 65, 82].map((cx, i) => {
            const cy = i === 0 ? 16 : i === 4 ? 16 : i === 2 ? 27 : 22;
            return (
              <g key={i}
                style={{
                  animation: `garlandDraw 0.5s ${0.9 + i * 0.2}s ease-out both`,
                  strokeDasharray: 30, strokeDashoffset: 30
                }}
              >
                <circle cx={cx} cy={cy} r="2.4" fill={GOLD_L} opacity="0.55"
                  style={{ animation: `twinkle ${3 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }} />
              </g>
            );
          })}
          {/* Second inner garland */}
          <path
            d="M5,1 Q25,22 50,26 Q75,22 95,1"
            fill="none" stroke={GOLD_L} strokeWidth="1.2" strokeLinecap="round"
            opacity="0.35"
            style={{
              strokeDasharray: 280,
              strokeDashoffset: 280,
              animation: "garlandDraw 2.8s 0.6s cubic-bezier(.4,0,.2,1) forwards"
            }}
          />
        </g>

        {/* === FAIRY LIGHTS STRING (top-left loop) === */}
        <g style={parallax(-2)}>
          {/* Wire */}
          <path d="M0,4 Q15,12 30,8 Q45,14 60,10"
            fill="none" stroke="#aaa" strokeWidth="0.5" opacity="0.3" />
          {/* Bulbs */}
          {[5, 12, 19, 27, 36, 46, 55].map((bx, i) => {
            const by = i % 2 === 0 ? 7 : 10;
            const colors2 = [GOLD, GOLD_L, PINK, LILAC, TEAL, GOLD, GOLD_L];
            return (
              <FairyBulb key={i} x={bx} y={by} color={colors2[i % colors2.length]}
                delay={i * 0.25} size={3.5} />
            );
          })}
        </g>

        {/* === FAIRY LIGHTS STRING (top-right loop) === */}
        <g style={parallax(-2)}>
          <path d="M40,6 Q55,14 70,9 Q85,15 100,6"
            fill="none" stroke="#aaa" strokeWidth="0.5" opacity="0.3" />
          {[42, 50, 58, 67, 76, 86, 95].map((bx, i) => {
            const by = i % 2 === 0 ? 9 : 12;
            const colors3 = [GOLD_L, PINK, GOLD, TEAL, LILAC, GOLD_L, GOLD];
            return (
              <FairyBulb key={i} x={bx} y={by} color={colors3[i % colors3.length]}
                delay={0.4 + i * 0.2} size={3.2} />
            );
          })}
        </g>

        {/* === BOW DECORATION at top-center === */}
        <g transform="translate(50,0)" style={parallax(-3)}>
          <g style={{ animation: "bowDecor 4s ease-in-out infinite" }}>
            {/* Left bow lobe */}
            <ellipse cx="-9" cy="5" rx="10" ry="5" fill={GOLD} opacity="0.7"
              transform="rotate(-25 -9 5)" />
            {/* Right bow lobe */}
            <ellipse cx="9" cy="5" rx="10" ry="5" fill={GOLD} opacity="0.7"
              transform="rotate(25 9 5)" />
            {/* Centre knot */}
            <circle cx="0" cy="5.5" r="3.5" fill={GOLD_L} opacity="0.9" />
            {/* Left tail */}
            <path d="M-2,7 Q-14,20 -10,28" stroke={GOLD} strokeWidth="2"
              fill="none" strokeLinecap="round" opacity="0.65" />
            {/* Right tail */}
            <path d="M2,7 Q14,20 10,28" stroke={GOLD} strokeWidth="2"
              fill="none" strokeLinecap="round" opacity="0.65" />
          </g>
        </g>

        {/* === CORNER BOW ACCENTS === */}
        {[
          { x:5,  y:0,  rx:1,   ry:-1  },
          { x:95, y:0,  rx:-1,  ry:-1  },
        ].map((c, i) => (
          <g key={i} transform={`translate(${c.x},${c.y}) scale(${c.rx},${c.ry})`}
            style={{ animation: `poleGrow 0.7s ${0.6 + i * 0.3}s ease-out both` }}>
            <ellipse cx="-5" cy="5" rx="6" ry="3.2" fill={GOLD} opacity="0.55"
              transform="rotate(-25 -5 5)" />
            <ellipse cx="5"  cy="5" rx="6" ry="3.2" fill={GOLD} opacity="0.55"
              transform="rotate(25 5 5)" />
            <circle  cx="0"  cy="5.5" r="2.5" fill={GOLD_L} opacity="0.9" />
          </g>
        ))}
      </svg>

      {/* ── DOM-layer: animated floaters (petals, stars, ribbons, confetti) ── */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {floaters.map((f, i) => {
          const animation = f.type === "ribbon"   ? `ribbonDrift  ${f.dur}s ${f.delay}s linear infinite`
            : f.type === "confetti" ? `confettiFall ${f.dur}s ${f.delay}s linear infinite`
            : f.type === "star"     ? `driftDown    ${f.dur}s ${f.delay}s linear infinite`
            : /* petal */             `petalFloat   ${f.dur}s ${f.delay}s linear infinite`;

          return (
            <div key={i} style={{
              position:"absolute",
              left: `${f.x}%`,
              top:  `${f.y}%`,
              animation,
              opacity: 0,
              willChange: "transform, opacity",
              ...parallax(f.type === "star" ? -4 : -2),
            }}>
              {f.type === "star"     && <StarSvg   color={f.color} size={f.size} />}
              {f.type === "petal"    && <PetalSvg  color={f.color} size={f.size} />}
              {f.type === "ribbon"   && <RibbonSvg color={f.color} size={f.size} />}
              {f.type === "confetti" && (
                <div style={{
                  width:  f.size,
                  height: f.size * 0.55,
                  background: f.color,
                  borderRadius: "1px",
                  opacity: 0.8,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── DOM-layer: gift boxes sliding in from sides ── */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {gifts.map((g, i) => (
          <div key={i} style={{
            position: "absolute",
            left:     `${g.x}%`,
            top:      `${g.y}%`,
            animation: g.side === "left"
              ? `giftSlideLeft  1.2s ${g.delay}s cubic-bezier(.34,1.56,.64,1) forwards`
              : `giftSlideRight 1.2s ${g.delay}s cubic-bezier(.34,1.56,.64,1) forwards`,
            opacity: 0,
            willChange: "transform, opacity",
            ...parallax(3),
          }}>
            <GiftSvg w={g.w} h={g.h} bodyColor={g.bodyColor}
              lidColor={g.lidColor} ribbonColor={g.ribbonColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
