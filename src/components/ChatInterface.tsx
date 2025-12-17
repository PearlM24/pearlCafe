'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { flowiseService, ChatMessage } from '@/services/flowiseService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    pageContent: string;
    metadata: { [key: string]: any };
  }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build history from previous messages
      const history: Array<{ question: string; answer: string }> = [];
      for (let i = 0; i < messages.length; i += 2) {
        if (messages[i].role === 'user' && messages[i + 1]?.role === 'assistant') {
          history.push({
            question: messages[i].content,
            answer: messages[i + 1].content,
          });
        }
      }

      const response = await flowiseService.sendMessage(userMessage.content, history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        sources: response.sourceDocuments,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response. Please check your Flowise configuration.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to get response. Please check your Flowise configuration.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      background: 'var(--bg-card)',
      borderRadius: '25px',
      boxShadow: 'var(--shadow-medium)',
      border: '2px solid var(--autumn-peach)',
      overflow: 'hidden'
    }}>
      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: 'linear-gradient(180deg, var(--autumn-cream) 0%, var(--bg-card) 100%)'
      }}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--autumn-rose) 0%, var(--autumn-terracotta) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-soft)'
            }}>
              <Bot size={40} color="white" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--autumn-burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Welcome to Pearl Cafe! <i className="fas fa-coffee" style={{ color: 'var(--autumn-terracotta)' }}></i>
            </h2>
            <p style={{ fontSize: '1rem', maxWidth: '400px', lineHeight: '1.6' }}>
              Ask me anything about coffee, our flavors, or get personalized recommendations!
              I'm here to help you find your perfect cup.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start'
            }}
          >
            {message.role === 'assistant' && (
              <div style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--autumn-rose) 0%, var(--autumn-terracotta) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-soft)'
              }}>
                <Bot size={20} color="white" />
              </div>
            )}

            <div className={`message-bubble ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}>
              <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                {message.content}
              </p>
              
              {message.sources && message.sources.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(184, 92, 87, 0.2)'
                }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-light)' }}>
                    Sources:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {message.sources.slice(0, 3).map((source, idx) => (
                      <div key={idx} style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        <p style={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%'
                        }}>
                          {source.pageContent.substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '8px', marginBottom: 0 }}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--autumn-dusty-pink) 0%, var(--autumn-lavender) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-soft)'
              }}>
                <User size={20} color="white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <div style={{
              flexShrink: 0,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--autumn-rose) 0%, var(--autumn-terracotta) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-soft)'
            }}>
              <Bot size={20} color="white" />
            </div>
            <div className="message-bubble message-assistant">
              <Loader2 size={20} className="spinner" style={{ color: 'var(--autumn-rose)' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          borderTop: '2px solid #e57373',
          color: '#c62828'
        }}>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div style={{
        borderTop: '2px solid var(--autumn-peach)',
        padding: '20px 24px',
        background: 'var(--bg-card)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about coffee, flavors, or get recommendations..."
            disabled={isLoading}
            className="input"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            {isLoading ? (
              <Loader2 size={20} className="spinner" />
            ) : (
              <>
                <Send size={20} />
                <span style={{ display: 'none' }} className="send-text">Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
