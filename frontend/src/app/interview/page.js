'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { startInterview, sendMessage } from '@/services/api';
import { Send, ArrowLeft, Bot, User, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

export default function InterviewPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initInterview();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initInterview = async () => {
    try {
      const res = await startInterview();
      if (res.success) {
        setSessionId(res.sessionId);
        setMessages([{ role: 'assistant', message: res.message }]);
      } else {
        alert(res.error || 'Failed to start interview');
        router.push('/');
      }
    } catch (error) {
      alert('Failed to start interview. Make sure a PDF is uploaded.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending || completed) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { role: 'user', message: userMessage }]);

    try {
      const res = await sendMessage(sessionId, userMessage);
      if (res.success) {
        setMessages((prev) => [...prev, { role: 'assistant', message: res.message }]);
        
        if (res.completed) {
          setCompleted(true);
          setOutcome(res.outcome);
        }
      } else {
        alert(res.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Initializing session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-heading font-semibold text-slate-800 flex items-center gap-2">
              Admission Interview
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-normal border border-blue-100">
                Live
              </span>
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Session ID: <span className="font-mono">{sessionId?.slice(0, 8)}</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={clsx(
                  "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center border shrink-0 shadow-sm",
                  isUser 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-indigo-600 border-indigo-100"
                )}>
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>
                
                <div className={clsx(
                  "max-w-[80%] p-5 rounded-2xl shadow-sm leading-relaxed",
                  isUser
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white text-slate-700 border border-slate-200 rounded-tl-sm"
                )}>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}
          
          {sending && (
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-indigo-600 border border-indigo-100 shrink-0 shadow-sm">
                  <Bot size={18} />
                </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Outcome / Input Area */}
      <div className="bg-white border-t border-slate-200 p-6">
        <div className="max-w-3xl mx-auto">
          {completed ? (
            <div className={clsx(
              "p-6 rounded-2xl flex items-center justify-between border shadow-sm animate-in zoom-in duration-300",
              outcome === 'Meets Criteria' 
                ? "bg-green-50 border-green-100" 
                : "bg-red-50 border-red-100"
            )}>
              <div className="flex items-center gap-4">
                <div className={clsx(
                  "p-3 rounded-full",
                  outcome === 'Meets Criteria' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {outcome === 'Meets Criteria' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div>
                  <h3 className={clsx(
                    "font-bold text-lg",
                    outcome === 'Meets Criteria' ? "text-green-800" : "text-red-800"
                  )}>
                    Interview Complete
                  </h3>
                  <p className={clsx(
                    "text-sm",
                    outcome === 'Meets Criteria' ? "text-green-700" : "text-red-700"
                  )}>
                    Outcome: {outcome}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSend} className="relative flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                  disabled={sending}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="p-3.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-colors disabled:bg-slate-200 disabled:cursor-not-allowed shadow-sm active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}