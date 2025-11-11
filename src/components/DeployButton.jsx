import { useState } from 'react';

export default function DeployButton() {
  const [showModal, setShowModal] = useState(false);

  const deployOptions = [
    { id: 'vercel', name: 'Deploy via Vercel', icon: '▲' },
    { id: 'render', name: 'Deploy via Render', icon: '🚀' },
    { id: 'docker', name: 'Deploy via Docker', icon: '🐳' },
    { id: 'custom', name: 'Custom Deployment', icon: '⚙️' },
  ];

  const handleDeploy = (option) => {
    console.log('Deploying via:', option);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed top-20 right-6 px-6 py-3 bg-arceus-orange text-white rounded-full shadow-lg hover:shadow-arceus-orange/50 hover:scale-105 transition-all font-semibold z-40"
      >
        Deploy
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-charcoal border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white-accent">Deploy Your Project</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white-accent transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {deployOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDeploy(option.id)}
                  className="w-full px-4 py-3 bg-jet-black hover:bg-opacity-80 border border-gray-700 hover:border-arceus-orange rounded-lg text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-white-accent group-hover:text-arceus-orange transition-colors">
                      {option.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-jet-black rounded-lg border border-gray-800">
              <p className="text-xs text-gray-400">
                Deployment integrations will be connected once you configure your hosting providers.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
