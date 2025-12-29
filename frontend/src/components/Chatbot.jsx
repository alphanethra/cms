import { useState } from "react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:4000/api/chatbot/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json," },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { user: userMessage },
        { bot: data.reply },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { bot: "Something went wrong. Try again." },
      ]);
    } finally {
      setUserMessage("");
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          💬 Chat
        </button>
      ) : (
        <div className="w-80 bg-white shadow-xl rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Student Assistant</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="h-60 overflow-y-auto border p-2 mb-2 text-sm">
            {chat.map((c, i) => (
              <div key={i} className="mb-1">
                {c.user && <p><b>You:</b> {c.user}</p>}
                {c.bot && <p><b>Bot:</b> {c.bot}</p>}
              </div>
            ))}
            {loading && <p>Bot is typing...</p>}
          </div>

          <input
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask something..."
            className="border w-full px-2 py-1 rounded mb-2"
          />

          <button
            onClick={sendMessage}
            className="w-full bg-blue-600 text-white py-1 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;