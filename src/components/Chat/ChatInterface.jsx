import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import MessageBubble from './MessageBubble';

export default function ChatInterface() {
  const { user } = useAuth();
  const { currentSession, selectedModel } = useApp();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentSession) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', currentSession.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || !currentSession) return;

    const userMessage = {
      session_id: currentSession.id,
      role: 'user',
      content: inputValue,
    };

    setInputValue('');
    setIsLoading(true);

    const { data: savedUserMessage, error: userError } = await supabase
      .from('chat_messages')
      .insert(userMessage)
      .select()
      .single();

    if (userError) {
      console.error('Error saving user message:', error);
      setIsLoading(false);
      return;
    }

    setMessages([...messages, savedUserMessage]);

    const aiResponse = {
      session_id: currentSession.id,
      role: 'assistant',
      content: `This is a simulated response from ${selectedModel}. In a production environment, this would call the OpenRouter API to generate a real response based on your prompt.`,
      model_used: selectedModel,
    };

    const { data: savedAiMessage, error: aiError } = await supabase
      .from('chat_messages')
      .insert(aiResponse)
      .select()
      .single();

    if (aiError) {
      console.error('Error saving AI message:', aiError);
    } else {
      setMessages((prev) => [...prev, savedAiMessage]);
    }

    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', currentSession.id);

    setIsLoading(false);
  };

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">
            <span className="text-arceus-orange">A</span>
            <span className="text-white-accent">rceus</span>
          </div>
          <h2 className="text-2xl font-semibold text-white-accent">Welcome to Arceus</h2>
          <p className="text-gray-400 max-w-md">
            Your AI coding assistant for building software projects. Start a new chat to begin your journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 bg-arceus-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-arceus-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-arceus-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-sm">Generating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-800 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Arceus anything..."
            className="flex-1 px-4 py-3 bg-charcoal border border-gray-700 rounded-lg text-white-accent placeholder-gray-500 focus:outline-none focus:border-arceus-orange transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-arceus-orange text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
