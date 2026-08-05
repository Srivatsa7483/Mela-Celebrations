import { useState, useEffect, useRef, useContext } from "react";
import { DesignContext } from "../context/DesignContext.jsx";
import { OrderContext } from "../context/OrderContext.jsx";
import "./GalleryPage.css";

function formatPrice(p) {
    return "₹" + p.toLocaleString("en-IN");
}

export const getParentCategory = (id) => {
    const mapping = {
        // Birthday subcategories
        "wall-decorations": "birthday",
        "kids-theme": "birthday",
        "jungle-theme": "birthday",
        "superman-theme": "birthday",
        "cars-theme": "birthday",
        "mickey-theme": "birthday",
        "football-theme": "birthday",
        "boss-baby-theme": "birthday",
        "space-theme": "birthday",
        "construction-theme": "birthday",
        "aeroplane-theme": "birthday",
        "paw-patrol-theme": "birthday",
        "car-boot-decorations": "birthday",
        "first-birthday-decorations": "birthday",
        
        // Decorations subcategories
        "decorations-anniversary": "decorations",
        "baby-shower-decorations": "decorations",
        "welcome-baby-decorations": "decorations",
        "naming-ceremony-decorations": "decorations",
        "room-decorations": "decorations",
        "haldi-decorations": "decorations",
        "retirement-party-decorations": "decorations",
        "bachelorette-party-decorations": "decorations",
        "first-night-decorations": "decorations",
        "valentines-decorations": "decorations",
        "mothers-decorations": "decorations",
        
        // Anniversary subcategories
        "simple-anniversary": "anniversary",
        "romantic-room": "anniversary",
        "premium-luxury": "anniversary",
        
        // Festival subcategories
        "new-year": "festival",
        "republic-day": "festival",
        "independence-day": "festival",
        "diwali": "festival",
        "navaratri": "festival",
        "ganesh-festival": "festival",
        "halloween": "festival",
        "christmas": "festival",

        // Flower Decoration subcategories
        "house-warming": "flower",
        "chhapara": "flower",
        "naming-ceremony": "flower",
        "baby-shower": "flower",
        "welcome-baby": "flower",

        // Kids Activities subcategories
        "male-emcee": "kidsactivities",
        "female-emcee": "kidsactivities",
        "magician": "kidsactivities",
        "tattoo": "kidsactivities",
        "arts-crafts": "kidsactivities",
        "clay-modelling": "kidsactivities",
        "mascot": "kidsactivities",
        "caricature": "kidsactivities",
        "balloon-sculptor": "kidsactivities",
        "bouncy-castle": "kidsactivities",
        "trampoline": "kidsactivities",
        "face-painting": "kidsactivities",
        "balloon-shooting": "kidsactivities",
        "ball-pool": "kidsactivities",
        "hoopla": "kidsactivities",
        "angry-bird": "kidsactivities",
        "pebble-painting": "kidsactivities",
        "sweet-corn-counter": "kidsactivities",
        "archery": "kidsactivities",
        "cotton-candy": "kidsactivities",
        "chocolate-fountain": "kidsactivities",
        "popcorn-stall": "kidsactivities",
        "sweet-corn-stall": "kidsactivities",
        "ice-gola": "kidsactivities",
    };
    return mapping[id] || id;
};

