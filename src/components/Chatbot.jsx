import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import Robot from "./Robot";

// ── Icons ────────────────────────────────────────────────────────────────────
const RobotIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8.01" y2="16" />
    <line x1="16" y1="16" x2="16.01" y2="16" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "10px 14px" }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{
          display: "block",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "rgba(44, 85, 132, 0.8)",
        }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! 👋 I'm Riadh's assistant. Ask me anything about his work, projects, or how to get in touch!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringSend, setIsHoveringSend] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (textOverride) => {
    const textToSend = typeof textOverride === "string" ? textOverride : input;
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages, // send history before the new user message
        }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again or contact Riadh directly." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isSendDisabled = !input.trim() || isLoading;

  return (
    <>
      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              bottom: isMobile ? "90px" : "110px",
              right: isMobile ? "16px" : "32px",
              width: isMobile ? "calc(100vw - 32px)" : "420px",
              height: isMobile ? "calc(100vh - 120px)" : "600px",
              maxHeight: "800px",
              background: "rgba(8, 8, 8, 0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(44, 85, 132, 0.3)",
              boxShadow: "0 0 40px rgba(44, 85, 132, 0.15)",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 9998,
              fontFamily: "inherit",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(44, 85, 132, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(44, 85, 132, 0.25)",
                    border: "1px solid rgba(44, 85, 132, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(44, 85, 132, 1)",
                  }}
                >
                  <RobotIcon />
                </div>
                {/* Online dot */}
                <span
                  style={{
                    position: "absolute",
                    bottom: "1px",
                    right: "1px",
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid #080808",
                  }}
                />
              </div>
              <div>
                <p style={{ margin: 0, color: "#ffffff", fontSize: "14px", fontWeight: "600", letterSpacing: "0.01em" }}>
                  Riadh's Assistant
                </p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.05em", marginTop: "1px" }}>
                  Ask me anything
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div
              data-lenis-prevent="true"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(44, 85, 132, 0.3) transparent",
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: "#ffffff",
                      ...(msg.role === "user"
                        ? {
                            background: "rgba(44, 85, 132, 0.4)",
                            border: "1px solid rgba(44, 85, 132, 0.5)",
                            borderRadius: "12px 12px 2px 12px",
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "12px 12px 12px 2px",
                          }),
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Suggestions (Only show at the start) */}
              {messages.length === 1 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}
                >
                  {["What services do you offer?", "How much for a website?", "Tell me about your projects."].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(suggestion)}
                      style={{
                        background: "rgba(44, 85, 132, 0.15)",
                        border: "1px solid rgba(44, 85, 132, 0.4)",
                        borderRadius: "20px",
                        padding: "6px 12px",
                        color: "#a1ebd4",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(44, 85, 132, 0.3)";
                        e.currentTarget.style.borderColor = "rgba(44, 85, 132, 0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(44, 85, 132, 0.15)";
                        e.currentTarget.style.borderColor = "rgba(44, 85, 132, 0.4)";
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px 12px 12px 2px",
                      }}
                    >
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid rgba(44, 85, 132, 0.2)",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Type a message..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  backdropFilter: "blur(8px)",
                  border: isFocused
                    ? "1px solid rgba(44, 85, 132, 0.8)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  fontFamily: "inherit",
                }}
              />
              <motion.button
                onClick={sendMessage}
                disabled={isSendDisabled}
                onMouseEnter={() => setIsHoveringSend(true)}
                onMouseLeave={() => setIsHoveringSend(false)}
                whileTap={!isSendDisabled ? { scale: 0.92 } : {}}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: isSendDisabled ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  transition: "background 0.2s ease, box-shadow 0.2s ease",
                  background: isSendDisabled
                    ? "rgba(44, 85, 132, 0.2)"
                    : isHoveringSend
                    ? "rgba(44, 85, 132, 0.9)"
                    : "rgba(44, 85, 132, 0.6)",
                  boxShadow:
                    !isSendDisabled && isHoveringSend
                      ? "0 0 16px rgba(44, 85, 132, 0.6)"
                      : "none",
                  flexShrink: 0,
                }}
              >
                <SendIcon />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Tooltip ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
            style={{
              position: "fixed",
              bottom: isMobile ? "32px" : "48px",
              right: isMobile ? "130px" : "140px",
              background: "rgba(44, 85, 132, 0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              padding: "10px 16px",
              borderRadius: "16px 16px 4px 16px",
              border: "1px solid rgba(44, 85, 132, 0.4)",
              color: "#fff",
              fontSize: "13px",
              pointerEvents: "none",
              zIndex: 9999,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
              fontFamily: "inherit"
            }}
          >
            *Beep boop* 🤖 Need any help?
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Toggle Button ── */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={() => setIsHoveringButton(true)}
        onMouseLeave={() => setIsHoveringButton(false)}
        animate={{ scale: isHoveringButton ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{
          position: "fixed",
          bottom: isOpen ? (isMobile ? "16px" : "32px") : (isMobile ? "12px" : "24px"),
          right: isOpen ? (isMobile ? "16px" : "32px") : (isMobile ? "12px" : "24px"),
          width: isOpen ? "56px" : (isMobile ? "110px" : "130px"),
          height: isOpen ? "56px" : (isMobile ? "110px" : "130px"),
          borderRadius: "50%",
          border: isOpen ? "1px solid rgba(44, 85, 132, 0.6)" : "none",
          background: isOpen ? "rgba(44, 85, 132, 0.15)" : "transparent",
          backdropFilter: isOpen ? "blur(12px)" : "none",
          WebkitBackdropFilter: isOpen ? "blur(12px)" : "none",
          boxShadow: isOpen && isHoveringButton
            ? "0 0 30px rgba(44, 85, 132, 0.6)"
            : isOpen ? "0 0 20px rgba(44, 85, 132, 0.4)" : "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          zIndex: 9999,
          outline: "none",
          transition: "box-shadow 0.3s ease, background 0.3s ease, border 0.3s ease",
          padding: 0
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.div
              key="robot"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[10, 10, 5]} intensity={3} />
                  <directionalLight position={[-10, -10, -5]} intensity={1} />
                  <Robot scale={0.026} position={[0, -0.4, 0]} isHero={false} />
                </Suspense>
              </Canvas>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default Chatbot;
