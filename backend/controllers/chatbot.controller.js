const axios = require("axios");

exports.chatbotReply = async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ 1. Check if message exists
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ✅ 2. LIMIT MESSAGE LENGTH (COST CONTROL)
    if (message.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Message too long (max 200 characters)",
      });
    }

    // 🚀 3. CALL GEMINI API (only if validation passes)
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Chatbot error",
    });
  }
};