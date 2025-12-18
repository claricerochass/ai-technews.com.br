// Simple in-memory rate limiting per IP
const requests: Record<string, number[]> = {}
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 10 // 10 requests per minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  if (!requests[ip]) {
    requests[ip] = []
  }

  requests[ip] = requests[ip].filter((time) => time > windowStart)

  if (requests[ip].length >= MAX_REQUESTS) {
    return false
  }

  requests[ip].push(now)
  return true
}

// Cleanup old entries periodically (prevent memory leak)
setInterval(
  () => {
    const now = Date.now()
    const windowStart = now - WINDOW_MS

    for (const [ip, times] of Object.entries(requests)) {
      requests[ip] = times.filter((time) => time > windowStart)
      if (requests[ip].length === 0) {
        delete requests[ip]
      }
    }
  },
  5 * 60 * 1000,
) // Cleanup every 5 minutes
