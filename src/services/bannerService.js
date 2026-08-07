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

export async function getBanners() {
  const res = await fetch("/api/banners");
  if (!res.ok) throw new Error("Failed to fetch banners");
  return res.json();
}

export async function createBanner(banner) {
  const res = await fetch("/api/banners", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(banner),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create banner");
  }
  return res.json();
}

export async function updateBanner(id, updates) {
  const res = await fetch(`/api/banners/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update banner");
  }
  return res.json();
}

export async function deleteBanner(id) {
  const res = await fetch(`/api/banners/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete banner");
  }
  return res.json();
}

export async function uploadBannerMedia(file) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", "banners");

  const token = localStorage.getItem("mela_token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/upload", {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Media upload failed");
  }

  const data = await res.json();
  return data.imageUrl;
}
