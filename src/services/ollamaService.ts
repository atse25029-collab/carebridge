export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface OllamaModelInfo {
  name: string;
  size: number;
  modified_at?: string;
}

export interface OllamaHealthStatus {
  connected: boolean;
  endpoint: string;
  models: string[];
  currentModel: string;
  error?: string;
}

const STORAGE_KEY_ENDPOINT = 'carebridge_ollama_endpoint';
const STORAGE_KEY_MODEL = 'carebridge_ollama_model';

export const DEFAULT_MODEL = 'gemma4:e2b';

export const CAREBRIDGE_SYSTEM_PROMPT = `You are CareBot, an empathetic, intelligent, and cheerful eldercare AI assistant for CareBridge in Chennai, South India. You are powered by Google's Gemma 4:e2b model running locally on the user's device via Ollama.

Key context about CareBridge:
- Platform: On-demand hourly companion care for elderly parents & seniors.
- Standard Tier: Starts at ₹120-₹190/hr. Companions include enthusiastic college students (Loyola, Anna University, Stella Maris) helping with Tamil newspaper reading, temple walks (e.g. Kapaleeshwarar Temple), chess/Pallanguzhi games, tech help, and pharmacy/grocery errands.
- Premium Tier: Starts at ₹480-₹600/hr. Certified nurses (RN/LPN) & Physiotherapists providing vital monitoring, post-surgery rehab, medication compliance, and stroke recovery support.
- Verified Credentials: All companions are background-checked. Badges include Two-Wheeler License, CPR Certified, First Aid Certified, and BLS.
- Chennai Local Context: Usman Road, Anna Salai, T. Nagar, Mylapore, Adyar. Emergency number in Chennai is 108 (Ambulance), and CareBridge partner is Apollo Hospitals (+91 98400 12345).

Your personality:
- Warm, respectful, culturally sensitive, encouraging, and clear.
- Greet users with "Vanakkam!" when appropriate.
- Give practical, safe eldercare advice and suggest matching CareBridge companion tiers or credentials when users describe their caregiving needs.
- Keep responses concise (2-4 paragraphs max), easy to read for seniors or busy family members.`;

export function getStoredEndpoint(): string {
  if (typeof window === 'undefined') return '/api/ollama';
  const stored = localStorage.getItem(STORAGE_KEY_ENDPOINT);
  if (stored) return stored;
  // In development, /api/ollama is proxied to http://127.0.0.1:11434
  return '/api/ollama';
}

export function setStoredEndpoint(endpoint: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ENDPOINT, endpoint.trim());
  }
}

export function getStoredModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
}

export function setStoredModel(model: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_MODEL, model.trim());
  }
}

/**
 * Checks connection to Ollama server and lists available models
 */
export async function checkOllamaHealth(customEndpoint?: string): Promise<OllamaHealthStatus> {
  const primaryEndpoint = (customEndpoint || getStoredEndpoint()).replace(/\/+$/, '');
  const candidateEndpoints = [
    primaryEndpoint,
    'http://127.0.0.1:11434',
    'http://localhost:11434',
    '/api/ollama',
  ];

  // Deduplicate endpoints
  const uniqueEndpoints = Array.from(new Set(candidateEndpoints));

  for (const endpoint of uniqueEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${endpoint}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const models: string[] = Array.isArray(data.models)
          ? data.models.map((m: any) => m.name || m.model).filter(Boolean)
          : [];

        const preferredModel = models.includes(DEFAULT_MODEL)
          ? DEFAULT_MODEL
          : models.find((m) => m.includes('gemma')) || models[0] || DEFAULT_MODEL;

        return {
          connected: true,
          endpoint,
          models,
          currentModel: preferredModel,
        };
      }
    } catch {
      // Try next endpoint
    }
  }

  return {
    connected: false,
    endpoint: primaryEndpoint,
    models: [],
    currentModel: getStoredModel(),
    error: 'Ollama is not reachable on port 11434. Please ensure "ollama serve" is running.',
  };
}

/**
 * Streams chat responses from Gemma 4:e2b via Ollama's /api/chat
 */
export async function streamChatWithGemma(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    endpoint?: string;
    model?: string;
    onToken?: (token: string, fullText: string) => void;
    signal?: AbortSignal;
  } = {}
): Promise<string> {
  const endpoint = (options.endpoint || getStoredEndpoint()).replace(/\/+$/, '');
  const model = options.model || getStoredModel();

  // Prepend system prompt if not present
  const fullMessages = messages.some((m) => m.role === 'system')
    ? messages
    : [{ role: 'system' as const, content: CAREBRIDGE_SYSTEM_PROMPT }, ...messages];

  let res: Response;
  try {
    res = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        stream: true,
        options: {
          temperature: 0.7,
        },
      }),
      signal: options.signal,
    });
  } catch (err: any) {
    // If proxied endpoint failed, try fallback direct localhost
    if (endpoint !== 'http://127.0.0.1:11434') {
      res = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: fullMessages,
          stream: true,
          options: {
            temperature: 0.7,
          },
        }),
        signal: options.signal,
      });
    } else {
      throw err;
    }
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Ollama error (${res.status}): ${errorText || res.statusText}`);
  }

  if (!res.body) {
    throw new Error('Readable stream not supported in this browser environment.');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed);
        const chunk = parsed.message?.content || parsed.response || '';
        if (chunk) {
          accumulated += chunk;
          options.onToken?.(chunk, accumulated);
        }
      } catch {
        // Skip malformed JSON lines
      }
    }
  }

  if (buffer.trim()) {
    try {
      const parsed = JSON.parse(buffer.trim());
      const chunk = parsed.message?.content || parsed.response || '';
      if (chunk) {
        accumulated += chunk;
        options.onToken?.(chunk, accumulated);
      }
    } catch {
      // Ignored
    }
  }

  return accumulated;
}
