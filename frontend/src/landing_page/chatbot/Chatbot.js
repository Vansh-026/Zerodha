import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Chatbot.css";

const QUICK_SUGGESTIONS = [
  "🚀 Take me to Pricing",
  "📝 Go to Sign Up",
  "📱 Show Products",
  "💰 What are brokerage charges?",
  "📈 Difference between CNC and MIS?",
  "🎯 What is a GTT order?",
];

const ROUTE_LABELS = {
  "/pricing": "View Pricing & Charges",
  "/signup": "Open Sign Up Page",
  "/login": "Go to Login",
  "/logout": "Log Out",
  "/product": "Explore Products",
  "/about": "About Zerodha",
  "/support": "Open Support Portal",
  "/": "Go to Home",
};

// Client-side quick navigation detector
function getClientNavigation(text) {
  const q = text.toLowerCase().trim();
  const navTrigger = /go to|take me to|navigate to|open|show me|visit|redirect|move to|view/;

  if (q.includes("pricing") || q.includes("charge") || q.includes("brokerage rate")) {
    if (navTrigger.test(q) || q.includes("page")) return "/pricing";
  }
  if (q.includes("signup") || q.includes("sign up") || q.includes("register") || q.includes("open account") || q.includes("new account")) {
    if (navTrigger.test(q) || q.includes("page") || q.startsWith("how to open")) return "/signup";
  }
  if (q.includes("login") || q.includes("sign in") || q.includes("log in")) {
    if (navTrigger.test(q) || q.includes("page")) return "/login";
  }
  if (q.includes("product") || q.includes("platform") || q.includes("kite app") || q.includes("coin app")) {
    if (navTrigger.test(q) || q.includes("page")) return "/product";
  }
  if (q.includes("about") || q.includes("founder") || q.includes("story") || q.includes("team")) {
    if (navTrigger.test(q) || q.includes("page")) return "/about";
  }
  if (q.includes("support") || q.includes("ticket") || q.includes("help") || q.includes("contact")) {
    if (navTrigger.test(q) || q.includes("page")) return "/support";
  }
  if (q.includes("home") || q.includes("landing")) {
    if (navTrigger.test(q) || q.includes("page")) return "/";
  }
  return null;
}

