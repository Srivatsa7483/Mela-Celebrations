import { createContext, useState, useEffect } from "react";
import { categories as staticCategories, designs as staticDesigns } from "../data/index.js";
import { getCategories, getDesigns, createDesign, deleteDesign, updateDesign } from "../services/designService.js";
import { getRecentProjects, createRecentProject, deleteRecentProject } from "../services/recentProjectsService.js";

export const DesignContext = createContext();

const staticRecentProjects = [
  {
    id: 1,
    title: "Pastel Pink Canopy Forest",
    category: "birthday",
    venue: "Whitefield Clubhouse, Bangalore",
    date: "May 12, 2026",
    desc: "A massive balloon archway in rose gold and matte pink with custom LED name boards.",
    image: "/b1.jpg",
    review: "Absolutely stunning! The kids loved the double arch sequin wall. Highly recommend! - Priya S.",
    cost: "₹18,500"
  },
  {
    id: 2,
    title: "Safari Animal Kingdom Kids Setup",
    category: "birthday",
    venue: "Prestige Ferns Residency, Bangalore",
    date: "April 28, 2026",
    desc: "Organic forest balloon combinations with standing cardboard giraffe and lion cutouts.",
    image: "/b2.jpg",
    review: "Very professional team. They finished the setup 1 hour before the party. - Rakesh K.",
    cost: "₹24,000"
  },
  {
    id: 3,
    title: "Golden Sequin Candlelight Romance",
    category: "anniversary",
    venue: "Sheraton Grand, Whitefield",
    date: "May 08, 2026",
    desc: "Glittering sequin walls draped with warm fairy lights and custom rose bouquets.",
    image: "/a1.jpg",
    review: "The candlelight dinner setup was magical. My wife was completely surprised! - Amit V.",
    cost: "₹15,000"
  },
  {
    id: 4,
    title: "Royal Golden Glow Anniversary",
    category: "anniversary",
    venue: "Private Villa, HSR Layout",
    date: "May 18, 2026",
    desc: "Elegant gold metallic balloons with premium white rose floral arrangements.",
    image: "/a2.jpg",
    review: "Splendid execution. The floral arches looked and smelled incredibly fresh. - Divya N.",
    cost: "₹21,000"
  },
  {
    id: 5,
    title: "Luxury Car Boot Surprise Setup",
    category: "decorations",
    venue: "Phoenix Marketcity Parking, Mahadevapura",
    date: "April 15, 2026",
    desc: "Custom surprise banner mounted on sedan trunk with LED lights and heart helium balloons.",
    image: "/c1.jpg",
    review: "Perfect surprise! The photos came out amazing. Very quick setup. - Nikhil P.",
    cost: "₹6,500"
  },
  {
    id: 6,
    title: "Enchanted Garden Baby Shower Canopy",
    category: "decorations",
    venue: "Acro House, Indiranagar",
    date: "May 02, 2026",
    desc: "Delicate pastel green canopy with butterfly clips and paper flower clusters.",
    image: "/b3.jpg",
    review: "Exactly like the Pinterest references we shared. Loved every detail! - Sneha M.",
    cost: "₹19,000"
  }
];

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState(staticDesigns);
  const [categories, setCategories] = useState(staticCategories);
  const [recentProjects, setRecentProjects] = useState(staticRecentProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 20-second timeout to handle sleeping Render servers
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Database connection timed out. Your Render backend server might still be waking up (Render free tier sleeps after 15 mins of inactivity) or the configured backend URL is unreachable. Please wait a moment and refresh.")), 20000)
        );

        const [dbDesigns, dbCategories, dbRecentProjects] = await Promise.race([
          Promise.all([
            getDesigns(),
            getCategories(),
            getRecentProjects(),
          ]),
          timeoutPromise
        ]);

        const cleanedCategories = dbCategories.map(cat => {
          if (cat.id === "kidsactivities") {
            const { dropdown, ...rest } = cat;
            return rest;
          }
          return cat;
        });
        setDesigns(dbDesigns);
        setCategories(cleanedCategories);
        setRecentProjects(dbRecentProjects);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch designs, categories, or recent projects from database:", err);
        
        // Only use static fallback in development; in production, fail explicitly so connection issues are obvious
        if (import.meta.env.DEV) {
          console.warn("Using static fallback data in development mode.");
          setError(null); // Clear error in dev to allow static fallback to load without blocking the dashboard
        } else {
          setError(err.message);
          setDesigns([]);
          setCategories([]);
          setRecentProjects([]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const createDesignAction = async (newDesign) => {
    try {
      const created = await createDesign(newDesign);
      setDesigns((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Error creating design:", err);
      throw err;
    }
  };

  const deleteDesignAction = async (designId) => {
    try {
      await deleteDesign(designId);
      // designId can be numeric or string, handle both comparisons
      setDesigns((prev) => prev.filter((d) => String(d.id) !== String(designId)));
    } catch (err) {
      console.error("Error deleting design:", err);
      throw err;
    }
  };

  const updateDesignAction = async (designId, updatedData) => {
    try {
      const updated = await updateDesign(designId, updatedData);
      setDesigns((prev) =>
        prev.map((d) => (String(d.id) === String(designId) ? updated : d))
      );
      return updated;
    } catch (err) {
      console.error("Error updating design:", err);
      throw err;
    }
  };

  const createRecentProjectAction = async (newProj) => {
    try {
      const created = await createRecentProject(newProj);
      setRecentProjects((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Error creating recent project:", err);
      throw err;
    }
  };

  const deleteRecentProjectAction = async (projId) => {
    try {
      await deleteRecentProject(projId);
      setRecentProjects((prev) => prev.filter((p) => String(p.id) !== String(projId)));
    } catch (err) {
      console.error("Error deleting recent project:", err);
      throw err;
    }
  };

  return (
    <DesignContext.Provider
      value={{
        designs,
        categories,
        recentProjects,
        loading,
        error,
        createDesignAction,
        deleteDesignAction,
        updateDesignAction,
        createRecentProjectAction,
        deleteRecentProjectAction,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}
