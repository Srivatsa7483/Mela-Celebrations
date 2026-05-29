import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { DesignContext } from '../context/DesignContext.jsx';
import { OrderContext } from '../context/OrderContext.jsx';
import './ProductDetailPage.css';

/* ─── Helpers ───────────────────────────────────────────────────── */
function fmt(p) {
    return '₹' + Number(p).toLocaleString('en-IN');
}
function discountPct(orig, cur) {
    if (!orig || orig <= cur) return 0;
    return Math.round(((orig - cur) / orig) * 100);
}

/* ─── Feature Item (reuses inclusion/exclusion logic from DesignModal) ── */
function FeatureItem({ text }) {
    const t = text.trim();
    const isExcl = t.startsWith('!') || /^(x\s|no\s)/i.test(t);
    const clean = isExcl
        ? t.replace(/^(!\s*|x\s+|no\s+)/i, '')
        : t.replace(/^(v\s+|ok\s+)/i, '');
    return (
        <li className={`pdp-feat${isExcl ? ' pdp-feat--excl' : ''}`}>
            <span className="pdp-feat__icon">
                {isExcl ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </span>
            <span className="pdp-feat__text">{clean}</span>
        </li>
    );
}

/* ─── Reviews Panel (real-time from API) ─────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function formatReviewDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function ReviewsPanel({ designId }) {
    const [reviews, setReviews] = useState([]);
    const [loadingRev, setLoadingRev] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [hoverStar, setHoverStar] = useState(0);
    const [form, setForm] = useState({ name: '', event: '', rating: 0, text: '' });

    const fetchReviews = useCallback(async () => {
        setLoadingRev(true);
        try {
            const res = await fetch(`${API_BASE}/api/reviews/${designId}`);
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch {
            setReviews([]);
        } finally {
            setLoadingRev(false);
        }
    }, [designId]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    // Compute rating summary from real data
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
        : '—';
    const barData = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        return { star, pct: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0 };
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating) { alert('Please select a star rating.'); return; }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/reviews/${designId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed');
            setSubmitSuccess(true);
            setForm({ name: '', event: '', rating: 0, text: '' });
            setShowForm(false);
            await fetchReviews();
            setTimeout(() => setSubmitSuccess(false), 4000);
        } catch {
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pdp-tab-panel">
            {/* Rating Summary */}
            <div className="pdp-reviews-summary">
                <div className="pdp-reviews-score">
                    <span className="pdp-reviews-score__num">{avgRating}</span>
                    <div className="pdp-reviews-score__stars">
                        {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ color: parseFloat(avgRating) >= s ? '#c9a84c' : '#ddd' }}>★</span>
                        ))}
                    </div>
                    <span className="pdp-reviews-score__count">
                        {totalReviews > 0 ? `Based on ${totalReviews} review${totalReviews !== 1 ? 's' : ''}` : 'No reviews yet — be the first!'}
                    </span>
                </div>
                <div className="pdp-reviews-bars">
                    {barData.map(({ star, pct }) => (
                        <div key={star} className="pdp-reviews-bar">
                            <span>{star} ★</span>
                            <div className="pdp-bar-track"><div className="pdp-bar-fill" style={{ width: `${pct}%` }} /></div>
                            <span>{pct}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write a Review Button */}
            {submitSuccess && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '14px 20px', marginBottom: '20px', color: '#166534', fontWeight: '600', fontSize: '0.9rem' }}>
                    ✅ Thank you! Your review has been posted successfully.
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                    onClick={() => setShowForm(v => !v)}
                    style={{
                        background: showForm ? 'transparent' : 'var(--navy)',
                        color: showForm ? 'var(--navy)' : '#fff',
                        border: '2px solid var(--navy)',
                        borderRadius: '8px', padding: '10px 22px',
                        fontFamily: 'inherit', fontWeight: '600', fontSize: '0.85rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                >
                    {showForm ? '✕ Cancel' : '✍️ Write a Review'}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: 'var(--cream)', border: '1.5px solid var(--border)',
                    borderRadius: '14px', padding: '28px', marginBottom: '28px',
                }}>
                    <h4 style={{ fontFamily: 'inherit', fontWeight: '700', marginBottom: '20px', color: 'var(--navy)', fontSize: '1rem' }}>Share Your Experience</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="rev-form-grid">
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.8rem', marginBottom: '6px', color: 'var(--text-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Name *</label>
                            <input
                                type="text" required value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. Priya Sharma"
                                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.8rem', marginBottom: '6px', color: 'var(--text-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Event Type</label>
                            <input
                                type="text" value={form.event}
                                onChange={e => setForm(p => ({ ...p, event: e.target.value }))}
                                placeholder="e.g. Birthday Party, Anniversary"
                                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                    </div>
                    {/* Star Picker */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Rating *</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <span
                                    key={s}
                                    onClick={() => setForm(p => ({ ...p, rating: s }))}
                                    onMouseEnter={() => setHoverStar(s)}
                                    onMouseLeave={() => setHoverStar(0)}
                                    style={{
                                        fontSize: '2rem', cursor: 'pointer', lineHeight: 1,
                                        color: (hoverStar || form.rating) >= s ? '#c9a84c' : '#D1D5DB',
                                        transition: 'color 0.15s, transform 0.1s',
                                        transform: (hoverStar || form.rating) >= s ? 'scale(1.2)' : 'scale(1)',
                                    }}
                                >★</span>
                            ))}
                            {form.rating > 0 && (
                                <span style={{ marginLeft: '8px', alignSelf: 'center', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: '600' }}>
                                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Review Text */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '0.8rem', marginBottom: '6px', color: 'var(--text-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Review *</label>
                        <textarea
                            required value={form.text}
                            onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                            placeholder="Tell others about your experience with this decoration setup..."
                            rows={4}
                            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', resize: 'vertical', background: '#fff' }}
                            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                    <button type="submit" disabled={submitting} style={{
                        background: 'var(--navy)', color: '#fff', border: 'none',
                        borderRadius: '8px', padding: '12px 28px',
                        fontFamily: 'inherit', fontWeight: '700', fontSize: '0.9rem',
                        cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                        transition: 'all 0.2s',
                    }}>
                        {submitting ? '⏳ Submitting…' : '📤 Submit Review'}
                    </button>
                </form>
            )}

            {/* Reviews List */}
            {loadingRev ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>Loading reviews…</p>
                </div>
            ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--cream)', borderRadius: '12px' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '10px' }}>⭐</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first to share your experience!</p>
                </div>
            ) : (
                <div className="pdp-review-cards">
                    {reviews.map((r) => (
                        <div key={r.id} className="pdp-review-card">
                            <div className="pdp-review-card__head">
                                <div className="pdp-review-card__avatar">{r.name[0].toUpperCase()}</div>
                                <div>
                                    <strong className="pdp-review-card__name">{r.name}</strong>
                                    <span className="pdp-review-card__event">
                                        {r.event ? `${r.event} · ` : ''}{formatReviewDate(r.createdAt)}
                                    </span>
                                </div>
                                <span className="pdp-review-card__stars">
                                    {[1,2,3,4,5].map(s => (
                                        <span key={s} style={{ color: r.rating >= s ? '#c9a84c' : '#ddd' }}>★</span>
                                    ))}
                                </span>
                            </div>
                            <p className="pdp-review-card__text">{r.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Skeleton Loader ────────────────────────────────────────────── */
function SkeletonLoader() {
    return (
        <div className="pdp-skeleton">
            <div className="container">
                <div className="pdp-skeleton__crumb" />
                <div className="pdp-skeleton__body">
                    <div className="pdp-skeleton__img" />
                    <div className="pdp-skeleton__panel">
                        <div className="pdp-skeleton__tag" />
                        <div className="pdp-skeleton__title" />
                        <div className="pdp-skeleton__title short" />
                        <div className="pdp-skeleton__price" />
                        <div className="pdp-skeleton__line" />
                        <div className="pdp-skeleton__line short" />
                        <div className="pdp-skeleton__line" />
                        <div className="pdp-skeleton__btns" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ProductDetailPage({ productId, setCurrentPage, setSelectedDesign, navigateToProduct }) {
    const { designs, loading } = useContext(DesignContext);
    const { wishlist, toggleWishlist } = useContext(OrderContext);

    const [activeImg, setActiveImg] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [wishAnim, setWishAnim] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIdx, setLightboxIdx] = useState(0);
    const imgWrapRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const openLightbox = (idx) => { setLightboxIdx(idx); setLightboxOpen(true); };
    const closeLightbox = () => setLightboxOpen(false);

    const design = designs.find(d => String(d.id) === String(productId));
    const isWishlisted = wishlist.map(String).includes(String(productId));
    const images = design
        ? (Array.isArray(design.images) && design.images.length > 0 ? design.images : [design.image])
        : [];
    const isSelfAnniversary = design ? (design.category === "anniversary" || (design.category === "decorations" && design.subcategory === "decorations-anniversary")) : false;
    const related = design
        ? designs.filter(d => {
            const isOtherAnniversary = d.category === "anniversary" || (d.category === "decorations" && d.subcategory === "decorations-anniversary");
            if (isSelfAnniversary) {
                return isOtherAnniversary && String(d.id) !== String(productId);
            }
            return d.category === design.category && String(d.id) !== String(productId);
        }).slice(0, 10)
        : [];
    const discount = design ? discountPct(design.originalPrice, design.price) : 0;

    // Lightbox navigation — defined after `images` so images.length is accessible
    const lightboxPrev = () => setLightboxIdx(i => (i - 1 + images.length) % images.length);
    const lightboxNext = () => setLightboxIdx(i => (i + 1) % images.length);

    // Keyboard nav for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const handler = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev();
            if (e.key === 'ArrowRight') lightboxNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightboxOpen, images.length]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveImg(0);
        setIsZoomed(false);
    }, [productId]);

    const handleMouseEnter = () => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        setIsZoomed(true);
    };

    const handleMouseMove = (e) => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (!imgWrapRef.current) return;
        const rect = imgWrapRef.current.getBoundingClientRect();
        setZoomPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!images || images.length <= 1) return;
        const diffX = touchStartX.current - touchEndX.current;
        const threshold = 50; // minimum pixels swept
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swiped left -> show next image
                setActiveImg((prev) => (prev + 1) % images.length);
            } else {
                // Swiped right -> show previous image
                setActiveImg((prev) => (prev - 1 + images.length) % images.length);
            }
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: design.name, text: design.description, url }); return; } catch {}
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const handleWA = () => {
        const msg = encodeURIComponent(`Check out "${design?.name}" on Mela Celebrations:\n${window.location.href}`);
        window.open(`https://wa.me/?text=${msg}`, '_blank');
    };

    /* ── Loading ── */
    if (loading) return <SkeletonLoader />;

    /* ── 404 ── */
    if (!design) {
        return (
            <div className="pdp-notfound">
                <div className="pdp-notfound__emoji">🎭</div>
                <h2 className="pdp-notfound__title">Design Not Found</h2>
                <p className="pdp-notfound__sub">
                    The design you're looking for doesn't exist or may have been removed.
                </p>
                <button className="btn-primary" onClick={() => setCurrentPage('gallery')}>
                    ← Back to Gallery
                </button>
            </div>
        );
    }

    const SERVICE_CARDS = [
        { icon: '🕐', title: 'Setup Time', desc: '2–4 hours before event' },
        { icon: '📍', title: 'Service Area', desc: 'Bangalore & Surroundings' },
        { icon: '🔄', title: 'Cancellation', desc: 'Free cancellation 48 hrs prior' },
        { icon: '✅', title: 'Verified Team', desc: 'Professional, on-time setup' },
    ];

    return (
        <div className="pdp">

            {/* ── Breadcrumb ── */}
            <div className="pdp-crumb">
                <div className="container">
                    <nav className="pdp-crumb__nav" aria-label="Breadcrumb">
                        <button onClick={() => setCurrentPage('home')} className="pdp-crumb__link">Home</button>
                        <span className="pdp-crumb__sep">›</span>
                        <button onClick={() => setCurrentPage('gallery')} className="pdp-crumb__link">Gallery</button>
                        <span className="pdp-crumb__sep">›</span>
                        <button onClick={() => setCurrentPage('gallery')} className="pdp-crumb__link">{design.categoryName}</button>
                        <span className="pdp-crumb__sep">›</span>
                        <span className="pdp-crumb__current">{design.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container">
                <div className="pdp-main">

                    {/* ══════════════ LEFT: GALLERY ══════════════ */}
                    <div className="pdp-gallery">

                        {/* ── PRIMARY IMAGE (always fixed) ── */}
                        <div
                            ref={imgWrapRef}
                            className={`pdp-img-wrap${isZoomed ? ' zoomed' : ''}`}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={isZoomed ? { '--ox': `${zoomPos.x}%`, '--oy': `${zoomPos.y}%` } : {}}
                        >
                            {design.badge && (
                                <span className="pdp-badge">{design.badge}</span>
                            )}
                            <img
                                src={images[0] || design.image}
                                alt={design.name}
                                className="pdp-img"
                                onClick={() => openLightbox(0)}
                                style={{ cursor: 'zoom-in' }}
                            />
                            <div className="pdp-zoom-hint" onClick={() => openLightbox(0)} style={{ cursor: 'pointer' }}>
                                🔍 Click to enlarge
                            </div>
                        </div>

                        {/* ── ALTERNATE THUMBNAILS below primary (only if there are extras) ── */}
                        {images.length > 1 && (
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '12px',
                                flexWrap: 'wrap',
                            }}>
                                {images.slice(1).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => openLightbox(i + 1)}
                                        aria-label={`View alternate image ${i + 1}`}
                                        title={`View image ${i + 2}`}
                                        style={{
                                            width: '76px',
                                            height: '76px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            border: '2px solid #E5E7EB',
                                            cursor: 'pointer',
                                            background: 'none',
                                            padding: 0,
                                            flexShrink: 0,
                                            transition: 'border-color 0.18s, transform 0.18s, box-shadow 0.18s',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = '#FFB300';
                                            e.currentTarget.style.transform = 'scale(1.06)';
                                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,179,0,0.3)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = '#E5E7EB';
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Alternate view ${i + 1}`}
                                            loading="lazy"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                        {/* magnify icon overlay */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(0,0,0,0)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem',
                                            transition: 'background 0.18s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.28)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                                        >
                                        </div>
                                    </button>
                                ))}
                                <p style={{ width: '100%', fontSize: '0.72rem', color: '#9CA3AF', margin: '4px 0 0', lineHeight: 1.4 }}>
                                    +{images.length - 1} more view{images.length - 1 !== 1 ? 's' : ''} · click to enlarge
                                </p>
                            </div>
                        )}

                        {/* Back link (desktop) */}
                        <button className="pdp-back-link" onClick={() => setCurrentPage('gallery')}>
                            ← Back to Gallery
                        </button>
                    </div>


                    {/* ══════════════ LIGHTBOX ══════════════ */}
                    {lightboxOpen && images.length > 0 && (
                        <div
                            className="pdp-lightbox-overlay"
                            onClick={closeLightbox}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Image viewer"
                        >
                            <style>{`
                                .pdp-lightbox-overlay {
                                    position: fixed; inset: 0; z-index: 9999;
                                    background: rgba(0,0,0,0.92);
                                    display: flex; align-items: center; justify-content: center;
                                    animation: lbFadeIn 0.2s ease;
                                }
                                @keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }
                                .pdp-lightbox-inner {
                                    position: relative;
                                    max-width: min(92vw, 860px);
                                    max-height: 90vh;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    gap: 14px;
                                }
                                .pdp-lightbox-img {
                                    max-width: 100%;
                                    max-height: 72vh;
                                    object-fit: contain;
                                    border-radius: 12px;
                                    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
                                    animation: lbSlide 0.2s ease;
                                    display: block;
                                }
                                @keyframes lbSlide { from { opacity:0; transform: scale(0.96) } to { opacity:1; transform: scale(1) } }
                                .pdp-lightbox-close {
                                    position: fixed; top: 18px; right: 22px;
                                    background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.25);
                                    color: #fff; border-radius: 50%;
                                    width: 44px; height: 44px;
                                    font-size: 1.4rem; line-height: 1; cursor: pointer;
                                    display: flex; align-items: center; justify-content: center;
                                    transition: background 0.2s;
                                    backdrop-filter: blur(6px);
                                    z-index: 10000;
                                }
                                .pdp-lightbox-close:hover { background: rgba(255,255,255,0.26); }
                                .pdp-lightbox-arrow {
                                    position: fixed; top: 50%; transform: translateY(-50%);
                                    background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2);
                                    color: #fff; border-radius: 50%;
                                    width: 52px; height: 52px;
                                    font-size: 1.8rem; cursor: pointer;
                                    display: flex; align-items: center; justify-content: center;
                                    transition: background 0.2s, transform 0.2s;
                                    backdrop-filter: blur(6px);
                                    z-index: 10000;
                                    padding: 0;
                                }
                                .pdp-lightbox-arrow:hover { background: rgba(255,255,255,0.24); transform: translateY(-50%) scale(1.1); }
                                .pdp-lightbox-arrow.prev { left: 18px; }
                                .pdp-lightbox-arrow.next { right: 18px; }
                                .pdp-lightbox-counter {
                                    color: rgba(255,255,255,0.8);
                                    font-size: 0.82rem; font-weight: 600; letter-spacing: 0.08em;
                                    background: rgba(0,0,0,0.4);
                                    padding: 5px 16px; border-radius: 20px;
                                    backdrop-filter: blur(4px);
                                }
                                .pdp-lightbox-thumbs {
                                    display: flex; gap: 8px;
                                    max-width: min(92vw, 860px);
                                    overflow-x: auto;
                                    padding: 4px 2px;
                                    scrollbar-width: none;
                                }
                                .pdp-lightbox-thumbs::-webkit-scrollbar { display: none; }
                                .pdp-lightbox-thumb-btn {
                                    flex-shrink: 0; width: 58px; height: 58px;
                                    border-radius: 8px; overflow: hidden;
                                    border: 2.5px solid transparent;
                                    cursor: pointer; background: none; padding: 0;
                                    transition: border-color 0.15s, opacity 0.15s;
                                    opacity: 0.5;
                                }
                                .pdp-lightbox-thumb-btn.active,
                                .pdp-lightbox-thumb-btn:hover { border-color: #FFB300; opacity: 1; }
                                .pdp-lightbox-thumb-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }
                                @media (max-width: 600px) {
                                    .pdp-lightbox-arrow { width: 40px; height: 40px; font-size: 1.4rem; }
                                    .pdp-lightbox-arrow.prev { left: 6px; }
                                    .pdp-lightbox-arrow.next { right: 6px; }
                                    .pdp-lightbox-close { top: 10px; right: 10px; width: 38px; height: 38px; font-size: 1.2rem; }
                                    .pdp-lightbox-img { max-height: 60vh; }
                                    .pdp-lightbox-thumb-btn { width: 46px; height: 46px; }
                                }
                            `}</style>

                            {/* × Close */}
                            <button className="pdp-lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">×</button>

                            {/* ‹ › Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button className="pdp-lightbox-arrow prev" onClick={e => { e.stopPropagation(); lightboxPrev(); }} aria-label="Previous image">‹</button>
                                    <button className="pdp-lightbox-arrow next" onClick={e => { e.stopPropagation(); lightboxNext(); }} aria-label="Next image">›</button>
                                </>
                            )}

                            {/* Content — click inside doesn't close */}
                            <div className="pdp-lightbox-inner" onClick={e => e.stopPropagation()}>

                                {/* Full-size image */}
                                <img
                                    key={lightboxIdx}
                                    src={images[lightboxIdx]}
                                    alt={`${design.name} — image ${lightboxIdx + 1}`}
                                    className="pdp-lightbox-img"
                                />

                                {/* Counter badge */}
                                {images.length > 1 && (
                                    <div className="pdp-lightbox-counter">{lightboxIdx + 1} of {images.length}</div>
                                )}

                                {/* Thumbnail row */}
                                {images.length > 1 && (
                                    <div className="pdp-lightbox-thumbs">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                className={`pdp-lightbox-thumb-btn${i === lightboxIdx ? ' active' : ''}`}
                                                onClick={() => setLightboxIdx(i)}
                                                aria-label={`Go to image ${i + 1}`}
                                            >
                                                <img src={img} alt="" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══════════════ RIGHT: INFO PANEL ══════════════ */}

                    <div className="pdp-info">

                        {/* Category + Badge */}
                        <div className="pdp-info__top">
                            <span className="pdp-cat">{design.categoryName}</span>
                            {design.badge && <span className="pdp-badge-sm">{design.badge}</span>}
                        </div>

                        {/* Title */}
                        <h1 className="pdp-title">{design.name}</h1>

                        {/* Rating */}
                        <div className="pdp-rating">
                            <span className="pdp-stars">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <span key={n} style={{ color: n <= 4 ? '#c9a84c' : '#d0cbc2' }}>★</span>
                                ))}
                            </span>
                            <span className="pdp-rating__txt">4.8 &nbsp;·&nbsp; 124 bookings</span>
                        </div>

                        <div className="pdp-divider" />

                        {/* Price */}
                        <div className="pdp-price-block">
                            <div className="pdp-price-row">
                                <span className="pdp-price">{fmt(design.price)}</span>
                                {design.originalPrice && design.originalPrice > design.price && (
                                    <>
                                        <span className="pdp-orig">{fmt(design.originalPrice)}</span>
                                        <span className="pdp-off-badge">{discount}% OFF</span>
                                    </>
                                )}
                            </div>
                            <p className="pdp-price-note">💡 Price varies with venue size & customizations</p>
                        </div>

                        <div className="pdp-divider" />

                        {/* Description */}
                        <div className="pdp-about">
                            <h3 className="pdp-section-lbl">About This Setup</h3>
                            <p className="pdp-desc">{design.description}</p>
                        </div>

                        {/* Features / Inclusions */}
                        {design.features && design.features.length > 0 && (
                            <div className="pdp-features-wrap">
                                <h3 className="pdp-section-lbl">What's Included</h3>
                                <ul className="pdp-features">
                                    {design.features.map((f, i) => (
                                        <FeatureItem key={i} text={f.trim()} />
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="pdp-divider" />

                        {/* Action Buttons */}
                        <div className="pdp-actions">
                            <button
                                className="pdp-btn-book"
                                onClick={() => { setSelectedDesign(design); setCurrentPage('order'); }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Book This Design
                            </button>
                            <button
                                className={`pdp-btn-wish${isWishlisted ? ' active' : ''}${wishAnim ? ' anim' : ''}`}
                                onClick={() => { toggleWishlist(design.id); setWishAnim(true); setTimeout(() => setWishAnim(false), 500); }}
                                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? '#e63946' : 'none'} stroke={isWishlisted ? '#e63946' : 'currentColor'} strokeWidth="2.5">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                            </button>
                        </div>

                        {/* Service Cards */}
                        <div className="pdp-service-grid">
                            {SERVICE_CARDS.map((c, i) => (
                                <div key={i} className="pdp-service-card">
                                    <span className="pdp-service-card__icon">{c.icon}</span>
                                    <div className="pdp-service-card__body">
                                        <strong>{c.title}</strong>
                                        <span>{c.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Share */}
                        <div className="pdp-share">
                            <span className="pdp-share__lbl">Share:</span>
                            <button className="pdp-share-btn" onClick={handleShare}>
                                {copied ? '✅ Copied!' : '🔗 Copy Link'}
                            </button>
                            <button className="pdp-share-btn pdp-share-btn--wa" onClick={handleWA}>
                                💬 WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* ══════════════ PRODUCT TABS ══════════════ */}
                <div className="pdp-tabs-section">
                    <div className="pdp-tabs">
                        {[
                            { id: 'description', label: '📋 Description' },
                            { id: 'specifications', label: '📐 Specifications' },
                            { id: 'reviews', label: '⭐ Reviews' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                className={`pdp-tab${activeTab === tab.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="pdp-tab-content">
                        {activeTab === 'description' && (
                            <div className="pdp-tab-panel">
                                <p className="pdp-tab-para">{design.description}</p>
                                <p className="pdp-tab-para">
                                    Our professional team handles everything from initial planning to final setup, ensuring your event looks absolutely stunning. Every package is customizable to match your vision and venue requirements.
                                </p>
                                {design.features && design.features.length > 0 && (
                                    <>
                                        <h4 className="pdp-tab-subtitle">Package Inclusions</h4>
                                        <ul className="pdp-tab-list">
                                            {design.features.map((f, i) => <FeatureItem key={i} text={f.trim()} />)}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="pdp-tab-panel">
                                <div className="pdp-specs-table">
                                    {[
                                        { label: 'Category', value: design.categoryName },
                                        { label: 'Starting Price', value: fmt(design.price) },
                                        { label: 'Setup Duration', value: '2–4 hours' },
                                        { label: 'Venue Suitability', value: 'Indoor & Outdoor' },
                                        { label: 'Team Size', value: '2–5 professionals' },
                                        { label: 'Customizable', value: 'Yes — Colors, Themes, Size' },
                                        { label: 'Photography', value: 'Not included (can be added)' },
                                        { label: 'Availability', value: '7 days a week' },
                                    ].map((row, i) => (
                                        <div key={i} className={`pdp-spec-row${i % 2 === 0 ? '' : ' alt'}`}>
                                            <span className="pdp-spec-row__label">{row.label}</span>
                                            <span className="pdp-spec-row__value">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && <ReviewsPanel designId={String(design.id)} />}
                    </div>
                </div>

                {/* ══════════════ RELATED PRODUCTS ══════════════ */}
                {related.length > 0 && (
                    <section className="pdp-related">
                        <div className="pdp-related__head">
                            <h2 className="pdp-related__title">Similar Designs You May Like</h2>
                            <button className="pdp-related__all" onClick={() => setCurrentPage('gallery')}>
                                View All →
                            </button>
                        </div>
                        <div className="pdp-related__track">
                            {related.map(r => {
                                const rDisc = discountPct(r.originalPrice, r.price);
                                return (
                                    <div
                                        key={r.id}
                                        className="pdp-rcard"
                                        onClick={() => navigateToProduct(r.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={e => e.key === 'Enter' && navigateToProduct(r.id)}
                                    >
                                        <div className="pdp-rcard__img-wrap">
                                            {r.badge && <span className="pdp-rcard__badge">{r.badge}</span>}
                                            {rDisc > 0 && <span className="pdp-rcard__off">{rDisc}% off</span>}
                                            <img src={r.image} alt={r.name} className="pdp-rcard__img" loading="lazy" />
                                            <div className="pdp-rcard__overlay">View Details</div>
                                        </div>
                                        <div className="pdp-rcard__body">
                                            <p className="pdp-rcard__cat">{r.categoryName}</p>
                                            <p className="pdp-rcard__name">{r.name}</p>
                                            <div className="pdp-rcard__prices">
                                                <span className="pdp-rcard__price">{fmt(r.price)}</span>
                                                {r.originalPrice && r.originalPrice > r.price && (
                                                    <span className="pdp-rcard__orig">{fmt(r.originalPrice)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* ══════════════ MOBILE STICKY CTA ══════════════ */}
            <div className="pdp-mobile-cta">
                <div className="pdp-mobile-cta__price">
                    <span className="pdp-mobile-cta__from">From</span>
                    <strong className="pdp-mobile-cta__amt">{fmt(design.price)}</strong>
                </div>
                <button
                    className="pdp-mobile-cta__btn"
                    onClick={() => { setSelectedDesign(design); setCurrentPage('order'); }}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}
