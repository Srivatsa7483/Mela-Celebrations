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
                    <span>🎈 Customized Balloon Decorations &nbsp;&nbsp;&nbsp;&nbsp; ✨ Premium Luxury Decorations &nbsp;&nbsp;&nbsp;&nbsp; 🎈 Balloon Decorations For All Events &nbsp;&nbsp;&nbsp;&nbsp; 🕒 Book Your Event In Advance &nbsp;&nbsp;&nbsp;&nbsp; 🎉 Complete Event Management &nbsp;&nbsp;&nbsp;&nbsp; 🎈 Customized Balloon Decorations &nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span aria-hidden="true">🎈 Customized Balloon Decorations &nbsp;&nbsp;&nbsp;&nbsp; ✨ Premium Luxury Decorations &nbsp;&nbsp;&nbsp;&nbsp; 🎈 Balloon Decorations For All Events &nbsp;&nbsp;&nbsp;&nbsp; 🕒 Book Your Event In Advance &nbsp;&nbsp;&nbsp;&nbsp; 🎉 Complete Event Management &nbsp;&nbsp;&nbsp;&nbsp; 🎈 Customized Balloon Decorations &nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
            </div>

            <Collections setCurrentPage={setCurrentPage} />

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