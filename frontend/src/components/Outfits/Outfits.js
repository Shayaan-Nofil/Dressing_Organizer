import React, { useState, useEffect } from 'react';
import './Outfits.css';

const Outfits = () => {
  const [clothingItems, setClothingItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newOutfit, setNewOutfit] = useState({
    name: '',
    occasion: '',
    weather: '',
    notes: '',
    season: '',
    style: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchClothingItems();
    fetchOutfits();
  }, []);

  const fetchClothingItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clothing-items');
      const data = await response.json();
      setClothingItems(data);
    } catch (error) {
      setClothingItems([]);
    }
  };

  const fetchOutfits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/outfits');
      const data = await response.json();
      setOutfits(data);
    } catch (error) {
      setOutfits([]);
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOutfit(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage('Please select at least one item for the outfit.');
      setMessageType('error');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const body = {
        ...newOutfit,
        items: selectedItems,
      };
      const response = await fetch('http://localhost:5000/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        await fetchOutfits();
        setShowAddForm(false);
        setSelectedItems([]);
        setNewOutfit({ name: '', occasion: '', weather: '', notes: '', season: '', style: '' });
        setMessage('Outfit created successfully!');
        setMessageType('success');
      } else {
        setMessage('Error creating outfit. Please check your input.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error creating outfit. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // AI Suggestion: pick a random item from each type (top, bottom, shoes)
  const handleSuggestOutfit = () => {
    const tops = clothingItems.filter(item => ['Shirt', 'T-shirt', 'Blouse', 'Sweater', 'Jacket', 'Coat', 'Blazer'].includes(item.type));
    const bottoms = clothingItems.filter(item => ['Pants', 'Jeans', 'Shorts', 'Skirt'].includes(item.type));
    const shoes = clothingItems.filter(item => ['Shoes', 'Boots', 'Sandals', 'Sneakers', 'Heels'].includes(item.type));
    const pick = arr => arr.length ? arr[Math.floor(Math.random() * arr.length)]._id : null;
    const suggestion = [pick(tops), pick(bottoms), pick(shoes)].filter(Boolean);
    if (suggestion.length < 2) {
      setMessage('Not enough variety in your wardrobe for an intelligent suggestion.');
      setMessageType('error');
      return;
    }
    setSelectedItems(suggestion);
    setShowAddForm(true);
    setMessage('AI suggested an outfit! You can edit or save it.');
    setMessageType('success');
  };

  return (
    <div className="outfits-container">
      <div className="outfits-header">
        <h2>Outfits</h2>
        <button className="add-outfit-btn" onClick={() => { setShowAddForm(true); setMessage(null); }}>Create New Outfit</button>
        <button className="suggest-outfit-btn" onClick={handleSuggestOutfit}>AI Suggest Outfit</button>
      </div>

      {message && (
        <div style={{
          margin: '1rem auto',
          maxWidth: 600,
          padding: '0.8rem 1.2rem',
          borderRadius: 6,
          background: messageType === 'success' ? '#e8f5e9' : '#ffebee',
          color: messageType === 'success' ? '#256029' : '#b71c1c',
          border: `1.5px solid ${messageType === 'success' ? '#a5d6a7' : '#ffcdd2'}`,
          textAlign: 'center',
          fontWeight: 500
        }}>{message}</div>
      )}

      {showAddForm && (
        <div className="add-outfit-form">
          <h3>Create New Outfit</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={newOutfit.name} onChange={handleInputChange} placeholder="Outfit Name" required />
            <input type="text" name="occasion" value={newOutfit.occasion} onChange={handleInputChange} placeholder="Occasion" />
            <input type="text" name="weather" value={newOutfit.weather} onChange={handleInputChange} placeholder="Weather" />
            <input type="text" name="season" value={newOutfit.season} onChange={handleInputChange} placeholder="Season" />
            <input type="text" name="style" value={newOutfit.style} onChange={handleInputChange} placeholder="Style" />
            <textarea name="notes" value={newOutfit.notes} onChange={handleInputChange} placeholder="Notes" />
            <div className="wardrobe-items-select">
              <h4>Select Items:</h4>
              <div className="wardrobe-items-list">
                {clothingItems.map(item => (
                  <div key={item._id} className={`wardrobe-item-card ${selectedItems.includes(item._id) ? 'selected' : ''}`} onClick={() => handleItemSelect(item._id)}>
                    {item.image && (
                      <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`} alt={item.name} />
                    )}
                    <div>{item.name}</div>
                    <div className="item-type">{item.type}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading || selectedItems.length === 0} style={{ opacity: loading || selectedItems.length === 0 ? 0.6 : 1 }}>
                {loading ? 'Saving...' : 'Save Outfit'}
              </button>
              <button type="button" className="cancel-btn" onClick={() => { setShowAddForm(false); setMessage(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="outfits-list">
        {outfits.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', width: '100%', marginTop: '2rem' }}>
            No outfits yet. Start by creating your first outfit!
          </div>
        ) : (
          outfits.map(outfit => (
            <div key={outfit._id} className="outfit-card">
              <h3>{outfit.name}</h3>
              <div className="outfit-items">
                {outfit.items && outfit.items.map(item => (
                  <div key={item._id} className="outfit-item">
                    {item.image && (
                      <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`} alt={item.name} />
                    )}
                    <div>{item.name}</div>
                    <div className="item-type">{item.type}</div>
                  </div>
                ))}
              </div>
              <div className="outfit-details">
                <span><strong>Occasion:</strong> {outfit.occasion}</span>
                <span><strong>Weather:</strong> {outfit.weather}</span>
                <span><strong>Season:</strong> {outfit.season}</span>
                <span><strong>Style:</strong> {outfit.style}</span>
                <span><strong>Notes:</strong> {outfit.notes}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Outfits; 