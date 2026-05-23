export async function getRecentProjects() {
  const res = await fetch("/api/recent-projects");
  if (!res.ok) throw new Error("Failed to fetch recent projects");
  return res.json();
}

export async function createRecentProject(newProj) {
  const res = await fetch("/api/recent-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProj),
  });
  if (!res.ok) throw new Error("Failed to create recent project");
  return res.json();
}

export async function deleteRecentProject(projId) {
  const res = await fetch(`/api/recent-projects/${projId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete recent project");
  return res.json();
}
