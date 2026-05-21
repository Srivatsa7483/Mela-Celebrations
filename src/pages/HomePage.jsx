import Hero from "../components/home/Hero.jsx";
import Collections from "../components/home/Collections.jsx";
import CategoryStrip from "../components/home/CategoryStrip.jsx";
import Packages from "../components/home/Packages.jsx";
import HowItWorks from "../components/home/HowItWorks.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import { categories, designs } from "../data/index.js";

export default function HomePage({ setCurrentPage, setSelectedDesign, setActiveCategory }) {
    return (
        <main>
            <Hero setCurrentPage={setCurrentPage} />
            
            {/* Scrolling Marquee Below Hero */}
            <div className="homepage__marquee">
                <div className="homepage__marquee-track">
                    <span className="homepage__marquee-item">Customized Balloon Decorations</span>
                    <span className="homepage__marquee-separator">✦</span>
                    <span className="homepage__marquee-item">Premium Luxury Decorations</span>
                    <span className="homepage__marquee-separator">✦</span>
                    <span className="homepage__marquee-item">Balloon Decorations For All Events</span>
                    <span className="homepage__marquee-separator">✦</span>
                    <span className="homepage__marquee-item">Book Your Event In Advance</span>
                    <span className="homepage__marquee-separator">✦</span>
                    <span className="homepage__marquee-item">Complete Event Management</span>
                    <span className="homepage__marquee-separator">✦</span>
                    
                    {/* Duplicate for seamless loop */}
                    <span className="homepage__marquee-item" aria-hidden="true">Customized Balloon Decorations</span>
                    <span className="homepage__marquee-separator" aria-hidden="true">✦</span>
                    <span className="homepage__marquee-item" aria-hidden="true">Premium Luxury Decorations</span>
                    <span className="homepage__marquee-separator" aria-hidden="true">✦</span>
                    <span className="homepage__marquee-item" aria-hidden="true">Balloon Decorations For All Events</span>
                    <span className="homepage__marquee-separator" aria-hidden="true">✦</span>
                    <span className="homepage__marquee-item" aria-hidden="true">Book Your Event In Advance</span>
                    <span className="homepage__marquee-separator" aria-hidden="true">✦</span>
                    <span className="homepage__marquee-item" aria-hidden="true">Complete Event Management</span>
                    <span className="homepage__marquee-separator" aria-hidden="true">✦</span>
                </div>
            </div>

            <Collections setCurrentPage={setCurrentPage} setActiveCategory={setActiveCategory} />

            {/* Dynamic Category Strips */}
            {categories.map(category => {
                const categoryDesigns = designs.filter(d => d.category === category.id);
                
                // Only show a strip if there are designs for this category
                if (categoryDesigns.length === 0) return null;

                return (
                    <CategoryStrip 
                        key={category.id}
                        title={category.name} 
                        categoryId={category.id} 
                        designs={categoryDesigns} 
                        setCurrentPage={setCurrentPage} 
                        setActiveCategory={setActiveCategory}
                        setSelectedDesign={setSelectedDesign}
                    />
                );
            })}

            <Packages setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />
            <HowItWorks />
            <Testimonials />
        </main>
    );
}