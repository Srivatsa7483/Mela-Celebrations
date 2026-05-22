import React, { useState, useEffect } from 'react';
import { getDesigns, getCategories, createDesign, deleteDesign, uploadImage } from '../../services/designService';

/* ─── Shared style tokens ─────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    background: '#F8F9FB', // Light Background
    fontFamily: "'Jost', 'Inter', sans-serif",
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
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', description: '', category: '', subcategory: '', price: '', originalPrice: '', features: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('mela_admin_auth') !== 'true') {
      setCurrentPage('admin');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fetchedDesigns, fetchedCategories] = await Promise.all([getDesigns(), getCategories()]);
    setDesigns(fetchedDesigns);
    setCategories(fetchedCategories);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mela_admin_auth');
    setCurrentPage('home');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData(prev => ({ ...prev, category: value, subcategory: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getSubcategoriesForCategory = (catId) => {
    const category = categories.find(c => c.id === catId);
    if (!category || !category.dropdown) return [];
    const subs = [];
    category.dropdown.forEach(item => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { alert('Please upload an image for the design.'); return; }
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      const selectedCategoryObj = categories.find(c => c.id === formData.category);
      const newDesign = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        categoryName: selectedCategoryObj ? selectedCategoryObj.name : formData.category,
        subcategory: formData.subcategory || null,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        features: formData.features.split(',').map(f => f.trim()),
        image: imageUrl,
        badge: 'NEW',
      };
      await createDesign(newDesign);
      alert('Design added successfully!');
      setIsAdding(false);
      setFormData({ name: '', description: '', category: '', subcategory: '', price: '', originalPrice: '', features: '' });
      setFile(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Error adding design.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (designId) => {
    if (window.confirm('Are you sure you want to permanently delete this design?')) {
      try {
        await deleteDesign(designId);
        alert('Design deleted successfully!');
        loadData();
      } catch (error) {
        console.error('Error deleting design:', error);
        alert('Failed to delete the design.');
      }
    }
  };

  /* ─── Focus style helper ─── */
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

  const subcategories = getSubcategoriesForCategory(formData.category);

  return (
    <div style={S.page}>
      {/* ── Top Bar ── */}
      <div style={S.topBar}>
        <div style={S.logoRow}>
          <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          <div>
            <p style={S.logoTitle}>Mela Celebrations</p>
            <span style={S.logoBadge}>Admin Dashboard</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>
            {designs.length} designs · {categories.length} categories
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
      <div style={S.content}>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '18px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {[
            { num: designs.length, label: 'Total Designs', icon: '🖼️' },
            { num: categories.length, label: 'Categories', icon: '📁' },
            { num: designs.filter(d => d.badge === 'NEW').length, label: 'New Additions', icon: '✨' },
          ].map(stat => (
            <div key={stat.label} style={S.statCard}>
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{stat.icon}</div>
              <p style={S.statNum}>{stat.num}</p>
              <p style={S.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <button
            onClick={() => setIsAdding(!isAdding)}
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

        {/* ── Add Design Form ── */}
        {isAdding && (
          <div style={S.formPanel}>
            <h3 style={S.formTitle}>
              ✨ New Design Details
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '22px', gridTemplateColumns: '1fr 1fr' }}>

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
                  Subcategory {subcategories.length > 0 ? '*' : <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none', fontSize: '0.7rem' }}> (select a category first)</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <CustomSelect
                    name="subcategory"
                    value={formData.subcategory}
                    options={subcategories.map(sub => ({ value: sub.id, label: sub.label }))}
                    placeholder="Select a Subcategory"
                    onChange={handleInputChange}
                    disabled={subcategories.length === 0}
                    required={subcategories.length > 0}
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

              {/* Image Upload */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={S.label}>Upload Design Image *</label>
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
                    {file ? `📎 ${file.name}` : '📁 Drag & drop or click to browse'}
                  </p>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required
                    style={{ color: '#4B5563', fontSize: '0.85rem', fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }} />
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
                      Save Design
                    </>
                  )}
                </button>
                {uploading && <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Uploading image and saving...</span>}
              </div>
            </form>
          </div>
        )}

        {/* ── Designs Table ── */}
        <div style={{ marginTop: '10px' }}>
          <p style={S.sectionTitle}>
            📋 All Designs — {designs.length} total
          </p>

          {designs.length === 0 ? (
            <div style={{ ...S.tableWrap, padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🖼️</p>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No designs yet. Click "Add New Design" to get started.</p>
            </div>
          ) : (
            <div style={S.tableWrap}>
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
                  {designs.map((d, i) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