const keywordMapping = {
    "wall-decorations": ["wall", "balloon arch", "bedroom", "background"],
    "jungle-theme": ["jungle", "safari", "forest"],
    "superman-theme": ["super hero", "superman", "hero"],
    "cars-theme": ["cars theme", "lightning mcqueen", "racing car", "cars birthday"],
    "mickey-theme": ["mickey", "mouse"],
    "football-theme": ["football", "soccer"],
    "boss-baby-theme": ["boss baby"],
    "space-theme": ["space", "astronaut", "planet"],
    "construction-theme": ["construction", "builder"],
    "aeroplane-theme": ["aeroplane", "airplane", "flight"],
    "paw-patrol-theme": ["paw patrol", "dog"],
    "car-boot-decorations": ["carboot", "car boot", "car surprise"],
    "first-birthday-decorations": ["1st", "first birthday", "turns 1", "welcome baby"],
    
    "decorations-anniversary": ["anniversary", "jubilee"],
    "baby-shower-decorations": ["baby shower", "shower"],
    "welcome-baby-decorations": ["welcome baby", "baby welcome"],
    "naming-ceremony-decorations": ["naming ceremony", "naming"],
    "room-decorations": ["room", "bedroom", "indoor"],
    "haldi-decorations": ["haldi", "mehendi", "yellow"],
    "retirement-party-decorations": ["retirement", "retire"],
    "bachelorette-party-decorations": ["bachelorette", "bride to be", "hen party"],
    "first-night-decorations": ["first night", "romantic room", "bed surprise"],
    "valentines-decorations": ["valentine", "love", "heart"],
    "mothers-decorations": ["mother", "mom"],
    
    "simple-anniversary": ["simple", "minimalist"],
    "romantic-room": ["room", "bedroom", "intimate"],
    "premium-luxury": ["premium", "luxury", "royal", "grand", "palace"],
    
    "new-year": ["new year", "countdown"],
    "republic-day": ["republic", "tricolor"],
    "independence-day": ["independence", "freedom"],
    "diwali": ["diwali", "marigold", "festival", "traditional"],
    "navaratri": ["navaratri", "dandiya"],
    "ganesh-festival": ["ganesh", "ganpati"],
    "halloween": ["halloween", "spooky"],
    "christmas": ["christmas", "santa", "snow"],
    "house-warming": ["house warming", "housewarming", "griha", "pravesh"],

    // Kids Activities subcategories
    "male-emcee": ["male emcee", "male host", "anchor"],
    "female-emcee": ["female emcee", "female host", "anchor"],
    "magician": ["magician", "magic show", "magic"],
    "tattoo": ["tattoo", "airbrush tattoo"],
    "arts-crafts": ["arts and crafts", "art & craft", "craft"],
    "clay-modelling": ["clay modelling", "clay modeling", "playdough"],
    "mascot": ["mascot", "costume character", "cartoon character"],
    "caricature": ["caricature", "caricature artist", "cartoon drawing"],
    "balloon-sculptor": ["balloon sculptor", "balloon twisting", "balloon animal", "balloon art"],
    "bouncy-castle": ["bouncy castle", "bounce house", "jumping castle", "inflatable"],
    "trampoline": ["trampoline", "bouncing"],
    "face-painting": ["face painting", "face paint"],
    "balloon-shooting": ["balloon shooting", "balloon dart", "dart game"],
    "ball-pool": ["ball pool", "ball pit", "ball pit pool"],
    "hoopla": ["hoopla", "ring toss"],
    "angry-bird": ["angry bird", "angry birds game"],
    "pebble-painting": ["pebble painting", "stone painting", "rock painting"],
    "sweet-corn-counter": ["sweet corn counter", "corn counter"],
    "archery": ["archery", "bow and arrow"],
    "cotton-candy": ["cotton candy", "candy floss", "cotton candy stall"],
    "chocolate-fountain": ["chocolate fountain", "chocolate fondue"],
    "popcorn-stall": ["popcorn stall", "popcorn counter"],
    "sweet-corn-stall": ["sweet corn stall", "sweet corn"],
    "ice-gola": ["ice gola", "gola", "shaved ice", "ice candy"]
};

const matchSubcategory = (design, subId) => {
    // If the design has an explicit subcategory set in the database/JSON,
    // match strictly on that and do NOT fall back to keyword scanning.
    if (design.subcategory !== undefined) {
        return design.subcategory === subId;
    }
    
    // Legacy fallback only for old seed designs without a subcategory field
    const text = (design.name + " " + design.description + " " + design.categoryName).toLowerCase();
    const keywords = keywordMapping[subId];
    if (!keywords) return false;
    
    return keywords.some(kw => text.includes(kw));
};

