"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Paperclip } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; text: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", role: "assistant", text: "Bienvenido. Soy LABI, tu asistente impulsado por IA para explorar investigaciones biológicas espaciales de la NASA. ¿Sobre qué tema quieres aprender?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    if (isLoading) return; // prevent sending while waiting

    const questionText = input.trim();
    const userMsg: Message = { id: String(Date.now()), role: "user", text: questionText };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // add typing indicator message which we'll replace later
    const typingId = `t-${Date.now()}`;
    setMessages((m) => [...m, { id: typingId, role: "assistant", text: "LABI está pensando..." }]);
    setIsLoading(true);

    try {
      const resp = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Server error: ${resp.status} ${text}`);
      }

      const data = await resp.json();
      const answer = typeof data?.answer === "string" ? data.answer : JSON.stringify(data);

      // replace typing indicator with actual answer
      setMessages((m) => m.map((msg) => (msg.id === typingId ? { ...msg, text: answer } : msg)));
    } catch (err: any) {
      console.error(err);
      const errorText = `Error al obtener respuesta: ${err?.message ?? String(err)}`;
      setMessages((m) => m.map((msg) => (msg.id === typingId ? { ...msg, text: errorText } : msg)));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-root">
      <div className="chat-panel">
        <div className="chat-messages">
        {messages.map((msg) => {
          const isTyping = msg.role === "assistant" && String(msg.id).startsWith("t-");
          return (
            <div key={msg.id} className={`msg ${msg.role} ${isTyping ? "typing" : ""}`}>
              <div className="msg-role">{msg.role === "user" ? "Tú" : "LABI"}</div>
              <div className="msg-text">{msg.text}</div>
            </div>
          );
        })}
        <div ref={endRef} />
        </div>

  <div className={`chat-input ${isLoading ? "disabled" : ""}`}>
        <button className="chat-mic-btn" aria-label="Grabar voz">
          <Mic size={18} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Escribe un mensaje..."
        />
        <button className="chat-attach-btn" aria-label="Adjuntar">
          <Paperclip size={16} />
        </button>
        <button onClick={send} aria-label="Enviar" className="chat-send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
        </div>
      </div>
    </div>
  );
}
