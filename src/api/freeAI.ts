/**
 * Token-based AI providers.
 * Chains: Groq → Hugging Face Zephyr
 * Both require free account tokens, but no paid plan is needed to start.
 */

const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant'
const HF_MODEL = import.meta.env.VITE_HF_MODEL || 'HuggingFaceH4/zephyr-7b-beta'
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || import.meta.env.VITE_HUGGINGFACE_API_KEY || ''

let lastProvider = null

export function getLastProvider() {
  return lastProvider
}

export function getConfiguredProvider() {
  if (GROQ_KEY) return 'groq'
  if (HF_TOKEN) return 'zephyr'
  return null
}

/**
 * Try Groq free tier first, then HuggingFace as fallback.
 * @param {string} userPrompt
 * @param {string} [systemPrompt]
 * @param {number} [maxTokens]
 * @returns {Promise<string>}
 */
export async function callFreeAI(userPrompt, systemPrompt = '', maxTokens = 1000) {
  const providers = [
    { name: 'Groq', fn: () => callGroq(userPrompt, systemPrompt, maxTokens) },
    { name: 'Zephyr', fn: () => callHuggingFace(userPrompt, systemPrompt, maxTokens) },
  ]

  let lastError
  for (const provider of providers) {
    try {
      const result = await provider.fn()
      if (result && result.trim().length > 0) {
        lastProvider = provider.name.toLowerCase()
        return result.trim()
      }
    } catch (err) {
      lastError = err
      console.warn(`${provider.name} failed, trying next provider:`, err.message)
    }
  }

  throw new Error(lastError?.message || 'Both Groq and Zephyr failed. Check your tokens and try again.')
}

async function callGroq(userPrompt, systemPrompt, maxTokens) {
  if (!GROQ_KEY) {
    throw new Error('Groq token missing. Set VITE_GROQ_API_KEY in .env.local')
  }

  const messages = []
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
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq HTTP ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callHuggingFace(userPrompt, systemPrompt, maxTokens) {
  if (!HF_TOKEN) {
    throw new Error('Hugging Face token missing. Set VITE_HF_TOKEN in .env.local')
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
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    },
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HuggingFace HTTP ${res.status}`)
  }

  const data = await res.json()

  // HuggingFace Inference API returns an array with generated_text
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text.trim()
  }

  // Some models return { generated_text: string }
  if (data.generated_text) {
    return data.generated_text.trim()
  }

  throw new Error('Unexpected HuggingFace response format')
}

/**
 * Check if any free provider is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkFreeAIAvailable() {
  try {
    const token = GROQ_KEY || HF_TOKEN
    if (!token) return false

    const url = GROQ_KEY
      ? 'https://api.groq.com/openai/v1/models'
      : `https://api-inference.huggingface.co/models/${HF_MODEL}`

    const res = await fetch(url, {
      method: 'GET',
      headers: GROQ_KEY
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_KEY}`,
          }
        : {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${HF_TOKEN}`,
          },
    })
    return res.ok
  } catch {
    return false
  }
}
