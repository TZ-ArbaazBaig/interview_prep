import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ChevronLeft, 
  Sparkles, 
  User, 
  Bot, 
  Clock, 
  Info,
  ArrowRight
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';

const Chat = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What are the core technical skills required?",
    "What experience level is expected for this role?",
    "What will my daily responsibilities look like?",
    "Am I a good fit if I have React but not AWS?"
  ];

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/sessions/${sessionId}`);
        setSession(data.session);
        
        // Initial welcome message
        setMessages([
          { 
            role: 'assistant', 
            content: `Hello! I've analyzed the dossier for the **${data.session.job_title}** role. Ask me anything about the requirements, responsibilities, or skills mentioned in the description.`,
            timestamp: new Date()
          }
        ]);
      } catch (err) {
        console.error('Fetch session error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim() || isTyping) return;

    const userMessage = { role: 'user', content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await api.post(`/chat/${sessionId}`, { question: query });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer, 
        chunksUsed: data.chunksUsed,
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I encountered a synchronization error while retrieving the data. Please ensure the intelligence server is active.",
        isError: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!session && loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link to={`/practice/${sessionId}`} className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-silver-500 hover:text-violet-400 transition-colors mb-2">
            <ChevronLeft size={14} />
            Back to Practice
          </Link>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">
            Intelligence <span className="text-violet-500">Chat</span>
          </h1>
          <p className="text-silver-400 text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
            <Info size={12} />
            Context: {session?.job_title}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:pb-0">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-obsidian-900 border border-obsidian-800 text-[10px] font-mono font-bold uppercase tracking-wider text-silver-400 hover:border-violet-500/50 hover:text-violet-400 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 chrome-card rounded-xl overflow-hidden flex flex-col bg-obsidian-900/40 relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`mt-1 flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center border ${
                    msg.role === 'user' 
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' 
                      : 'bg-obsidian-800 border-obsidian-700 text-silver-400'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`p-5 rounded-2xl text-sm leading-relaxed font-medium shadow-xl ${
                      msg.role === 'user'
                        ? 'bg-violet-500 text-white rounded-tr-none'
                        : msg.isError 
                          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-tl-none'
                          : 'bg-obsidian-800 border border-obsidian-700 text-silver-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.chunksUsed !== undefined && (
                      <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-silver-500 uppercase tracking-widest opacity-40">
                        <Sparkles size={10} />
                        Analyzed {msg.chunksUsed} segments of the dossier
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-obsidian-800 border border-obsidian-700 p-4 rounded-2xl rounded-tl-none flex gap-2">
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-obsidian-900/60 border-t border-obsidian-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative group"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the job requirements..."
              className="w-full bg-obsidian-950 border border-obsidian-800 rounded-lg pl-6 pr-16 py-4 text-silver-100 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all shadow-inner"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-20 disabled:hover:bg-violet-500 transition-all shadow-violet-glow"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="mt-3 text-[9px] font-mono font-bold text-silver-600 uppercase tracking-widest text-center">
            Secured Context-Aware Retrieval Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
