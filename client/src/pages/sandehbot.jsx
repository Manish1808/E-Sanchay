import React, { useState } from "react";
import axios from "axios";

const SandehBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english"); // Default: English

  // Function to update the initial message when language changes
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);

    let updatedMessage = "Hello! How can I help you today?"; // Default English

    if (newLanguage === "hindi") {
      updatedMessage = "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?";
    } else if (newLanguage === "telugu") {
      updatedMessage = "హలో! నేను మీకు ఎలా సహాయపడగలను?";
    }

    setMessages([{ text: updatedMessage, sender: "bot" }]);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send user input and selected language to the backend
      const response = await axios.post("http://localhost:8000/api/v1/chat/sandeh", {
        input,
        language: selectedLanguage, // Send selected language
      });

      // Extract bot response
      const botMessage = { text: response.data.data.message, sender: "bot" };

      // Update state with bot's response
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong. 😞", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black-900 p-5">
    
      <div className="flex w-[900px] h-[600px] bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden border border-gray-700">
        
        <div className="hidden md:block w-1/3">
          <img src="/chatbotsandeh.jpg" alt="Chatbot Illustration" className="w-full h-full object-cover" />
        </div>

       
        <div className="flex flex-col w-full md:w-2/3">
          <div className="bg-gray-700 text-white text-center py-4 text-xl font-semibold flex justify-between px-4">
            <span>SandehBot</span>

           
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-gray-600 text-white px-3 py-1 text-sm rounded"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="telugu">తెలుగు (Telugu)</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[75%] px-4 py-3 rounded-lg text-base ${
                msg.sender === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-600 text-gray-200 self-start"
              }`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-sm">Typing...</div>}
          </div>

          <div className="p-4 border-t border-gray-700 flex items-center bg-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 text-base border rounded-l focus:outline-none bg-gray-800 border-gray-600 text-white"
            />
            <button onClick={sendMessage} disabled={loading} className="bg-blue-500 text-white px-5 py-3 rounded-r">
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandehBot;
