"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Loader2, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { personal } from "@/lib/data";
import { MASCOT_NAME } from "@/lib/chatbot-knowledge";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  text: `Beep boop! I'm ${MASCOT_NAME}, ${personal.name.split(" ")[0]}'s sidekick around here. Ask me about his projects, skills, or how to get in touch — or tell me what you're looking for and I'll point you the right way.`,
};

interface ChatApiResponse {
  reply?: string;
}

interface ChatPanelProps {
  onClose: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const history = nextMessages
        .slice(0, -1)
        .map((m) => ({ role: m.role === "assistant" ? "model" : "user", text: m.text }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data: ChatApiResponse = await response.json();
      const reply = data.reply || "Hmm, something short-circuited. Try asking again?";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Looks like my signal dropped. Mind trying that again in a moment?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Chat with ${MASCOT_NAME}`}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 24, scale: reducedMotion ? 1 : 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 24, scale: reducedMotion ? 1 : 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="glass fixed bottom-4 right-4 z-50 flex h-[min(32rem,calc(100dvh-2rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl shadow-2xl sm:bottom-6 sm:right-6"
    >
      <header className="flex items-center justify-between gap-3 border-b border-[var(--glass-border)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-9 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground">
            <Bot className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">{MASCOT_NAME}</p>
            <p className="mt-1 text-xs text-muted-foreground">Ask me about {personal.firstName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-gradient-brand text-primary-foreground"
                  : "bg-foreground/5 text-foreground"
              )}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-foreground/5 px-3.5 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              thinking…
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-[var(--glass-border)] p-3"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Ask ${MASCOT_NAME} something…`}
          maxLength={1000}
          disabled={isLoading}
          className="h-10 rounded-full bg-background/60"
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20 outline-none transition-transform disabled:pointer-events-none disabled:opacity-50 hover:not-disabled:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Send className="size-4" />
        </button>
      </form>
    </motion.div>
  );
}
