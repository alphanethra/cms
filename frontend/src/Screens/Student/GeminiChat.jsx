import { useState, useRef, useEffect } from "react";

const GEMINI_API_KEY = "AIzaSyDu-zjFiHH5uEwm0U7p-bsUfG-nYTBGKv8"; // ⚠️ move to backend later

export default function GeminiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }],
          }),
        }
      );

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error communicating with Gemini" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---- FORMAT GEMINI RESPONSE ---- */
  const formatText = (text) => {
    return text.split("\n").map((line, idx) => {
      // Headings
      if (line.match(/^#+\s/)) {
        return (
          <h3 key={idx} className="font-semibold text-base mt-3 mb-1">
            {line.replace(/^#+\s/, "")}
          </h3>
        );
      }

      // Bullet points
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-5 list-disc">
            {line.slice(2)}
          </li>
        );
      }

      // Code blocks
      if (line.startsWith("```")) {
        return null;
      }

      // Normal paragraph
      return (
        <p key={idx} className="mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      <div className="bg-white rounded-xl shadow-md border border-indigo-100 flex flex-col h-[70vh]">

        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white">
            🎓 College AI Assistant
          </h2>
          <p className="text-sm text-indigo-200">
            Ask academics, exams, projects, or technical doubts
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 space-y-4 text-sm text-gray-800">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] px-4 py-3 rounded-lg ${
                msg.role === "user"
                  ? "ml-auto bg-indigo-600 text-white"
                  : "mr-auto bg-white border"
              }`}
            >
              {msg.role === "bot" ? formatText(msg.text) : msg.text}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-white border px-4 py-2 rounded-lg text-gray-500">
              Gemini is typing…
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask your question..."
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
