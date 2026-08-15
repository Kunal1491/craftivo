import { useState, useRef, useEffect } from 'react';
import { FiSend, FiCpu, FiMessageSquare } from 'react-icons/fi';
import api from '../services/api';

export function AskOpsly() {
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'opsly',
      text: 'Good morning! I am your intelligent business assistant. Ask me anything about our customers, projects, outstanding tasks, or revenue metrics.',
      suggestions: [
        'Which projects are at risk?',
        'Who has the most overdue tasks?',
        'What is our revenue overview?',
        'Which customers generated the most revenue?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    // Add user message
    const userMsg = { id: Math.random().toString(36).substring(2, 9), sender: 'user', text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.askAI(promptText);
      
      const opslyMsg = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'opsly',
        text: response.answer,
        contextType: response.contextType,
        suggestions: [
          'Who has the most overdue tasks?',
          'Which projects are at risk?'
        ]
      };
      
      setMessages((prev) => [...prev, opslyMsg]);
    } catch (err) {
      const errorMsg = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'opsly',
        text: `Error connecting to Opsly intelligence engine: ${err.message}. Please verify the Express backend is running.`,
        contextType: 'danger'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const getAlertBorder = (contextType) => {
    switch (contextType) {
      case 'success': return '4px solid var(--opsly-success)';
      case 'warning': return '4px solid var(--opsly-warning)';
      case 'danger': return '4px solid var(--opsly-danger)';
      default: return '1px solid var(--opsly-border)';
    }
  };

  return (
    <div className="opsly-card opsly-ai-assistant">
      <div className="opsly-card-header">
        <h3 className="opsly-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiCpu color="var(--opsly-accent)" /> Ask Opsly AI
        </h3>
        <span className="opsly-badge opsly-badge-info">AI Ready</span>
      </div>

      <div className="opsly-ai-chat-history">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`opsly-ai-msg ${m.sender}`}
            style={m.sender === 'opsly' ? { borderLeft: getAlertBorder(m.contextType) } : {}}
          >
            <div className="opsly-ai-msg-body">{m.text}</div>
            
            {m.sender === 'opsly' && m.suggestions && (
              <div className="opsly-ai-suggestions">
                {m.suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    className="opsly-ai-suggest-btn"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="opsly-ai-msg opsly" style={{ fontStyle: 'italic', color: 'var(--opsly-text-muted)' }}>
            Opsly is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="opsly-ai-input-row">
        <input
          type="text"
          className="opsly-form-input"
          placeholder="Ask a business operations question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isTyping}
        />
        <button
          className="opsly-btn opsly-btn-primary"
          onClick={() => handleSend()}
          disabled={isTyping}
          aria-label="Send query"
        >
          <FiSend size={14} />
        </button>
      </div>
    </div>
  );
}
export default AskOpsly;
