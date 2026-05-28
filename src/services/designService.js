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

export async function updateDesign(designId, updatedDesign) {
  const res = await fetch(`/api/designs/${designId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedDesign),
  });
  if (!res.ok) throw new Error("Failed to update design");
  return res.json();
}

export async function uploadImage(file, folder = "products") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type manually — browser sets it with boundary automatically
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Image upload to Cloudflare R2 failed");
  }

  const data = await res.json();
  return data.imageUrl;
}
