import React, { useState } from 'react';
import './Trends.css';

const Trends = () => {
  const [trends] = useState([
    {
      title: 'Effortless Layering',
      description: "Layering lightweight pieces for a chic, adaptable look. Try a linen shirt over a tank top with relaxed trousers.",
      tips: ['Mix textures', 'Use neutral colors', 'Add a statement accessory'],
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    },
    {
      title: 'Pop of Color',
      description: 'Brighten up your outfit with a bold accessory or a vibrant top. Color blocking is in!',
      tips: ['Choose one bold color', 'Keep the rest neutral'],
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
    },
    {
      title: 'Relaxed Tailoring',
      description: 'Loose blazers and wide-leg pants are trending for a comfortable yet polished look.',
      tips: ['Go for oversized fits', 'Pair with sneakers'],
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    },
  ]);

  const [seasonalRecommendations] = useState([
    {
      season: 'Summer',
      title: 'Breezy Summer Outfits',
      description: 'Opt for breathable fabrics like cotton and linen. Pair shorts with loose shirts and sandals.',
      image: 'https://images.unsplash.com/photo-1469398715555-76331a6c7c9b',
      combos: ['Shorts + Linen Shirt', 'Maxi Dress + Sandals', 'T-shirt + Skirt'],
    },
    {
      season: 'Winter',
      title: 'Cozy Winter Layers',
      description: "Layer up with knits, scarves, and boots. Don't forget a statement coat!",
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      combos: ['Sweater + Jeans + Boots', 'Turtleneck + Coat', 'Dress + Tights + Ankle Boots'],
    },
  ]);

  // Placeholder analytics data
  const [analytics] = useState({
    wearFrequency: [
      { name: 'Blue Denim Jacket', count: 12 },
      { name: 'White T-shirt', count: 20 },
      { name: 'Black Jeans', count: 15 },
    ],
    combinationHistory: [
      { date: '2024-06-10', items: ['Blue Denim Jacket', 'White T-shirt', 'Black Jeans'], rating: 5 },
      { date: '2024-06-09', items: ['Sweater', 'Jeans'], rating: 4 },
    ],
    lifecycle: [
      { name: 'White T-shirt', wears: 50, recommendation: 'Consider replacing soon' },
      { name: 'Blue Denim Jacket', wears: 12, recommendation: 'Good condition' },
    ],
  });

  return (
    <div className="trends-container">
      <h2>Daily Dressing Trends</h2>
      <div className="trends-grid">
        {trends.map((trend, idx) => (
          <div className="trend-card" key={idx}>
            <img src={trend.image} alt={trend.title} className="trend-img" />
            <div className="trend-content">
              <h3>{trend.title}</h3>
              <p>{trend.description}</p>
              <ul className="trend-tips">
                {trend.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <h2>Seasonal Recommendations</h2>
      <div className="trends-grid">
        {seasonalRecommendations.map((rec, idx) => (
          <div className="trend-card" key={idx}>
            <img src={rec.image} alt={rec.title} className="trend-img" />
            <div className="trend-content">
              <h3>{rec.title}</h3>
              <p>{rec.description}</p>
              <ul className="trend-combos">
                {rec.combos.map((combo, i) => <li key={i}>{combo}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <h2>Analytics & Insights</h2>
      <div className="analytics-section">
        <div className="analytics-card">
          <h3>Wear Frequency Stats</h3>
          <ul>
            {analytics.wearFrequency.map((item, idx) => (
              <li key={idx}>{item.name}: {item.count} wears</li>
            ))}
          </ul>
        </div>
        <div className="analytics-card">
          <h3>Combination History</h3>
          <ul>
            {analytics.combinationHistory.map((combo, idx) => (
              <li key={idx}>{combo.date}: {combo.items.join(' + ')} (Rating: {combo.rating}/5)</li>
            ))}
          </ul>
        </div>
        <div className="analytics-card">
          <h3>Clothing Lifecycle Insights</h3>
          <ul>
            {analytics.lifecycle.map((item, idx) => (
              <li key={idx}>{item.name}: {item.wears} wears - {item.recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Trends; 