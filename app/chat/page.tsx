"use client";

import { useState } from "react";
import { Message } from "../../lib/agent/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "system", content: "You are a helpful assistant.", id: crypto.randomUUID() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gpt");

  async function send() {
    if (loading) return;
    if (!input.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: "user", content: input.trim(), id: crypto.randomUUID() } as Message];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        body: JSON.stringify({ model, messages: newMessages })
      })
      const data = await res.json();
      if (data?.result) {
        setMessages(prev => [...prev, { role: "assistant", content: data.result.content, id: crypto.randomUUID() } as Message]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Error: no response", id: crypto.randomUUID() } as Message]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", content: "Network error", id: crypto.randomUUID() } as Message]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Agent Chat</h1>
      <select
        value={model}
        onChange={e => setModel(e.target.value)}
        className="mb-4 border p-2"
      >
        <option value="gpt">GPT</option>
        <option value="claude">Claude</option>
        <option value="llama">Local Llama</option>
      </select>

      <div className="border p-4 h-[400px] mb-4 overflow-y-scroll">
        {messages.map((m, i) => (
          <div key={m.id} className="mb-2">
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        className="border p-2 w-full"
        onKeyDown={e => e.key === "Enter" && send()}
      />
    </div>
  );
}
