import { useState } from 'react';

export default function PreviewPanel() {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="w-96 bg-charcoal border-l border-gray-800 flex flex-col">
      <div className="h-12 border-b border-gray-800 flex items-center px-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeTab === 'preview'
                ? 'bg-arceus-orange text-white'
                : 'text-gray-400 hover:text-white-accent'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeTab === 'console'
                ? 'bg-arceus-orange text-white'
                : 'text-gray-400 hover:text-white-accent'
            }`}
          >
            Console
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'preview' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-jet-black rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="text-sm text-gray-500">No preview available</div>
              <div className="text-xs text-gray-600">
                Start a conversation to see your project preview
              </div>
            </div>
          </div>
        ) : (
          <div className="font-mono text-xs space-y-1">
            <div className="text-gray-500">Console output will appear here...</div>
            <div className="text-gray-600">Ready for build logs</div>
          </div>
        )}
      </div>
    </div>
  );
}
