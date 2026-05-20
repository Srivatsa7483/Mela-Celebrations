import { useState, useEffect, useRef, useContext } from "react";
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

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            // Close dropdowns when clicking outside the navbar bottom container
            const bottomBar = document.querySelector(".navbar__bottom");
            if (bottomBar && !bottomBar.contains(e.target)) {
                setActiveNavbarDropdown(null);
                setActiveNavbarSubDropdown(null);
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
                <button className="navbar__logo" onClick={() => setCurrentPage("home")}>
                    <img src="/logo.jpg" alt="Mela Celebrations" className="navbar__logo-img" />
                </button>

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
                                👤 {user.name.split(" ")[0]}
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

            <div className="navbar__bottom">
                <div className="navbar__bottom-inner">
                    
                    {/* Core Features / Planning shortcuts */}
                    <button 
                        className="navbar__pill highlight-pill" 
                        onClick={() => setCurrentPage("calculator")}
                        style={{ border: "1px dashed var(--gold)", color: "var(--gold)", fontWeight: "600", whiteSpace: "nowrap" }}
                    >
                        🧮 Calculator
                    </button>
                    <button 
                        className="navbar__pill highlight-pill" 
                        onClick={() => setCurrentPage("customizer")}
                        style={{ border: "1px dashed var(--gold)", color: "var(--gold)", fontWeight: "600", whiteSpace: "nowrap" }}
                    >
                        🎨 Customize Setup
                    </button>
                    <button 
                        className="navbar__pill highlight-pill" 
                        onClick={() => setCurrentPage("recent-gallery")}
                        style={{ border: "1px dashed var(--gold)", color: "var(--gold)", fontWeight: "600", whiteSpace: "nowrap" }}
                    >
                        📸 Recent Projects
                    </button>
                    
                    <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border)", flexShrink: 0, margin: "0 8px" }} />
                    
                    {categories.map((cat) => {
                        const isCatOpen = activeNavbarDropdown === cat.id;
                        return (
                            <div key={cat.id} className={`navbar__pill-container ${cat.dropdown ? 'has-dropdown' : ''}`} style={{ flexShrink: 0 }}>
                                <button
                                    className="navbar__pill"
                                    onClick={(e) => {
                                        if (cat.dropdown) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveNavbarDropdown(isCatOpen ? null : cat.id);
                                            setActiveNavbarSubDropdown(null);
                                        } else {
                                            handleNavClick(cat.id);
                                            setActiveNavbarDropdown(null);
                                            setActiveNavbarSubDropdown(null);
                                        }
                                    }}
                                >
                                    {cat.name}
                                    {cat.dropdown && <span style={{ fontSize: "0.65rem", marginLeft: "6px", transition: "transform 0.2s", display: "inline-block", transform: isCatOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>}
                                </button>

                                {cat.dropdown && (
                                    <div className={`navbar__dropdown${isCatOpen ? ' show' : ''}`}>
                                        <button
                                            className="navbar__dropdown-item"
                                            onClick={() => {
                                                handleNavClick(cat.id);
                                                setActiveNavbarDropdown(null);
                                                setActiveNavbarSubDropdown(null);
                                            }}
                                            style={{ fontWeight: "700", borderBottom: "1px solid var(--border)", color: "var(--gold)" }}
                                        >
                                            View All {cat.name}
                                        </button>
                                        {cat.dropdown.map(sub => {
                                            if (sub.dropdown) {
                                                const isSubOpen = activeNavbarSubDropdown === sub.id;
                                                return (
                                                    <div key={sub.id} className="navbar__dropdown-item-wrapper has-sub-dropdown">
                                                        <button
                                                            className="navbar__dropdown-item"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveNavbarSubDropdown(isSubOpen ? null : sub.id);
                                                            }}
                                                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", fontWeight: isSubOpen ? "600" : "400" }}
                                                        >
                                                            <span>{sub.label}</span>
                                                            <span style={{ fontSize: "0.6rem", opacity: 0.7, transform: isSubOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
                                                        </button>
                                                        <div className={`navbar__sub-dropdown${isSubOpen ? ' show' : ''}`}>
                                                            {sub.dropdown.map(nested => (
                                                                <button
                                                                    key={nested.id}
                                                                    className="navbar__dropdown-item"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleNavClick(nested.id);
                                                                        setActiveNavbarDropdown(null);
                                                                        setActiveNavbarSubDropdown(null);
                                                                    }}
                                                                >
                                                                    {nested.label}
                                                                </button>
                                                            ))}
                                                        </div>
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
                                                        setActiveNavbarDropdown(null);
                                                        setActiveNavbarSubDropdown(null);
                                                    }}
                                                >
                                                    {sub.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="navbar__mobile-menu">
                    {/* Shortcuts */}
                    <button className="navbar__mobile-link" onClick={() => { setCurrentPage("calculator"); setMenuOpen(false); }} style={{ color: "var(--gold)" }}>🧮 BUDGET CALCULATOR</button>
                    <button className="navbar__mobile-link" onClick={() => { setCurrentPage("customizer"); setMenuOpen(false); }} style={{ color: "var(--gold)" }}>🎨 CUSTOMIZE EVENT</button>
                    <button className="navbar__mobile-link" onClick={() => { setCurrentPage("recent-gallery"); setMenuOpen(false); }} style={{ color: "var(--gold)" }}>📸 RECENT PROJECTS</button>
                    <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "8px 0" }} />
                    
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
                                                style={sub.dropdown ? { fontWeight: "600", display: "flex", justifyContent: "space-between", width: "100%" } : { width: "100%" }}
                                            >
                                                {sub.label}
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
                    {isAuthenticated ? (
                        <>
                            <button className="navbar__mobile-link" onClick={() => { setCurrentPage("dashboard"); setMenuOpen(false); }}>👤 MY DASHBOARD ({wishlist.length} SAVED)</button>
                            <button className="navbar__mobile-link" onClick={() => { logout(); setMenuOpen(false); }}>LOGOUT</button>
                        </>
                    ) : (
                        <button className="navbar__mobile-link" onClick={() => { setCurrentPage("login"); setMenuOpen(false); }}>👤 LOGIN</button>
                    )}
                    <button className="navbar__cta" style={{ marginTop: "12px", width: "100%", justifyContent: "center" }} onClick={() => { setCurrentPage("order"); setMenuOpen(false); }}>CONSULTATION</button>
                </div>
            )}
                </>
            )}
        </header>
    );
}