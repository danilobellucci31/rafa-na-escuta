import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

// Professor Rafa AI Persona Definition
const systemInstruction = `
Você é o "Professor Rafa", um educador físico extremamente acolhedor, paciente, empático e didático. Sua especialidade é saúde, envelhecimento ativo, mobilidade e bem-estar para o público 50+. Você atua como um companheiro digital e guia diário de saúde preventiva.

Seu Público:
Idosos, pessoas com mais de 50 anos, hipertensos, diabéticos, pessoas buscando melhorar a memória e pessoas sedentárias. Eles valorizam confiança, companhia, palavras de incentivo e, acima de tudo, simplicidade.

Regras Absolutas de Resposta:

Tom e Voz: Fale de forma simples, carinhosa e livre de termos médicos difíceis. Use expressões acolhedoras. Termine sempre com uma mensagem de encorajamento (ex: "Estou aqui com você!", "Um abraço do Professor Rafa!").

Formato (Crucial): Suas respostas DEVEM ser muito curtas. Pense que o texto será lido em voz alta em no máximo 30 segundos. Use tópicos (bullet points ou emojis) para quebrar o texto na tela, facilitando a leitura para quem tem visão cansada.

Segurança e Limites: Dê orientações baseadas em seus 3 pilares (Sono, Alimentação e Exercício). Se o assunto for grave (dor forte, alteração de remédios, diagnósticos), oriente com muito carinho que a pessoa procure o médico. NUNCA prescreva medicamentos.

Identidade: Aja sempre na primeira pessoa ("Eu sugiro", "Minha dica para você").

Exemplo de formato esperado:
"Olá! Professor Rafa na Escuta tá na área. 😊 Sobre caminhada e pressão alta, tenho ótimas notícias!

A caminhada é um excelente remédio natural, mas siga estas regrinhas:
✔️ Escolha os horários mais frescos do dia.
✔️ Beba água antes e depois.
✔️ Caminhe num ritmo em que você consiga conversar sem perder o fôlego.

Lembre-se sempre de tomar seu remedinho no horário que seu médico passou, combinado? Um abraço forte e boa caminhada!"
`.trim();

// API routes
app.post("/api/gemini/tts", async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`[TTS_INIT] [${requestId}] Received TTS request calling Gemini`);
  try {
    const { text } = req.body;
    if (!text) {
      console.warn(`[TTS_WARN] [${requestId}] Missing text field in body`);
      return res.status(400).json({ error: "O texto para síntese de voz é obrigatório." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`[TTS_AUTH] [${requestId}] GEMINI_API_KEY is ${apiKey ? `present (length: ${apiKey.length})` : "undefined/empty"}`);

    if (!apiKey) {
      return res.status(400).json({ error: "Chave API não configurada." });
    }

    // Initialize Gemini SDK securely inside route handler
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Clean up markdown markers and extra emojis to make the Brazilian Portuguese read sound pristine
    const textCleaned = text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '') // Emojis
      .replace(/\*+/g, '') // Bold markers
      .replace(/#+/g, '') // Header lines
      .replace(/-\s+/g, ' '); // Line bullet spacing

    console.log(`[TTS_SEND] [${requestId}] Calling gemini-3.1-flash-tts-preview...`);
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
      console.error(`[TTS_ERROR] [${requestId}] No audio data in model candidate list:`, JSON.stringify(response));
      throw new Error("Nenhum dado de áudio foi retornado do modelo TTS.");
    }

    console.log(`[TTS_SUCCESS] [${requestId}] Audio generated successfully (${base64Audio.length} chars of base64 data)`);
    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error(`[TTS_CRITICAL_FAIL] [${requestId}] Erro na API do Gemini TTS:`, error);
    res.status(500).json({ 
      error: "Houve um erro ao sintetizar a voz do Professor Rafa.",
      details: `${error.message || error}\n\nStack:\n${error.stack || "No stack trace available"}`
    });
  }
});

app.post("/api/gemini/chat", async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`[CHAT_INIT] [${requestId}] Received chat conversation request`);
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      console.warn(`[CHAT_WARN] [${requestId}] Formato de mensagens inválido no corpo`);
      return res.status(400).json({ error: "O formato das mensagens é inválido." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`[CHAT_AUTH] [${requestId}] GEMINI_API_KEY is ${apiKey ? `present (length: ${apiKey.length})` : "undefined/empty"}`);

    if (!apiKey) {
      // Friendly fallback if the developer hasn't set the key yet
      console.warn(`[CHAT_WARN] [${requestId}] No API key present. Triggering fallback response info.`);
      return res.json({
        text: "Olá! Eu sou o Professor Rafa. Que bom ter você aqui! 😊 Para eu falar com você com toda minha sabedoria, lembre-se de configurar a chave do Gemini (GEMINI_API_KEY) nos segredos do seu painel. Mas enquanto isso, me diga: como está o seu dia? Eu estou pronto para ouvir você com muita paciência e carinho!"
      });
    }

    // Initialize Gemini SDK securely inside route handler
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Convert messages to form requested by SDK
    const contentHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    console.log(`[CHAT_SEND] [${requestId}] Requesting gemini-3.5-flash with history length: ${messages.length}`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const responseText = response.text || "Desculpe, não consegui processar sua resposta no momento. Pode repetir para mim?";
    console.log(`[CHAT_SUCCESS] [${requestId}] Gemini responded successfully with text length: ${responseText.length}`);
    
    res.json({ text: responseText });
  } catch (error: any) {
    console.error(`[CHAT_CRITICAL_FAIL] [${requestId}] Erro na API do Gemini:`, error);
    res.status(500).json({ 
      error: "Houve um erro ao conversar com o Professor Rafa.",
      details: `${error.message || error}\n\nStack:\n${error.stack || "No stack trace available"}`
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Professor Rafa Backend" });
});

export default app;
