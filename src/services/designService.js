// src/services/designService.js
export async function getDesigns() {
  try {
    const response = await fetch("/api/designs");
    if (!response.ok) throw new Error("Failed to fetch designs");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCategories() {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createDesign(designData) {
  try {
    const response = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(designData),
    });
    if (!response.ok) throw new Error("Failed to create design");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload image");
    const data = await response.json();
    return data.imageUrl; // e.g. /uploads/filename.jpg
  } catch (error) {
    console.error(error);
    throw error;
  }
}
