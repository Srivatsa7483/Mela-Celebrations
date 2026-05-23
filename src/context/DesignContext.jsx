import { createContext, useState, useEffect } from "react";
import { categories as staticCategories, designs as staticDesigns } from "../data/index.js";
import { getCategories, getDesigns, createDesign, deleteDesign, updateDesign } from "../services/designService.js";

export const DesignContext = createContext();

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState(staticDesigns);
  const [categories, setCategories] = useState(staticCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [dbDesigns, dbCategories] = await Promise.all([
          getDesigns(),
          getCategories(),
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
      } catch (err) {
        console.error("Failed to fetch designs or categories from database, using static fallback:", err);
        setError(err.message);
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

  return (
    <DesignContext.Provider
      value={{
        designs,
        categories,
        loading,
        error,
        createDesignAction,
        deleteDesignAction,
        updateDesignAction,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}
