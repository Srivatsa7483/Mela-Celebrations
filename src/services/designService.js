const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("mela_token");
  const headers = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

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
    headers: getHeaders(),
    body: JSON.stringify(newDesign),
  });
  if (!res.ok) throw new Error("Failed to create design");
  return res.json();
}

export async function deleteDesign(designId) {
  const res = await fetch(`/api/designs/${designId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete design");
  return res.json();
}

export async function updateDesign(designId, updatedDesign) {
  const res = await fetch(`/api/designs/${designId}`, {
    method: "PUT",
    headers: getHeaders(),
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
    headers: getHeaders(true),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Image upload to Cloudflare R2 failed");
  }

  const data = await res.json();
  return data.imageUrl;
}
