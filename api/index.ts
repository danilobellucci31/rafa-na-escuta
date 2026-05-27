import app from "../server";

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to execute serverless function",
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
