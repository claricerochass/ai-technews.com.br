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
  } catch {
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

  const fallbackInsights: Record<string, string> = {
    design: `Esta notícia sobre "${title.substring(0, 50)}..." representa uma oportunidade para repensar a experiência do usuário em produtos digitais. Profissionais de design devem considerar como essas mudanças impactam a jornada do usuário e quais padrões de interface podem ser adaptados. É importante avaliar a acessibilidade e usabilidade das soluções propostas, garantindo que todos os usuários sejam beneficiados pelas inovações.`,
    dev: `Do ponto de vista técnico, "${title.substring(0, 50)}..." abre portas para novas arquiteturas e padrões de desenvolvimento. Desenvolvedores devem avaliar como integrar essas tecnologias em seus projetos atuais, considerando aspectos de escalabilidade, manutenibilidade e performance. É recomendável criar provas de conceito para validar a viabilidade técnica antes de implementações em produção.`,
    business: `O impacto nos negócios de "${title.substring(0, 50)}..." é significativo, pois empresas que adotarem essas tendências terão vantagem competitiva. É essencial avaliar o ROI potencial e criar um roadmap de implementação alinhado com objetivos estratégicos. Líderes devem considerar parcerias estratégicas e investimentos em capacitação para maximizar os benefícios dessas inovações.`,
  }

  try {
    const prompt = `Você é um analista especializado em tecnologia.
Gere um insight de 400-500 caracteres sobre esta notícia, focando na perspectiva de ${perspectiveLabels[perspective] || perspective}.

Título: ${title}
Descrição: ${description || "Não disponível"}
Categoria da notícia: ${category}

Regras:
- Seja específico e acionável
- Não repita o título da notícia
- Foque em implicações práticas para profissionais da área
- Escreva em português brasileiro
- Não use bullet points, escreva em texto corrido
- Comece diretamente com o insight, sem introduções`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 300,
      temperature: 0.7,
    })

    return Response.json({ insight: text })
  } catch {
    return Response.json({
      insight: fallbackInsights[perspective] || fallbackInsights.dev,
      fallback: true,
    })
  }
}
