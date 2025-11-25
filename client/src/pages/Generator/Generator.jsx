// src/pages/GeneratorPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./generator.css"; // 👈 import the CSS file
import { useSelector } from "react-redux";

export default function GeneratorPage() {
  const { user } = useSelector((state) => state.auth);

  const [brandData, setBrandData] = useState({
    companyName: "",
    website: "",
    domain: "",
    targetAudience: "",
    description: "",
    platform: "Instagram",
  });

  const handleGenerate = (finalData) => {
    console.log("Final brand data to send to backend:", finalData);
    // later: call your backend here
  };

  return (
    <div className="generator-page">
      {/* background glows */}
      <div className="generator-glows">
        <div className="glow glow-cyan" />
        <div className="glow glow-purple" />
        <div className="glow glow-green" />
      </div>

      <div className="generator-inner">
        {/* LEFT – hero section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-section"
        >
          {/* Tag pill */}
          <div className="tag-pill">
            <span className="tag-dot" />
            <span className="tag-text">AI AUTOMATION · MULTI-MODEL ENGINE</span>
          </div>

          {/* Title */}
          <h1 className="hero-title">
            <span>Automate your </span>
            <span className="hero-title-accent">creative workflow</span>
            <span> with AI.</span>
          </h1>

          {/* Paragraph */}
          <p className="hero-paragraph">
            Chat with AutoCreative AI, answer a few questions about your brand,
            and get ad visuals, social posts and copy generated using multiple
            models in parallel — ranked and ready for your campaigns.
          </p>

          {/* Feature chips */}
          <div className="features-row">
            <div className="feature-chip">
              <div className="feature-bubble">
                <span className="feature-bubble-text">2x</span>
              </div>
              <div>
                <p className="feature-title">Multi-model Ranking</p>
                <p className="feature-sub">Flux + SDXL + more</p>
              </div>
            </div>

            <div className="feature-chip">
              <div className="feature-circle" />
              <div>
                <p className="feature-title">Chat-based onboarding</p>
                <p className="feature-sub">
                  Feels like talking to an assistant
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* RIGHT – chat wizard */}
        <ConversationGenerator
          brandData={brandData}
          setBrandData={setBrandData}
          onGenerate={handleGenerate}
        />
      </div>

      {/* FOOTER */}
      <footer className="generator-footer">
        <span>
          © {new Date().getFullYear()} AutoCreative AI. All rights reserved.
        </span>
        <span className="footer-right">
          <span className="footer-dot" />
          <span>AI-powered automation for marketers.</span>
        </span>
      </footer>
    </div>
  );
}

/* ---------------- Conversation-based Generator ---------------- */

function ConversationGenerator({ brandData, setBrandData, onGenerate }) {
  const { user } = useSelector((state) => state.auth);

  const steps = [
    { key: "companyName", question: "First, what’s your company name?" },
    { key: "website", question: "Great. What’s your website URL?" },
    {
      key: "domain",
      question:
        "What industry or domain are you in (e.g. fitness, SaaS, real estate, ecommerce)?",
    },
    {
      key: "targetAudience",
      question:
        "Who is your main target audience (e.g. busy executives, startup founders, families)?",
    },
    {
      key: "description",
      question:
        "Give me a short 1–2 sentence description of your main product or service.",
    },
    {
      key: "platform",
      question:
        "Which platform do you want to focus on first (Instagram, LinkedIn, TikTok, Facebook)?",
    },
  ];

  const [messages, setMessages] = useState([
    {
      from: "system",
      text: `Hey ${user?.firstName}, I’m your AI creative assistant. I’ll ask you a few quick questions and then I’ll generate a full campaign for you.`,
    },
    {
      from: "system",
      text: steps[0].question,
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👇 SCROLL REF
  const messagesEndRef = useRef(null);

  // 👇 SCROLL EFFECT – runs every time messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth", // change to "auto" if you don’t want animation
        block: "end",
      });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || completed) return;

    const step = steps[currentStep];
    const updatedBrand = { ...brandData, [step.key]: text };

    setBrandData(updatedBrand);

    setMessages((prev) => {
      const updated = [...prev, { from: "user", text }];
      if (currentStep < steps.length - 1) {
        updated.push({
          from: "system",
          text: steps[currentStep + 1].question,
        });
      } else {
        updated.push({
          from: "system",
          text: "Perfect. I’ve got everything I need. Let me craft your campaign now… ⚡",
        });
      }
      return updated;
    });

    setInput("");

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // last step → fake loading + callback
    setCompleted(true);
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      onGenerate(updatedBrand);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="chat-card"
    >
      <div className="chat-glow chat-glow-top" />
      <div className="chat-glow chat-glow-bottom" />

      {/* header */}
      <div className="chat-header">
        <div>
          <h2 className="chat-title">Brand setup chat</h2>
          <p className="chat-subtitle">
            Answer a few questions, like you would in a conversation, and we’ll
            do the rest.
          </p>
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          <span className="live-text">Live AI assistant</span>
        </div>
      </div>

      {/* messages */}
      <div className="messages-area">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.from === "user"
                ? "message-row message-row-user"
                : "message-row message-row-system"
            }
          >
            <div
              className={
                msg.from === "user"
                  ? "bubble bubble-user"
                  : "bubble bubble-system"
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* input row */}
      <form onSubmit={handleSend} className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || completed}
          placeholder={
            loading
              ? "Generating your campaign..."
              : completed
              ? "Done! You can now go to results."
              : "Type your answer here and press Enter..."
          }
          className={`chat-input ${loading ? "chat-input-loading" : ""}`}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="send-button"
        >
          {completed ? "✓" : "Send"}
        </button>
      </form>

      <p className="bottom-hint">
        We’ll convert your answers into a structured JSON object and feed it to
        your AI models for prompt and asset generation.
      </p>
    </motion.div>
  );
}
