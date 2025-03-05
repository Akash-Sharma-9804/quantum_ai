import { useState, useEffect, useRef } from "react";
import {
  Send,
  User,
  Bot,
  Sun,
  Moon,
  Plus,
  Menu,
  X,
  CircleUserRound,
  Settings,
  BadgeHelp,
  History,
  ChevronDown,
  CircleFadingArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function GeminiClone() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [botTyping, setBotTyping] = useState("");
  const [greeting, setGreeting] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);
  const [isRotated, setIsRotated] = useState(false);

  const generateGreeting = () => {
    setGreeting("");
    const greetingText = "Hi! I am Quantum Ai. Ask me anything...";
    let currentText = "";
    greetingText.split("").forEach((char, index) => {
      setTimeout(() => {
        currentText += char;
        setGreeting(currentText);
      }, index * 50);
    });
  };

  useEffect(() => {
    generateGreeting();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, botTyping]);

  const addNewChat = () => {
    generateGreeting();
    const newChat = { id: Date.now(), title: "New Chat", messages: [] };
    setChats([newChat, ...chats]);
    setCurrentChat(null);
  };

  const GEMINI_API_KEY = "AIzaSyAMPu-bJRESlhUlLoLPCdW_gqvuU3g5ZjE"; // Replace with your actual API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    let updatedChats = [...chats];
    let chatIndex = chats.findIndex((chat) => chat.id === currentChat);
    let chatId = currentChat; // Store chatId before updating state

    if (chatIndex === -1) {
        const newChat = {
            id: Date.now(),
            title: input,
            messages: [{ sender: "user", text: input }],
        };
        updatedChats = [newChat, ...chats];
        setCurrentChat(newChat.id);
        chatId = newChat.id; // Update the local variable
    } else {
        updatedChats[chatIndex].messages.push({ sender: "user", text: input });
    }

    setChats(updatedChats);
    setInput("");
    setBotTyping("Thinking...");

    try {
        const requestBody = {
            contents: [{ parts: [{ text: input }] }]
        };
        
        const response = await axios.post(GEMINI_API_URL, requestBody);

        const botResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";

        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === chatId  // Using stored chatId instead of currentChat
                    ? {
                        ...chat,
                        messages: [...chat.messages, { sender: "bot", text: botResponse }],
                    }
                    : chat
            )
        );
    } catch (error) {
        console.error("API Error:", error);
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === chatId
                    ? {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            { sender: "bot", text: "Error getting response. Try again." },
                        ],
                    }
                    : chat
            )
        );
    }

    setBotTyping("");
    setLoading(false);
};


  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-r from-zinc-700 to-slate-900 text-white"
          : "bg-gradient-to-r from-orange-100 to-neutral-300 text-black"
      } flex h-screen overflow-hidden font-mono`}>
      {/* Sidebar starts */}
      <div
        className={`fixed md:relative z-20 h-full w-64 bg-white dark:bg-gradient-to-r from-zinc-700 to-slate-900 border-r p-4 flex flex-col space-y-4 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0`}>
        <div className="flex justify-between gap-2 items-center ">
          <span className=" text-xl sm:hidden font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Quantum Ai.
          </span>

          <button
            className="md:hidden  self-end flex justify-center text-white items-center"
            onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <button
          className="p-2 bg-blue-500 text-white rounded-lg flex items-center justify-center"
          onClick={addNewChat}>
          <Plus size={18} className="mr-2" /> New Chat
        </button>
        <span className="p-2 flex items-center gap-4 bg-gray-600 text-white rounded-lg cursor-pointer">
          <History color="#ffffff" /> Chat history
        </span>
        <div className="flex flex-col space-y-2 flex-1 overflow-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-2 rounded-lg cursor-pointer ${
                currentChat === chat.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-white"
              }`}
              onClick={() => setCurrentChat(chat.id)}>
              {chat.title}
            </div>
          ))}
        </div>
        <button
          className="p-2 flex items-center gap-4 bg-gray-600 text-white rounded-lg"
          onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />} Toggle Theme
        </button>
        <span className="p-2 flex items-center gap-4 bg-gray-600 text-white rounded-lg cursor-pointer">
          <BadgeHelp color="#ffffff" />
          Help
        </span>
        <span
          className="p-2 flex items-center gap-4 bg-gray-600 text-white rounded-lg cursor-pointer"
          onClick={() => setIsRotated(!isRotated)}>
          <Settings
            color="#ffffff"
            className={`transition-transform duration-300 ${
              isRotated ? "rotate-90" : "rotate-0"
            }`}
          />
          Settings
        </span>
        <span className="p-1 flex items-center gap-4 bg-gray-600 text-white rounded-lg cursor-pointer">
          <CircleFadingArrowUp size={24} color="#ffffff" strokeWidth={2.25} />{" "}
        <div className="flex flex-col ">
        Upgrade Plan
        <span className="text-[11px]">More access to best models.</span>
          </div>  
        </span>
      </div>
      {/* Sidebar ends */}

      {/* Chat Window starts */}
      <div className="flex flex-col flex-1 p-4 relative">
        <div className="flex sm:justify-between items-center justify-around gap-7">
          <button
            className="sm:hidden z-10"
            onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
          <div className="relative group flex flex-col justify-center items-center cursor-pointer ">
            <span className="text-2xl flex gap-2 items-center cursor-pointer sm:text-center font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent bg-clip-text">
              {" "}
              Quantum Ai.{" "}
              <ChevronDown
                size={20}
                color={`${darkMode ? " #ffffff" : " #000000"} `}
              />
            </span>
            <span className="text-sm">Version 2.0</span>
            <div className="absolute top-12 p-1  bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p
                className={`${
                  darkMode ? " text-white" : " text-black"
                } text-xs   font-semibold`}>
                Stay tuned for latest versions.
              </p>
            </div>
          </div>
          <span className="realtive group cursor-pointer sm:mr-6 border-2 rounded-full p-2 dark:bg-gray-700 text-white">
            {" "}
            <User size={20} />
            <div className="absolute top-14 p-1 right-6 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p
                className={`${
                  darkMode ? " text-white" : " text-black"
                } text-xs   font-semibold`}>
                User Name
              </p>
            </div>
          </span>
        </div>

        {currentChat === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className=" sm:absolute relative top-56  sm:inset-0 flex items-center justify-center text-3xl font-bold text-center max-w-lg mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent bg-clip-text">
            {greeting}
          </motion.div>
        )}
        <div className="flex-1 mt-5  p-4 space-y-4 overflow-auto">
          {chats
            .find((chat) => chat.id === currentChat)
            ?.messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg max-w-3xl break-words whitespace-pre-wrap 
             ${
               msg.sender === "user"
                 ? "bg-blue-500 text-white self-end ml-auto"
                 : "bg-gray-200 dark:bg-gray-600 text-black dark:text-white self-start mr-auto"
             }`}
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                <div className="flex items-center gap-2">
                  {msg.sender === "user" ? (
                    <CircleUserRound
                      size={20}
                      color="#ffffff"
                      strokeWidth={2.25}
                    />
                  ) : (
                    <Bot size={18} />
                  )}
                  <span>{msg.text}</span>
                </div>
              </motion.div>
            ))}
          {botTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-lg max-w-xl bg-gray-200 text-black self-start mr-auto">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <span>{botTyping}</span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex items-center w-full justify-center p-2 border-t border-black ">
          <input
            type="text"
            className="w-5/6 p-5 border rounded-3xl outline-none dark:bg-gray-700 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask something..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            disabled={loading}>
            <Send size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
