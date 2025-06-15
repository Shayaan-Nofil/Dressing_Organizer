import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import './Analytics.css';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

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
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.entries(analytics.categoryBreakdown || {}).map(([category, count]) => ({ name: category, value: count }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {Object.entries(analytics.categoryBreakdown || {}).map(([category], idx) => (
                  <Cell key={`cell-${category}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57'][idx % 7]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Color Breakdown */}
        <div className="analytics-card">
          <h3>Color Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(analytics.colorBreakdown).map(([color, count]) => ({ color, count }))}>
              <XAxis dataKey="color" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="count" fill="#8884d8">
                {Object.entries(analytics.colorBreakdown).map(([color], idx) => (
                  <Cell key={`cell-bar-${color}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57'][idx % 7]} />
                ))}
              </Bar>
              <RechartsTooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(analytics.seasonalUsage).map(([season, count]) => ({ season, count }))}>
              <XAxis dataKey="season" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="count" fill="#ff8042">
                {Object.entries(analytics.seasonalUsage).map(([season], idx) => (
                  <Cell key={`cell-season-${season}`} fill={['#ff8042', '#8884d8', '#82ca9d', '#ffc658'][idx % 4]} />
                ))}
              </Bar>
              <RechartsTooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
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
              <li key={item._id} style={{ marginBottom: 8 }}>
                <strong>{item.name}</strong>: {item.recommendation}
                <div style={{ display: 'inline-block', marginLeft: 12 }}>
                  <ActionButtons itemId={item._id} />
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

// ActionButtons component for lifecycle actions
const ActionButtons = ({ itemId }) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async (action) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/clothing-items/${itemId}/lifecycle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error('Failed to update.');
      setDone(true);
    } catch (e) {
      setError('Failed!');
    } finally {
      setLoading(false);
    }
  };

  if (done) return <span style={{ color: 'green', marginLeft: 8 }}>✔️ Updated</span>;
  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" variant="outlined" color="success" disabled={loading} onClick={() => handleAction('donate')}>Donate</Button>
      <Button size="small" variant="outlined" color="warning" disabled={loading} onClick={() => handleAction('restyle')}>Restyle</Button>
      <Button size="small" variant="outlined" color="error" disabled={loading} onClick={() => handleAction('replace')}>Replace</Button>
      {loading && <span style={{ marginLeft: 4 }}>...</span>}
      {error && <span style={{ color: 'red', marginLeft: 4 }}>{error}</span>}
    </Stack>
  );
};

export default Analytics;
