
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Leaf, Send, Loader2, Sparkles, User, Bot, HelpCircle } from 'lucide-react';

const FullChatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Halo! I am your Leafslip Advisor. How can I help you optimize your business today? I can analyze your inventory patterns or suggest waste reduction strategies.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are Leafslip AI, a professional business consultant for Indonesian MSMEs. You help small shop owners with stock management, reducing food waste, and interpreting sales history. Your tone is respectful, encouraging, and uses local Indonesian context where appropriate."
        }
      });

      const botText = response.text || "Mohon maaf, I couldn't process that. Can you rephrase?";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Service temporarily unavailable. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] bg-white rounded-[40px] shadow-xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#2D3E2D] p-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#D9ED92] text-[#2D3E2D] p-2.5 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Business Advisor</h2>
            <p className="text-xs text-[#D9ED92] font-medium tracking-widest uppercase opacity-70">Leafslip Intelligence</p>
          </div>
        </div>
        <HelpCircle className="text-white/40 cursor-help" size={24} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-[#D9ED92] text-[#2D3E2D]' : 'bg-[#2D3E2D] text-white'}`}>
                  {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
               </div>
               <div className={`rounded-3xl px-6 py-4 text-sm shadow-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#2D3E2D] text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[85%] items-center">
                <div className="w-10 h-10 rounded-2xl bg-[#2D3E2D] text-white flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl px-6 py-4 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2D3E2D]" />
                  <span className="text-xs text-gray-400 font-medium">Advisor is analyzing patterns...</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-gray-100">
        <div className="flex gap-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your stock, weekly trends, or waste reduction..."
            className="flex-1 bg-gray-100 rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 ring-[#D9ED92] transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-[#D9ED92] text-[#2D3E2D] px-8 rounded-2xl hover:brightness-95 disabled:opacity-50 transition-all font-bold shadow-md flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>Send</span>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
          Private MSME Consultation powered by Gemini 3.0
        </p>
      </div>
    </div>
  );
};

export default FullChatbot;
