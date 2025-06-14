import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Dressing Organizer</h1>
      </div>
      <ul className="nav-links">
        <li><a href="/wardrobe">My Wardrobe</a></li>
        <li><a href="/outfits">Outfits</a></li>
        <li><a href="/analytics">Analytics</a></li>
        <li><a href="/trends">Trends</a></li>
      </ul>
    </nav>
  );
};

export default Navbar; 