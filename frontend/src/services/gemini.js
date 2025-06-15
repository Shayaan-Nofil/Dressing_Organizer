// services/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCpIRHDrooZXfGiveOMQr40f5TFyjSZpsg');

// Helper function to convert file to base64
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

/**
 * Generate outfit suggestions based on user's wardrobe and preferences
 * @param {Array} userItems - Array of user's clothing items
 * @param {string} occasion - Occasion for the outfit
 * @param {string} weather - Current or expected weather
 * @returns {Promise<Object>} - Generated outfit suggestion
 */
export const generateOutfitSuggestion = async (userItems, filters = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const occasion = filters.occasion || 'casual';
    const weather = filters.weather || 'moderate';
    const style = filters.style || '';
    
    const prompt = `You are a fashion assistant. Create an outfit using ONLY items from the user's wardrobe below.
      
User's Available Items:
${userItems.map(item => `- ID: ${item._id}, Name: ${item.name}, Type: ${item.type}, Category: ${item.category}, Color: ${item.color}, Season: ${item.season}`).join('\n')}

Requirements:
- Occasion: ${occasion}
- Weather: ${weather}
${style ? `- Style: ${style}` : ''}

IMPORTANT: You must return a valid JSON object with this exact structure and ONLY use item IDs from the list above:
{
  "items": ["item_id_1", "item_id_2", "item_id_3"],
  "reasoning": "Brief explanation of why this outfit works well"
}

Select 2-4 items that work well together for the given occasion and weather.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from markdown code block if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating outfit suggestion:', error);
    throw new Error('Failed to generate outfit suggestion');
  }
};

/**
 * Analyze a clothing item from an image
 * @param {File} imageFile - Image file of the clothing item
 * @returns {Promise<Object>} - Analysis of the clothing item
 */
export const analyzeClothingImage = async (imageFile) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = await fileToBase64(imageFile);
    
    const result = await model.generateContent([
      "Analyze this clothing item and return a JSON object with these fields: {" +
      "type: string (shirt, pants, dress, etc.), " +
      "color: string, " +
      "style: string (casual, formal, sporty, etc.), " +
      "isFormal: boolean, " +
      "suitableSeasons: string[] (summer, winter, etc.)}",
      { 
        inlineData: { 
          data: imageBase64, 
          mimeType: imageFile.type || 'image/jpeg' 
        } 
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error analyzing clothing image:', error);
    throw new Error('Failed to analyze clothing image');
  }
};

/**
 * Get fashion trends based on season and location
 * @param {string} season - Current season
 * @param {string} location - User's location
 * @returns {Promise<string>} - Formatted markdown with trends
 */
export const getFashionTrends = async (season = 'summer', location = '') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `What are the top 5 fashion trends for ${season} ${location ? 'in ' + location : ''}? 
      Include color palettes and styling tips. Format as markdown.`;
    

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting fashion trends:', error);
    throw new Error('Failed to fetch fashion trends');
  }
};

/**
 * Rate an outfit and provide feedback
 * @param {Object} outfitDetails - Details of the outfit to rate
 * @returns {Promise<Object>} - Rating and feedback
 */
export const rateOutfit = async (outfitDetails) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Rate this outfit out of 10 and provide feedback: ${JSON.stringify(outfitDetails)}. 
      Consider color coordination, occasion appropriateness, and style. 
      Return as JSON: {"rating": number, "feedback": string, "improvementTips": string[]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from markdown code block if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error rating outfit:', error);
    throw new Error('Failed to rate outfit');
  }
};

/**
 * Smart Wardrobe Assistant - Analyzes wardrobe and suggests improvements
 * @param {Array} userItems - User's clothing items
 * @param {Object} preferences - User preferences (budget, lifestyle, etc.)
 * @returns {Promise<Object>} - Wardrobe analysis and recommendations
 */
export const analyzeWardrobeGaps = async (userItems, preferences = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { budget = 'moderate', lifestyle = 'casual', priorities = [] } = preferences;
    
    // Categorize existing items
    const itemsByCategory = userItems.reduce((acc, item) => {
      const category = item.category || item.type || 'miscellaneous';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
    
    const prompt = `You are a professional wardrobe consultant. Analyze this wardrobe and provide strategic recommendations.

CURRENT WARDROBE:
${Object.entries(itemsByCategory).map(([category, items]) => 
  `${category.toUpperCase()}: ${items.map(item => `${item.name} (${item.color})`).join(', ')}`
).join('\n')}

USER PROFILE:
- Budget: ${budget}
- Lifestyle: ${lifestyle}
- Priorities: ${priorities.join(', ') || 'versatility, style'}

ANALYSIS REQUIRED:
1. Identify wardrobe gaps and missing essentials
2. Suggest strategic purchases that maximize outfit combinations
3. Identify redundant items that could be donated/replaced
4. Recommend color palette improvements
5. Suggest versatile items that work with existing pieces

Return a JSON object with this structure:
{
  "gapsAnalysis": {
    "missingEssentials": ["item description"],
    "underdevelopedCategories": ["category name"],
    "colorGaps": ["color suggestions"]
  },
  "strategicPurchases": [
    {
      "item": "item description",
      "priority": "high/medium/low",
      "reasoning": "why this item is important",
      "versatilityScore": 1-10,
      "estimatedCost": "price range"
    }
  ],
  "redundantItems": [
    {
      "items": ["similar item names"],
      "recommendation": "keep/donate suggestion"
    }
  ],
  "styleOptimization": {
    "colorPaletteAdvice": "color strategy",
    "versatilityTips": ["tip1", "tip2"],
    "overallScore": 1-10
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error analyzing wardrobe gaps:', error);
    throw new Error('Failed to analyze wardrobe');
  }
};

/**
 * Generate shopping recommendations based on wardrobe analysis
 * @param {Array} userItems - User's clothing items
 * @param {Object} budget - Budget constraints
 * @param {string} targetSeason - Season to shop for
 * @returns {Promise<Object>} - Smart shopping recommendations
 */
export const generateShoppingList = async (userItems, budget = {}, targetSeason = 'current') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { maxAmount = 500, priority = 'essentials' } = budget;
    
    const prompt = `Create a strategic shopping list for this wardrobe.

CURRENT ITEMS: ${userItems.map(item => `${item.name} (${item.category}, ${item.color})`).join(', ')}

BUDGET: $${maxAmount}
PRIORITY: ${priority}
SEASON: ${targetSeason}

Create a prioritized shopping list that maximizes wardrobe versatility within budget.

Return JSON:
{
  "shoppingList": [
    {
      "item": "item description",
      "category": "clothing category",
      "priority": 1-5,
      "estimatedPrice": "$X-Y",
      "reasoning": "why needed",
      "compatibleWith": ["existing items it works with"],
      "seasonality": "season suitability"
    }
  ],
  "budgetBreakdown": {
    "essentials": "$amount",
    "versatilePieces": "$amount",
    "trendItems": "$amount"
  },
  "maxOutfitPotential": "number of new outfit combinations possible"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating shopping list:', error);
    throw new Error('Failed to generate shopping recommendations');
  }
};

/**
 * Social Context Advisor - Suggests culturally and socially appropriate outfits
 * @param {Object} context - Social context details
 * @param {Array} userItems - Available clothing items
 * @returns {Promise<Object>} - Context-appropriate outfit suggestions
 */
export const getSocialContextAdvice = async (context, userItems) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const {
      eventType = '',
      location = '',
      culturalContext = '',
      attendeeProfile = '',
      duration = '',
      timeOfDay = '',
      formality = 'casual'
    } = context;
    
    const prompt = `You are a cultural etiquette and fashion expert. Provide socially appropriate outfit advice.

EVENT CONTEXT:
- Event Type: ${eventType}
- Location: ${location}
- Cultural Context: ${culturalContext}
- Attendee Profile: ${attendeeProfile}
- Duration: ${duration}
- Time of Day: ${timeOfDay}
- Formality Level: ${formality}

AVAILABLE CLOTHING:
${userItems.map(item => `- ${item.name} (${item.type}, ${item.color}, ${item.category})`).join('\n')}

REQUIREMENTS:
1. Suggest appropriate outfit combinations from available items
2. Highlight any cultural considerations
3. Provide alternative options for different comfort levels
4. Include what to avoid and why
5. Suggest adjustments for better fit to context

Return JSON:
{
  "primaryRecommendation": {
    "items": ["item IDs from user wardrobe"],
    "reasoning": "why this combination works",
    "culturalAppropriatenesss": "explanation",
    "confidenceLevel": 1-10
  },
  "alternativeOptions": [
    {
      "items": ["item IDs"],
      "description": "more/less conservative option",
      "whenToChoose": "circumstances for this choice"
    }
  ],
  "culturalConsiderations": {
    "doWear": ["appropriate elements"],
    "avoid": ["items/styles to avoid"],
    "respectfulChoices": ["culturally sensitive options"]
  },
  "socialDynamics": {
    "fitsGroupSetting": true/false,
    "attentionLevel": "appropriate/too flashy/too understated",
    "confidenceBoost": "how outfit affects presence"
  },
  "practicalAdvice": {
    "comfortLevel": "assessment",
    "mobilityConsiderations": "advice for event activities",
    "weatherAppropriate": true/false
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error getting social context advice:', error);
    throw new Error('Failed to analyze social context');
  }
};

/**
 * Cultural Appropriateness Checker
 * @param {Array} outfitItems - Selected outfit items
 * @param {Object} culturalContext - Cultural setting details
 * @returns {Promise<Object>} - Appropriateness assessment
 */
export const checkCulturalAppropriateness = async (outfitItems, culturalContext) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { country = '', religion = '', occasion = '', customsInfo = '' } = culturalContext;
    
    const prompt = `Assess the cultural appropriateness of this outfit.

OUTFIT: ${outfitItems.map(item => `${item.name} (${item.type})`).join(', ')}

CULTURAL CONTEXT:
- Country/Region: ${country}
- Religious Considerations: ${religion}
- Specific Occasion: ${occasion}
- Additional Customs: ${customsInfo}

Provide a respectful assessment focusing on cultural sensitivity.

Return JSON:
{
  "overallAppropriateness": "appropriate/needs-modification/inappropriate",
  "confidenceScore": 1-10,
  "specificIssues": [
    {
      "item": "item name",
      "concern": "specific cultural issue",
      "severity": "minor/moderate/major",
      "suggestion": "how to modify or replace"
    }
  ],
  "positiveAspects": ["what works well culturally"],
  "modifications": [
    {
      "change": "specific modification",
      "reasoning": "cultural consideration"
    }
  ],
  "learningPoints": ["cultural insights for future reference"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error checking cultural appropriateness:', error);
    throw new Error('Failed to assess cultural appropriateness');
  }
};