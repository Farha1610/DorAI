import { GoogleGenAI } from "@google/genai";
import { PickupRequest } from "../types";

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  }

  async optimizeRoutes(pickups: PickupRequest[]) {
    if (pickups.length === 0) return null;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `
          As a logistics expert for DOR AI, a circular fashion platform, optimize the pickup route for the following requests:
          ${JSON.stringify(pickups.map(p => ({ id: p.id, address: p.address, quantity: p.quantity, category: p.category })))}
          
          Return a JSON object with:
          - "optimizedOrder": array of pickup IDs in order
          - "totalEfficiency": percentage efficiency gain
          - "routeSummary": brief textual description for the driver
        `
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return null;
    }
  }

  async suggestPickupSlot(location: string, quantity: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `
          Based on the location "${location}" and quantity "${quantity}", suggest 3 optimal pickup time slots that would minimize logistics costs (e.g., grouping with other nearby pickups).
          
          Return JSON with an array "slots" where each item has "time" and "reason" (why this is efficient).
        `
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { slots: [] };
    }
  }

  async classifyClothing(description: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `
          Classify the following clothing description for recycling purposes: "${description}"
          
          Categories: "reusable" (good condition), "recyclable" (torn/worn), "donate" (bulk/mixed).
          
          Return JSON with:
          - "category": one of the categories above
          - "confidence": percentage
          - "advice": brief recycling tip
        `
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { category: 'donate', confidence: 0, advice: '' };
    }
  }
}

export const aiService = new AIService();
