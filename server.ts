import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

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

// API routes FIRST
app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "O texto para síntese de voz é obrigatório." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
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

    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error("Erro na API do Gemini TTS:", error);
    res.status(500).json({ 
      error: "Houve um erro ao sintetizar a voz do Professor Rafa.",
      details: error.message 
    });
  }
});

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "O formato das mensagens é inválido." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Friendly fallback if the developer hasn't set the key yet
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
    // In @google/genai, ai.models.generateContent accepts content structures.
    // Let's format previous messages.
    // Each element in contents can be strings or structured objects containing parts
    const contentHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const responseText = response.text || "Desculpe, não consegui processar sua resposta no momento. Pode repetir para mim?";
    
    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Erro na API do Gemini:", error);
    res.status(500).json({ 
      error: "Houve um erro ao conversar com o Professor Rafa.",
      details: error.message 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Professor Rafa Backend" });
});

// Setup Vite middleware or Static serving depending on environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
