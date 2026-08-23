import { NextResponse } from "next/server";
import { buildSystemPrompt, MASCOT_NAME } from "@/lib/chatbot-knowledge";
import { getLocalFallbackReply } from "@/lib/chatbot-fallback";

export const runtime = "nodejs";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
// Google's free tier shares an overloaded pool per-model — a 503 on one
// model doesn't mean the others are down too. Try a couple of alternates
// before giving up, so a single model's "high demand" spike doesn't sink
// every reply.
const FALLBACK_MODELS = ["gemini-3.5-flash-lite", "gemini-flash-latest"];
const MODEL_CANDIDATES = Array.from(new Set([GEMINI_MODEL, ...FALLBACK_MODELS]));

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 12;

const FALLBACK_ERROR = `Uh oh, my circuits fizzled for a second there. Mind trying that again? If it keeps happening, the Contact section always works and doesn't run on Wi-Fi.`;

// Cached at module scope — the knowledge base is static per deploy.
let systemPrompt: string | null = null;
function getSystemPrompt(): string {
  if (!systemPrompt) {
    systemPrompt = buildSystemPrompt();
  }
  return systemPrompt;
}

interface ChatTurn {
  role: "user" | "model";
  text: string;
}

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: { parts?: GeminiPart[] };
  finishReason?: string;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: { blockReason?: string };
}

function sanitizeHistory(history: unknown): ChatTurn[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (turn): turn is ChatTurn =>
        typeof turn === "object" &&
        turn !== null &&
        (turn as ChatTurn).role !== undefined &&
        ((turn as ChatTurn).role === "user" || (turn as ChatTurn).role === "model") &&
        typeof (turn as ChatTurn).text === "string"
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({
      role: turn.role,
      text: turn.text.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

export async function POST(request: Request) {
  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: FALLBACK_ERROR, ok: false }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { reply: "Say that again? I didn't catch anything.", ok: false },
      { status: 400 }
    );
  }

  const trimmedMessage = message.slice(0, MAX_MESSAGE_LENGTH);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: getLocalFallbackReply(trimmedMessage),
      ok: true,
      mascot: MASCOT_NAME,
      source: "offline",
    });
  }

  const history = sanitizeHistory(body.history);

  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    { role: "user", parts: [{ text: trimmedMessage }] },
  ];

  const requestBody = JSON.stringify({
    system_instruction: { parts: [{ text: getSystemPrompt() }] },
    contents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 500,
      // Newer Gemini models "think" by default, and thinking tokens are
      // deducted from maxOutputTokens — leaving nothing for the visible
      // reply on a small budget. This is a short chit-chat mascot, not a
      // reasoning task, so turn thinking off entirely.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await fetch(`${geminiUrl(model)}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (${model})`, response.status, errorText);
        // Different models can reject the same request for different reasons
        // (overload, a param one variant doesn't like, auth hiccups) — always
        // give the next candidate a shot rather than bailing on the first
        // failure. The final fallback after the loop covers total failure.
        continue;
      }

      const data: GeminiResponse = await response.json();

      if (data.promptFeedback?.blockReason) {
        return NextResponse.json({
          reply: `Whoa, that one tripped a safety filter on my end. Let's talk about something else — like ${personalHint()}?`,
          ok: false,
          mascot: MASCOT_NAME,
        });
      }

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();

      if (!text) continue; // empty candidate — try the next model

      return NextResponse.json({ reply: text, ok: true, mascot: MASCOT_NAME });
    } catch (error) {
      console.error(`Chat route failure (${model})`, error);
      // Network blip — give the next model a shot too.
    }
  }

  // Every model candidate was overloaded, rate-limited, or unreachable —
  // answer from the real knowledge base instead of a generic apology.
  return NextResponse.json({
    reply: getLocalFallbackReply(trimmedMessage),
    ok: true,
    mascot: MASCOT_NAME,
    source: "offline",
  });
}

function personalHint(): string {
  return "the projects Harshilsinh has shipped";
}
