const Outfit = require('../models/Outfit');
const ClothingItem = require('../models/ClothingItem');

// GET /api/analytics - Wardrobe analytics and outfit history
exports.getAnalytics = async (req, res) => {
  try {
    // Most/least worn items: based on lastWorn or a wearCount field (not present, so count from outfit history)
    // For now, we'll count how many times each item appears in outfits' history
    const allOutfits = await Outfit.find({ userId: req.user.id }).populate('items');
    const allItems = await ClothingItem.find({ userId: req.user.id });

    // --- Most/Least Worn Items ---
    const itemWearCounts = {};
    allOutfits.forEach(outfit => {
      (outfit.items || []).forEach(item => {
        itemWearCounts[item._id] = (itemWearCounts[item._id] || 0) + 1;
      });
    });
    const itemsWithWear = allItems.map(item => ({
      _id: item._id,
      name: item.name,
      wearCount: itemWearCounts[item._id] || 0
    }));
    const mostWornItems = [...itemsWithWear].sort((a, b) => b.wearCount - a.wearCount).slice(0, 5);
    const leastWornItems = [...itemsWithWear].sort((a, b) => a.wearCount - b.wearCount).slice(0, 5);

    // --- Category Breakdown ---
    const categoryBreakdown = {};
    allItems.forEach(item => {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;
    });

    // --- Color Breakdown ---
    const colorBreakdown = {};
    allItems.forEach(item => {
      colorBreakdown[item.color] = (colorBreakdown[item.color] || 0) + 1;
    });

    // --- Seasonal Usage ---
    const seasonalUsage = {};
    allOutfits.forEach(outfit => {
      if (outfit.season) {
        seasonalUsage[outfit.season] = (seasonalUsage[outfit.season] || 0) + 1;
      }
    });

    // --- Combination History ---
    // Show last 10 worn outfits with items and rating
    const combinationHistory = allOutfits
      .sort((a, b) => (b.lastWorn || b.updatedAt) - (a.lastWorn || a.updatedAt))
      .slice(0, 10)
      .map(outfit => ({
        items: (outfit.items || []).map(item => item.name),
        rating: outfit.rating || null,
        lastWorn: outfit.lastWorn || outfit.updatedAt
      }));

    // --- Lifecycle Recommendations (simple: old or rarely worn items) ---
    const lifecycleRecommendations = allItems.map(item => {
      let recommendation = '';
      if ((itemWearCounts[item._id] || 0) === 0) {
        recommendation = 'Consider donating or restyling this item.';
      } else if (item.condition && item.condition === 'Poor') {
        recommendation = 'Consider replacing this item soon.';
      } else if (item.purchaseDate && (Date.now() - new Date(item.purchaseDate)) > 2 * 365 * 24 * 60 * 60 * 1000) {
        recommendation = 'This item is over 2 years old.';
      }
      return {
        _id: item._id,
        name: item.name,
        recommendation
      };
    }).filter(item => item.recommendation);

    res.json({
      totalItems: allItems.length,
      categoryBreakdown,
      colorBreakdown,
      mostWornItems,
      leastWornItems,
      seasonalUsage,
      combinationHistory,
      lifecycleRecommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
