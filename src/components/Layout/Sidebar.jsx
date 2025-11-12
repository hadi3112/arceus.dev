import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar, currentSession, setCurrentSession } = useApp();
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with MongoDB implementation
  // - Fetch chat sessions from MongoDB chat_sessions collection
  // - Use MongoDB query: db.chat_sessions.find({ user_id: user.id }).sort({ updated_at: -1 }).limit(20)
  // - Store sessions in state
  useEffect(() => {
    if (user) {
      fetchChatSessions();
    }
  }, [user]);

  // Refresh sessions when currentSession changes (e.g., after sending a message)
  useEffect(() => {
    if (user && currentSession) {
      fetchChatSessions();
    }
  }, [currentSession?.updated_at]);

  const fetchChatSessions = async () => {
    setLoading(true);
    
    // Mock implementation - replace with MongoDB
    // const response = await fetch(`/api/chat-sessions?userId=${user.id}`);
    // const data = await response.json();
    // setChatSessions(data || []);
    
    // For now, load from localStorage
    try {
      const storedSessions = localStorage.getItem(`arceus_chatSessions_${user.id}`);
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions);
        setChatSessions(sessions);
      } else {
        setChatSessions([]);
      }
    } catch (err) {
      console.error('Error loading chat sessions:', err);
      setChatSessions([]);
    }
    
    setLoading(false);
  };

  // TODO: Replace with MongoDB implementation
  // - Create new chat session in MongoDB chat_sessions collection
  // - Use MongoDB insert: db.chat_sessions.insertOne({ user_id: user.id, title: 'New Chat', created_at: new Date(), updated_at: new Date() })
  // - Return created session and add to state
  const createNewSession = async () => {
    // Mock implementation - replace with MongoDB
    // const response = await fetch('/api/chat-sessions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ user_id: user.id, title: 'New Chat' })
    // });
    // const data = await response.json();
    
    // For now, create a mock session
    const newSession = {
      id: `session_${Date.now()}`,
      user_id: user.id,
      title: 'New Chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedSessions = [newSession, ...chatSessions];
    setChatSessions(updatedSessions);
    setCurrentSession(newSession);
    
    // Save to localStorage
    try {
      localStorage.setItem(`arceus_chatSessions_${user.id}`, JSON.stringify(updatedSessions));
    } catch (err) {
      console.error('Error saving chat sessions:', err);
    }
  };

  if (sidebarCollapsed) {
    return (
      <div className="w-16 bg-charcoal border-r border-gray-800 flex flex-col items-center py-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-jet-black rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-charcoal border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white-accent">Chats</h2>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-jet-black rounded transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          <button
            onClick={createNewSession}
            className="w-full px-4 py-3 bg-arceus-orange text-white rounded-lg hover:bg-opacity-90 transition-all font-medium"
          >
            + New Chat
          </button>

          <button className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white-accent hover:bg-jet-black rounded-lg transition-colors">
            Saved Builds
          </button>

          <button className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white-accent hover:bg-jet-black rounded-lg transition-colors">
            Settings
          </button>
        </div>

        <div className="px-4 py-2 border-t border-gray-800 mt-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent</h3>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : chatSessions.length === 0 ? (
            <div className="text-sm text-gray-500">No chats yet</div>
          ) : (
            <div className="space-y-1">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setCurrentSession(session)}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-all group ${
                    currentSession?.id === session.id
                      ? 'bg-jet-black text-white-accent border border-arceus-orange'
                      : 'text-gray-300 hover:text-white-accent hover:bg-jet-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{session.title}</span>
                    <span className="text-xs text-gray-600 group-hover:text-gray-500">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
