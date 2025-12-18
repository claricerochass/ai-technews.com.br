import { NextResponse } from "next/server"
import Parser from "rss-parser"
import { RSS_FEEDS, type NewsItem, type AISummary } from "@/lib/rss-feeds"

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

  // Gerar variações baseadas no hash do título para diversificar os resumos
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

  // Misturar base com variação para mais diversidade
  if (hash % 2 === 0) {
    return baseSum
  }
  return variation
}

function extractImage(item: Record<string, unknown>): string | undefined {
  // Try media:content (array)
  if (item.mediaContent && Array.isArray(item.mediaContent)) {
    for (const media of item.mediaContent) {
      const m = media as { $?: { url?: string; medium?: string; type?: string } }
      if (m?.$?.url) {
        // Prefer image type
        if (m.$.medium === "image" || m.$.type?.startsWith("image") || !m.$.type) {
          return m.$.url
        }
      }
    }
  }

  // Try media:thumbnail (can be array or object)
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

  // Try media:group
  if (item.mediaGroup) {
    const group = item.mediaGroup as { "media:content"?: Array<{ $?: { url?: string } }> }
    if (group["media:content"]?.[0]?.$?.url) {
      return group["media:content"][0].$.url
    }
  }

  // Try enclosure
  if (item.enclosure) {
    const enc = item.enclosure as { url?: string; type?: string }
    if (enc?.url) {
      // Accept if it's an image or if type is not specified
      if (!enc.type || enc.type.startsWith("image")) {
        return enc.url
      }
    }
  }

  // Try itunes:image
  if (item.itunesImage) {
    const itunes = item.itunesImage as { $?: { href?: string }; href?: string }
    if (itunes?.$?.href) return itunes.$.href
    if (itunes?.href) return itunes.href
  }

  // Try direct image field
  if (item.image) {
    const img = item.image as { url?: string; $?: { url?: string } } | string
    if (typeof img === "string") return img
    if (img?.url) return img.url
    if (img?.$?.url) return img.$.url
  }

  // Try to extract from content/description HTML
  const content = (item["content:encoded"] || item.content || item.description || item.summary) as string
  if (content) {
    // Try img tag with src
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
    if (imgMatch?.[1]) {
      const url = imgMatch[1]
      // Skip tracking pixels and very small images
      if (!url.includes("feedburner") && !url.includes("pixel") && !url.includes("1x1")) {
        return url
      }
    }

    // Try figure with img
    const figureMatch = content.match(/<figure[^>]*>.*?<img[^>]+src=["']([^"']+)["']/is)
    if (figureMatch?.[1]) return figureMatch[1]

    // Try srcset and get first image
    const srcsetMatch = content.match(/srcset=["']([^"']+)["']/i)
    if (srcsetMatch?.[1]) {
      const firstSrc = srcsetMatch[1].split(",")[0].trim().split(" ")[0]
      if (firstSrc) return firstSrc
    }

    // Try background-image in style
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

export async function GET() {
  try {
    const allItems: NewsItem[] = []

    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url)
        return parsed.items.slice(0, 10).map((item, index) => ({
          id: `${feed.name}-${index}-${item.guid || item.link}`,
          title: item.title || "Sem título",
          description: stripHtml(item.contentSnippet || item.content || item.description || ""),
          link: item.link || "",
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          source: feed.name,
          category: feed.category,
          imageUrl: extractImage(item as Record<string, unknown>),
          ai_summary: generateMockAISummary(item.title || "", feed.category),
        }))
      } catch (error) {
        console.error(`Error fetching ${feed.name}:`, error)
        return []
      }
    })

    const results = await Promise.all(feedPromises)
    results.forEach((items) => allItems.push(...items))

    // Sort by date, most recent first
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return NextResponse.json(allItems)
  } catch (error) {
    console.error("RSS fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 })
  }
}
