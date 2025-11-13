import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { marked } from 'marked';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
}

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const ChatTool: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const chatInstance = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a helpful AI assistant integrated into a personal tracking application. Be friendly, concise, and helpful. Use markdown for formatting when appropriate."
                }
            });
            setChat(chatInstance);

            setMessages([{
                id: 'initial',
                role: 'model',
                content: "Hello! I'm your AI assistant. How can I help you today?"
            }]);
        } catch (error) {
            console.error("Failed to initialize AI Chat:", error);
            setMessages([{
                id: 'initial-error',
                role: 'model',
                content: "Sorry, I couldn't connect to the AI service. Please check your API key and refresh."
            }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Add a placeholder for the model's response
        const modelResponseId = `model-${Date.now()}`;
        setMessages(prev => [...prev, { id: modelResponseId, role: 'model', content: '' }]);

        try {
            const result = await chat.sendMessageStream({ message: input });
            let streamedText = '';
            for await (const chunk of result) {
                streamedText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelResponseId ? { ...msg, content: streamedText } : msg
                ));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => prev.map(msg => 
                msg.id === modelResponseId ? { ...msg, content: "Sorry, I encountered an error. Please try again." } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };
    
    const parsedContent = (content: string) => {
        return { __html: marked.parse(content, { gfm: true, breaks: true }) as string };
    };

    return (
        <div className="h-full flex flex-col text-text-primary">
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'model' && <div className="w-8 h-8 rounded-full bg-accent-primary flex-shrink-0"></div>}
                        <div className={`prose prose-invert prose-sm max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-accent-primary text-white rounded-br-none' : 'bg-sidebar-bg rounded-bl-none'}`}
                           dangerouslySetInnerHTML={parsedContent(message.content)}
                        >
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length-1]?.role === 'model' && (
                     <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-accent-primary flex-shrink-0"></div>
                        <div className="bg-sidebar-bg rounded-lg rounded-bl-none px-4 py-3">
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
            <div className="p-4 border-t border-border">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        disabled={isLoading || !chat}
                        className="flex-grow w-full bg-input-bg rounded-full px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                    <button type="submit" disabled={isLoading || !input.trim() || !chat} className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-primary text-white disabled:bg-gray-600 transition-colors">
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
                    color: #f5f5f5;
                }
             `}</style>
        </div>
    );
};

export default ChatTool;