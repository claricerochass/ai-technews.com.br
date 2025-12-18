import { NextResponse, type NextRequest } from "next/server"
import Parser from "rss-parser"
import { RSS_FEEDS, type NewsItem, type AISummary } from "@/lib/rss-feeds"
import { generateAISummaries } from "@/lib/generate-summaries"
import { generateCacheKey, getSummaryFromCache, storeSummaryInCache } from "@/lib/summary-cache"
import { checkRateLimit } from "@/lib/rate-limit"

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["media:group", "mediaGroup"],
      ["enclosure", "enclosure"],
      ["image", "image"],
      ["itunes:image", "itunesImage"],
    ],
  },
})

function generateMockAISummary(title: string, category: string): AISummary {
  const summaries: Record<string, Record<string, AISummary>> = {
    design: {
      default: {
        dev: "Implementação técnica focada em componentização e sistemas de design escaláveis para melhor DX.",
        design: "Princípios de UX/UI aplicados com foco em acessibilidade, hierarquia visual e experiência do usuário.",
        product: "Impacto em métricas de engajamento e conversão através de melhorias na interface do produto.",
      },
    },
    ai: {
      default: {
        dev: "Arquitetura de ML/AI com foco em integração de APIs, pipelines de dados e otimização de modelos.",
        design: "Considerações de UX para interfaces de IA: feedback, transparência e interação humano-máquina.",
        product: "Oportunidades de produto com IA: automação, personalização e novos modelos de negócio.",
      },
    },
    tech: {
      default: {
        dev: "Stack técnico, performance, segurança e boas práticas de engenharia de software.",
        design: "Implicações de design para novas tecnologias: adaptação de interfaces e padrões emergentes.",
        product: "Análise de mercado, tendências tecnológicas e impacto estratégico no roadmap de produto.",
      },
    },
  }

  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const variations = [
    {
      dev: "Aspectos de implementação: arquitetura, código limpo e padrões de desenvolvimento.",
      design: "Visão de design: usabilidade, estética e consistência visual no contexto apresentado.",
      product: "Perspectiva de produto: valor para usuário, métricas de sucesso e alinhamento estratégico.",
    },
    {
      dev: "Considerações técnicas: escalabilidade, manutenibilidade e integração com sistemas existentes.",
      design: "Oportunidades de design: inovação visual, micro-interações e design system.",
      product: "Análise de produto: market fit, diferenciação competitiva e growth potential.",
    },
    {
      dev: "Deep-dive técnico: performance, segurança e debt técnico a considerar.",
      design: "Exploração de UX: jornada do usuário, pontos de fricção e oportunidades de melhoria.",
      product: "Estratégia de produto: priorização, trade-offs e impacto no roadmap.",
    },
  ]

  const baseSum = summaries[category]?.default || summaries.tech.default
  const variation = variations[hash % variations.length]

  if (hash % 2 === 0) {
    return baseSum
  }
  return variation
}

function extractImage(item: Record<string, unknown>): string | undefined {
  if (item.mediaContent && Array.isArray(item.mediaContent)) {
    for (const media of item.mediaContent) {
      const m = media as { $?: { url?: string; medium?: string; type?: string } }
      if (m?.$?.url) {
        if (m.$.medium === "image" || m.$.type?.startsWith("image") || !m.$.type) {
          return m.$.url
        }
      }
    }
  }

  if (item.mediaThumbnail) {
    if (Array.isArray(item.mediaThumbnail)) {
      const thumb = item.mediaThumbnail[0] as { $?: { url?: string } }
      if (thumb?.$?.url) return thumb.$.url
    } else {
      const thumb = item.mediaThumbnail as { $?: { url?: string }; url?: string }
      if (thumb?.$?.url) return thumb.$.url
      if (thumb?.url) return thumb.url
    }
  }

  if (item.mediaGroup) {
    const group = item.mediaGroup as { "media:content"?: Array<{ $?: { url?: string } }> }
    if (group["media:content"]?.[0]?.$?.url) {
      return group["media:content"][0].$.url
    }
  }

  if (item.enclosure) {
    const enc = item.enclosure as { url?: string; type?: string }
    if (enc?.url) {
      if (!enc.type || enc.type.startsWith("image")) {
        return enc.url
      }
    }
  }

  if (item.itunesImage) {
    const itunes = item.itunesImage as { $?: { href?: string }; href?: string }
    if (itunes?.$?.href) return itunes.$.href
    if (itunes?.href) return itunes.href
  }

  if (item.image) {
    const img = item.image as { url?: string; $?: { url?: string } } | string
    if (typeof img === "string") return img
    if (img?.url) return img.url
    if (img?.$?.url) return img.$.url
  }

  const content = (item["content:encoded"] || item.content || item.description || item.summary) as string
  if (content) {
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
    if (imgMatch?.[1]) {
      const url = imgMatch[1]
      if (!url.includes("feedburner") && !url.includes("pixel") && !url.includes("1x1")) {
        return url
      }
    }

    const figureMatch = content.match(/<figure[^>]*>.*?<img[^>]+src=["']([^"']+)["']/is)
    if (figureMatch?.[1]) return figureMatch[1]

    const srcsetMatch = content.match(/srcset=["']([^"']+)["']/i)
    if (srcsetMatch?.[1]) {
      const firstSrc = srcsetMatch[1].split(",")[0].trim().split(" ")[0]
      if (firstSrc) return firstSrc
    }

    const bgMatch = content.match(/background-image:\s*url$$["']?([^"')]+)["']?$$/i)
    if (bgMatch?.[1]) return bgMatch[1]
  }

  return undefined
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 200)
}

async function getOrGenerateSummary(title: string, description: string): Promise<AISummary> {
  const cacheKey = generateCacheKey(title, description)

  const cached = getSummaryFromCache(cacheKey)
  if (cached) {
    return cached
  }

  const generated = await generateAISummaries(title, description)
  if (generated) {
    storeSummaryInCache(cacheKey, generated)
    return generated
  }

  return {
    dev: "Resumo temporariamente indisponível",
    design: "Resumo temporariamente indisponível",
    product: "Resumo temporariamente indisponível",
  }
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const allItems: NewsItem[] = []

    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url)
        const items = parsed.items.slice(0, 10)

        const itemsWithSummaries = await Promise.all(
          items.map(async (item, index) => {
            const description = stripHtml(item.contentSnippet || item.content || item.description || "")
            const ai_summary = await getOrGenerateSummary(item.title || "", description)

            return {
              id: `${feed.name}-${index}-${item.guid || item.link}`,
              title: item.title || "Sem título",
              description,
              link: item.link || "",
              pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
              source: feed.name,
              category: feed.category,
              imageUrl: extractImage(item as Record<string, unknown>),
              ai_summary,
            }
          }),
        )

        return itemsWithSummaries
      } catch (error) {
        console.error(`Error fetching ${feed.name}:`, error)
        return []
      }
    })

    const results = await Promise.all(feedPromises)
    results.forEach((items) => allItems.push(...items))

    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return NextResponse.json(allItems)
  } catch (error) {
    console.error("RSS fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 })
  }
}
