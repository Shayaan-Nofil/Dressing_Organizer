// services/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_API_KEY');

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
export const generateOutfitSuggestion = async (userItems, occasion = 'casual', weather = 'moderate') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a fashion assistant. Create an outfit using the following items from the user's wardrobe.
      
User's Items (ID, Type, Color, Style):
${userItems.map(item => `- ${item.name} (${item.type}, ${item.color}, ${item.style || 'casual'})`).join('\n')}

Occasion: ${occasion}
Weather: ${weather}

Return a JSON object with this structure:
{
  "outfit": {
    "top": "Item name and description",
    "bottom": "Item name and description",
    "shoes": "Item name and description",
    "accessories": "Item name and description"
  },
  "reasoning": "Explanation of why this outfit works well"
}`;

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
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
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