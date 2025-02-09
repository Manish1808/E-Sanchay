import React, { useState } from "react";
import axios from "axios";

const SandehBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [listening, setListening] = useState(false);
  const [status, setstatus] = useState("");

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);

    let updatedMessage = "Hello! How can I help you today?";

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
    setstatus("Typing.......")

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/sandeh`, {
        input,
        language: selectedLanguage,
      });

      const botMessage = { text: response.data.data.message, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { text: "Sorry, something went wrong. 😞", sender: "bot" }]);
    } finally {
      setLoading(false);
      setstatus("");
    }
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage === "hindi" ? "hi-IN" : selectedLanguage === "telugu" ? "te-IN" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const loadVoices = () => {
    return new Promise((resolve) => {
      let voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      };
    });
  };

  const handleTextToSpeech = (text) => {
    setLoading(true);
    setstatus("Speaking.....");
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === "hindi" ? "hi-IN" 
                   : selectedLanguage === "telugu" ? "te-IN" 
                   : "en-US";
  
    // Only fetch a Telugu voice explicitly
    if (selectedLanguage === "telugu") {
      const voices = speechSynthesis.getVoices();
      const teluguVoice = voices.find(voice => voice.lang === "te-IN");
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      } else {
        console.warn("Telugu voice not found. Using default.");
      }
    }
  
    utterance.onend = () => {
      setLoading(false);
      setstatus("");
    };
  
    speechSynthesis.speak(utterance);
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
            <select value={selectedLanguage} onChange={handleLanguageChange} className="bg-gray-600 text-white px-3 py-1 text-sm rounded">
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="telugu">తెలుగు (Telugu)</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[75%] px-4 py-3 rounded-lg text-base flex items-center ${msg.sender === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-600 text-gray-200 self-start"}`}>
                <span>{msg.text}</span>
                {msg.sender === "bot" && (
                  <button onClick={() => handleTextToSpeech(msg.text)} className="ml-2 text-yellow-400">
                    🔊
                  </button>
                )}
              </div>
            ))}
            {status && <div className="text-gray-400 text-sm">{status}</div>}
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
            <button onClick={handleSpeechRecognition} className={`bg-red-500 text-white px-4 py-3 ${listening ? "animate-pulse" : ""} rounded-r`}>
              🎤
            </button>
            <button onClick={sendMessage} disabled={loading} className="bg-blue-500 text-white px-5 py-3 rounded-r ml-2">
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandehBot;