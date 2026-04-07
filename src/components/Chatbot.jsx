import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import axiosInstance from '../services/axiosInstance';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: 'مرحباً بك في ناس الملاح! كيفاش نقدر نعاونك اليوم؟',
          isBot: true,
        },
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      // Use your backend endpoint
      const response = await axiosInstance.post('/chat', {
        message: userMessage,
        // Optional: send message history if backend handles history
      });

      setMessages((prev) => [
        ...prev,
        { text: response.data.reply || 'System Error/لا يوجد رد', isBot: true },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const fallbackMsg = error.response?.data?.reply || 'عذرا، السيرفر لا يستجيب. المرجو المحاولة لاحقا.';
      setMessages((prev) => [
        ...prev,
        { text: fallbackMsg, isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar" style={{ overflow: 'hidden', padding: 0, background: 'transparent', border: 'none' }}>
                <img src="/nas_logo.png" alt="Nas lmla7" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3>ناس الملاح</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  msg.isBot ? 'chatbot-message-bot' : 'chatbot-message-user'
                }`}
              >
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message chatbot-message-bot chatbot-typing">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button className="chatbot-bubble" onClick={toggleChat}>
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
