import { createContext, useState, useEffect } from "react";
import { getCategories, getDesigns, createDesign, deleteDesign, updateDesign } from "../services/designService.js";
import { getRecentProjects, createRecentProject, deleteRecentProject, updateRecentProject } from "../services/recentProjectsService.js";

export const DesignContext = createContext();

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 90-second timeout to handle sleeping Render servers (cold start on free tier can take up to 80s)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Database connection timed out. Your Render backend server is still waking up (Render free tier sleeps after 15 mins of inactivity). Please click 'Retry Connection' and wait 30–60 seconds.")), 90000)
        );

        const [dbDesigns, dbCategories, dbRecentProjects] = await Promise.race([
          Promise.all([
            getDesigns(),
            getCategories(),
            getRecentProjects(),
          ]),
          timeoutPromise
        ]);

        setDesigns(dbDesigns);
        setCategories(dbCategories);
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

  const updateRecentProjectAction = async (projId, updatedData) => {
    try {
      const updated = await updateRecentProject(projId, updatedData);
      setRecentProjects((prev) =>
        prev.map((p) => (String(p.id) === String(projId) ? updated : p))
      );
      return updated;
    } catch (err) {
      console.error("Error updating recent project:", err);
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
        updateRecentProjectAction,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}
