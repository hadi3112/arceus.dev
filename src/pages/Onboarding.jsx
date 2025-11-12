import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = ['welcome', 'github', 'model', 'demo'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState('DeepSeek V3');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  // TODO: Replace with MongoDB implementation
  // - Update user document in MongoDB users collection
  // - Use MongoDB query: db.users.updateOne({ _id: ObjectId(user.id) }, { $set: { onboarding_completed: true } })
  // - Update userProfile in context after successful update
  const completeOnboarding = async () => {
    if (user) {
      // Mock implementation - replace with MongoDB
      // const response = await fetch(`/api/users/${user.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ onboarding_completed: true })
      // });
      // const data = await response.json();
      
      // For now, update local storage
      const storedProfile = localStorage.getItem('arceus_userProfile');
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          profile.onboarding_completed = true;
          localStorage.setItem('arceus_userProfile', JSON.stringify(profile));
        } catch (err) {
          console.error('Error updating profile:', err);
        }
      }
    }
    navigate('/');
  };

  const renderStep = () => {
    switch (STEPS[currentStep]) {
      case 'welcome':
        return (
          <div className="text-center space-y-6 max-w-2xl">
            <div className="text-6xl font-bold mb-4">
              <span className="text-arceus-orange">A</span>
              <span className="text-white-accent">rceus</span>
            </div>
            <h1 className="text-3xl font-bold text-white-accent">Welcome to Arceus</h1>
            <p className="text-lg text-gray-400">
              Your AI-powered coding assistant that helps you build software projects from idea to deployment.
            </p>
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-charcoal rounded-lg">
                <div className="w-12 h-12 bg-arceus-orange rounded-full flex items-center justify-center text-2xl">
                  💬
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white-accent">Natural Conversations</div>
                  <div className="text-sm text-gray-400">Chat with AI to build your ideas</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-charcoal rounded-lg">
                <div className="w-12 h-12 bg-arceus-orange rounded-full flex items-center justify-center text-2xl">
                  🔧
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white-accent">Live Preview</div>
                  <div className="text-sm text-gray-400">See your project come to life in real-time</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-charcoal rounded-lg">
                <div className="w-12 h-12 bg-arceus-orange rounded-full flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white-accent">Easy Deployment</div>
                  <div className="text-sm text-gray-400">Deploy to multiple platforms with one click</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'github':
        return (
          <div className="text-center space-y-6 max-w-md">
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-white-accent">Connect Your GitHub</h2>
            <p className="text-gray-400">
              Link your GitHub account to sync projects, manage repositories, and collaborate with your team.
            </p>
            <button className="w-full py-3 bg-charcoal border border-gray-700 hover:border-arceus-orange rounded-lg text-white-accent transition-all">
              Connect GitHub Account
            </button>
            <p className="text-sm text-gray-500">You can skip this step and connect later</p>
          </div>
        );

      case 'model':
        return (
          <div className="text-center space-y-6 max-w-md">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-white-accent">Choose Your AI Model</h2>
            <p className="text-gray-400">Select the AI model that best fits your workflow.</p>
            <div className="space-y-3">
              {[
                { name: 'DeepSeek R1', desc: 'Best for reasoning and problem-solving' },
                { name: 'DeepSeek V3', desc: 'Optimized for code generation' },
                { name: 'Gemini 2.5 Flash', desc: 'Fast planning and architecture' },
                { name: 'Mistral Devstral Small', desc: 'Lightweight and efficient' },
              ].map((model) => (
                <button
                  key={model.name}
                  onClick={() => setSelectedModel(model.name)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedModel === model.name
                      ? 'bg-arceus-orange bg-opacity-20 border-2 border-arceus-orange'
                      : 'bg-charcoal border border-gray-700 hover:border-arceus-orange'
                  }`}
                >
                  <div className="font-semibold text-white-accent">{model.name}</div>
                  <div className="text-sm text-gray-400">{model.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'demo':
        return (
          <div className="text-center space-y-6 max-w-md">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-white-accent">Ready to Build!</h2>
            <p className="text-gray-400">
              You're all set! Start with a demo project or create your own from scratch.
            </p>
            <div className="space-y-3">
              <button
                onClick={completeOnboarding}
                className="w-full py-3 bg-arceus-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Create Demo App
              </button>
              <button
                onClick={completeOnboarding}
                className="w-full py-3 bg-charcoal border border-gray-700 hover:border-arceus-orange text-white-accent rounded-lg transition-all"
              >
                Start from Scratch
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= currentStep ? 'w-12 bg-arceus-orange' : 'w-8 bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center min-h-[500px]">{renderStep()}</div>

        <div className="mt-8 flex justify-between max-w-2xl mx-auto">
          <button
            onClick={handleSkip}
            className="px-6 py-2 text-gray-400 hover:text-white-accent transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-2 bg-arceus-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
