import { generateText } from "ai"

export async function POST(req: Request) {
  let title = ""
  let description = ""
  let category = ""
  let perspective = "dev"

  try {
    const body = await req.json()
    title = body.title || ""
    description = body.description || ""
    category = body.category || "Tech"
    perspective = body.perspective || "dev"
  } catch (parseError) {
    return Response.json({ error: "Erro ao processar requisição" }, { status: 400 })
  }

  if (!title || !perspective) {
    return Response.json({ error: "Título e perspectiva são obrigatórios" }, { status: 400 })
  }

  const perspectiveLabels: Record<string, string> = {
    design: "Design (UX/UI, experiência do usuário, interfaces)",
    dev: "Desenvolvimento (código, arquitetura, tecnologias)",
    business: "Negócios (estratégia, mercado, ROI)",
  }

  function generateDynamicFallback(title: string, description: string, perspective: string): string {
    // Extrair palavras-chave significativas do título
    const stopWords = [
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "shall",
      "can",
      "need",
      "dare",
      "ought",
      "used",
      "it",
      "its",
      "you",
      "your",
      "we",
      "our",
      "they",
      "their",
      "this",
      "that",
      "these",
      "those",
      "what",
      "which",
      "who",
      "whom",
      "whose",
      "where",
      "when",
      "why",
      "how",
      "all",
      "each",
      "every",
      "both",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "just",
      "also",
      "now",
      "here",
      "there",
      "then",
      "once",
      "from",
      "into",
      "about",
      "after",
      "before",
      "above",
      "below",
      "between",
      "under",
      "again",
      "further",
      "then",
      "once",
    ]

    const words = title
      .replace(/[^\w\s]/g, " ")
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.includes(w))

    const mainTopic = words.slice(0, 3).join(" ") || title.substring(0, 30)
    const descWords = (description || "")
      .replace(/[^\w\s]/g, " ")
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.includes(w))
      .slice(0, 5)

    const context = descWords.length > 0 ? descWords.join(", ") : "tecnologia"

    // Templates dinâmicos que incorporam o conteúdo real
    const templates: Record<string, string[]> = {
      design: [
        `O tema "${mainTopic}" demanda interfaces que equilibrem complexidade técnica com clareza visual. Profissionais de UX devem mapear jornadas de usuário específicas, identificar pontos de fricção e criar protótipos que validem hipóteses sobre ${context}. Testes de usabilidade com usuários reais são essenciais para garantir que a solução atenda necessidades genuínas, não apenas suposições da equipe de produto.`,
        `Ao abordar "${mainTopic}", designers precisam considerar hierarquia de informação, affordances claras e feedback imediato. A experiência deve guiar usuários naturalmente através de ${context}, minimizando carga cognitiva. Padrões de design system garantem consistência, enquanto micro-interações bem executadas aumentam o engajamento e a percepção de qualidade do produto final.`,
        `"${mainTopic}" apresenta desafios de design centrado no usuário relacionados a ${context}. É fundamental conduzir pesquisas qualitativas para entender contextos de uso reais, criar personas baseadas em dados e iterar rapidamente sobre wireframes. Acessibilidade deve ser prioridade desde o início, garantindo que a solução funcione para todos os perfis de usuário identificados.`,
      ],
      dev: [
        `Implementar funcionalidades relacionadas a "${mainTopic}" requer arquitetura escalável e manutenível. Considere padrões como ${context} para organizar a lógica de negócio. Testes automatizados em múltiplas camadas, CI/CD robusto e monitoramento em produção são fundamentais. Documente decisões técnicas para facilitar onboarding e manutenção futura por outros desenvolvedores da equipe.`,
        `O desenvolvimento de soluções para "${mainTopic}" exige avaliação cuidadosa de trade-offs técnicos envolvendo ${context}. Performance, segurança e experiência do desenvolvedor devem guiar escolhas de stack. Implemente observabilidade desde o início com logs estruturados, métricas de negócio e alertas proativos para identificar problemas antes que afetem usuários em produção.`,
        `"${mainTopic}" demanda abordagem técnica que considere ${context} como fatores críticos. APIs bem documentadas, contratos claros entre serviços e versionamento semântico facilitam evolução do sistema. Priorize código legível sobre código "inteligente" e estabeleça code review como prática obrigatória para manter qualidade e disseminar conhecimento na equipe.`,
      ],
      business: [
        `"${mainTopic}" representa oportunidade de mercado que exige análise de ${context} para tomada de decisão informada. Empresas devem calcular TAM/SAM/SOM, identificar vantagens competitivas sustentáveis e definir métricas de sucesso claras. Pilotos controlados reduzem risco antes de investimentos maiores, enquanto feedback de clientes early-adopters valida product-market fit.`,
        `A evolução de "${mainTopic}" no contexto de ${context} demanda estratégia empresarial adaptativa. Líderes devem avaliar impacto em modelos de negócio existentes, identificar parcerias estratégicas e alocar recursos para capacitação de equipes. ROI deve considerar não apenas ganhos diretos, mas também posicionamento competitivo de médio e longo prazo no mercado.`,
        `Do ponto de vista de negócios, "${mainTopic}" conecta-se com tendências de ${context} que podem definir vencedores e perdedores no setor. Due diligence rigorosa, benchmarking competitivo e análise de cenários são essenciais. Decisões de investimento devem balancear inovação com gestão de risco, mantendo foco em criação de valor sustentável para stakeholders.`,
      ],
    }

    const perspectiveTemplates = templates[perspective] || templates.dev
    const randomIndex = Math.floor(Math.random() * perspectiveTemplates.length)
    return perspectiveTemplates[randomIndex]
  }

  try {
    const prompt = `Você é um analista especializado em tecnologia.
Gere um insight ÚNICO e ESPECÍFICO de 450-500 caracteres sobre esta notícia, focando na perspectiva de ${perspectiveLabels[perspective] || perspective}.

NOTÍCIA:
Título: ${title}
Descrição: ${description || "Não disponível"}
Categoria: ${category}

REGRAS IMPORTANTES:
- O insight DEVE ser baseado especificamente no conteúdo do título e descrição acima
- Seja específico e acionável, mencionando elementos concretos da notícia
- NÃO repita o título da notícia literalmente
- Foque em implicações práticas para profissionais da área
- Escreva em português brasileiro
- Não use bullet points, escreva em texto corrido
- Comece diretamente com o insight, sem introduções como "Este artigo..." ou "Esta notícia..."
- Entre 450-500 caracteres (incluindo espaços)`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 200,
      temperature: 0.7,
    })

    const truncatedInsight = text.substring(0, 500)

    return Response.json({ insight: truncatedInsight })
  } catch (aiError) {
    const dynamicFallback = generateDynamicFallback(title, description, perspective)

    return Response.json({
      insight: dynamicFallback,
      fallback: true,
    })
  }
}
