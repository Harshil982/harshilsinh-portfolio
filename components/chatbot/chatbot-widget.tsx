"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RobotMascot } from "@/components/chatbot/robot-mascot";
import { ChatPanel } from "@/components/chatbot/chat-panel";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RobotMascot isOpen={isOpen} onToggle={() => setIsOpen(true)} />
      <AnimatePresence>
        {isOpen && <ChatPanel key="chat-panel" onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
