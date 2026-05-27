let appInstance: any = null;
let importError: any = null;

async function getApp() {
  if (appInstance) return appInstance;
  if (importError) throw importError;
  try {
    const module = await import("../server");
    appInstance = module.default;
    return appInstance;
  } catch (err: any) {
    importError = err;
    console.error("Failed to import server module:", err);
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to initialize serverless function",
      message: error.message || String(error),
      stack: error.stack || "No stack trace",
      vercelEnv: {
        nodeVersion: process.version,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        geminiKeyLen: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
        env: process.env.NODE_ENV
      }
    });
  }
}
