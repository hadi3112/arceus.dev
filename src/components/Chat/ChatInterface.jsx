import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import MessageBubble from './MessageBubble';

export default function ChatInterface() {
  const { user } = useAuth();
  const { currentSession, selectedModel, setCurrentSession } = useApp();
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

  // TODO: Replace with MongoDB implementation
  // - Fetch messages from MongoDB chat_messages collection
  // - Use MongoDB query: db.chat_messages.find({ session_id: currentSession.id }).sort({ created_at: 1 })
  // - Store messages in state
  const fetchMessages = async () => {
    // Mock implementation - replace with MongoDB
    // const response = await fetch(`/api/chat-messages?sessionId=${currentSession.id}`);
    // const data = await response.json();
    // setMessages(data || []);
    
    // For now, load from localStorage
    try {
      const storedMessages = localStorage.getItem(`arceus_messages_${currentSession.id}`);
      if (storedMessages) {
        const msgs = JSON.parse(storedMessages);
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
    }
  };

  // TODO: Replace with MongoDB implementation
  // - Save user message to MongoDB chat_messages collection
  // - Use MongoDB insert: db.chat_messages.insertOne({ session_id, role: 'user', content, created_at: new Date() })
  // - Call AI API (OpenRouter) to get response
  // - Save AI response to MongoDB chat_messages collection
  // - Update chat_sessions.updated_at in MongoDB
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || !currentSession) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      session_id: currentSession.id,
      role: 'user',
      content: inputValue,
      created_at: new Date().toISOString(),
    };

    setInputValue('');
    setIsLoading(true);

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Save to localStorage
    try {
      localStorage.setItem(`arceus_messages_${currentSession.id}`, JSON.stringify(updatedMessages));
    } catch (err) {
      console.error('Error saving messages:', err);
    }

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: `msg_${Date.now() + 1}`,
        session_id: currentSession.id,
        role: 'assistant',
        content: `This is a simulated response from ${selectedModel}. In a production environment, this would call the OpenRouter API to generate a real response based on your prompt.`,
        model_used: selectedModel,
        created_at: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      
      // Save to localStorage
      try {
        localStorage.setItem(`arceus_messages_${currentSession.id}`, JSON.stringify(finalMessages));
        
        // Update session updated_at in localStorage
        const storedSessions = localStorage.getItem(`arceus_chatSessions_${user.id}`);
        if (storedSessions) {
          const sessions = JSON.parse(storedSessions);
          const updatedSessions = sessions.map(s => 
            s.id === currentSession.id 
              ? { ...s, updated_at: new Date().toISOString() }
              : s
          );
          localStorage.setItem(`arceus_chatSessions_${user.id}`, JSON.stringify(updatedSessions));
          
          // Update current session in context
          const updatedSession = updatedSessions.find(s => s.id === currentSession.id);
          if (updatedSession) {
            setCurrentSession(updatedSession);
          }
        }
      } catch (err) {
        console.error('Error saving AI message:', err);
      }
      
      setIsLoading(false);
    }, 1000); // Simulate 1 second delay for AI response
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
