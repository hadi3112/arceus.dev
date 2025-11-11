import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const MODEL_OPTIONS = [
  { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Reasoning' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', description: 'Code Generation' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Planning' },
  { id: 'mistral-devstral', name: 'Mistral Devstral Small', description: 'Lightweight' },
];

export default function TopBar() {
  const { user, signOut, userProfile } = useAuth();
  const { selectedModel, setSelectedModel } = useApp();
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleModelSelect = (modelName) => {
    setSelectedModel(modelName);
    setShowModelDropdown(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <div className="h-16 bg-charcoal border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">
          <span className="text-arceus-orange">A</span>
          <span className="text-white-accent">rceus</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-jet-black border border-gray-700 rounded-lg hover:border-arceus-orange transition-colors"
          >
            <span className="text-sm text-white-accent">{selectedModel}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showModelDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-charcoal border border-gray-700 rounded-lg shadow-xl z-50">
              {MODEL_OPTIONS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.name)}
                  className="w-full px-4 py-3 text-left hover:bg-jet-black transition-colors border-b border-gray-800 last:border-b-0"
                >
                  <div className="text-sm font-medium text-white-accent">{model.name}</div>
                  <div className="text-xs text-gray-400">{model.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-full bg-arceus-orange flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-arceus-orange hover:ring-offset-2 hover:ring-offset-jet-black transition-all"
          >
            {userProfile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-charcoal border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-800">
                <div className="text-sm font-medium text-white-accent">
                  {userProfile?.display_name || 'User'}
                </div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-white-accent hover:bg-jet-black transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
