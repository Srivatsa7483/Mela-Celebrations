import Hero from "../components/home/Hero.jsx";
import Collections from "../components/home/Collections.jsx";
import Packages from "../components/home/Packages.jsx";
import HowItWorks from "../components/home/HowItWorks.jsx";
import StatsBanner from "../components/home/StatsBanner.jsx";
import Testimonials from "../components/home/Testimonials.jsx";

export default function HomePage({ setCurrentPage, setSelectedDesign }) {
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

            <StatsBanner />
            <Collections setCurrentPage={setCurrentPage} />
            <Packages setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />
            <HowItWorks />
            <Testimonials />
        </main>
    );
}