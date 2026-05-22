export async function getDesigns() {
  const res = await fetch("/api/designs");
  if (!res.ok) throw new Error("Failed to fetch designs");
  return res.json();
}

export async function getCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createDesign(newDesign) {
  const res = await fetch("/api/designs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newDesign),
  });
  if (!res.ok) throw new Error("Failed to create design");
  return res.json();
}

export async function deleteDesign(designId) {
  const res = await fetch(`/api/designs/${designId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete design");
  return res.json();
}

export async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
