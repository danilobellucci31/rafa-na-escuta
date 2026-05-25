import { Context } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini SDK securely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export default async (req: Request, context: Context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }), 
      { status: 405, headers }
    );
  }

  try {
    const { text } = await req.json() as { text: string };
    if (!text) {
      return new Response(
        JSON.stringify({ error: "O texto para síntese de voz é obrigatório." }),
        { status: 400, headers }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Chave API não configurada no Netlify." }),
        { status: 400, headers }
      );
    }

    // Clean up markdown markers and extra emojis to make the Brazilian Portuguese read sound pristine
    const textCleaned = text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '') // Emojis
      .replace(/\*+/g, '') // Bold markers
      .replace(/#+/g, '') // Header lines
      .replace(/-\s+/g, ' '); // Line bullet spacing

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: textCleaned }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("Nenhum dado de áudio foi retornado do modelo TTS.");
    }

    return new Response(
      JSON.stringify({ audio: base64Audio }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error("Erro no Netlify Function Gemini TTS:", error);
    return new Response(
      JSON.stringify({ 
        error: "Houve um erro ao sintetizar a voz do Professor Rafa.",
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
};
