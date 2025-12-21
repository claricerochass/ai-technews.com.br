import { type NextRequest, NextResponse } from "next/server"
import type { Ratelimit } from "@upstash/ratelimit"

interface RateLimitOptions {
  ratelimit: Ratelimit
  fallbackResponse?: any
}

/**
 * Middleware genérico para aplicar rate limiting em API routes
 * Usa Upstash Redis com algoritmo Sliding Window
 */
export async function withRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
  handler: () => Promise<NextResponse>,
) {
  try {
    // Identifica usuário por IP (usa x-forwarded-for ou x-real-ip)
    const identifier = getIdentifier(request)

    // Checa rate limit no Redis
    const { success, limit, remaining, reset } = await options.ratelimit.limit(identifier)

    // Headers informativos para o cliente
    const rateLimitHeaders = {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    }

    // Se excedeu o limite
    if (!success) {
      // Se tem fallback configurado, retorna sem bloquear
      if (options.fallbackResponse) {
        return NextResponse.json(
          { ...options.fallbackResponse, rateLimited: true },
          { status: 200, headers: rateLimitHeaders },
        )
      }

      // Senão, retorna 429 Too Many Requests
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)

      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Por favor, aguarde ${retryAfter} segundos antes de tentar novamente.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            ...rateLimitHeaders,
            "Retry-After": retryAfter.toString(),
          },
        },
      )
    }

    // Executa handler normal da API
    const response = await handler()

    // Adiciona headers de rate limit na resposta
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error("[v0] Rate limit Redis error:", error instanceof Error ? error.message : String(error))
    // Fail-open: permite requisição em caso de erro (Redis indisponível não deve bloquear app)
    return handler()
  }
}

/**
 * Extrai identificador único do usuário (IP)
 * Prioriza x-forwarded-for (Vercel) > x-real-ip > fallback
 */
function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  if (forwarded) {
    // x-forwarded-for pode ter múltiplos IPs, pega o primeiro
    return forwarded.split(",")[0].trim()
  }

  if (realIp) {
    return realIp
  }

  // Fallback para development
  return "unknown-ip"
}
