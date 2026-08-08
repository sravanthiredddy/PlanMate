import React, { useState } from "react";
import axios from "axios";
import "./AIChat.css";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const USER_ID = storedUser?.id;
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:8080/api/ai/user/${USER_ID}`,
        { message }
      );

      const botMsg = { sender: "bot", text: res.data };
      setChat((prev) => [...prev, botMsg]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to AI." }
      ]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <section className="ai-chat-shell">
      <div className="ai-chat-hero">
        <p className="ai-chat-kicker">Smart Workspace</p>
        <h2>AI Assistant</h2>
        <p className="ai-chat-subtitle">
          Ask for summaries, planning help, and quick task guidance in one place.
        </p>
      </div>

      <div className="ai-chat-window">
        {chat.map((msg, index) => (
          <div key={index} className={`ai-chat-row ${msg.sender === "user" ? "user" : "bot"}`}>
            <span className="ai-chat-bubble">{msg.text}</span>
          </div>
        ))}

        {loading && <p className="ai-chat-thinking">Thinking...</p>}
      </div>

      <div className="ai-chat-composer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask the assistant about your tasks..."
        />

        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </section>
  );
}

export default AIChat;
