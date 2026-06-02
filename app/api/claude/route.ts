import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages, max_tokens, system, model, _fallback } = await request.json()

    // Primary: Anthropic Claude
    if (!_fallback && process.env.ANTHROPIC_API_KEY) {
      try {
        const upstream = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
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

        if (!upstream.ok && data.error) {
          console.warn('Anthropic failed, falling back to Groq:', data.error)
          return proxyGroq(messages, system, max_tokens)
        }

        return NextResponse.json(data, { status: upstream.status })
      } catch (err) {
        console.warn('Anthropic proxy error, falling back to Groq:', (err as Error).message)
        return proxyGroq(messages, system, max_tokens)
      }
    }

    // No Anthropic key configured — use Groq free tier
    return proxyGroq(messages, system, max_tokens)
  } catch (err) {
    console.error('AI route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function proxyGroq(messages: unknown[], system?: string, maxTokens?: number) {
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
      return NextResponse.json(
        { error: data.error?.message || 'Groq error' },
        { status: upstream.status },
      )
    }

    const content = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({
      content: [{ type: 'text', text: content }],
      provider: 'groq',
    })
  } catch (err) {
    console.error('Groq proxy error:', err)
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
  }
}
