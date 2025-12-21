import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

// Singleton Redis client para Upstash
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Rate limiter para geração de insights (crítico - consome OpenAI API)
// 5 requisições por minuto por IP
export const insightRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "rl:insight",
})

// Rate limiter para agregação de RSS (moderado)
// 10 requisições por minuto por IP
export const rssRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "rl:rss",
})
