export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' })
    }
  
    const { nome, preco, avaliacao, descricao, link } = req.body
  
    const prompt = `
  Você é um especialista em marketing digital e vendas para afiliados da Shopee.
  
  Com base nas informações abaixo, gere conteúdo de divulgação para diferentes plataformas.
  
  PRODUTO:
  - Nome: ${nome}
  - Preço: ${preco}
  - Avaliação: ${avaliacao || 'Não informada'}
  - Descrição: ${descricao}
  - Link: ${link}
  
  Gere EXATAMENTE no formato JSON abaixo, sem nenhum texto fora do JSON:
  
  {
    "whatsapp": [
      "texto versão urgência aqui (use emojis, CTA forte, mencione o preço e o link)",
      "texto versão emocional aqui (conecte com sentimento, benefício, use emojis e o link)",
      "texto versão informativa aqui (foque nos detalhes, avaliação, custo benefício e o link)"
    ],
    "reels": "roteiro curto para Reels ou TikTok aqui (máximo 30 segundos, com gancho inicial, desenvolvimento e CTA)",
    "instagram": "legenda para Instagram aqui com emojis e hashtags relevantes no final",
    "thumbnail": "sugestão detalhada de como deve ser a imagem de capa/thumbnail para esse produto"
  }
  `
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      })
  
      const data = await response.json()
      const texto = data.content[0].text
      const json = JSON.parse(texto)
  
      return res.status(200).json(json)
  
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao gerar conteúdo' })
    }
  }
  