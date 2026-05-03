/**
 * Vercel Serverless Function — AI API Proxy
 * Primary: Anthropic Claude (if ANTHROPIC_API_KEY is set)
 * Fallback: Groq free tier (no key needed)
 *
 * Endpoint: POST /api/claude
 * Body: { messages: [...], max_tokens, system, _fallback?: true }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, max_tokens, system, model, _fallback } = req.body

  // Primary: Anthropic Claude
  if (!_fallback && process.env.ANTHROPIC_API_KEY) {
    try {
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model || 'claude-sonnet-4-20250514',
          max_tokens: max_tokens || 1000,
          messages,
          ...(system ? { system } : {}),
        }),
      })

      const data = await upstream.json()

      // If Anthropic fails, fallback to Groq
      if (!upstream.ok && data.error) {
        console.warn('Anthropic failed, falling back to Groq:', data.error)
        return proxyGroq(res, messages, system, max_tokens)
      }

      return res.status(upstream.status).json(data)
    } catch (err) {
      console.warn('Anthropic proxy error, falling back to Groq:', err.message)
      return proxyGroq(res, messages, system, max_tokens)
    }
  }

  // No Anthropic key configured — use Groq free tier
  return proxyGroq(res, messages, system, max_tokens)
}

async function proxyGroq(res, messages, system, maxTokens) {
  try {
    const groqMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: groqMessages,
        max_tokens: maxTokens || 1000,
        temperature: 0.7,
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error?.message || 'Groq error' })
    }

    // Transform Groq response to look like Anthropic response for frontend compatibility
    const content = data.choices?.[0]?.message?.content || ''
    return res.status(200).json({
      content: [{ type: 'text', text: content }],
      provider: 'groq',
    })
  } catch (err) {
    console.error('Groq proxy error:', err)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}
