import { useState, useEffect, useRef } from "react";
import { designs } from "../../data/index.js";
import "./Navbar.css";

export default function Navbar({ currentPage, setCurrentPage, setActiveCategory, setSearchQuery }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const categories = [
        {
            id: "birthday",
            label: "Birthday Decorations",
            dropdown: [
                { id: "kids-theme", label: "Kids Theme Decor" },
                { id: "butterfly-theme", label: "Butterfly Theme Decorations" },
                { id: "princess-theme", label: "Princess Theme" }
            ]
        },
        { id: "anniversary", label: "Anniversary Decoration" },
        { id: "carboot", label: "Car Boot Decoration" },
        { id: "candlelight", label: "Candlelight Dinner" },
        { id: "festival", label: "Festival Decorations" },
        { id: "babyshower", label: "Baby Shower" },
        { id: "corporate", label: "Corporate Planner" },
    ];

    // Compute suggestions
    const suggestions = localSearch.trim() === "" ? [] : designs.filter(d => 
        d.name.toLowerCase().includes(localSearch.toLowerCase()) || 
        d.categoryName.toLowerCase().includes(localSearch.toLowerCase())
    ).slice(0, 5);

    const handleNavClick = (id) => {
        // Map specific dropdown sub-categories back to "birthday" for now, or use their specific IDs if you add them to data/index.js
        const baseCategory = ["kids-theme", "butterfly-theme", "princess-theme"].includes(id) ? "birthday" : id;
        setActiveCategory(baseCategory);
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
        <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
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
                    <button className="navbar__icon" title="How It Works" onClick={() => setCurrentPage("how-it-works")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </button>

                    <button
                        className="navbar__cta"
                        onClick={() => setCurrentPage("order")}
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

            {/* Bottom Row: Category Pills */}
            <div className="navbar__bottom">
                <div className="navbar__bottom-inner">
                    {categories.map((cat) => (
                        <div key={cat.id} className={`navbar__pill-container ${cat.dropdown ? 'has-dropdown' : ''}`}>
                            <button
                                className="navbar__pill"
                                onClick={() => handleNavClick(cat.id)}
                            >
                                {cat.label}
                                {cat.dropdown && (
                                    <svg className="navbar__dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {cat.dropdown && (
                                <div className="navbar__dropdown">
                                    {cat.dropdown.map(sub => (
                                        <button
                                            key={sub.id}
                                            className="navbar__dropdown-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNavClick(sub.id);
                                            }}
                                        >
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                                {cat.label}
                            </button>
                            {cat.dropdown && (
                                <div className="navbar__mobile-sublinks">
                                    {cat.dropdown.map(sub => (
                                        <button
                                            key={sub.id}
                                            className="navbar__mobile-sublink"
                                            onClick={() => handleNavClick(sub.id)}
                                        >
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="navbar__mobile-link" onClick={() => { setCurrentPage("how-it-works"); setMenuOpen(false); }}>HOW IT WORKS</button>
                    <button className="navbar__cta" style={{ marginTop: "12px", width: "100%", justifyContent: "center" }} onClick={() => { setCurrentPage("order"); setMenuOpen(false); }}>CONSULTATION</button>
                </div>
            )}
        </header>
    );
}