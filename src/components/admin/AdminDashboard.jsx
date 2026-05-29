import React, { useState, useEffect, useContext } from 'react';
import { uploadImage } from '../../services/designService';
import { DesignContext } from '../../context/DesignContext';
import './AdminDashboard.css';

/* ─── Render Wakeup Error Component ──────────────────────────────────────── */
function RenderWakeupError({ onRetry }) {
  const [countdown, setCountdown] = useState(20);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Auto-retry after countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // Animate dots
    const dotsTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => { clearInterval(timer); clearInterval(dotsTimer); };
  }, [onRetry]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '40px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {/* Animated spinner */}
      <div style={{ width: '64px', height: '64px', border: '4px solid rgba(11,25,44,0.08)', borderTopColor: '#FFB300', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <h2 style={{ color: '#0B192C', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
        ☕ Backend is Waking Up{dots}
      </h2>
      <p style={{ color: '#6B7280', fontSize: '0.92rem', maxWidth: '440px', lineHeight: '1.7', margin: '0' }}>
        Your Render server was sleeping (free tier goes idle after 15 mins).<br />
        It's now starting up — this takes <strong>30–60 seconds</strong> on the first visit.
      </p>
      <div style={{ background: 'rgba(255,179,0,0.1)', border: '1.5px solid #FFB300', borderRadius: '12px', padding: '14px 28px' }}>
        <p style={{ margin: 0, color: '#0B192C', fontWeight: '700', fontSize: '1rem' }}>
          Auto-retrying in <span style={{ color: '#FFB300', fontSize: '1.3rem' }}>{countdown}s</span>
        </p>
      </div>
      <button
        onClick={onRetry}
        style={{ background: '#FFB300', color: '#0B192C', border: 'none', borderRadius: '30px', padding: '12px 28px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 18px rgba(255,179,0,0.3)', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        🔄 Retry Now
      </button>
    </div>
  );
}


/* ─── Shared style tokens ─────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    background: '#F8F9FB', // Light Background
    fontFamily: "'DM Sans', sans-serif",
    color: '#0B192C', // Deep Navy Blue Text
    padding: '0',
  },
  // Top bar
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 40px',
    background: '#ffffff',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #D8DCE3', // Soft Border
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoBadge: {
    background: 'rgba(255, 179, 0, 0.12)', // Light version of Chrome Yellow
    border: '1px solid #FFB300', // Chrome Yellow
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '0.68rem',
    color: '#0B192C', // Deep Navy
    letterSpacing: '0.16em',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  logoTitle: { color: '#0B192C', fontSize: '1.2rem', fontWeight: '700', margin: 0, letterSpacing: '0.04em' }, // Deep Navy
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#EF4444',
    padding: '9px 18px',
    borderRadius: '10px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.06em',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  // Content
  content: { padding: '36px 40px', maxWidth: '1280px', margin: '0 auto' },
  // Section header
  sectionTitle: {
    color: '#0B192C', // Deep Navy
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginBottom: '20px',
  },
  // Stats row
  statCard: {
    background: '#ffffff', // White card on light background
    border: '1px solid #D8DCE3', // Soft Border
    borderRadius: '16px',
    padding: '22px 26px',
    flex: '1',
    minWidth: '160px',
    boxShadow: '0 4px 12px rgba(11, 25, 44, 0.04)',
  },
  statNum: { fontSize: '2rem', fontWeight: '800', color: '#0B192C', margin: 0 }, // Deep Navy for numbers
  statLabel: { fontSize: '0.78rem', color: '#6B7280', marginTop: '4px', letterSpacing: '0.06em' }, 
  // Add button
  addBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#0B192C', // Deep Navy
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '800',
    fontSize: '0.88rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(11, 25, 44, 0.15)',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  cancelBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#ffffff',
    color: '#4B5563',
    border: '1px solid #D8DCE3', // Border
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  // Form panel
  formPanel: {
    background: '#ffffff',
    border: '1px solid #D8DCE3', // Border
    borderRadius: '20px',
    padding: '36px',
    marginBottom: '36px',
    boxShadow: '0 8px 24px rgba(11, 25, 44, 0.04)',
    backdropFilter: 'blur(10px)',
  },
  formTitle: { color: '#0B192C', fontSize: '1.05rem', fontWeight: '700', margin: '0 0 28px', letterSpacing: '0.04em' },
  label: {
    display: 'block',
    color: '#4B5563', // Muted text 
    fontSize: '0.74rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#F8F9FB', // Background
    border: '1px solid #D8DCE3', // Border
    borderRadius: '10px',
    color: '#0B192C', // Text
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    background: '#F8F9FB',
    border: '1px solid #D8DCE3', // Border
    borderRadius: '10px',
    color: '#0B192C', // Text
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230B192C' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '42px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: '#F8F9FB', // Background
    border: '1px solid #D8DCE3', // Border
    borderRadius: '10px',
    color: '#0B192C', // Text
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    height: '90px',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  saveBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#FFB300', // Chrome Yellow
    color: '#0B192C', // Deep Navy Blue for high contrast
    border: 'none',
    padding: '14px 32px',
    borderRadius: '10px',
    fontWeight: '800',
    fontSize: '0.9rem',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(255, 179, 0, 0.25)',
    transition: 'all 0.22s',
    fontFamily: 'inherit',
  },
  // Table
  tableWrap: {
    background: '#ffffff',
    border: '1px solid #D8DCE3', // Border
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(11, 25, 44, 0.02)',
  },
  th: {
    padding: '16px 20px',
    fontSize: '0.7rem',
    fontWeight: '800',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#0B192C', // Deep Navy Blue
    textAlign: 'left',
    background: '#F8F9FB', // Background
    borderBottom: '1px solid #D8DCE3', // Border
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '16px 20px',
    color: '#0B192C', // Text
    fontSize: '0.88rem',
    verticalAlign: 'middle',
    borderBottom: '1px solid #D8DCE3', // Border
  },
  deleteBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#EF4444',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    letterSpacing: '0.04em',
  },
  editBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(255, 179, 0, 0.12)',
    border: '1px solid rgba(255, 179, 0, 0.35)',
    color: '#0B192C',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    letterSpacing: '0.04em',
    marginRight: '8px',
  },
};

const CustomSelect = ({ value, onChange, options, placeholder, disabled, name, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = () => setIsOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div style={{ position: 'relative', width: '100%' }} onClick={e => e.stopPropagation()}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          ...S.select,
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: isOpen ? '1px solid #FFB300' : '1px solid #D8DCE3',
          background: isOpen ? '#ffffff' : '#F8F9FB',
        }}
      >
        <span style={{ color: selectedOption ? '#0B192C' : '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayLabel}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #D8DCE3',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(11,25,44,0.08)',
            maxHeight: '220px',
            overflowY: 'auto',
            zIndex: 1000,
            padding: '4px',
            scrollbarWidth: 'thin',
          }}
        >
          {options.length === 0 ? (
            <div style={{ padding: '10px 14px', color: '#9CA3AF', fontSize: '0.85rem' }}>
              No options available
            </div>
          ) : (
            options.map(opt => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 14px',
                  color: opt.value === value ? '#0B192C' : '#4B5563',
                  background: opt.value === value ? 'rgba(255, 179, 0, 0.12)' : 'transparent',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontWeight: opt.value === value ? '700' : 'normal',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 179, 0, 0.18)';
                  e.currentTarget.style.color = '#0B192C';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = opt.value === value ? 'rgba(255, 179, 0, 0.12)' : 'transparent';
                  e.currentTarget.style.color = opt.value === value ? '#0B192C' : '#4B5563';
                }}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ setCurrentPage }) => {
  const { 
    designs, categories, recentProjects, loading, error,
    createDesignAction, deleteDesignAction, updateDesignAction,
    createRecentProjectAction, deleteRecentProjectAction, updateRecentProjectAction
  } = useContext(DesignContext);

  const [activeTab, setActiveTab] = useState('designs'); // 'designs', 'projects', 'signature'
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  /* ─── Designs Tab States ─── */
  const [isAdding, setIsAdding] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', subcategory: '', price: '', originalPrice: '', features: '', badge: '', isSignature: false,
  });
  const [file, setFile] = useState(null); // Primary image file
  const [additionalFiles, setAdditionalFiles] = useState([]); // Extra image files (new uploads)
  const [existingImages, setExistingImages] = useState([]); // Existing image URLs (when editing)

  /* ─── Recent Projects Tab States ─── */
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectUploading, setProjectUploading] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    title: '', category: '', venue: '', date: '', cost: '', desc: '', review: ''
  });
  const [projectFile, setProjectFile] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('mela_admin_auth') !== 'true') {
      setCurrentPage('admin');
    }
  }, [setCurrentPage]);

  const handleLogout = () => {
    sessionStorage.removeItem('mela_admin_auth');
    setCurrentPage('home');
  };

  /* ─── Designs Handlers ─── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData(prev => ({ ...prev, category: value, subcategory: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClick = (design) => {
    setEditingDesign(design);
    setIsAdding(true);
    setFormData({
      name: design.name || '',
      description: design.description || '',
      category: design.category || '',
      subcategory: design.subcategory || '',
      price: design.price || '',
      originalPrice: design.originalPrice || '',
      features: design.features ? design.features.join(', ') : '',
      badge: design.badge || '',
      isSignature: design.isSignature || false,
    });
    setFile(null);
    setAdditionalFiles([]);
    // Pre-fill existing images: images[] array, or fall back to single image
    const existingImgArr = Array.isArray(design.images) && design.images.length > 0
      ? design.images
      : (design.image ? [design.image] : []);
    setExistingImages(existingImgArr);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelClick = () => {
    setIsAdding(false);
    setEditingDesign(null);
    setFormData({ name: '', description: '', category: '', subcategory: '', price: '', originalPrice: '', features: '', badge: '', isSignature: false });
    setFile(null);
    setAdditionalFiles([]);
    setExistingImages([]);
  };

  const getSubcategoriesForCategory = (catId) => {
    const category = categories.find(c => c.id === catId);
    if (!category || !category.dropdown) return [];
    const subs = [];
    category.dropdown.forEach(item => {
      if (item.id === "decorations-anniversary") return; // Synced dynamically with Anniversary main category
      subs.push({ id: item.id, label: item.label });
      if (item.dropdown) {
        item.dropdown.forEach(subItem => {
          subs.push({ id: subItem.id, label: `${item.label} → ${subItem.label}` });
        });
      }
    });
    return subs;
  };

  const getSubcategoryLabel = (catId, subId) => {
    if (!subId) return '';
    const category = categories.find(c => c.id === catId);
    if (!category || !category.dropdown) return subId;
    for (const item of category.dropdown) {
      if (item.id === subId) return item.label;
      if (item.dropdown) {
        const subItem = item.dropdown.find(s => s.id === subId);
        if (subItem) return `${item.label} → ${subItem.label}`;
      }
    }
    return subId;
  };

  const filteredDesigns = designs.filter(d => {
    const query = adminSearchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const matchesName = d.name && d.name.toLowerCase().includes(query);
    const matchesCategory = d.categoryName && d.categoryName.toLowerCase().includes(query);
    const subcatLabel = d.subcategory ? getSubcategoryLabel(d.category, d.subcategory) : '';
    const matchesSubcategory = subcatLabel && subcatLabel.toLowerCase().includes(query);
    const matchesDescription = d.description && d.description.toLowerCase().includes(query);
    const matchesFeatures = d.features && d.features.some(f => f.toLowerCase().includes(query));
    
    return matchesName || matchesCategory || matchesSubcategory || matchesDescription || matchesFeatures;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingDesign && !file) {
      alert('Please upload a primary image for the design.');
      return;
    }
    if (!formData.category) {
      alert('Please select a main category for the design.');
      return;
    }
    setUploading(true);
    try {
      // ── 1. Upload primary image (if a new one was selected) ──
      let primaryUrl = editingDesign
        ? (existingImages[0] || editingDesign.image || '')
        : '';
      if (file) {
        primaryUrl = await uploadImage(file);
      }

      // ── 2. Upload any new additional images in parallel ──
      let newAdditionalUrls = [];
      if (additionalFiles.length > 0) {
        newAdditionalUrls = await Promise.all(
          additionalFiles.map(f => uploadImage(f))
        );
      }

      // ── 3. Build final images array ──
      // For edit: keep existing images (minus primary which may have been replaced)
      // then append new uploads
      let finalImages;
      if (editingDesign) {
        // existingImages[0] is the old primary; if new file uploaded, replace it
        const keptExisting = file
          ? existingImages.slice(1)   // drop old primary if replaced
          : existingImages;           // keep all if no new primary
        finalImages = [primaryUrl, ...keptExisting.slice(file ? 0 : 1), ...newAdditionalUrls];
        // Remove duplicates and clean
        finalImages = [...new Set(finalImages)].filter(Boolean);
      } else {
        finalImages = [primaryUrl, ...newAdditionalUrls].filter(Boolean);
      }

      const selectedCategoryObj = categories.find(c => c.id === formData.category);
      const designPayload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        categoryName: selectedCategoryObj ? selectedCategoryObj.name : formData.category,
        subcategory: formData.subcategory || null,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        features: formData.features.split(',').map(f => f.trim()),
        image: finalImages[0] || primaryUrl,   // backwards-compatible single image field
        images: finalImages,                   // new multi-image array
        badge: formData.badge || null,
        isSignature: Boolean(formData.isSignature),
      };

      if (editingDesign) {
        await updateDesignAction(editingDesign.id, designPayload);
        alert('Design updated successfully!');
      } else {
        await createDesignAction(designPayload);
        alert('Design added successfully!');
      }
      handleCancelClick();
    } catch (error) {
      console.error(error);
      alert(editingDesign ? 'Error updating design.' : 'Error adding design.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (designId) => {
    if (window.confirm('Are you sure you want to permanently delete this design?')) {
      try {
        await deleteDesignAction(designId);
        alert('Design deleted successfully!');
      } catch (error) {
        console.error('Error deleting design:', error);
        alert('Failed to delete the design.');
      }
    }
  };

  /* ─── Recent Projects Handlers ─── */
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectEditClick = (project) => {
    setEditingProject(project);
    setIsAddingProject(true);
    setProjectFormData({
      title: project.title || '',
      category: project.category || '',
      venue: project.venue || '',
      date: project.date || '',
      cost: project.cost || '',
      desc: project.desc || '',
      review: project.review || '',
    });
    setProjectFile(null);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleProjectCancelClick = () => {
    setIsAddingProject(false);
    setEditingProject(null);
    setProjectFormData({ title: '', category: '', venue: '', date: '', cost: '', desc: '', review: '' });
    setProjectFile(null);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!editingProject && !projectFile) {
      alert('Please upload an image for the completed project.');
      return;
    }
    setProjectUploading(true);
    try {
      let imageUrl = editingProject ? editingProject.image : '';
      if (projectFile) {
        imageUrl = await uploadImage(projectFile);
      }
      
      const projectPayload = {
        title: projectFormData.title,
        category: projectFormData.category,
        venue: projectFormData.venue,
        date: projectFormData.date,
        cost: projectFormData.cost,
        desc: projectFormData.desc,
        review: projectFormData.review || '',
        image: imageUrl,
      };

      if (editingProject) {
        await updateRecentProjectAction(editingProject.id, projectPayload);
        alert('Recent completed project updated successfully!');
      } else {
        await createRecentProjectAction(projectPayload);
        alert('Recent completed project added successfully!');
      }
      
      handleProjectCancelClick();
    } catch (error) {
      console.error(error);
      alert(editingProject ? 'Error updating completed project.' : 'Error saving completed project.');
    } finally {
      setProjectUploading(false);
    }
  };

  const handleProjectDelete = async (projId) => {
    if (window.confirm('Are you sure you want to permanently delete this completed project?')) {
      try {
        await deleteRecentProjectAction(projId);
        alert('Completed project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete the project.');
      }
    }
  };

  const filteredProjects = recentProjects.filter(p => {
    const query = projectSearchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesTitle = p.title && p.title.toLowerCase().includes(query);
    const matchesVenue = p.venue && p.venue.toLowerCase().includes(query);
    const matchesDesc = p.desc && p.desc.toLowerCase().includes(query);
    const categoryName = categories.find(c => c.id === p.category)?.name || p.category;
    const matchesCategory = categoryName.toLowerCase().includes(query);

    return matchesTitle || matchesVenue || matchesDesc || matchesCategory;
  });

  /* ─── Focus style helpers ─── */
  const onFocus = (e) => {
    e.target.style.borderColor = '#FFB300';
    e.target.style.boxShadow = '0 0 0 3px rgba(255, 179, 0, 0.15)';
  };
  const onBlur = (e) => {
    e.target.style.borderColor = '#D8DCE3';
    e.target.style.boxShadow = 'none';
  };

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid rgba(11,25,44,0.1)', borderTopColor: '#FFB300', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6B7280', fontSize: '0.9rem', letterSpacing: '0.08em' }}>Loading Dashboard…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <RenderWakeupError onRetry={() => window.location.reload()} />
  );


  const subcategories = getSubcategoriesForCategory(formData.category);

  return (
    <div style={S.page}>
      {/* ── Top Bar ── */}
      <div style={S.topBar} className="admin-topbar">
        <div style={S.logoRow} className="admin-topbar-left">
          <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          <div>
            <p style={S.logoTitle} className="admin-logo-title">Mela Celebrations</p>
            <span style={S.logoBadge}>Admin Dashboard</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }} className="admin-topbar-right">
          <span style={{ color: '#6B7280', fontSize: '0.78rem' }} className="admin-stats-count">
            {designs.length} designs · {recentProjects.length} projects · {categories.length} categories
          </span>
          <button
            onClick={handleLogout}
            style={S.logoutBtn}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={S.content} className="admin-content">

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '18px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {[
            { num: designs.length, label: 'Total Designs', icon: '🖼️' },
            { num: recentProjects.length, label: 'Recent Projects', icon: '📸' },
            { num: categories.length, label: 'Active Categories', icon: '📁' },
          ].map(stat => (
            <div key={stat.label} style={S.statCard}>
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{stat.icon}</div>
              <p style={S.statNum}>{stat.num}</p>
              <p style={S.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tab Selector ── */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #D8DCE3', marginBottom: '28px', paddingBottom: '2px' }} className="admin-tabs">
          <button
            onClick={() => setActiveTab('designs')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'designs' ? '3px solid #FFB300' : '3px solid transparent',
              color: activeTab === 'designs' ? '#0B192C' : '#6B7280',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            🖼️ Celebration Designs
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'projects' ? '3px solid #FFB300' : '3px solid transparent',
              color: activeTab === 'projects' ? '#0B192C' : '#6B7280',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            📸 Recent Completed Projects
          </button>
          <button
            onClick={() => setActiveTab('signature')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'signature' ? '3px solid #FFB300' : '3px solid transparent',
              color: activeTab === 'signature' ? '#0B192C' : '#6B7280',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            ✨ Mela Signature Packages
          </button>
        </div>

        {/* ─── DESIGNS TAB PANEL ─── */}
        {activeTab === 'designs' && (
          <>
            {/* Action row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <button
                onClick={isAdding ? handleCancelClick : () => setIsAdding(true)}
                style={isAdding ? S.cancelBtn : S.addBtn}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(11,25,44,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isAdding ? 'none' : '0 4px 12px rgba(11,25,44,0.15)'; }}
              >
                {isAdding ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add New Design
                  </>
                )}
              </button>
              <p style={{ color: '#6B7280', fontSize: '0.8rem', margin: 0 }}>
                Manage your celebration designs below
              </p>
            </div>

            {/* Add Design Form */}
            {isAdding && (
              <div style={S.formPanel}>
                <h3 style={S.formTitle}>
                  {editingDesign ? '✏️ Edit Design Details' : '✨ New Design Details'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '22px', gridTemplateColumns: '1fr 1fr' }} className="admin-form-grid">

                  {/* Name */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>Design Name *</label>
                    <input style={S.input} type="text" name="name" value={formData.name}
                      onChange={handleInputChange} required placeholder="e.g. Royal Birthday Setup"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Description */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>Description *</label>
                    <textarea style={S.textarea} name="description" value={formData.description}
                      onChange={handleInputChange} required placeholder="Describe the decoration theme and ambiance…"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Price */}
                  <div>
                    <label style={S.label}>Price (₹) *</label>
                    <input style={S.input} type="number" name="price" value={formData.price}
                      onChange={handleInputChange} required placeholder="e.g. 4999"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label style={S.label}>Original / MRP (₹) *</label>
                    <input style={S.input} type="number" name="originalPrice" value={formData.originalPrice}
                      onChange={handleInputChange} required placeholder="e.g. 6999"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Category */}
                  <div>
                    <label style={S.label}>Main Category *</label>
                    <div style={{ position: 'relative' }}>
                      <CustomSelect
                        name="category"
                        value={formData.category}
                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                        placeholder="Select a Category"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label style={S.label}>
                      Subcategory {subcategories.length > 0 ? '' : <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none', fontSize: '0.7rem' }}> (select a category first)</span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <CustomSelect
                        name="subcategory"
                        value={formData.subcategory}
                        options={[{ value: '', label: 'None (Main Category Only)' }, ...subcategories.map(sub => ({ value: sub.id, label: sub.label }))]}
                        placeholder="Select a Subcategory"
                        onChange={handleInputChange}
                        disabled={subcategories.length === 0}
                        required={false}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>Features (comma separated) *</label>
                    <input style={S.input} type="text" name="features" value={formData.features}
                      onChange={handleInputChange} required placeholder="e.g. Red Balloons, Fairy Lights, Flower Arch"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Badge */}
                  <div>
                    <label style={S.label}>Product Badge (Label)</label>
                    <CustomSelect
                      name="badge"
                      value={formData.badge}
                      options={[
                        { value: '', label: 'No Badge' },
                        { value: 'NEW', label: '🆕 NEW' },
                        { value: 'TRENDING', label: '🔥 TRENDING' },
                        { value: 'POPULAR', label: '⭐ POPULAR' },
                        { value: 'BESTSELLER', label: '🏆 BESTSELLER' },
                        { value: 'PREMIUM', label: '💎 PREMIUM' },
                        { value: 'FEATURED', label: '✨ FEATURED' },
                      ]}
                      placeholder="Select a Badge"
                      onChange={handleInputChange}
                      required={false}
                    />
                    <p style={{ color: '#9CA3AF', fontSize: '0.72rem', margin: '6px 0 0', lineHeight: '1.5' }}>
                      This label appears as a colored ribbon on the product card.
                    </p>
                  </div>

                  {/* Mela Signature Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ ...S.label, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none', marginTop: '22px' }}>
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, isSignature: !prev.isSignature }))}
                        style={{
                          width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer', flexShrink: 0,
                          background: formData.isSignature ? 'linear-gradient(135deg,#FFB300,#FF8F00)' : '#D1D5DB',
                          transition: 'background 0.25s',
                          boxShadow: formData.isSignature ? '0 0 0 3px rgba(255,179,0,0.25)' : 'none',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: '3px', left: formData.isSignature ? '23px' : '3px',
                          width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.25s',
                        }} />
                      </div>
                      <span style={{ fontWeight: formData.isSignature ? '700' : '500', color: formData.isSignature ? '#FF8F00' : '#4B5563', transition: 'all 0.2s' }}>
                        {formData.isSignature ? '✨ Mela Signature Package (will appear in Signature section)' : 'Mark as Mela Signature Package'}
                      </span>
                    </label>
                  </div>


                  {/* ── Image Gallery Manager ── */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ ...S.label, marginBottom: '4px' }}>🖼️ Design Images</label>
                    <p style={{ color: '#9CA3AF', fontSize: '0.72rem', margin: '0 0 16px', lineHeight: '1.5' }}>
                      Upload a primary image (required) + optional alternate gallery images. Customers will see all images with thumbnail navigation.
                    </p>

                    {/* ─ Primary Image ─ */}
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ ...S.label, fontSize: '0.72rem', color: '#6B7280', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.1em' }}>
                        PRIMARY IMAGE {editingDesign ? '(leave empty to keep current)' : '*'}
                      </p>

                      {/* Show current primary if editing */}
                      {editingDesign && existingImages[0] && !file && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', background: '#F8F9FB', borderRadius: '10px', padding: '10px 14px', border: '1px solid #D8DCE3' }}>
                          <img src={existingImages[0]} alt="current primary" style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #FFB300' }} />
                          <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#0B192C' }}>Current Primary Image</p>
                            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#9CA3AF' }}>Upload a new file below to replace it</p>
                          </div>
                        </div>
                      )}

                      <div
                        style={{ border: `2px dashed ${file ? '#FFB300' : 'rgba(11,25,44,0.2)'}`, borderRadius: '12px', padding: '16px 20px', textAlign: 'center', background: file ? 'rgba(255,179,0,0.04)' : 'rgba(255,179,0,0.02)', transition: 'all 0.2s', cursor: 'pointer' }}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#FFB300'; }}
                        onDragLeave={e => { e.currentTarget.style.borderColor = file ? '#FFB300' : 'rgba(11,25,44,0.2)'; }}
                        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) setFile(f); }}
                      >
                        <p style={{ color: file ? '#0B192C' : '#6B7280', fontSize: '0.82rem', margin: '0 0 8px', fontWeight: file ? '600' : '400' }}>
                          {file ? `✅ ${file.name}` : '📁 Drag & drop or click to browse'}
                        </p>
                        <input type="file" accept="image/*"
                          onChange={e => setFile(e.target.files[0])}
                          required={!editingDesign}
                          style={{ color: '#4B5563', fontSize: '0.82rem', fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }} />
                      </div>
                    </div>

                    {/* ─ Alternate / Gallery Images ─ */}
                    <div>
                      <p style={{ ...S.label, fontSize: '0.72rem', color: '#6B7280', marginBottom: '10px', fontWeight: '700', letterSpacing: '0.1em' }}>
                        ALTERNATE GALLERY IMAGES (optional)
                      </p>

                      {/* Existing alternate images (editing only) */}
                      {editingDesign && existingImages.length > 1 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                          {existingImages.slice(1).map((imgUrl, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '10px', overflow: 'visible', flexShrink: 0 }}>
                              <img
                                src={imgUrl}
                                alt={`alt-${idx}`}
                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid #D8DCE3', display: 'block' }}
                              />
                              <button
                                type="button"
                                title="Remove this image"
                                onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx + 1))}
                                style={{
                                  position: 'absolute', top: '-7px', right: '-7px',
                                  width: '20px', height: '20px', borderRadius: '50%',
                                  background: '#EF4444', color: '#fff', border: '2px solid #fff',
                                  fontSize: '10px', fontWeight: '900', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  lineHeight: 1, padding: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                }}
                              >✕</button>
                            </div>
                          ))}
                          <p style={{ width: '100%', fontSize: '0.72rem', color: '#9CA3AF', margin: '2px 0 0' }}>
                            {existingImages.length - 1} existing alternate image{existingImages.length - 1 !== 1 ? 's' : ''} · click ✕ to remove
                          </p>
                        </div>
                      )}

                      {/* New additional files queued */}
                      {additionalFiles.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                          {additionalFiles.map((f, idx) => (
                            <div key={idx} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.35)',
                              borderRadius: '20px', padding: '4px 10px 4px 8px', fontSize: '0.75rem', color: '#0B192C',
                            }}>
                              <span>📎 {f.name.length > 20 ? f.name.slice(0, 18) + '…' : f.name}</span>
                              <button
                                type="button"
                                onClick={() => setAdditionalFiles(prev => prev.filter((_, i) => i !== idx))}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontWeight: '900', fontSize: '12px', padding: '0 0 0 2px', lineHeight: 1 }}
                              >✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Multi-file picker */}
                      <div
                        style={{ border: '2px dashed rgba(11,25,44,0.15)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center', background: '#FAFBFC', transition: 'all 0.2s', cursor: 'pointer' }}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#FFB300'; e.currentTarget.style.background = 'rgba(255,179,0,0.04)'; }}
                        onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(11,25,44,0.15)'; e.currentTarget.style.background = '#FAFBFC'; }}
                        onDrop={e => {
                          e.preventDefault();
                          const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                          setAdditionalFiles(prev => [...prev, ...dropped]);
                          e.currentTarget.style.borderColor = 'rgba(11,25,44,0.15)';
                          e.currentTarget.style.background = '#FAFBFC';
                        }}
                      >
                        <p style={{ color: '#9CA3AF', fontSize: '0.8rem', margin: '0 0 8px' }}>📷 Add more angles / alternate views</p>
                        <input
                          type="file" accept="image/*" multiple
                          onChange={e => setAdditionalFiles(prev => [...prev, ...Array.from(e.target.files)])}
                          style={{ color: '#4B5563', fontSize: '0.8rem', fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                        />
                        <p style={{ color: '#C0C6CF', fontSize: '0.7rem', margin: '6px 0 0' }}>You can select multiple files at once</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <button type="submit" disabled={uploading} style={S.saveBtn}
                      onMouseEnter={e => { if (!uploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,179,0,0.35)'; } }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(255,179,0,0.2)'; }}
                    >
                      {uploading ? (
                        <>⏳ Saving Design…</>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                          {editingDesign ? 'Update Design' : 'Save Design'}
                        </>
                      )}
                    </button>
                    {uploading && <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Uploading {1 + additionalFiles.length} image{additionalFiles.length > 0 ? 's' : ''} and saving…</span>}
                  </div>
                </form>
              </div>
            )}

            {/* Designs Table */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <p style={{ ...S.sectionTitle, margin: 0 }}>
                  📋 All Designs — {filteredDesigns.length !== designs.length ? `${filteredDesigns.length} of ${designs.length}` : `${designs.length}`} total
                </p>
                
                {/* Search */}
                <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                  <input
                    type="text"
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    placeholder="Search designs..."
                    style={{
                      ...S.input,
                      paddingLeft: '40px',
                      background: '#ffffff',
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#6B7280" 
                    strokeWidth="2.5" 
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  >
                    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  {adminSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setAdminSearchQuery('')}
                      style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.25rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', padding: 0, lineHeight: 1
                      }}
                      title="Clear search"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {designs.length === 0 ? (
                <div style={{ ...S.tableWrap, padding: '60px', textAlign: 'center' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🖼️</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No designs yet. Click "Add New Design" to get started.</p>
                </div>
              ) : filteredDesigns.length === 0 ? (
                <div style={{ ...S.tableWrap, padding: '60px', textAlign: 'center' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No designs found matching "{adminSearchQuery}".</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div style={S.tableWrap} className="admin-designs-table">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={S.th}>Image</th>
                          <th style={S.th}>Name</th>
                          <th style={S.th}>Category</th>
                          <th style={S.th}>Price</th>
                          <th style={{ ...S.th, textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDesigns.map((d, i) => (
                          <tr
                            key={d.id}
                            style={{ background: i % 2 === 0 ? 'transparent' : '#F9FAFB' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 179, 0, 0.04)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#F9FAFB'; }}
                          >
                            <td style={S.td}>
                              <img src={d.image} alt={d.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #D8DCE3' }} />
                            </td>
                            <td style={{ ...S.td, fontWeight: '700', color: '#0B192C' }}>
                              {d.name}
                              {d.badge && (
                                <span style={{ marginLeft: '8px', background: 'rgba(255, 179, 0, 0.12)', border: '1px solid rgba(255, 179, 0, 0.3)', borderRadius: '8px', padding: '2px 8px', fontSize: '0.65rem', color: '#FFA000', fontWeight: '700', letterSpacing: '0.1em', verticalAlign: 'middle' }}>
                                  {d.badge}
                                </span>
                              )}
                            </td>
                            <td style={S.td}>
                              <span style={{ color: '#4B5563' }}>{d.categoryName}</span>
                              {d.subcategory && (
                                <div style={{ fontSize: '0.75rem', color: '#FFA000', marginTop: '4px', fontWeight: '600' }}>
                                  ↳ {getSubcategoryLabel(d.category, d.subcategory)}
                                </div>
                              )}
                            </td>
                            <td style={S.td}>
                              <span style={{ color: '#0B192C', fontWeight: '700', fontSize: '0.95rem' }}>₹{d.price.toLocaleString('en-IN')}</span>
                              {d.originalPrice && d.originalPrice > d.price && (
                                <div style={{ fontSize: '0.73rem', color: '#9CA3AF', textDecoration: 'line-through', marginTop: '2px' }}>
                                  ₹{d.originalPrice.toLocaleString('en-IN')}
                                </div>
                              )}
                            </td>
                            <td style={{ ...S.td, textAlign: 'center' }}>
                              <button
                                onClick={() => handleEditClick(d)}
                                style={S.editBtn}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,179,0,0.22)'; e.currentTarget.style.borderColor = 'rgba(255,179,0,0.55)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,179,0,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,179,0,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(d.id)}
                                style={S.deleteBtn}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.24)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="admin-designs-cards">
                    {filteredDesigns.map((d) => (
                      <div key={d.id} className="admin-design-card">
                        <img src={d.image} alt={d.name} className="admin-design-card__img" />
                        <div className="admin-design-card__info">
                          <p className="admin-design-card__name">
                            {d.name}
                            {d.badge && <span className="admin-design-card__badge">{d.badge}</span>}
                          </p>
                          <p className="admin-design-card__cat">
                            {d.categoryName}{d.subcategory ? ` › ${getSubcategoryLabel(d.category, d.subcategory)}` : ''}
                          </p>
                          <p className="admin-design-card__price">
                            ₹{d.price.toLocaleString('en-IN')}
                            {d.originalPrice && d.originalPrice > d.price && (
                              <span style={{ marginLeft: '6px', fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'line-through', fontWeight: '400' }}>
                                ₹{d.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <button
                              onClick={() => handleEditClick(d)}
                              style={{
                                ...S.editBtn,
                                marginRight: 0,
                                flex: 1,
                                justifyContent: 'center',
                                padding: '8px 12px',
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                              </svg>
                              Edit
                            </button>
                            <button
                              className="admin-design-card__delete"
                              onClick={() => handleDelete(d.id)}
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                padding: '8px 12px',
                                margin: 0,
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ─── RECENT PROJECTS TAB PANEL ─── */}
        {activeTab === 'projects' && (
          <>
            {/* Action row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <button
                onClick={isAddingProject ? handleProjectCancelClick : () => setIsAddingProject(true)}
                style={isAddingProject ? S.cancelBtn : S.addBtn}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(11,25,44,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isAddingProject ? 'none' : '0 4px 12px rgba(11,25,44,0.15)'; }}
              >
                {isAddingProject ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Completed Project
                  </>
                )}
              </button>
              <p style={{ color: '#6B7280', fontSize: '0.8rem', margin: 0 }}>
                Manage your dynamic completed portfolio showcase below
              </p>
            </div>

            {/* Add / Edit Project Form */}
            {isAddingProject && (
              <div style={S.formPanel}>
                <h3 style={S.formTitle}>
                  {editingProject ? '✏️ Edit Completed Project' : '✨ New Completed Project Details'}
                </h3>
                <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gap: '22px', gridTemplateColumns: '1fr 1fr' }} className="admin-form-grid">

                  {/* Title */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>Project Title *</label>
                    <input style={S.input} type="text" name="title" value={projectFormData.title}
                      onChange={handleProjectInputChange} required placeholder="e.g. Forest Safari 1st Birthday"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Description */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>Project Description *</label>
                    <textarea style={S.textarea} name="desc" value={projectFormData.desc}
                      onChange={handleProjectInputChange} required placeholder="Briefly describe what elements were created…"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Venue */}
                  <div>
                    <label style={S.label}>Venue & Location *</label>
                    <input style={S.input} type="text" name="venue" value={projectFormData.venue}
                      onChange={handleProjectInputChange} required placeholder="e.g. Prestige Clubhouse, Bangalore"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Date */}
                  <div>
                    <label style={S.label}>Completion Date *</label>
                    <input style={S.input} type="text" name="date" value={projectFormData.date}
                      onChange={handleProjectInputChange} required placeholder="e.g. May 12, 2026"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Cost */}
                  <div>
                    <label style={S.label}>Price / Budget Showcase *</label>
                    <input style={S.input} type="text" name="cost" value={projectFormData.cost}
                      onChange={handleProjectInputChange} required placeholder="e.g. ₹18,500"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Category Dropdown - Dynamic Categories from database list only */}
                  <div>
                    <label style={S.label}>Project Category *</label>
                    <div style={{ position: 'relative' }}>
                      <CustomSelect
                        name="category"
                        value={projectFormData.category}
                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                        placeholder="Select a Category"
                        onChange={handleProjectInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Customer Review */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>Customer Review (Optional)</label>
                    <textarea style={{ ...S.textarea, height: '70px' }} name="review" value={projectFormData.review}
                      onChange={handleProjectInputChange} placeholder="What did the client say? e.g. Amazing work, loved it! - Priya"
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {/* Image Upload */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>
                      {editingProject ? 'Change Project Image (Optional)' : 'Project Image *'}
                    </label>
                    <div style={{
                      border: '2px dashed rgba(11,25,44,0.2)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      background: 'rgba(255, 179, 0, 0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#FFB300'; }}
                      onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(11,25,44,0.2)'; }}
                    >
                      <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: '0 0 10px' }}>
                        {projectFile ? `📎 ${projectFile.name}` : '📁 Drag & drop or click to browse'}
                      </p>
                      <input type="file" accept="image/*" onChange={e => setProjectFile(e.target.files[0])} required={!editingProject}
                        style={{ color: '#4B5563', fontSize: '0.85rem', fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }} />
                    </div>
                  </div>

                  {/* Submit */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <button type="submit" disabled={projectUploading} style={S.saveBtn}
                      onMouseEnter={e => { if (!projectUploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,179,0,0.35)'; } }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(255,179,0,0.2)'; }}
                    >
                      {projectUploading ? (
                        <>⏳ Saving Project…</>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                          Save Project
                        </>
                      )}
                    </button>
                    {projectUploading && <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Uploading project image and saving...</span>}
                  </div>
                </form>
              </div>
            )}

            {/* Projects Table */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <p style={{ ...S.sectionTitle, margin: 0 }}>
                  📸 Portfolio Completed Projects — {filteredProjects.length !== recentProjects.length ? `${filteredProjects.length} of ${recentProjects.length}` : `${recentProjects.length}`} total
                </p>
                
                {/* Search */}
                <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                  <input
                    type="text"
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    placeholder="Search recent projects..."
                    style={{
                      ...S.input,
                      paddingLeft: '40px',
                      background: '#ffffff',
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#6B7280" 
                    strokeWidth="2.5" 
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  >
                    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  {projectSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setProjectSearchQuery('')}
                      style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.25rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', padding: 0, lineHeight: 1
                      }}
                      title="Clear search"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {recentProjects.length === 0 ? (
                <div style={{ ...S.tableWrap, padding: '60px', textAlign: 'center' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📸</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No completed projects yet. Click "Add Completed Project" to get started.</p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div style={{ ...S.tableWrap, padding: '60px', textAlign: 'center' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No projects found matching "{projectSearchQuery}".</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div style={S.tableWrap} className="admin-designs-table">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={S.th}>Image</th>
                          <th style={S.th}>Title</th>
                          <th style={S.th}>Category</th>
                          <th style={S.th}>Venue</th>
                          <th style={S.th}>Cost</th>
                          <th style={{ ...S.th, textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((p, i) => {
                          const catName = categories.find(c => c.id === p.category)?.name || p.category;
                          return (
                            <tr
                              key={p.id}
                              style={{ background: i % 2 === 0 ? 'transparent' : '#F9FAFB' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 179, 0, 0.04)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#F9FAFB'; }}
                            >
                              <td style={S.td}>
                                <img src={p.image} alt={p.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #D8DCE3' }} />
                              </td>
                              <td style={{ ...S.td, fontWeight: '700', color: '#0B192C' }}>
                                {p.title}
                                <div style={{ fontSize: '0.73rem', color: '#9CA3AF', fontWeight: '400', marginTop: '2px' }}>
                                  📅 {p.date}
                                </div>
                              </td>
                              <td style={S.td}>
                                <span style={{ color: '#4B5563' }}>{catName}</span>
                              </td>
                              <td style={S.td}>
                                <span style={{ color: '#4B5563' }}>📍 {p.venue}</span>
                              </td>
                              <td style={S.td}>
                                <span style={{ color: '#0B192C', fontWeight: '700' }}>{p.cost}</span>
                              </td>
                              <td style={{ ...S.td, textAlign: 'center' }}>
                                <button
                                  onClick={() => handleProjectEditClick(p)}
                                  style={S.editBtn}
                                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,179,0,0.22)'; e.currentTarget.style.borderColor = 'rgba(255,179,0,0.55)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,179,0,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,179,0,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleProjectDelete(p.id)}
                                  style={S.deleteBtn}
                                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.24)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="admin-designs-cards">
                    {filteredProjects.map((p) => {
                      const catName = categories.find(c => c.id === p.category)?.name || p.category;
                      return (
                        <div key={p.id} className="admin-design-card">
                          <img src={p.image} alt={p.title} className="admin-design-card__img" />
                          <div className="admin-design-card__info">
                            <p className="admin-design-card__name">
                              {p.title}
                            </p>
                            <p className="admin-design-card__cat">
                              {catName} · 📍 {p.venue}
                            </p>
                            <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '4px 0' }}>
                              📅 {p.date}
                            </p>
                            <p className="admin-design-card__price">
                              {p.cost}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                              <button
                                className="admin-design-card__edit"
                                onClick={() => handleProjectEditClick(p)}
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  padding: '8px 12px',
                                  margin: 0,
                                  ...S.editBtn,
                                }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                </svg>
                                Edit
                              </button>
                              <button
                                className="admin-design-card__delete"
                                onClick={() => handleProjectDelete(p.id)}
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  padding: '8px 12px',
                                  margin: 0,
                                }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ─── MELA SIGNATURE PACKAGES TAB PANEL ─── */}
        {activeTab === 'signature' && (() => {
          const signatureDesigns = designs.filter(d => d.isSignature);
          return (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                <button
                  onClick={isAdding ? handleCancelClick : () => { setIsAdding(true); setFormData(prev => ({ ...prev, isSignature: true })); }}
                  style={isAdding ? S.cancelBtn : S.addBtn}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(11,25,44,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isAdding ? 'none' : '0 4px 12px rgba(11,25,44,0.15)'; }}
                >
                  {isAdding ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Signature Package</>
                  )}
                </button>
                <p style={{ color: '#6B7280', fontSize: '0.8rem', margin: 0 }}>
                  ✨ These exclusive packages appear in the &quot;Mela Signature&quot; section on the storefront
                </p>
              </div>

              {/* Reuse the same design form panel */}
              {isAdding && (
                <div style={S.formPanel}>
                  <h3 style={S.formTitle}>
                    {editingDesign ? '✏️ Edit Signature Package' : '✨ New Mela Signature Package'}
                  </h3>
                  <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '22px', gridTemplateColumns: '1fr 1fr' }} className="admin-form-grid">
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={S.label}>Package Name *</label>
                      <input style={S.input} type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Royal Mela Extravaganza" onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={S.label}>Description *</label>
                      <textarea style={S.textarea} name="description" value={formData.description} onChange={handleInputChange} required placeholder="Describe this signature experience..." onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label style={S.label}>Category *</label>
                      <CustomSelect name="category" value={formData.category} options={categories.map(c => ({ value: c.id, label: c.name }))} placeholder="Select Category" onChange={handleInputChange} required />
                    </div>
                    <div>
                      <label style={S.label}>Price (₹) *</label>
                      <input style={S.input} type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="e.g. 45000" onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label style={S.label}>Original Price (₹) — for discount display</label>
                      <input style={S.input} type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="e.g. 55000" onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label style={S.label}>Features (comma separated) *</label>
                      <input style={S.input} type="text" name="features" value={formData.features} onChange={handleInputChange} required placeholder="e.g. Gold Arch, Premium Florals" onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    {/* isSignature hidden — always true for signature tab */}
                    <input type="hidden" name="isSignature" value="true" />
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={S.label}>{editingDesign ? 'Change Package Image (Optional)' : 'Upload Package Image *'}</label>
                      <div style={{ border: '2px dashed rgba(11,25,44,0.2)', borderRadius: '12px', padding: '20px', textAlign: 'center', background: 'rgba(255, 179, 0, 0.02)', cursor: 'pointer', transition: 'all 0.2s' }}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#FFB300'; }}
                        onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(11,25,44,0.2)'; }}
                      >
                        <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: '0 0 10px' }}>{file ? `📎 ${file.name}` : editingDesign ? '📁 Drag & drop or click to replace image' : '📁 Drag & drop or click to browse'}</p>
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required={!editingDesign}
                          style={{ color: '#4B5563', fontSize: '0.85rem', fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }} />
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <button type="submit" disabled={uploading} style={S.saveBtn}
                        onMouseEnter={e => { if (!uploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,179,0,0.35)'; } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(255,179,0,0.2)'; }}
                      >
                        {uploading ? <>⏳ Saving…</> : (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>{editingDesign ? ' Update Package' : ' Save Package'}</> )}
                      </button>
                      {uploading && <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Uploading image and saving...</span>}
                    </div>
                  </form>
                </div>
              )}

              {/* Signature Packages Table */}
              <div style={{ marginTop: '10px' }}>
                <p style={{ ...S.sectionTitle, marginBottom: '20px' }}>✨ Mela Signature Packages — {signatureDesigns.length} total</p>
                {signatureDesigns.length === 0 ? (
                  <div style={{ ...S.tableWrap, padding: '60px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</p>
                    <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No signature packages yet. Click "Add Signature Package" to create one.</p>
                  </div>
                ) : (
                  <div style={S.tableWrap} className="admin-designs-table">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={S.th}>Image</th>
                          <th style={S.th}>Package Name</th>
                          <th style={S.th}>Category</th>
                          <th style={S.th}>Price</th>
                          <th style={{ ...S.th, textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signatureDesigns.map((d, i) => (
                          <tr key={d.id}
                            style={{ background: i % 2 === 0 ? 'transparent' : '#F9FAFB' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 179, 0, 0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#F9FAFB'; }}
                          >
                            <td style={S.td}>
                              <img src={d.image} alt={d.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '2px solid rgba(255,179,0,0.4)' }} />
                            </td>
                            <td style={{ ...S.td, fontWeight: '700', color: '#0B192C' }}>
                              {d.name}
                              <span style={{ marginLeft: '8px', background: 'linear-gradient(135deg,#FFB300,#FF8F00)', borderRadius: '8px', padding: '2px 8px', fontSize: '0.62rem', color: '#fff', fontWeight: '800', letterSpacing: '0.1em', verticalAlign: 'middle' }}>SIGNATURE</span>
                            </td>
                            <td style={S.td}><span style={{ color: '#4B5563' }}>{d.categoryName}</span></td>
                            <td style={S.td}>
                              <span style={{ color: '#0B192C', fontWeight: '700' }}>₹{d.price.toLocaleString('en-IN')}</span>
                              {d.originalPrice && d.originalPrice > d.price && (
                                <div style={{ fontSize: '0.73rem', color: '#9CA3AF', textDecoration: 'line-through', marginTop: '2px' }}>₹{d.originalPrice.toLocaleString('en-IN')}</div>
                              )}
                            </td>
                            <td style={{ ...S.td, textAlign: 'center' }}>
                              <button
                                onClick={() => { handleEditClick(d); setActiveTab('signature'); }}
                                style={S.editBtn}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,179,0,0.22)'; e.currentTarget.style.borderColor = 'rgba(255,179,0,0.55)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,179,0,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,179,0,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(d.id)}
                                style={S.deleteBtn}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.24)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          );
        })()}

      </div>
    </div>
  );
};

export default AdminDashboard;
