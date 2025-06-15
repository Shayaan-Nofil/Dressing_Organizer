import React, { useState, useEffect } from 'react';
import './Wardrobe.css';

const Wardrobe = () => {
  const [clothingItems, setClothingItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    category: '',
    color: '',
    image: null,
    lastWorn: '',
    notes: '',
    season: '',
    brand: '',
    size: '',
    condition: 'New',
    purchaseDate: '',
    price: ''
  });

  const itemTypes = [
    'Shirt', 'T-shirt', 'Blouse', 'Sweater', 'Jacket', 'Coat', 'Blazer',
    'Pants', 'Jeans', 'Shorts', 'Skirt', 'Dress', 'Jumpsuit', 'Suit',
    'Shoes', 'Boots', 'Sandals', 'Sneakers', 'Heels', 'Accessories'
  ];

  const categories = [
    'Casual', 'Formal', 'Business', 'Party', 'Wedding', 'Sports',
    'Beach', 'Evening', 'Outdoor', 'Loungewear', 'Sleepwear'
  ];

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All Seasons'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchClothingItems();
  }, []);
  const fetchClothingItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/clothing-items', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clothing items: ${response.status}`);
      }
      
      const data = await response.json();
      setClothingItems(data);
    } catch (error) {
      console.error('Error fetching clothing items:', error);
      // For development, add some sample data if API is not available
      setClothingItems([
        {
          id: 1,
          name: 'Blue Denim Jacket',
          type: 'Jacket',
          category: 'Casual',
          color: '#1E90FF',
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
          lastWorn: '2024-03-15',
          season: 'Spring',
          condition: 'Good'
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newItem).forEach(key => {
        if (newItem[key]) formData.append(key, newItem[key]);
      });

      // Debug: log FormData content
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/clothing-items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const addedItem = await response.json();
        setClothingItems(prev => [...prev, addedItem]);
        setShowAddForm(false);
        setNewItem({
          name: '',
          type: '',
          category: '',
          color: '',
          image: null,
          lastWorn: '',
          notes: '',
          season: '',
          brand: '',
          size: '',
          condition: 'New',
          purchaseDate: '',
          price: ''
        });
      } else {
        const errorText = await response.text();
        alert('Error adding clothing item: ' + errorText);
        console.error('Error adding clothing item:', errorText);
      }
    } catch (error) {
      alert('Error adding clothing item: ' + error.message);
      console.error('Error adding clothing item:', error);
    }
  };

  const handleLastWorn = async (itemId) => {
    const today = new Date().toISOString().split('T')[0];    try {
      // For development, simulate API call
      setClothingItems(prev =>
        prev.map(item => 
          item.id === itemId 
            ? { ...item, lastWorn: today }
            : item
        )
      );

      // In production, use this API call:
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/clothing-items/${itemId}/last-worn`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lastWorn: today })
      });
      
      if (!response.ok) {
        console.error('Failed to update last worn date:', response.status);
      }
    } catch (error) {
      console.error('Error updating last worn date:', error);
    }
  };

  return (
    <div className="wardrobe-container">
      <div className="wardrobe-header">
        <h2>My Wardrobe</h2>
        <button 
          className="add-item-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add New Item
        </button>
      </div>

      {showAddForm && (
        <div className="add-item-form">
          <h3>Add New Clothing Item</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type:</label>
                <select
                  name="type"
                  value={newItem.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {itemTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Category:</label>
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Color:</label>
                <input
                  type="color"
                  name="color"
                  value={newItem.color}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Season:</label>
                <select
                  name="season"
                  value={newItem.season}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Season</option>
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Brand:</label>
                <input
                  type="text"
                  name="brand"
                  value={newItem.brand}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Size:</label>
                <input
                  type="text"
                  name="size"
                  value={newItem.size}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Condition:</label>
                <select
                  name="condition"
                  value={newItem.condition}
                  onChange={handleInputChange}
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Purchase Date:</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={newItem.purchaseDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={newItem.notes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {newItem.image && (
                  <div className="image-preview">
                    <img src={typeof newItem.image === 'string' ? newItem.image : URL.createObjectURL(newItem.image)} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Add Item</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="clothing-items-grid">
        {clothingItems.map(item => (
          <div key={item._id || item.id} className="clothing-item-card">
            {item.image && (
              <div className="item-image">
                <img src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `http://localhost:5000/${item.image}`} alt={item.name} />
              </div>
            )}
            <div className="item-details">
              <h3>{item.name}</h3>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Color:</strong> 
                <span 
                  className="color-dot" 
                  style={{ backgroundColor: item.color }}
                />
              </p>
              <p><strong>Last Worn:</strong> {item.lastWorn || 'Never'}</p>
              <p><strong>Season:</strong> {item.season}</p>
              <p><strong>Condition:</strong> {item.condition}</p>
              {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
              <button 
                className="last-worn-btn"
                onClick={() => handleLastWorn(item._id || item.id)}
              >
                Mark as Worn Today
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe; 