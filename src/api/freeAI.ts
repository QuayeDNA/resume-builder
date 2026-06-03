const GROQ_MODEL = process.env.NEXT_PUBLIC_GROQ_MODEL || 'llama-3.1-8b-instant'
const HF_MODEL = process.env.NEXT_PUBLIC_HF_MODEL || 'HuggingFaceH4/zephyr-7b-beta'
const GROQ_KEY: string = process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
const HF_TOKEN: string = process.env.NEXT_PUBLIC_HF_TOKEN || ''

let lastProvider: string | null = null

export function getLastProvider(): string | null {
  return lastProvider
}

export function getConfiguredProvider(): string | null {
  if (GROQ_KEY) return 'groq'
  if (HF_TOKEN) return 'zephyr'
  return null
}

export async function callFreeAI(userPrompt: string, systemPrompt = '', maxTokens = 1000, temperature = 0.7): Promise<string> {
  const providers = [
    { name: 'Groq', fn: () => callGroq(userPrompt, systemPrompt, maxTokens, temperature) },
    { name: 'Zephyr', fn: () => callHuggingFace(userPrompt, systemPrompt, maxTokens, temperature) },
  ]

  let lastError: Error | null = null
  for (const provider of providers) {
    try {
      const result = await provider.fn()
      if (result && result.trim().length > 0) {
        lastProvider = provider.name.toLowerCase()
        return result.trim()
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.warn(`${provider.name} failed, trying next provider:`, lastError.message)
    }
  }

  throw new Error(lastError?.message || 'Both Groq and Zephyr failed. Check your tokens and try again.')
}

async function callGroq(userPrompt: string, systemPrompt: string, maxTokens: number, temperature: number): Promise<string> {
  if (!GROQ_KEY) {
    throw new Error('Groq token missing. Set NEXT_PUBLIC_GROQ_API_KEY in .env.local')
  }

  const messages: { role: string; content: string }[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  messages.push({ role: 'user', content: userPrompt })

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(err.error?.message || `Groq HTTP ${res.status}`)
  }

  const data = await res.json() as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content || ''
}

async function callHuggingFace(userPrompt: string, systemPrompt: string, maxTokens: number, temperature: number): Promise<string> {
  if (!HF_TOKEN) {
    throw new Error('Hugging Face token missing. Set NEXT_PUBLIC_HF_TOKEN in .env.local')
  }

  const prompt = systemPrompt
    ? `<<SYS>>\n${systemPrompt}\n<</SYS>>\n\n${userPrompt}`
    : userPrompt

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: Math.min(maxTokens, 512),
          temperature,
          return_full_text: false,
        },
      }),
    },
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error || `HuggingFace HTTP ${res.status}`)
  }

  const data = await res.json() as { generated_text?: string }[] | { generated_text?: string }

  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text.trim()
  }

  if (!Array.isArray(data) && data.generated_text) {
    return data.generated_text.trim()
  }

  throw new Error('Unexpected HuggingFace response format')
}

export async function checkFreeAIAvailable(): Promise<boolean> {
  try {
    const token = GROQ_KEY || HF_TOKEN
    if (!token) return false

    const url = GROQ_KEY
      ? 'https://api.groq.com/openai/v1/models'
      : `https://api-inference.huggingface.co/models/${HF_MODEL}`

    const headers: Record<string, string> = GROQ_KEY
      ? {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_KEY}`,
        }
      : {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${HF_TOKEN}`,
        }

    const res = await fetch(url, { method: 'GET', headers })
    return res.ok
  } catch {
    return false
  }
}
