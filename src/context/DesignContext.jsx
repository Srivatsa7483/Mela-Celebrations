import { createContext, useState, useEffect } from "react";
import { getCategories, getDesigns, createDesign, deleteDesign, updateDesign } from "../services/designService.js";
import { getRecentProjects, createRecentProject, deleteRecentProject, updateRecentProject } from "../services/recentProjectsService.js";
import { categories as staticCategories, designs as staticDesigns } from "../data/index.js";

export const DesignContext = createContext();

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState(staticDesigns);
  const [categories, setCategories] = useState(staticCategories);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbStatus, setDbStatus] = useState("loading"); // 'loading' | 'connected' | 'error'

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setDbStatus("loading");

        // 90-second timeout to handle sleeping Render servers (cold start on free tier can take up to 80s)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Database connection timed out.")), 90000)
        );

        const [dbDesigns, dbCategories, dbRecentProjects] = await Promise.race([
          Promise.all([
            getDesigns(),
            getCategories(),
            getRecentProjects(),
          ]),
          timeoutPromise
        ]);

        if (dbDesigns && dbDesigns.length > 0) setDesigns(dbDesigns);
        if (dbCategories && dbCategories.length > 0) setCategories(dbCategories);
        setRecentProjects(dbRecentProjects || []);
        setError(null);
        setDbStatus("connected");
      } catch (err) {
        console.error("Failed to fetch designs, categories, or recent projects from database, using preloaded catalog:", err);
        setError(err.message);
        setDbStatus("error");
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
        dbStatus,
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
