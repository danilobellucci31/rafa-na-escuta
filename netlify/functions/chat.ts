import { Context } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

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
    const { messages } = await req.json() as { messages: any[] };
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "O formato das mensagens é inválido." }),
        { status: 400, headers }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Friendly fallback if the developer hasn't set the key yet
      return new Response(
        JSON.stringify({
          text: "Olá! Eu sou o Professor Rafa. Que bom ter você aqui! 😊 Para eu falar com você com toda minha sabedoria, lembre-se de configurar a chave do Gemini (GEMINI_API_KEY) nas variáveis de ambiente do seu painel do Netlify. Depois de salvar, lembre-se de realizar um novo " + "deploy" + " no site. Mal posso esperar para conversarmos!"
        }),
        { status: 200, headers }
      );
    }

    // Initialize Gemini SDK securely inside handler
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const responseText = response.text || "Desculpe, não consegui processar sua resposta no momento. Pode repetir para mim?";
    
    return new Response(
      JSON.stringify({ text: responseText }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error("Erro no Netlify Function Gemini Chat:", error);
    return new Response(
      JSON.stringify({ 
        error: "Houve um erro ao conversar com o Professor Rafa.",
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
};
