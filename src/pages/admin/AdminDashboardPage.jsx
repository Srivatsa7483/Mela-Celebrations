import React, { useState, useEffect } from 'react';
import { getDesigns, getCategories, createDesign, uploadImage } from '../../services/designService';

const AdminDashboardPage = ({ setCurrentPage }) => {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    features: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Check Auth
    if (sessionStorage.getItem('mela_admin_auth') !== 'true') {
      setCurrentPage('admin');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fetchedDesigns, fetchedCategories] = await Promise.all([
      getDesigns(), getCategories()
    ]);
    setDesigns(fetchedDesigns);
    setCategories(fetchedCategories);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mela_admin_auth');
    setCurrentPage('home');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image for the design.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload Image
      const imageUrl = await uploadImage(file);
      
      // 2. Prepare Data
      const selectedCategoryObj = categories.find(c => c.id === formData.category);
      
      const newDesign = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        categoryName: selectedCategoryObj ? selectedCategoryObj.name : formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        features: formData.features.split(',').map(f => f.trim()),
        image: imageUrl, // Real Image URL
        badge: "NEW"
      };

      // 3. Save Design
      await createDesign(newDesign);
      
      // 4. Reset & Reload
      alert("Design added successfully!");
      setIsAdding(false);
      setFormData({ name: '', description: '', category: '', price: '', originalPrice: '', features: '' });
      setFile(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Error adding design.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#0c4a6e' }}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#c9a84c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isAdding ? "Cancel" : "+ Add New Design"}
        </button>
      </div>

      {isAdding && (
        <div style={{ backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3>Add New Design</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label>Design Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem', height: '80px' }}></textarea>
            </div>

            <div>
              <label>Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
            </div>

            <div>
              <label>Original Price (₹)</label>
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
            </div>

            <div>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }}>
                <option value="">Select a Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label>Features (comma separated)</label>
              <input type="text" name="features" value={formData.features} onChange={handleInputChange} placeholder="e.g. Red Balloons, Fairy Lights" required style={{ width: '100%', padding: '0.5rem' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label>Upload Real Image</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required style={{ width: '100%', padding: '0.5rem' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" disabled={uploading} style={{ padding: '0.75rem 2rem', backgroundColor: '#0c4a6e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {uploading ? "Uploading & Saving..." : "Save Design"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3>Current Designs ({designs.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Image</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {designs.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>
                  <img src={d.image} alt={d.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{d.name}</td>
                <td style={{ padding: '1rem' }}>{d.categoryName}</td>
                <td style={{ padding: '1rem' }}>₹{d.price.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
