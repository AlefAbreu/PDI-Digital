import { GoogleGenAI, Type } from "@google/genai";
import type { AIGeneratedSuggestion, MaturityLevelInfo } from '../types';

// Assume process.env.API_KEY is configured in the environment
// Fix: Conditionally initialize ai only if the API key is available
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

if (!ai) {
    console.warn("Gemini API key not found. AI features will be disabled.");
}

const suggestionSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Um título conciso e acionável para a atividade de desenvolvimento.',
        },
        description: {
          type: Type.STRING,
          description: 'Uma breve descrição (1-2 frases) explicando o propósito e o benefício da atividade.',
        },
        steps: {
            type: Type.ARRAY,
            description: 'Uma lista de 2 a 3 passos práticos que o orientado pode seguir para completar a atividade.',
            items: {
                type: Type.STRING,
            }
        }
      },
      required: ["title", "description", "steps"],
    },
};

export const generateActivitySuggestions = async (maturityInfo: MaturityLevelInfo): Promise<AIGeneratedSuggestion[]> => {
    // Fix: Check if the ai instance was created
    if (!ai) {
        return Promise.resolve([]);
    }

    const prompt = `
        Você é um coach de desenvolvimento de carreira e liderança.
        Um mentor precisa de sugestões de atividades para um orientado (mentee) com o seguinte perfil:

        - Nível de Maturidade: ${maturityInfo.name} (${maturityInfo.level})
        - Características Principais: ${maturityInfo.characteristics.join(', ')}

        Com base nesse perfil, gere 3 sugestões de atividades de desenvolvimento detalhadas e criativas.
        As sugestões devem ser práticas e ajudar o orientado a avançar para o próximo nível de maturidade.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
                temperature: 0.8,
            },
        });

        const jsonStr = response.text.trim();
        const suggestions = JSON.parse(jsonStr) as AIGeneratedSuggestion[];
        return suggestions;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return [];
    }
};
