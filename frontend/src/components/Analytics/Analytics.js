import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalItems: 0,
    categoryBreakdown: {},
    colorBreakdown: {},
    mostWornItems: [],
    leastWornItems: [],
    seasonalUsage: {},
    combinationHistory: [], // New
    lifecycleRecommendations: [] // New
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="analytics-container">
      <h2>Wardrobe Analytics</h2>

      <div className="analytics-grid">
        {/* Total Items */}
        <div className="analytics-card">
          <h3>Total Items</h3>
          <div className="stat-value">{analytics.totalItems}</div>
        </div>

        {/* Category Breakdown */}
        <div className="analytics-card">
          <h3>Category Breakdown</h3>
          <div className="breakdown-list">
            {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="breakdown-item">
                <span className="category">{category}</span>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Breakdown */}
        <div className="analytics-card">
          <h3>Color Distribution</h3>
          <div className="color-grid">
            {Object.entries(analytics.colorBreakdown).map(([color, count]) => (
              <div key={color} className="color-item">
                <div 
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                />
                <span className="color-name">{color}</span>
                <span className="color-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Worn Items */}
        <div className="analytics-card">
          <h3>Most Worn Items</h3>
          <div className="items-list">
            {analytics.mostWornItems.map(item => (
              <div key={item._id} className="item-row">
                <span className="item-name">{item.name}</span>
                <span className="wear-count">{item.wearCount} times</span>
              </div>
            ))}
          </div>
        </div>

        {/* Least Worn Items */}
        <div className="analytics-card">
          <h3>Least Worn Items</h3>
          <div className="items-list">
            {analytics.leastWornItems.map(item => (
              <div key={item._id} className="item-row">
                <span className="item-name">{item.name}</span>
                <span className="wear-count">{item.wearCount} times</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Usage */}
        <div className="analytics-card">
          <h3>Seasonal Usage</h3>
          <div className="seasonal-chart">
            {Object.entries(analytics.seasonalUsage).map(([season, count]) => (
              <div key={season} className="season-bar">
                <div className="bar-label">{season}</div>
                <div 
                  className="bar-fill"
                  style={{ width: `${(count / analytics.totalItems) * 100}%` }}
                />
                <div className="bar-value">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Combination History */}
        <div className="analytics-card">
          <h3>Combination History</h3>
          <div className="items-list">
            {analytics.combinationHistory.map((combo, index) => (
              <div key={index} className="item-row">
                <span className="item-name">
                  {combo.items.join(', ')}
                </span>
                <span className="rating">⭐ {combo.rating || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lifecycle Insights */}
        <div className="analytics-card">
          <h3>Clothing Lifecycle Insights</h3>
          <ul className="lifecycle-list">
            {analytics.lifecycleRecommendations.map(item => (
              <li key={item._id}>
                <strong>{item.name}</strong>: {item.recommendation}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
