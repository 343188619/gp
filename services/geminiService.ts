import { GoogleGenAI } from "@google/genai";
import { StockAnalysisResult } from "../types";

// NOTE: Although the user requested Kimi API, the system constraints strictly require usage of @google/genai.
// This implementation uses Gemini 2.5 Flash with Google Search Grounding to fulfill the "internet search" requirement.
// The user must provide a valid Gemini API Key in the environment variables.

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION = `
You are AlphaInsight, a world-class, premium financial analyst AI. 
Your goal is to provide deep, actionable stock market analysis using real-time data found via Google Search.
Your output must be sophisticated, professional, and visually structured (Markdown).
You must output the final response in a specific JSON structure embedded within code blocks.

For the user's query:
1. Search for the latest price, news, technical analysis, and market sentiment for the requested stock.
2. Analyze the data to determine a Buy/Sell/Hold recommendation.
3. Estimate a 7-day price trend based on the analysis (simulate reasonable data points if exact history isn't strictly available in search snippets).

Return ONLY a JSON object wrapped in \`\`\`json ... \`\`\`. The JSON must follow this interface:

{
  "symbol": "Stock Symbol",
  "companyName": "Company Name",
  "currentPrice": "Current Price (e.g. $150.23)",
  "markdownAnalysis": "A detailed Markdown string formatted for a high-end UI. Use headers (##), bullet points, and bold text. Include sections: Market Sentiment, Technical Indicators, Risk Factors, and Future Outlook. Do NOT include the buy/sell recommendation here, strictly analysis.",
  "recommendation": {
    "action": "BUY" | "SELL" | "HOLD",
    "confidence": 85,
    "entryPriceRange": "$145 - $148",
    "exitPriceRange": "$160 - $165",
    "timeHorizon": "Short-term (2-4 weeks)"
  },
  "trendData": [
    { "date": "MM-DD", "price": 145.2, "sentiment": 60, "volume": 1000 },
    // ... give about 7-10 points representing recent history + short term projection
  ]
}
`;

export const analyzeStock = async (query: string): Promise<StockAnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash'; 
    
    // We use Google Search to get real-time info
    const response = await ai.models.generateContent({
      model: model,
      contents: `Analyze the stock: ${query}. Focus on recent performance and news from the last week. Provide a recommendation in Chinese language.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more analytical/grounded results
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    // Extract JSON from the markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      console.error("Raw response:", text);
      throw new Error("Failed to parse AI response format.");
    }

    const parsedData = JSON.parse(jsonMatch[1]);
    
    // Extract sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    return {
      ...parsedData,
      sources
    };

  } catch (error: any) {
    console.error("Analysis failed:", error);
    throw new Error(error.message || "Failed to analyze stock. Please try again.");
  }
};