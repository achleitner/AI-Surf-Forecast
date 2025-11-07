import { GoogleGenAI, Type } from "@google/genai";
import { SurfForecast, Coordinates } from '../types';

const getSurfForecast = async (coords: Coordinates): Promise<SurfForecast> => {
    // This is a placeholder for the actual API key which should be in process.env.API_KEY
    if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not set. Using mocked data.");
        // Return mock data if API key is not available.
        return new Promise(resolve => setTimeout(() => resolve({
            locationName: `Coastal Area near (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)})`,
            forecast: [
                { day: 'Mon', waveHeight: { min: 1.2, max: 1.8 }, swellPeriod: 12, windSpeed: 10, windDirection: 'NW', summary: 'Clean morning waves, onshore winds in the afternoon.' },
                { day: 'Tue', waveHeight: { min: 1.5, max: 2.2 }, swellPeriod: 14, windSpeed: 8, windDirection: 'W', summary: 'Building swell, good conditions all day.' },
                { day: 'Wed', waveHeight: { min: 1.8, max: 2.5 }, swellPeriod: 14, windSpeed: 12, windDirection: 'SW', summary: 'Peak of the swell, strong offshore winds.' },
                { day: 'Thu', waveHeight: { min: 1.4, max: 2.0 }, swellPeriod: 13, windSpeed: 15, windDirection: 'S', summary: 'Swell easing, becoming windy and choppy.' },
                { day: 'Fri', waveHeight: { min: 1.0, max: 1.5 }, swellPeriod: 11, windSpeed: 10, windDirection: 'SE', summary: 'Smaller but clean conditions, good for longboarding.' },
            ]
        }), 1500));
    }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Generate a realistic but fictional 5-day surf forecast for the coastal location at latitude ${coords.lat.toFixed(4)}, longitude ${coords.lon.toFixed(4)}.
  If this is on land, find the nearest realistic surf spot.
  Provide wave height in meters, swell period in seconds, wind speed in knots, and wind direction as a compass point (e.g., NW, S, ESE).
  The response must be a JSON object that strictly follows the provided schema. Do not include any markdown formatting like \`\`\`json.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locationName: {
              type: Type.STRING,
              description: 'A plausible name for the surf spot or coastal area near the given coordinates.',
            },
            forecast: {
              type: Type.ARRAY,
              description: 'An array of 5 daily forecast objects.',
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: 'Day of the week, abbreviated (e.g., Mon, Tue).' },
                  waveHeight: {
                    type: Type.OBJECT,
                    properties: {
                        min: { type: Type.NUMBER, description: 'Minimum wave height in meters.' },
                        max: { type: Type.NUMBER, description: 'Maximum wave height in meters.' },
                    },
                    required: ['min', 'max']
                  },
                  swellPeriod: { type: Type.NUMBER, description: 'Swell period in seconds.' },
                  windSpeed: { type: Type.NUMBER, description: 'Wind speed in knots.' },
                  windDirection: { type: Type.STRING, description: 'Wind direction (e.g., NW, S, ESE).' },
                  summary: { type: Type.STRING, description: 'A brief, engaging summary of the day\'s surf conditions.' },
                },
                required: ['day', 'waveHeight', 'swellPeriod', 'windSpeed', 'windDirection', 'summary'],
              },
            },
          },
          required: ['locationName', 'forecast'],
        },
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as SurfForecast;
  } catch (error) {
    console.error("Error fetching surf forecast from Gemini API:", error);
    throw new Error("Could not generate surf forecast. Please try a different location.");
  }
};

export { getSurfForecast };