// Helper to format markdown-like text (bold, lists, line breaks)
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let currentList = [];

  const parseInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(
        <li key={`li-${index}`}>{parseInline(trimmed.substring(2))}</li>
      );
    } else {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`}>{currentList}</ul>);
        currentList = [];
      }
      if (trimmed === "") {
        elements.push(<div key={`empty-${index}`} style={{ height: "6px" }} />);
      } else {
        elements.push(
          <p key={`p-${index}`} style={{ margin: "4px 0" }}>
            {parseInline(line)}
          </p>
        );
      }
    }
  });

  if (currentList.length > 0) {
    elements.push(<ul key={`ul-end`}>{currentList}</ul>);
  }

  return <div className="formatted-bot-text">{elements}</div>;
}

function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPill, setShowPill] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hi! I am your Zerodha AI Assistant. You can ask me **any question** (stocks, charges, market concepts, Kite) or ask me to **take you to any page** on the website!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowPill(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const getBackendUrl = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return "https://zerodha-backend-1klu.onrender.com";
  };

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const message = (textToSend || input).trim();
    if (!message || isLoading) return;

    // Check if user wanted to navigate
    const clientNavPath = getClientNavigation(message);

    const userMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const backendUrl = getBackendUrl();
      const historyPayload = nextMessages
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const response = await axios.post(
        `${backendUrl}/chat`,
        {
          message: userMessage.text,
          history: historyPayload,
        },
        { timeout: 25000 }
      );

      let botReply = response.data?.reply || "I didn't receive a response. Please try again.";
      let navPath = clientNavPath;

      // Extract [[NAVIGATE:/path]] from bot reply
      const navMatch = botReply.match(/\[\[NAVIGATE:([a-zA-Z0-9_/]+)\]\]/);
      if (navMatch) {
        navPath = navMatch[1];
        botReply = botReply.replace(/\[\[NAVIGATE:[a-zA-Z0-9_/]+\]\]/g, "").trim();
      }

      // Automatically navigate if a path is identified
      if (navPath) {
        handleNavigate(navPath);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          navPath: navPath,
          navLabel: navPath ? ROUTE_LABELS[navPath] || `Open ${navPath}` : null,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      // If network failed but user wanted to navigate, still navigate!
      if (clientNavPath) {
        handleNavigate(clientNavPath);
        setMessages((prev) => [
          ...prev,
          {
            id: "bot-nav-" + Date.now(),
            sender: "bot",
            text: `Navigating you to **${ROUTE_LABELS[clientNavPath] || clientNavPath}**!`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            navPath: clientNavPath,
            navLabel: ROUTE_LABELS[clientNavPath],
          },
        ]);
      } else {
        let errorText = "Sorry, I couldn't reach the server right now. ";
        if (error.code === "ECONNABORTED") {
          errorText = "Request timed out. Please try again in a moment.";
        } else if (error.response?.data?.error) {
          errorText = error.response.data.error;
        } else {
          errorText += "Please make sure your backend is running.";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: "bot-err-" + Date.now(),
            sender: "bot",
            text: errorText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: "Chat cleared! How else can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="zerodha-chatbot-container">
      {/* Floating Launcher Button & Greeting Pill */}
      {!isOpen && (
        <>
          {showPill && (
            <div
              className="launcher-greeting-pill"
              onClick={() => setIsOpen(true)}
              title="Click to chat"
            >
              <span>💬 Ask AI or Navigate</span>
            </div>
          )}
          <button
            className="chatbot-launcher-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open Zerodha AI Assistant"
            title="Chat with Zerodha Assistant"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="launcher-pulse"></span>
          </button>
        </>
      )}

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-info">
              <div className="header-avatar">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                  <line x1="16" y1="16" x2="16.01" y2="16" />
                </svg>
              </div>
              <div className="header-title-box">
                <h3>Zerodha Assistant</h3>
                <div className="header-status">
                  <span className="status-dot"></span>
                  Online | AI & Navigation
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                className="header-btn"
                onClick={handleClearChat}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>
              <button
                className="header-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="chatbot-messages">
            {/* Quick Suggestions Card on Start */}
            {messages.length <= 2 && (
              <div className="chat-welcome-card">
                <div className="welcome-title">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Quick Questions & Navigation</span>
                </div>
                <div className="welcome-text">
                  Ask any question or click to jump straight to a page:
                </div>
                <div className="suggestion-chips">
                  {QUICK_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-chip"
                      onClick={() => handleSendMessage(suggestion)}
                      disabled={isLoading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                {msg.sender === "bot" && (
                  <div className="bot-avatar-small">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                    </svg>
                  </div>
                )}
                <div className="message-bubble-wrapper">
                  <div className="message-bubble">
                    {msg.sender === "bot" ? (
                      <>
                        <FormattedMessage text={msg.text} />
                        {msg.navPath && (
                          <button
                            className="chat-action-btn"
                            onClick={() => handleNavigate(msg.navPath)}
                            title={`Navigate to ${msg.navPath}`}
                          >
                            <span>🚀 {msg.navLabel || "Go to Page"}</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>
                  <div className="message-timestamp">{msg.time}</div>
                </div>
              </div>
            ))}

            {/* Thinking / Typing Animation */}
            {isLoading && (
              <div className="chat-message-row bot">
                <div className="bot-avatar-small">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                  </svg>
                </div>
                <div className="typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="chatbot-footer">
            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="chat-input-field"
                placeholder="Ask any question, or say 'Take me to pricing'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <div className="footer-caption">Zerodha Kite AI • Questions & Page Navigation</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