export default function GalleryPage({ setCurrentPage, setSelectedDesign, activeCategory, setActiveCategory, activeSubcategory, setActiveSubcategory, searchQuery, setSearchQuery, navigateToProduct }) {
    const { designs, categories } = useContext(DesignContext);
    const { wishlist, toggleWishlist } = useContext(OrderContext);
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef({});
    const gridRef = useRef(null);

    // Advanced Filter states
    const [genderFilter, setGenderFilter] = useState("all");
    const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [sortBy, setSortBy] = useState("relevance");
    const [isSortOpen, setIsSortOpen] = useState(false);

    const showThemeFilter = getParentCategory(activeCategory) === "birthday" || getParentCategory(activeCategory) === "kidsactivities";

    useEffect(() => {
        if (!showThemeFilter) {
            setGenderFilter("all");
        }
    }, [activeCategory, showThemeFilter]);

    // Get subcategories for currently selected main category
    const getSubcategoryPills = () => {
        const cat = allCats.find(c => c.id === activeCategory);
        if (!cat || !cat.dropdown) return [];
        const pills = [];
        cat.dropdown.forEach(item => {
            pills.push({ id: item.id, label: item.label, price: item.price });
            if (item.dropdown) {
                item.dropdown.forEach(sub => {
                    pills.push({ id: sub.id, label: `${item.label} → ${sub.label}`, price: sub.price });
                });
            }
        });
        return pills;
    };

    const sortOptions = [
        { value: "relevance", label: "Relevance" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" }
    ];
    const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || "Relevance";

    const allCats = categories;

    // Helper to dynamically resolve banner header title, description and background image
    const getGalleryHeaderDetails = () => {
        let title = "Event Gallery";
        let subtitle = "Explore our curated collection of event themes and decorations.";
        let image = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=85";

        // Resolve main parent category if a subcategory is active
        let targetCategory = activeCategory;
        if (activeSubcategory && activeSubcategory !== "all") {
            targetCategory = getParentCategory(activeSubcategory);
        } else if (activeCategory && activeCategory !== "all") {
            const parent = getParentCategory(activeCategory);
            if (parent) {
                targetCategory = parent;
            }
        }

        if (targetCategory && targetCategory !== "all") {
            // Hardcode / override image specifically for the birthday category
            if (targetCategory === "birthday") {
                title = "Birthday Decorations";
                subtitle = "Explore our curated selection of premium birthday setups.";
                image = "/birthday-banner.jpg";
                return { title, subtitle, image };
            }

            // Hardcode / override image specifically for the anniversary category
            if (targetCategory === "anniversary") {
                title = "Anniversary Decorations";
                subtitle = "Explore our curated selection of premium anniversary setups.";
                image = "/anniversary-banner.jpg";
                return { title, subtitle, image };
            }

            // Hardcode / override image specifically for the kidsactivities category
            if (targetCategory === "kidsactivities") {
                title = "Kids Activities";
                subtitle = "Explore our curated selection of fun and engaging kids activities.";
                image = "/kids-banner.jpg";
                return { title, subtitle, image };
            }

            // Hardcode / override image specifically for the flower category
            if (targetCategory === "flower") {
                title = "Flower Decorations";
                subtitle = "Explore our curated selection of fresh and premium flower setups.";
                image = "/flower-banner.jpg";
                return { title, subtitle, image };
            }

            // Hardcode / override image specifically for the festival category
            if (targetCategory === "festival") {
                title = "Festival Decor";
                subtitle = "Explore our curated selection of grand festive and seasonal decor.";
                image = "/festive-banner.jpg";
                return { title, subtitle, image };
            }

            // Hardcode / override image specifically for the corporate category
            if (targetCategory === "corporate") {
                title = "Corporate Events";
                subtitle = "Explore our curated selection of professional corporate event setups.";
                image = "/corporate-banner.jpg";
                return { title, subtitle, image };
            }

            // For other categories, resolve dynamically from categories list
            const cat = categories.find(c => c.id === targetCategory);
            if (cat) {
                title = cat.name;
                subtitle = `Explore our curated selection of premium ${cat.name.toLowerCase()} setups.`;
                if (cat.image) image = cat.image;
                return { title, subtitle, image };
            }
        }

        return { title, subtitle, image };
    };

    const headerDetails = getGalleryHeaderDetails();

    // Boy / Girl theme classifiers based on name/description keywords
    const isBoyTheme = (d) => {
        const text = (d.name + " " + d.description + " " + d.categoryName).toLowerCase();
        return text.includes("boy") || text.includes("super hero") || text.includes("safari") || text.includes("space") || text.includes("blue") || text.includes("carboot") || text.includes("corporate") || text.includes("jungle");
    };

    const isGirlTheme = (d) => {
        const text = (d.name + " " + d.description + " " + d.categoryName).toLowerCase();
        return text.includes("girl") || text.includes("unicorn") || text.includes("princess") || text.includes("pink") || text.includes("peppa") || text.includes("frozen") || text.includes("butterfly") || text.includes("rose") || text.includes("ruby");
    };

    const matchesMainCategory = (design, catId) => {
        if (Array.isArray(design.categories) && design.categories.length > 0) {
            return design.categories.includes(catId);
        }
        return design.category === catId;
    };

    const matchesSubcategory = (design, subId) => {
        if (Array.isArray(design.subcategories) && design.subcategories.length > 0) {
            return design.subcategories.includes(subId);
        }
        if (design.subcategory) {
            return design.subcategory === subId;
        }
        return matchSubcategory(design, subId);
    };

    const filtered = designs.filter((d) => {
        let matchCat = false;
        
        if (activeCategory === "all") {
            matchCat = true;
        } else if (activeCategory === "decorations") {
            matchCat = matchesMainCategory(d, "decorations");
        } else if (activeCategory === "kids-theme") {
            const kidsSubcategories = [
                "jungle-theme", "superman-theme", "cars-theme", 
                "mickey-theme", "football-theme", "boss-baby-theme", 
                "space-theme", "construction-theme", "aeroplane-theme", "paw-patrol-theme"
            ];
            matchCat = matchesMainCategory(d, "birthday") && (
                matchesSubcategory(d, "kids-theme") ||
                kidsSubcategories.some(subId => matchesSubcategory(d, subId))
            );
        } else if (activeCategory in keywordMapping) {
            const parentCat = getParentCategory(activeCategory);
            matchCat = matchesMainCategory(d, parentCat) && matchesSubcategory(d, activeCategory);
        } else {
            matchCat = matchesMainCategory(d, activeCategory);
        }

        // If a subcategory is active, filter designs matching that subcategory
        if (activeSubcategory && activeCategory !== "all") {
            const parentCat = getParentCategory(activeSubcategory);
            // Only apply the filter if the subcategory actually belongs to the current activeCategory
            // Prevents stale activeSubcategory from overriding when switching categories
            if (parentCat === activeCategory) {
                if (activeSubcategory === "decorations-anniversary") {
                    matchCat = matchesMainCategory(d, "decorations") && matchesSubcategory(d, "decorations-anniversary");
                } else {
                    matchCat = matchesMainCategory(d, parentCat) && matchesSubcategory(d, activeSubcategory);
                }
            }
        }

        const searchStr = searchQuery || "";
        const matchSearch = d.name.toLowerCase().includes(searchStr.toLowerCase()) ||
            d.categoryName.toLowerCase().includes(searchStr.toLowerCase());

        // Gender theme filters
        let matchGender = true;
        if (genderFilter === "boy") matchGender = isBoyTheme(d);
        else if (genderFilter === "girl") matchGender = isGirlTheme(d);

        // Discounts
        let matchDiscount = true;
        if (showDiscountsOnly) {
            matchDiscount = d.originalPrice && d.originalPrice > d.price;
        }

        // Favorites
        let matchFav = true;
        if (showFavoritesOnly) {
            matchFav = wishlist.map(String).includes(String(d.id));
        }

        return matchCat && matchSearch && matchGender && matchDiscount && matchFav;
    });

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0; // default / relevance
    });

    useEffect(() => {
        if (activeCategory && activeCategory !== "all") {
            const timer = setTimeout(() => {
                if (gridRef.current) {
                    gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
            return () => clearTimeout(timer);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [activeCategory]);

    useEffect(() => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    setVisibleCards((prev) => new Set([...prev, e.target.dataset.id]));
                }
            });
        }, { threshold: 0.1 });

        Object.values(cardRefs.current).forEach((el) => { if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, [sorted.length]);

    return (
        <div className="gallery-page">
            {/* Page Header */}
            <div className="gallery-page__header" style={{ backgroundImage: `url(${headerDetails.image})` }}>
                <div className="gallery-page__header-overlay"></div>
                <div className="container gallery-page__header-content">
                    <span className="tag animate-fade-in" style={{ color: "rgba(255,255,255,0.7)" }}>OUR PORTFOLIO</span>
                    <h1 className="gallery-page__title animate-fade-up delay-1">{headerDetails.title}</h1>
                    <p className="gallery-page__sub animate-fade-up delay-2">{headerDetails.subtitle}</p>
                </div>
            </div>

            <div className="container">
                {/* Advanced Filters Layout */}
                <div className="filter-bar-container">
                    {/* Search */}
                    <div className="gallery-page__search-wrap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--navy)" }}>
                            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            className="gallery-page__search"
                            placeholder="What are you celebrating? (e.g. Birthday)"
                            value={searchQuery || ""}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-bar-actions">
                        {/* Gender Filters */}
                        {showThemeFilter && (
                            <div className="filter-group">
                                <span className="filter-label">Theme:</span>
                                <div className="filter-buttons">
                                    {["all", "boy", "girl"].map((g) => (
                                        <button
                                            key={g}
                                            className={`filter-btn ${genderFilter === g ? "active" : ""}`}
                                            onClick={() => setGenderFilter(g)}
                                        >
                                            {g === "all" ? "All" : g + "s"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Offer Checkboxes */}
                        <div className="filter-group checkboxes">
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={showDiscountsOnly}
                                    onChange={(e) => setShowDiscountsOnly(e.target.checked)}
                                />
                                <span className="checkbox-text">⚡ Offers</span>
                            </label>
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={showFavoritesOnly}
                                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                                />
                                <span className="checkbox-text">❤️ Favorites ({wishlist.length})</span>
                            </label>
                        </div>

                        {/* Sorting Dropdown */}
                        <div className="filter-group sort-group">
                            <span className="filter-label">Sort:</span>
                            <div className="sort-dropdown-wrap">
                                <button
                                    className={`sort-toggle ${isSortOpen ? "open" : ""}`}
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                >
                                    <span>{currentSortLabel}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="sort-icon">
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </button>
                                {isSortOpen && (
                                    <>
                                        <div 
                                            className="sort-backdrop"
                                            onClick={() => setIsSortOpen(false)}
                                        />
                                        <div className="sort-menu">
                                            {sortOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`sort-option ${sortBy === opt.value ? "active" : ""}`}
                                                    onClick={() => {
                                                        setSortBy(opt.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subcategory Pills — shown when selected category has subcategories */}
                {(() => {
                    const subPills = getSubcategoryPills();
                    if (subPills.length === 0) return null;
                    const isKids = activeCategory === "kidsactivities";
                    return (
                        <div className="gallery-page__subcats">
                            <div className="gallery-page__subcats-label">
                                {isKids ? "🎉 Available Activities & Pricing" : "📌 Browse by Type"}
                            </div>
                            <div className="gallery-page__subcats-pills">
                                <button
                                    className={`gallery-page__subcat-pill${!activeSubcategory ? " active" : ""}`}
                                    onClick={() => setActiveSubcategory(null)}
                                >
                                    All
                                </button>
                                {subPills.map(sub => (
                                    <button
                                        key={sub.id}
                                        className={`gallery-page__subcat-pill${activeSubcategory === sub.id ? " active" : ""} ${isKids ? "kids-pill" : ""}`}
                                        onClick={() => setActiveSubcategory(sub.id)}
                                        style={sub.price ? { display: "inline-flex", justifyContent: "space-between", alignItems: "center", gap: "8px" } : {}}
                                    >
                                        <span>{sub.label}</span>
                                        {sub.price && <span style={{ fontWeight: "600", color: "var(--gold)" }}>₹{sub.price}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Grid */}
                <div className="gallery-page__grid">
                    {sorted.length === 0 && (
                        <div className="gallery-page__empty" style={{ width: "100%", gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>
                            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No designs matches your search criteria. Try broadening your filters.</p>
                        </div>
                    )}
                    {sorted.map((d, i) => {
                        const isVis = visibleCards.has(String(d.id));
                        const isLiked = wishlist.map(String).includes(String(d.id));
                        return (
                            <div
                                key={d.id}
                                data-id={String(d.id)}
                                ref={(el) => { cardRefs.current[d.id] = el; }}
                                className={`gcard${isVis ? " gcard--visible" : ""}`}
                                style={{ "--delay": `${(i % 3) * 0.1}s` }}
                            >
                                <div className="gcard__img-wrap" style={{ position: "relative" }}>
                                    {d.badge && <span className="gcard__badge">{d.badge}</span>}
                                    
                                    {/* Wishlist Heart Icon overlay */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(d.id);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: "12px",
                                            right: "12px",
                                            backgroundColor: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "32px",
                                            height: "32px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                            zIndex: 5,
                                            transition: "transform 0.2s"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                                        title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill={isLiked ? "#e63946" : "none"} 
                                            stroke={isLiked ? "#e63946" : "currentColor"} 
                                            strokeWidth="2.5"
                                        >
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </button>

                                    <img src={d.image} alt={d.name} className="gcard__img" onClick={() => navigateToProduct(d.id)} />
                                    <div className="gcard__view-overlay" onClick={() => navigateToProduct(d.id)}>
                                        <span>View Details</span>
                                    </div>
                                </div>
                                <div className="gcard__body">
                                    <span className="gcard__cat">{d.categoryName}</span>
                                    <h3 className="gcard__name">{d.name}</h3>
                                    <p className="gcard__desc">{d.description}</p>
                                    <div className="gcard__footer">
                                        <div className="gcard__price">
                                            <span className="gcard__from">From</span>
                                            <div style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
                                                <span className="gcard__amount">{formatPrice(d.price)}</span>
                                                {d.originalPrice && d.originalPrice > d.price && (
                                                    <span style={{ fontSize: "0.75rem", textDecoration: "line-through", color: "var(--text-muted)" }}>
                                                        {formatPrice(d.originalPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className="gcard__btn"
                                            onClick={() => { setSelectedDesign(d); setCurrentPage("order"); }}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}