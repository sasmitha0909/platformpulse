import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Layers,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  HelpCircle,
  Lightbulb
} from "lucide-react";

export const CopilotDrawer = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    copilotKnowledge,
    setActiveTab,
    pipelines,
    dashboards
  } = useApp();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I'm your **PlatformPulse Copilot**. Ask me anything about overnight pipeline failures, why dashboard trust scores dropped, request backlog status, or where platform spend is spiking."
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isCopilotOpen) return null;

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Append user message
    const newMessages = [...messages, { role: "user", text: query }];
    setMessages(newMessages);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      const match = copilotKnowledge.find((k) =>
        k.keywords.some((kw) => lower.includes(kw))
      );

      let reply = "";
      if (match) {
        reply = match.answer;
      } else {
        reply = `**PlatformPulse Diagnostic**:
I analyzed our live telemetry for "${query}". 
- **Pipelines**: 2 failed overnight, 2 delayed.
- **Dashboards**: Executive ARR Overview has an active freshness breach (Score: 48).
- **Cost**: Platform spend is outpacing usage with $7,820/mo in reclaimable waste.

Would you like to inspect **Pipeline Health** or check the **Dashboard Trust** directory?`;
      }

      setMessages([...newMessages, { role: "assistant", text: reply }]);
      setIsThinking(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                PlatformPulse AI Copilot
              </h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                Live Data Mesh Context • Ready
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs leading-relaxed">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 shadow-xs"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing pipelines, trust scores, and warehouse spend...</span>
            </div>
          )}

          {/* Preset Question Chips */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Suggested Diagnostics:
            </span>
            {copilotKnowledge.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.question)}
                className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center justify-between group"
              >
                <span className="truncate">{item.question}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about platform health..."
              className="flex-1 py-2 px-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
