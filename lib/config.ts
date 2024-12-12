export const config = {
  ai: {
    model: process.env.NEXT_PUBLIC_DEFAULT_MODEL || "deepseek-ai/DeepSeek-V2.5",
    temperature: 0.3,
    maxTokens: 4096,
    apiKey: process.env.NEXT_PUBLIC_DEFAULT_API_TOKEN,
    endpoint: process.env.NEXT_PUBLIC_DEFAULT_API_ENDPOINT,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    timeout: 30000,
  },
} as const;
