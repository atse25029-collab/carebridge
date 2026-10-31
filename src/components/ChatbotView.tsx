import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Settings,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  X,
  Server
} from 'lucide-react';
import {
  checkOllamaHealth,
  streamChatWithGemma,
  getStoredEndpoint,
  setStoredEndpoint,
  getStoredModel,
  setStoredModel,
  type ChatMessage,
  type OllamaHealthStatus,
  DEFAULT_MODEL,
} from '../services/ollamaService';

const SUGGESTED_PROMPTS = [
  {
    icon: '👵',
    title: 'Chennai Companion',
    prompt: 'Can you recommend a suitable companion in Chennai for my 78-year-old grandmother who loves Tamil conversations and evening walks?',
  },
  {
    icon: '🏷️',
    title: 'Tier Comparison',
    prompt: 'What is the exact difference between CareBridge Standard (₹120/hr) and Premium (₹480/hr) tiers?',
  },
  {
    icon: '🛵',
    title: 'Medicine & Groceries',
    prompt: 'Can student companions with Two-Wheeler licenses help pick up pharmacy prescriptions and groceries in T. Nagar?',
  },
  {
    icon: '🩺',
    title: 'Post-Surgery Care',
    prompt: 'What verified credentials should I look for if my father recently had orthopedic hip surgery?',
  },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  content: `Vanakkam! 🙏 I am **CareBot**, your dedicated eldercare AI assistant powered by **Gemma 4:e2b** running locally on your device via Ollama.\n\nI can help you find the right companion in Chennai, explain verified credentials (CPR, First Aid, Nursing), guide you on pricing, or offer helpful tips for caring for elderly loved ones.\n\nHow may I assist your family today?`,
  timestamp: 'Just now',
};

export const ChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('carebridge_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignored
    }
    return [INITIAL_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<OllamaHealthStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Settings form states
  const [endpointInput, setEndpointInput] = useState(getStoredEndpoint());
  const [modelInput, setModelInput] = useState(getStoredModel());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom(true);
    try {
      localStorage.setItem('carebridge_chat_history', JSON.stringify(messages));
    } catch {
      // Ignored
    }
  }, [messages, isGenerating]);

  // Check Ollama health on mount
  const verifyConnection = async (endpoint?: string) => {
    setIsCheckingHealth(true);
    try {
      const res = await checkOllamaHealth(endpoint);
      setStatus(res);
      if (res.connected && res.currentModel) {
        setModelInput(res.currentModel);
      }
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isGenerating) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = `msg-reply-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages([...updatedHistory, initialAssistantMsg]);
    setIsGenerating(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const chatPayload = updatedHistory
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      await streamChatWithGemma(chatPayload, {
        endpoint: status?.endpoint || getStoredEndpoint(),
        model: status?.currentModel || getStoredModel(),
        signal: controller.signal,
        onToken: (_token, accumulated) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: accumulated } : msg
            )
          );
        },
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User aborted
      } else {
        const errorMsg = `⚠️ **Could not connect to Gemma 4:e2b on Ollama**\n\n${
          err.message || 'Please check that Ollama is running and listening on port 11434.'
        }\n\n*Tip:* Tap the **Settings (⚙️)** icon above to verify your endpoint or start Ollama with: \`ollama serve\`.`;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: errorMsg } : msg
          )
        );
        // Refresh health status
        verifyConnection();
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all conversation history with CareBot?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('carebridge_chat_history');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveSettings = () => {
    setStoredEndpoint(endpointInput);
    setStoredModel(modelInput);
    setShowSettings(false);
    verifyConnection(endpointInput);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs z-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Bot size={22} />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                status?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
              title={status?.connected ? 'Connected to Ollama' : 'Disconnected'}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slate-900">CareBot AI</h1>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                <Sparkles size={9} />
                Gemma 4:e2b
              </span>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
              {status?.connected ? (
                <span className="text-emerald-600 font-medium">● Local Ollama Active</span>
              ) : (
                <span className="text-rose-500 font-medium">● Offline (Port 11434)</span>
              )}
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => verifyConnection()}
            disabled={isCheckingHealth}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
            title="Refresh Ollama Connection"
          >
            <RefreshCw size={15} className={isCheckingHealth ? 'animate-spin text-sky-600' : ''} />
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors active:scale-95"
            title="Clear Chat History"
          >
            <Trash2 size={15} />
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
            title="Ollama Settings"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Offline Alert Banner (if disconnected) */}
      {!status?.connected && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2.5 flex-shrink-0">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-amber-900 leading-tight">
              Ollama Server Not Detected
            </p>
            <p className="text-[10px] text-amber-700 mt-0.5 leading-normal">
              Ensure Ollama is running with model <code className="bg-amber-100 px-1 py-0.2 rounded font-mono text-[9px]">gemma4:e2b</code>.
            </p>
          </div>
          <button
            onClick={() => verifyConnection()}
            className="px-2 py-1 text-[10px] font-bold bg-amber-600 text-white rounded-lg shadow-xs hover:bg-amber-700 active:scale-95 transition-all flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs relative transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-100">
                    <span className="text-[9px] font-bold text-sky-600 flex items-center gap-1 uppercase tracking-wider">
                      <Bot size={11} />
                      CareBot • Gemma 4
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <Check size={11} className="text-emerald-600" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed select-text font-normal">
                  {msg.content || (
                    <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                      Thinking with Gemma 4:e2b...
                    </span>
                  )}
                </div>

                <div
                  className={`text-[9px] mt-1 text-right ${
                    isUser ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Suggested Starter Chips (only show when conversation is fresh) */}
        {messages.length <= 1 && (
          <div className="pt-2 pb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles size={11} className="text-sky-500" />
              Suggested Questions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="bg-white border border-slate-200/80 hover:border-sky-300 hover:shadow-xs p-2.5 rounded-xl text-left transition-all active:scale-98 flex items-start gap-2 group cursor-pointer"
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {item.prompt}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-slate-200 p-3 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CareBot about companions, rates, elderly care..."
              disabled={isGenerating}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all disabled:opacity-60"
            />
          </div>

          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              className="h-10 px-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-xs bg-white animate-pulse" />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all shadow-md shadow-sky-600/20 disabled:shadow-none active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={15} />
            </button>
          )}
        </form>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Server size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Ollama Configuration</h3>
                  <p className="text-[10px] text-slate-500">Local Gemma 4:e2b Model</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Ollama Endpoint URL
                </label>
                <input
                  type="text"
                  value={endpointInput}
                  onChange={(e) => setEndpointInput(e.target.value)}
                  placeholder="/api/ollama or http://127.0.0.1:11434"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">
                  Default: <code className="text-slate-600">/api/ollama</code> (proxied to port 11434)
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Model Tag
                </label>
                <input
                  type="text"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  placeholder="gemma4:e2b"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">
                  Installed in: <code className="text-slate-600">E:\ollama models</code>
                </span>
              </div>

              {/* Status info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Connection Status:</span>
                  <span className={`font-bold ${status?.connected ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {status?.connected ? 'Connected' : 'Offline'}
                  </span>
                </div>
                {status?.models && status.models.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Detected Models:</span>
                    <span className="font-mono text-slate-700 truncate max-w-[150px]">
                      {status.models.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEndpointInput('/api/ollama');
                  setModelInput(DEFAULT_MODEL);
                }}
                className="px-3 py-2 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Reset Default
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex-1 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 active:scale-98 transition-all"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
