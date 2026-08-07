import { useState, useEffect, useRef } from "react";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerMedia,
} from "../../services/bannerService.js";
import "./AdminBannerManager.css";

const CATEGORIES = [
  { value: "", label: "— None / Custom Link —" },
  { value: "anniversary", label: "Anniversary" },
  { value: "first-birthday-decorations", label: "First Birthday" },
  { value: "kidsactivities", label: "Kids Activities" },
  { value: "house-warming", label: "House Warming" },
  { value: "welcome-baby-decorations", label: "Welcome Baby" },
  { value: "corporate", label: "Corporate" },
  { value: "haldi-decorations", label: "Haldi Decorations" },
  { value: "photography", label: "Photography" },
  { value: "birthday", label: "Birthday" },
];

const BLANK_FORM = {
  alt: "",
  category: "",
  enabled: true,
};

export default function AdminBannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(BLANK_FORM);
  const [addFile, setAddFile] = useState(null);
  const [addPreview, setAddPreview] = useState(null);
  const addFileRef = useRef();

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const editFileRef = useRef();

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ── Add Flow ──────────────────────────────────────────────────────────────
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAddFile(file);
    setAddPreview(URL.createObjectURL(file));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addFile) {
      showToast("Please select an image or video file.", "error");
      return;
    }
    try {
      setSaving(true);
      const url = await uploadBannerMedia(addFile);
      const isVideo = addFile.type.startsWith("video/");
      await createBanner({
        url,
        type: isVideo ? "video" : "image",
        alt: addForm.alt,
        category: addForm.category,
        enabled: addForm.enabled,
      });
      showToast("Banner added successfully! 🎉");
      setShowAddForm(false);
      setAddForm(BLANK_FORM);
      setAddFile(null);
      setAddPreview(null);
      fetchBanners();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Edit Flow ─────────────────────────────────────────────────────────────
  const startEdit = (banner) => {
    setEditingId(banner.id);
    setEditForm({ alt: banner.alt || "", category: banner.category || "", enabled: banner.enabled !== false });
    setEditFile(null);
    setEditPreview(null);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditFile(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const handleEditSave = async (bannerId) => {
    try {
      setSaving(true);
      let updates = { ...editForm };
      if (editFile) {
        const url = await uploadBannerMedia(editFile);
        const isVideo = editFile.type.startsWith("video/");
        updates.url = url;
        updates.type = isVideo ? "video" : "image";
      }
      await updateBanner(bannerId, updates);
      showToast("Banner updated! ✨");
      setEditingId(null);
      setEditFile(null);
      setEditPreview(null);
      fetchBanners();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle enabled ────────────────────────────────────────────────────────
  const handleToggle = async (banner) => {
    try {
      await updateBanner(banner.id, { enabled: !banner.enabled });
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, enabled: !b.enabled } : b));
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ── Reorder (move up/down) ───────────────────────────────────────────────
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
    setBanners(newBanners);
    try {
      await Promise.all(newBanners.map((b, i) => updateBanner(b.id, { order: i + 1 })));
    } catch (err) {
      showToast("Failed to reorder", "error");
      fetchBanners();
    }
  };

  const handleMoveDown = async (index) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    setBanners(newBanners);
    try {
      await Promise.all(newBanners.map((b, i) => updateBanner(b.id, { order: i + 1 })));
    } catch (err) {
      showToast("Failed to reorder", "error");
      fetchBanners();
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (bannerId) => {
    if (!window.confirm("Delete this banner? This action cannot be undone.")) return;
    try {
      await deleteBanner(bannerId);
      showToast("Banner deleted.");
      fetchBanners();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="abm__loading">
        <div className="abm__spinner" />
        <p>Loading banners…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="abm__error">
        <span>⚠️ {error}</span>
        <button onClick={fetchBanners}>Retry</button>
      </div>
    );
  }

  return (
    <div className="abm">
      {/* Toast */}
      {toast && (
        <div className={`abm__toast abm__toast--${toast.type}`}>{toast.msg}</div>
      )}

      <div className="abm__header">
        <div>
          <h2 className="abm__title">🎨 Advertisement Banners</h2>
          <p className="abm__subtitle">
            Manage the homepage hero slideshow — add, edit, reorder, or hide banners without touching code.
          </p>
        </div>
        <button
          className="abm__btn abm__btn--primary"
          onClick={() => { setShowAddForm(v => !v); setEditingId(null); }}
        >
          {showAddForm ? "✕ Cancel" : "+ Add New Banner"}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showAddForm && (
        <form className="abm__form abm__form--add" onSubmit={handleAddSubmit}>
          <h3 className="abm__form-title">New Banner</h3>

          <div
            className="abm__drop-zone"
            onClick={() => addFileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) { setAddFile(file); setAddPreview(URL.createObjectURL(file)); }
            }}
          >
            {addPreview ? (
              addFile?.type.startsWith("video/") ? (
                <video src={addPreview} className="abm__preview" controls muted />
              ) : (
                <img src={addPreview} className="abm__preview" alt="Preview" />
              )
            ) : (
              <div className="abm__drop-placeholder">
                <span className="abm__drop-icon">🖼️</span>
                <span>Click or drag-and-drop an image or video here</span>
                <small>JPG, PNG, WEBP, GIF, MP4, WEBM, MOV · Max 50 MB</small>
              </div>
            )}
            <input
              ref={addFileRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={handleAddFileChange}
            />
          </div>

          <div className="abm__fields">
            <label className="abm__label">
              Alt / Caption Text
              <input
                type="text"
                className="abm__input"
                placeholder="Describe this banner for accessibility & SEO"
                value={addForm.alt}
                onChange={e => setAddForm(f => ({ ...f, alt: e.target.value }))}
              />
            </label>

            <label className="abm__label">
              Gallery Category (click destination)
              <select
                className="abm__input"
                value={addForm.category}
                onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>

            <label className="abm__label abm__label--toggle">
              <span>Enable this banner immediately</span>
              <div
                className={`abm__toggle ${addForm.enabled ? "abm__toggle--on" : ""}`}
                onClick={() => setAddForm(f => ({ ...f, enabled: !f.enabled }))}
              />
            </label>
          </div>

          <div className="abm__form-actions">
            <button
              type="submit"
              className="abm__btn abm__btn--primary"
              disabled={saving}
            >
              {saving ? "Uploading…" : "Save Banner"}
            </button>
          </div>
        </form>
      )}

      {/* ── Banner List ── */}
      <div className="abm__list">
        {banners.length === 0 && (
          <div className="abm__empty">No banners yet. Add your first one above!</div>
        )}
        {banners.map((banner, index) => (
          <div key={banner.id} className={`abm__card ${!banner.enabled ? "abm__card--disabled" : ""}`}>
            {/* Thumbnail */}
            <div className="abm__thumb-wrap">
              {banner.type === "video" ? (
                <video src={banner.url} className="abm__thumb" muted />
              ) : (
                <img src={banner.url} alt={banner.alt} className="abm__thumb" />
              )}
              <span className={`abm__type-badge abm__type-badge--${banner.type}`}>
                {banner.type === "video" ? "🎬 Video" : "🖼️ Image"}
              </span>
            </div>

            {/* Info or Edit Form */}
            <div className="abm__info">
              {editingId === banner.id ? (
                <div className="abm__edit-form">
                  <div
                    className="abm__drop-zone abm__drop-zone--sm"
                    onClick={() => editFileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) { setEditFile(file); setEditPreview(URL.createObjectURL(file)); }
                    }}
                  >
                    {editPreview ? (
                      editFile?.type.startsWith("video/") ? (
                        <video src={editPreview} className="abm__preview abm__preview--sm" controls muted />
                      ) : (
                        <img src={editPreview} className="abm__preview abm__preview--sm" alt="New preview" />
                      )
                    ) : (
                      <span className="abm__drop-replace">🔄 Click to replace media (optional)</span>
                    )}
                    <input
                      ref={editFileRef}
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: "none" }}
                      onChange={handleEditFileChange}
                    />
                  </div>

                  <label className="abm__label">
                    Alt / Caption
                    <input
                      type="text"
                      className="abm__input"
                      value={editForm.alt}
                      onChange={e => setEditForm(f => ({ ...f, alt: e.target.value }))}
                    />
                  </label>
                  <label className="abm__label">
                    Category
                    <select
                      className="abm__input"
                      value={editForm.category}
                      onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                    >
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </label>
                  <label className="abm__label abm__label--toggle">
                    <span>Enabled</span>
                    <div
                      className={`abm__toggle ${editForm.enabled ? "abm__toggle--on" : ""}`}
                      onClick={() => setEditForm(f => ({ ...f, enabled: !f.enabled }))}
                    />
                  </label>

                  <div className="abm__edit-actions">
                    <button
                      className="abm__btn abm__btn--primary abm__btn--sm"
                      onClick={() => handleEditSave(banner.id)}
                      disabled={saving}
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      className="abm__btn abm__btn--ghost abm__btn--sm"
                      onClick={() => { setEditingId(null); setEditFile(null); setEditPreview(null); }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="abm__alt-text">{banner.alt || <em style={{ color: "var(--text-muted)" }}>No alt text</em>}</p>
                  <span className="abm__category">
                    {banner.category
                      ? `→ ${CATEGORIES.find(c => c.value === banner.category)?.label || banner.category}`
                      : "No category link"}
                  </span>
                </>
              )}
            </div>

            {/* Controls */}
            {editingId !== banner.id && (
              <div className="abm__controls">
                <div className="abm__order-btns">
                  <button
                    className="abm__btn abm__btn--icon"
                    onClick={() => handleMoveUp(index)}
                    title="Move up"
                    disabled={index === 0}
                  >↑</button>
                  <button
                    className="abm__btn abm__btn--icon"
                    onClick={() => handleMoveDown(index)}
                    title="Move down"
                    disabled={index === banners.length - 1}
                  >↓</button>
                </div>

                <div
                  className={`abm__toggle ${banner.enabled ? "abm__toggle--on" : ""}`}
                  onClick={() => handleToggle(banner)}
                  title={banner.enabled ? "Hide this banner" : "Show this banner"}
                />

                <button
                  className="abm__btn abm__btn--ghost abm__btn--sm"
                  onClick={() => startEdit(banner)}
                >✏️ Edit</button>
                <button
                  className="abm__btn abm__btn--danger abm__btn--sm"
                  onClick={() => handleDelete(banner.id)}
                >🗑️ Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
