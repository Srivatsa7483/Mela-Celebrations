import { useState, useEffect, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import { designs, categories } from "../../data/index.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { OrderContext } from "../../context/OrderContext.jsx";
import "./Navbar.css";

export default function Navbar({ currentPage, setCurrentPage, setActiveCategory, setSearchQuery, countdownText }) {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const { wishlist } = useContext(OrderContext);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeNavbarDropdown, setActiveNavbarDropdown] = useState(null);
    const [activeNavbarSubDropdown, setActiveNavbarSubDropdown] = useState(null);
    const searchRef = useRef(null);
    const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
    const menuDropdownRef = useRef(null);
    // Portal-based dropdown state (escapes overflow clipping)
    const [openDropdownCat, setOpenDropdownCat] = useState(null);
    const [dropdownRect, setDropdownRect] = useState(null);
    const [openSubDropdownId, setOpenSubDropdownId] = useState(null);
    const pillHoverTimer = useRef(null);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
            // Close portal dropdown on scroll so it doesn't float in wrong position
            clearTimeout(pillHoverTimer.current);
            setOpenDropdownCat(null);
            setDropdownRect(null);
            setOpenSubDropdownId(null);
        };
        window.addEventListener("scroll", onScroll);

        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            // Close portal dropdown when clicking outside dropdown or pill
            if (!e.target.closest('.navbar__dropdown') && !e.target.closest('.navbar__pill')) {
                setOpenDropdownCat(null);
                setDropdownRect(null);
                setOpenSubDropdownId(null);
            }
            // Close logo menu dropdown when clicking outside
            if (menuDropdownRef.current && !menuDropdownRef.current.contains(e.target)) {
                setMenuDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const updateNavbarHeight = () => {
            const navbarEl = document.querySelector(".navbar");
            if (navbarEl) {
                let height = navbarEl.offsetHeight;
                const mobileMenuEl = navbarEl.querySelector(".navbar__mobile-menu");
                if (mobileMenuEl) {
                    height -= mobileMenuEl.offsetHeight;
                }
                document.documentElement.style.setProperty("--navbar-height", `${height}px`);
            }
        };

        updateNavbarHeight();
        window.addEventListener("resize", updateNavbarHeight);
        window.addEventListener("orientationchange", updateNavbarHeight);
        const timer = setTimeout(updateNavbarHeight, 100);

        return () => {
            window.removeEventListener("resize", updateNavbarHeight);
            window.removeEventListener("orientationchange", updateNavbarHeight);
            clearTimeout(timer);
        };
    }, [currentPage, countdownText, menuOpen]);



    const suggestions = localSearch.trim() === "" ? [] : designs.filter(d => 
        d.name.toLowerCase().includes(localSearch.toLowerCase()) || 
        d.categoryName.toLowerCase().includes(localSearch.toLowerCase())
    ).slice(0, 5);

    const handleNavClick = (id) => {
        setActiveCategory(id);
        if (setSearchQuery) setSearchQuery("");
        setLocalSearch("");
        setCurrentPage("gallery");
        setMenuOpen(false);
    };

    const handleSearch = (overrideQuery = null) => {
        const query = overrideQuery !== null ? overrideQuery : localSearch;
        if (setSearchQuery) setSearchQuery(query);
        setActiveCategory("all");
        setCurrentPage("gallery");
        setShowSuggestions(false);
    };

    return (
        <header className={`navbar${scrolled ? " navbar--scrolled" : ""}${currentPage === "login" ? " navbar--login" : ""}`}>
            {/* Dynamic Offer Countdown Banner */}
            {countdownText && (
                <div className="offer-countdown-banner" style={{
                    background: 'linear-gradient(90deg, #0d1b2a 0%, #c9a84c 50%, #0d1b2a 100%)',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    width: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    ⚡ Limited Time Offer: Get 20% off with code <strong style={{ color: '#fff', textDecoration: 'underline' }}>MELA20</strong>. Deal ends in: <span style={{ fontFamily: 'monospace', fontWeight: 'bold', background: '#0d1b2a', padding: '2px 8px', borderRadius: '4px', marginLeft: '4px' }}>{countdownText}</span>
                </div>
            )}
            {currentPage !== "login" && (
                <>
                    {/* Top Row: Logo & Actions */}
                    <div className="navbar__inner">
                <div className="navbar__logo-wrapper-container" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button className="navbar__logo" onClick={() => setCurrentPage("home")}>
                        <img src="/logo.png" alt="Mela Celebrations" className="navbar__logo-img" />
                    </button>
                    
                    {/* Menu Bar Icon Dropdown */}
                    <div className="navbar__menu-dropdown-container" ref={menuDropdownRef} style={{ position: "relative" }}>
                        <button 
                            className="navbar__menu-icon-btn"
                            onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
                            aria-label="Toggle Navigation Menu"
                            title="Menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                        
                        {menuDropdownOpen && (
                            <div className="navbar__menu-dropdown">
                                <div className="navbar__menu-dropdown-shortcuts">
                                    <button 
                                        className="navbar__menu-dropdown-item" 
                                        onClick={() => { setCurrentPage("calculator"); setMenuDropdownOpen(false); }}
                                    >
                                        <span className="navbar__menu-dropdown-icon">🧮</span> Budget Calculator
                                    </button>
                                    <button 
                                        className="navbar__menu-dropdown-item" 
                                        onClick={() => { setCurrentPage("customizer"); setMenuDropdownOpen(false); }}
                                    >
                                        <span className="navbar__menu-dropdown-icon">🎨</span> Customize Setup
                                    </button>
                                    <button 
                                        className="navbar__menu-dropdown-item" 
                                        onClick={() => { setCurrentPage("recent-gallery"); setMenuDropdownOpen(false); }}
                                    >
                                        <span className="navbar__menu-dropdown-icon">📸</span> Recent Projects
                                    </button>
                                    <button 
                                        className="navbar__menu-dropdown-item" 
                                        onClick={() => { setCurrentPage("contact"); setMenuDropdownOpen(false); }}
                                    >
                                        <span className="navbar__menu-dropdown-icon">📞</span> Contact Us
                                    </button>
                                </div>
                                <div className="navbar__menu-dropdown-divider" />
                                <div className="navbar__menu-dropdown-account">
                                    <div className="navbar__menu-dropdown-account-title">
                                        👤 Account Profile
                                    </div>
                                    {isAuthenticated ? (
                                        <div className="navbar__menu-dropdown-profile">
                                            <div className="profile-info">
                                                <div className="profile-name">{user?.name || "Customer"}</div>
                                                <div className="profile-email">📧 {user?.email || ""}</div>
                                                {user?.phone && <div className="profile-phone">📞 {user.phone}</div>}
                                            </div>
                                            <div className="profile-actions">
                                                <button 
                                                    className="navbar__pill"
                                                    onClick={() => { setCurrentPage("dashboard"); setMenuDropdownOpen(false); }}
                                                    style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem", height: "34px", padding: "0" }}
                                                >
                                                    Go to Dashboard
                                                </button>
                                                <button 
                                                    className="btn-navy-outline"
                                                    onClick={() => { logout(); setMenuDropdownOpen(false); }}
                                                    style={{ width: "100%", fontSize: "0.75rem", height: "34px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="navbar__menu-dropdown-guest">
                                            <p className="guest-msg">Login to save your progress, manage customized setups, and view wishlist items.</p>
                                            <button 
                                                className="navbar__cta"
                                                onClick={() => { setCurrentPage("login"); setMenuDropdownOpen(false); }}
                                                style={{ width: "100%", display: "flex", justifyContent: "center", height: "36px", padding: "0", alignItems: "center" }}
                                            >
                                                Login / Sign Up
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="navbar__search-container" ref={searchRef}>
                    <input
                        type="text"
                        className="navbar__search-input"
                        placeholder="Search by event, birthday, party..."
                        value={localSearch}
                        onChange={(e) => {
                            setLocalSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                    />
                    <button
                        className="navbar__search-btn"
                        onClick={() => handleSearch()}
                        title="Search"
                    >
                        <svg className="navbar__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="navbar__suggestions">
                            {suggestions.map(s => (
                                <div 
                                    key={s.id} 
                                    className="navbar__suggestion-item"
                                    onClick={() => {
                                        setLocalSearch(s.name);
                                        handleSearch(s.name);
                                    }}
                                >
                                    <img src={s.image} alt={s.name} className="navbar__suggestion-img" />
                                    <div className="navbar__suggestion-info">
                                        <div className="navbar__suggestion-name">{s.name}</div>
                                        <div className="navbar__suggestion-cat">{s.categoryName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="navbar__actions">
                    {/* How It Works Icon */}
                    <div className="navbar__icon-wrapper" data-tooltip="How It Works">
                        <button className="navbar__icon" onClick={() => setCurrentPage("how-it-works")}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </button>
                    </div>

                    {/* Contact Us Icon */}
                    <div className="navbar__icon-wrapper" data-tooltip="Contact Us">
                        <button className="navbar__icon" onClick={() => setCurrentPage("contact")}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </button>
                    </div>

                    {/* Customer Login / Dashboard integration */}
                    {isAuthenticated ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button 
                                className="navbar__pill" 
                                onClick={() => setCurrentPage("dashboard")}
                                style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "6px", 
                                    border: "1px solid var(--gold)", 
                                    background: "rgba(201,168,76,0.08)",
                                    color: "var(--navy)",
                                    fontSize: "0.8rem",
                                    height: "38px"
                                }}
                            >
                                👤 {(user?.name || "User").split(" ")[0]}
                                {wishlist.length > 0 && (
                                    <span style={{ 
                                        background: "#e63946", 
                                        color: "white", 
                                        borderRadius: "50%", 
                                        padding: "2px 6px", 
                                        fontSize: "0.7rem", 
                                        fontWeight: "bold",
                                        marginLeft: "4px"
                                    }}>
                                        {wishlist.length}
                                    </span>
                                )}
                            </button>
                            <button 
                                className="btn-navy-outline" 
                                style={{ padding: "8px 14px", height: "38px", fontSize: "0.75rem" }} 
                                onClick={logout}
                            >
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="btn-navy-outline" 
                            style={{ padding: "8px 20px", height: "38px", fontSize: "0.75rem" }} 
                            onClick={() => setCurrentPage("login")}
                        >
                            LOGIN
                        </button>
                    )}

                    <button
                        className="navbar__cta"
                        onClick={() => setCurrentPage("order")}
                        style={{ height: "38px" }}
                    >
                        CONSULTATION
                    </button>

                    <button
                        className="navbar__hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* ── Mobile-only second row: search + icons + booking ── */}
            <div className="navbar__mobile-search-row">
                <div className="navbar__mobile-search-wrap">
                    <input
                        type="text"
                        className="navbar__search-input"
                        placeholder="Search events, birthday, party..."
                        value={localSearch}
                        onChange={(e) => {
                            setLocalSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                    />
                    <button className="navbar__search-btn" onClick={() => handleSearch()} title="Search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>

                    {/* Mobile Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="navbar__suggestions">
                            {suggestions.map(s => (
                                <div
                                    key={s.id}
                                    className="navbar__suggestion-item"
                                    onClick={() => {
                                        setLocalSearch(s.name);
                                        handleSearch(s.name);
                                    }}
                                >
                                    <img src={s.image} alt={s.name} className="navbar__suggestion-img" />
                                    <div className="navbar__suggestion-info">
                                        <div className="navbar__suggestion-name">{s.name}</div>
                                        <div className="navbar__suggestion-cat">{s.categoryName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Compact icon shortcuts */}
                <div className="navbar__mobile-row-icons">
                    <button className="navbar__icon" onClick={() => setCurrentPage("how-it-works")} title="How It Works">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </button>
                    <button className="navbar__icon" onClick={() => setCurrentPage("contact")} title="Contact Us">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </button>
                    <button className="navbar__cta navbar__mobile-book-btn" onClick={() => setCurrentPage("order")}>
                        CONSULTATION
                    </button>
                </div>
            </div>

            <div className="navbar__bottom">
                <div className="navbar__bottom-inner">
                    {categories.map((cat) => (
                        <div key={cat.id} className="navbar__pill-container" style={{ flexShrink: 0 }}>
                            <button
                                className="navbar__pill"
                                onClick={() => handleNavClick(cat.id)}
                                onMouseEnter={(e) => {
                                    if (!cat.dropdown) return;
                                    clearTimeout(pillHoverTimer.current);
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setOpenDropdownCat(cat);
                                    setDropdownRect(rect);
                                    setOpenSubDropdownId(null);
                                }}
                                onMouseLeave={() => {
                                    pillHoverTimer.current = setTimeout(() => {
                                        setOpenDropdownCat(null);
                                        setDropdownRect(null);
                                        setOpenSubDropdownId(null);
                                    }, 150);
                                }}
                            >
                                {cat.name}
                                {cat.dropdown && (
                                    <span
                                        style={{
                                            fontSize: "0.65rem",
                                            marginLeft: "6px",
                                            display: "inline-block",
                                            transition: "transform 0.2s",
                                            transform: openDropdownCat?.id === cat.id ? "rotate(180deg)" : "rotate(0deg)"
                                        }}
                                    >▼</span>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="navbar__mobile-menu">
                    {categories.map((cat) => (
                        <div key={cat.id}>
                            <button
                                className="navbar__mobile-link"
                                onClick={() => handleNavClick(cat.id)}
                            >
                                {cat.name}
                            </button>
                            {cat.dropdown && (
                                <div className="navbar__mobile-sublinks">
                                    {cat.dropdown.map(sub => (
                                        <div key={sub.id}>
                                            <button
                                                className="navbar__mobile-sublink"
                                                onClick={() => handleNavClick(sub.id)}
                                                style={(sub.dropdown || sub.price) ? { fontWeight: sub.dropdown ? "600" : "400", display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" } : { width: "100%" }}
                                            >
                                                <span>{sub.label}</span>
                                                {sub.price && <span style={{ fontWeight: "600", color: "var(--gold)" }}>₹{sub.price}</span>}
                                            </button>
                                            {sub.dropdown && (
                                                <div className="navbar__mobile-sublinks" style={{ paddingLeft: "12px", borderLeft: "1px dashed var(--border)", marginLeft: "4px" }}>
                                                    {sub.dropdown.map(nested => (
                                                        <button
                                                            key={nested.id}
                                                            className="navbar__mobile-sublink"
                                                            onClick={() => handleNavClick(nested.id)}
                                                        >
                                                            {nested.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="navbar__mobile-link" onClick={() => { setCurrentPage("how-it-works"); setMenuOpen(false); }}>HOW IT WORKS</button>
                    <button className="navbar__cta" style={{ marginTop: "12px", width: "100%", justifyContent: "center" }} onClick={() => { setCurrentPage("order"); setMenuOpen(false); }}>CONSULTATION</button>
                </div>
            )}
                </>
            )}

            {/* ── Category Dropdown Portal ──
                Rendered at document.body so it escapes the overflow-x:auto
                clipping context of .navbar__bottom and always floats above ads.
            */}
            {openDropdownCat && dropdownRect && createPortal(
                <div
                    className="navbar__dropdown"
                    style={{
                        position: 'fixed',
                        top: dropdownRect.bottom + 4,
                        left: Math.max(8, Math.min(dropdownRect.left, window.innerWidth - 260)),
                        opacity: 1,
                        visibility: 'visible',
                        transform: 'translateY(0)',
                        zIndex: 99999,
                        pointerEvents: 'all',
                    }}
                    onMouseEnter={() => clearTimeout(pillHoverTimer.current)}
                    onMouseLeave={() => {
                        pillHoverTimer.current = setTimeout(() => {
                            setOpenDropdownCat(null);
                            setDropdownRect(null);
                            setOpenSubDropdownId(null);
                        }, 150);
                    }}
                >
                    <button
                        className="navbar__dropdown-item"
                        onClick={() => { handleNavClick(openDropdownCat.id); setOpenDropdownCat(null); }}
                        style={{ fontWeight: "700", borderBottom: "1px solid var(--border)", color: "var(--gold)" }}
                    >
                        View All {openDropdownCat.name}
                    </button>

                    {openDropdownCat.dropdown.map(sub => {
                        if (sub.dropdown) {
                            return (
                                <div
                                    key={sub.id}
                                    className="navbar__dropdown-item-wrapper"
                                    style={{ position: 'relative' }}
                                    onMouseEnter={() => {
                                        clearTimeout(pillHoverTimer.current);
                                        setOpenSubDropdownId(sub.id);
                                    }}
                                >
                                    <button
                                        className="navbar__dropdown-item"
                                        onClick={() => { handleNavClick(sub.id); setOpenDropdownCat(null); }}
                                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
                                    >
                                        <span>{sub.label}</span>
                                        <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>▶</span>
                                    </button>
                                    {openSubDropdownId === sub.id && (
                                        <div
                                            className="navbar__sub-dropdown"
                                            style={{
                                                opacity: 1,
                                                visibility: 'visible',
                                                transform: 'translateX(0)',
                                                position: 'absolute',
                                                top: 0,
                                                left: '100%',
                                                zIndex: 100000,
                                            }}
                                        >
                                            {sub.dropdown.map(nested => (
                                                <button
                                                    key={nested.id}
                                                    className="navbar__dropdown-item"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNavClick(nested.id);
                                                        setOpenDropdownCat(null);
                                                    }}
                                                >
                                                    {nested.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        return (
                            <button
                                key={sub.id}
                                className="navbar__dropdown-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavClick(sub.id);
                                    setOpenDropdownCat(null);
                                }}
                                style={sub.price ? { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" } : {}}
                            >
                                <span>{sub.label}</span>
                                {sub.price && <span style={{ fontWeight: "600", color: "var(--gold)" }}>₹{sub.price}</span>}
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </header>
    );
}