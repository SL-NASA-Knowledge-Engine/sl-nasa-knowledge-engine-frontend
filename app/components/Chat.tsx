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

  function linkifyText(text: string): React.ReactNode[] {
  // Regex for URLs (word boundary before protocol helps avoid partial matches)
  const urlRegex = /\bhttps?:\/\/[\S)]+/g;
  // Regex for PMCID like PMC1234567 (match any length of digits)
  const pmcRegex = /PMC\d+/g;

    const lines = text.split(/\n/);
    const nodes: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // If line has '## Referencias' make it a heading
      if (/##\s*Referencias/i.test(line) || /^Referencias[:]?/i.test(line)) {
        nodes.push(
          <div key={`h-${idx}`} style={{ fontWeight: 700, marginTop: 8, marginBottom: 6 }}>Referencias</div>
        );
        return;
      }

      // Replace PMCID first: turn PMCxxxxx into link to pmc
      let parts: Array<string | React.ReactNode> = [line];

      const pmcMatches = line.match(pmcRegex);
      if (pmcMatches) {
        parts = [];
        let cursor = 0;
        pmcMatches.forEach((pmc) => {
          const i = line.indexOf(pmc, cursor);
          if (i > cursor) parts.push(line.slice(cursor, i));
          const href = `https://pmc.ncbi.nlm.nih.gov/articles/${pmc}/`;
          parts.push(
            <a key={`${pmc}-${idx}`} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-blue)' }}>
              {pmc}
            </a>
          );
          cursor = i + pmc.length;
        });
        if (cursor < line.length) parts.push(line.slice(cursor));
      }

      // Now replace any URLs in each part
      parts.forEach((part, pidx) => {
        if (typeof part !== 'string') {
          nodes.push(part);
          return;
        }

        let lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = urlRegex.exec(part)) !== null) {
          const url = match[0];
          const i = match.index;
          if (i > lastIndex) nodes.push(part.slice(lastIndex, i));
          nodes.push(
            <a key={`u-${idx}-${pidx}-${i}`} href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-blue)' }}>
              {url}
            </a>
          );
          lastIndex = i + url.length;
        }
        if (lastIndex < part.length) nodes.push(part.slice(lastIndex));
      });

      // Add a line break after each original line except the last
      if (idx < lines.length - 1) nodes.push(<br key={`br-${idx}`} />);
    });

    return nodes;
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
              <div className="msg-text">
                {msg.role === 'assistant' ? <>{linkifyText(msg.text)}</> : msg.text}
              </div>
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
