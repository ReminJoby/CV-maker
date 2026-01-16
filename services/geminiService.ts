
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

/**
 * Gemini API Initialization
 * We use process.env.API_KEY as the standardized way to access the secret
 * in production environments like Vercel.
 */
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const RESUME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A suggested title for this resume" },
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        website: { type: Type.STRING },
        summary: { type: Type.STRING }
      }
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
          current: { type: Type.BOOLEAN }
        }
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          field: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING }
        }
      }
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          level: { type: Type.NUMBER }
        }
      }
    }
  }
};

export const getAIOptimizationTips = async (section: string, text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional resume optimizer. Analyze the following "${section}" content and provide 3-5 specific, action-oriented suggestions.

      Content:
      "${text}"`,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return ["Add more action-oriented verbs", "Quantify your achievements", "Keep formatting consistent"];
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return ["Use powerful action verbs", "Include metrics to show impact", "Keep descriptions concise"];
  }
};

export const parseResumeFromText = async (text: string): Promise<Partial<ResumeData> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract resume data into JSON. If missing, use empty strings/arrays.\nText: """${text}"""`,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: RESUME_SCHEMA,
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("AI Resume Parsing failed:", error);
    return null;
  }
};

export const parseResumeFromPDF = async (base64PDF: string): Promise<Partial<ResumeData> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64PDF
            }
          },
          {
            text: "Quickly extract resume data from this PDF into the specified JSON format."
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: RESUME_SCHEMA,
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("AI PDF Parsing failed:", error);
    return null;
  }
};

export const generateHeroImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
