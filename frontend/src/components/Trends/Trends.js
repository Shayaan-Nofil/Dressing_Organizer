import React, { useState, useEffect } from 'react';
import './Trends.css';
import { getWearFrequencyStats, getAllItems } from '../../services/clothing';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

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
  // Real analytics data
  const [analytics, setAnalytics] = useState({
    wearFrequency: [],
    combinationHistory: [],
    lifecycle: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [wearStats, allItems] = await Promise.all([
          getWearFrequencyStats(),
          getAllItems()
        ]);

        // Process wear frequency data
        const sortedByWears = wearStats.sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0)).slice(0, 10);
        
        // Create lifecycle recommendations
        const lifecycle = allItems.map(item => {
          const wears = item.timesWorn || 0;
          let recommendation = 'New item';
          if (wears > 50) recommendation = 'Consider replacing soon';
          else if (wears > 30) recommendation = 'Well-worn, still good';
          else if (wears > 10) recommendation = 'Good condition';
          
          return {
            name: item.name,
            image: item.image,
            wears,
            recommendation
          };
        }).slice(0, 5);

        setAnalytics({
          wearFrequency: sortedByWears,
          combinationHistory: [], // This would need outfit history data
          lifecycle
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Keep fallback data if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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
      </div>      <h2>Analytics & Insights</h2>
      {loading ? (
        <div>Loading analytics...</div>
      ) : (
        <div className="analytics-section">
          <div className="analytics-card">
            <h3>Most Worn Items</h3>
            <div className="wear-frequency-grid">
              {analytics.wearFrequency.map((item, idx) => (
                <div key={item._id || idx} className="wear-frequency-item">
                  <img 
                    src={getImageUrl(item.image) || getPlaceholderImage(60, 60)} 
                    alt={item.name}
                    className="wear-frequency-img"
                  />
                  <div className="wear-frequency-info">
                    <strong>{item.name}</strong>
                    <span>{item.timesWorn || 0} wears</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="analytics-card">
            <h3>Combination History</h3>
            <ul>
              {analytics.combinationHistory.length > 0 ? (
                analytics.combinationHistory.map((combo, idx) => (
                  <li key={idx}>{combo.date}: {combo.items.join(' + ')} (Rating: {combo.rating}/5)</li>
                ))
              ) : (
                <li>No combination history available yet</li>
              )}
            </ul>
          </div>
          <div className="analytics-card">
            <h3>Clothing Lifecycle Insights</h3>
            <div className="lifecycle-grid">
              {analytics.lifecycle.map((item, idx) => (
                <div key={idx} className="lifecycle-item">
                  <img 
                    src={getImageUrl(item.image) || getPlaceholderImage(50, 50)} 
                    alt={item.name}
                    className="lifecycle-img"
                  />
                  <div className="lifecycle-info">
                    <strong>{item.name}</strong>
                    <span>{item.wears} wears</span>
                    <small>{item.recommendation}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trends; 