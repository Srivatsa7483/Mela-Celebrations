import { useState, useEffect, useContext, useRef } from 'react';
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
    const imgWrapRef = useRef(null);

    const design = designs.find(d => String(d.id) === String(productId));
    const isWishlisted = wishlist.map(String).includes(String(productId));
    const images = design
        ? (Array.isArray(design.images) && design.images.length > 0 ? design.images : [design.image])
        : [];
    const related = design
        ? designs.filter(d => d.category === design.category && String(d.id) !== String(productId)).slice(0, 10)
        : [];
    const discount = design ? discountPct(design.originalPrice, design.price) : 0;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveImg(0);
        setIsZoomed(false);
    }, [productId]);

    const handleMouseMove = (e) => {
        if (!imgWrapRef.current) return;
        const rect = imgWrapRef.current.getBoundingClientRect();
        setZoomPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
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

                        {/* Thumbnail strip (desktop + tablet) */}
                        {images.length > 1 && (
                            <div className="pdp-thumbs">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`pdp-thumb${activeImg === i ? ' active' : ''}`}
                                        onClick={() => setActiveImg(i)}
                                        aria-label={`View image ${i + 1}`}
                                    >
                                        <img src={img} alt="" loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main image */}
                        <div
                            ref={imgWrapRef}
                            className={`pdp-img-wrap${isZoomed ? ' zoomed' : ''}`}
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                            style={isZoomed ? { '--ox': `${zoomPos.x}%`, '--oy': `${zoomPos.y}%` } : {}}
                        >
                            {design.badge && (
                                <span className="pdp-badge">{design.badge}</span>
                            )}
                            <img
                                src={images[activeImg] || design.image}
                                alt={design.name}
                                className="pdp-img"
                            />
                            <div className="pdp-zoom-hint">🔍 Hover to zoom</div>
                        </div>

                        {/* Dot indicators (mobile) */}
                        {images.length > 1 && (
                            <div className="pdp-dots">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`pdp-dot${activeImg === i ? ' active' : ''}`}
                                        onClick={() => setActiveImg(i)}
                                        aria-label={`Image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Back link (desktop) */}
                        <button className="pdp-back-link" onClick={() => setCurrentPage('gallery')}>
                            ← Back to Gallery
                        </button>
                    </div>

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
                            { id: 'delivery', label: '🚚 Delivery & Policy' },
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
                        {activeTab === 'delivery' && (
                            <div className="pdp-tab-panel">
                                <div className="pdp-delivery-cards">
                                    {[
                                        { icon: '📍', title: 'Service Area', body: 'We serve Bangalore and surrounding areas within 50km. Contact us for other locations.' },
                                        { icon: '📅', title: 'Booking Window', body: 'Book at least 3 days in advance. For premium packages, 7-day advance booking is recommended.' },
                                        { icon: '🔄', title: 'Cancellation Policy', body: 'Free cancellation up to 48 hours before your event. 50% refund for cancellations within 24 hours.' },
                                        { icon: '💳', title: 'Payment', body: '50% advance payment to confirm booking. Remaining balance due on the day of setup.' },
                                        { icon: '🛡️', title: 'Warranty', body: 'We guarantee on-time arrival and professional setup. If we fail, you get a full refund.' },
                                        { icon: '📸', title: 'Add-Ons Available', body: 'Photography, Videography, Catering coordination, Floral arrangements available as add-ons.' },
                                    ].map((c, i) => (
                                        <div key={i} className="pdp-delivery-card">
                                            <div className="pdp-delivery-card__icon">{c.icon}</div>
                                            <div>
                                                <h4 className="pdp-delivery-card__title">{c.title}</h4>
                                                <p className="pdp-delivery-card__body">{c.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="pdp-tab-panel">
                                <div className="pdp-reviews-summary">
                                    <div className="pdp-reviews-score">
                                        <span className="pdp-reviews-score__num">4.8</span>
                                        <div className="pdp-reviews-score__stars">★★★★★</div>
                                        <span className="pdp-reviews-score__count">Based on 124 bookings</span>
                                    </div>
                                    <div className="pdp-reviews-bars">
                                        {[['5 ★', 78], ['4 ★', 18], ['3 ★', 4], ['2 ★', 0], ['1 ★', 0]].map(([label, pct]) => (
                                            <div key={label} className="pdp-reviews-bar">
                                                <span>{label}</span>
                                                <div className="pdp-bar-track"><div className="pdp-bar-fill" style={{ width: `${pct}%` }} /></div>
                                                <span>{pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pdp-review-cards">
                                    {[
                                        { name: 'Priya Sharma', rating: 5, date: 'April 2025', text: 'Absolutely stunning setup! The team arrived on time and transformed the venue beyond our expectations. Highly recommend Mela Celebrations!', event: 'Anniversary Celebration' },
                                        { name: 'Rahul Mehta', rating: 5, date: 'March 2025', text: 'The decoration was exactly as described and even better in person. Very professional team, very clean work. Will definitely book again!', event: 'Birthday Party' },
                                        { name: 'Deepa Nair', rating: 4, date: 'February 2025', text: 'Beautiful decorations and excellent service. Setup took a little longer than expected but the result was worth the wait.', event: 'Baby Shower' },
                                    ].map((r, i) => (
                                        <div key={i} className="pdp-review-card">
                                            <div className="pdp-review-card__head">
                                                <div className="pdp-review-card__avatar">{r.name[0]}</div>
                                                <div>
                                                    <strong className="pdp-review-card__name">{r.name}</strong>
                                                    <span className="pdp-review-card__event">{r.event} · {r.date}</span>
                                                </div>
                                                <span className="pdp-review-card__stars">{'★'.repeat(r.rating)}</span>
                                            </div>
                                            <p className="pdp-review-card__text">{r.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
