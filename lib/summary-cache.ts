import type { GeneratedSummary } from "./generate-summaries"
import * as fs from "fs"
import * as path from "path"

const CACHE_FILE = path.join(process.cwd(), ".summaryCache.json")
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

interface CacheEntry {
  summary: GeneratedSummary
  timestamp: number
}

interface CacheData {
  [key: string]: CacheEntry
}

let memoryCache: CacheData = {}

// Load cache from file on startup
function loadCache(): void {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8")
      memoryCache = JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading cache:", error)
  }
}

// Save cache to file
function saveCache(): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(memoryCache, null, 2))
  } catch (error) {
    console.error("Error saving cache:", error)
  }
}

// Generate cache key from title + description hash
export function generateCacheKey(title: string, description: string): string {
  const combined = `${title}|${description}`
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `summary_${Math.abs(hash)}`
}

// Get summary from cache
export function getSummaryFromCache(key: string): GeneratedSummary | null {
  loadCache()
  const entry = memoryCache[key]

  if (!entry) return null

  // Check if cache expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    delete memoryCache[key]
    saveCache()
    return null
  }

  return entry.summary
}

// Store summary in cache
export function storeSummaryInCache(key: string, summary: GeneratedSummary): void {
  loadCache()
  memoryCache[key] = {
    summary,
    timestamp: Date.now(),
  }
  saveCache()
}

// Clear old cache entries
export function cleanupExpiredCache(): void {
  loadCache()
  let cleaned = false

  for (const [key, entry] of Object.entries(memoryCache)) {
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      delete memoryCache[key]
      cleaned = true
    }
  }

  if (cleaned) {
    saveCache()
  }
}
