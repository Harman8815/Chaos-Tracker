import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { Send, Sparkles, XCircle, Copy, Check } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { SettingsContext } from '../../context/SettingsContext';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
}

const SendIcon = Send;
const SparkleIcon = Sparkles;
const ClearIcon = XCircle;
const CopyIcon = Copy;
const CheckIcon = Check;


const WELCOME_MESSAGE: Message = {
    id: 'initial',
    role: 'model',
    content: "Hello! I'm your personal data assistant. I can help you analyze your progress. \n\nHere are some things you can ask:\n*   `What was my biggest expense category last month?`\n*   `Summarize my journal entries from the last 3 days.`\n*   `Which monthly goal am I falling behind on?`"
};


const ChatTool: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // FIX: Add state to track AI initialization, as updating a ref doesn't trigger re-renders.
    const [aiInitialized, setAiInitialized] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    const { data, today, habits, plannerData, goals, expenses, quotes } = useContext(DataContext);
    const { scoringRules } = useContext(SettingsContext);

    useEffect(() => {
        try {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            setAiInitialized(true);
        } catch (error) {
            console.error("Failed to initialize AI Chat:", error);
            setMessages([{
                id: 'initial-error',
                role: 'model',
                content: "Sorry, I couldn't connect to the AI service. Please check your API key and refresh."
            }]);
            setAiInitialized(false);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !aiRef.current || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input
        };
        
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const modelResponseId = `model-${Date.now()}`;
        setMessages(prev => [...prev, { id: modelResponseId, role: 'model', content: '' }]);

        try {
            const recentDailyData = Object.fromEntries(Object.entries(data).slice(-15));
            const recentExpenses = expenses.slice(-30);
            const allUserData = {
                today,
                dailyEntries: recentDailyData,
                habitsConfig: habits,
                scoringRules,
                planner: plannerData,
                goals,
                expenses: recentExpenses,
                quotes: {
                    sourceCount: quotes.length,
                    totalQuotes: quotes.reduce((acc, s) => acc + s.quotes.length, 0),
                    sources: quotes.map(s => s.title)
                }
            };
            const systemInstruction = `You are a helpful and insightful AI assistant integrated into a personal tracking application. Your role is to act as a data-driven life coach. Analyze the user's data to answer their questions, provide insights, identify patterns, and offer encouragement or advice. Be friendly, concise, and helpful. Use markdown for formatting, including code blocks for lists or important points. Here is a JSON summary of the user's current data: ${JSON.stringify(allUserData, null, 2)}`;

            const historyForAPI = newMessages
                .filter(msg => msg.id !== 'initial') // Don't send the welcome message back
                .map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }]
                }));

            const result = await aiRef.current.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: historyForAPI,
                config: { systemInstruction }
            });
            
            let streamedText = '';
            for await (const chunk of result) {
                streamedText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelResponseId ? { ...msg, content: streamedText } : msg
                ));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = (error as Error).message || "An unknown error occurred.";
            setMessages(prev => prev.map(msg => 
                msg.id === modelResponseId ? { ...msg, content: `Sorry, I encountered an error: ${errorMessage}` } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedMessageId(id);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const handleClearChat = () => {
        setMessages([WELCOME_MESSAGE]);
    }
    
    const parsedContent = (content: string) => {
        return { __html: marked.parse(content, { gfm: true, breaks: true }) as string };
    };

    return (
        <div className="h-full flex flex-col text-white bg-white/[0.06] backdrop-blur-sm border border-white/5 rounded-2xl -m-4 relative">
            <button 
                onClick={handleClearChat}
                title="Clear Chat"
                className="absolute top-3 right-3 z-10 p-2 text-text-secondary hover:text-white rounded-full hover:bg-white/[0.06]/80 backdrop-blur-sm transition-colors"
            >
                <ClearIcon />
            </button>
            <div className="flex-grow overflow-y-auto p-4 space-y-6 pt-12">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-[rgba(15,10,30,0.65)]/80 backdrop-blur-sm border border-accent-primary/35 flex items-center justify-center flex-shrink-0 text-accent-primary">
                                <SparkleIcon className="w-5 h-5"/>
                            </div>
                        )}
                        <div className={`group relative max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-accent-primary text-white rounded-br-none' : 'bg-white/[0.06] backdrop-blur-md border border-[rgba(139,92,246,0.2)] rounded-bl-none'}`}>
                           <div 
                             className="prose prose-invert prose-sm max-w-none"
                             dangerouslySetInnerHTML={parsedContent(message.content || ' ')}
                            />
                           {message.role === 'model' && message.id !== 'initial' && (
                                <button 
                                    onClick={() => handleCopy(message.content, message.id)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-white/[0.06]/80 backdrop-blur-sm rounded-full text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {copiedMessageId === message.id ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
                                </button>
                           )}
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length-1]?.role === 'model' && (
                     <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-[rgba(15,10,30,0.65)]/80 backdrop-blur-sm border border-accent-primary/35 flex items-center justify-center flex-shrink-0 text-accent-primary">
                            <SparkleIcon className="w-5 h-5"/>
                        </div>
                        <div className="bg-white/[0.06] backdrop-blur-md border border-[rgba(139,92,246,0.2)] rounded-lg rounded-bl-none px-4 py-3">
                            <div className="flex items-center justify-center space-x-1">
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-[rgba(139,92,246,0.2)] bg-white/[0.06] backdrop-blur-xl">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your data..."
                        disabled={isLoading || !aiInitialized}
                        className="flex-grow w-full bg-white/[0.06] backdrop-blur-sm rounded-full px-4 py-2 border border-[rgba(139,92,246,0.25)] focus:outline-none focus:ring-2 focus:ring-accent-primary text-white placeholder:text-text-secondary"
                    />
                    <button type="submit" disabled={isLoading || !input.trim() || !aiInitialized} className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-primary text-white disabled:bg-gray-600 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_20px_rgba(139,92,246,0.7)]">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
             <style>{`
                 .prose pre {
                     background-color: var(--color-background) !important;
                     padding: 0.5rem;
                     border-radius: 0.5rem;
                     font-size: 0.8em;
                 }
                  .prose code {
                      color: var(--color-text-primary);
                      background-color: var(--color-input-bg);
                      padding: 0.1em 0.3em;
                      border-radius: 0.25rem;
                  }
                 .prose ul {
                     margin-top: 0.5em;
                     margin-bottom: 0.5em;
                 }
                 .prose p {
                     margin-top: 0.5em;
                     margin-bottom: 0.5em;
                 }
              `}</style>
        </div>
    );
};

export default ChatTool;
