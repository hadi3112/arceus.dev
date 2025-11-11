import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CodeReview() {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [comment, setComment] = useState('');

  const handleApprove = () => {
    console.log('Code review approved');
  };

  const handleRequestChanges = () => {
    console.log('Changes requested:', comment);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-arceus-orange hover:underline mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white-accent">Code Review</h1>
            <p className="text-gray-400 mt-1">Review changes and provide feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 bg-charcoal border border-gray-700 rounded-lg text-white-accent focus:outline-none focus:border-arceus-orange"
            >
              <option value="main">main</option>
              <option value="feature/new-ui">feature/new-ui</option>
              <option value="stable-v1.2">stable-v1.2</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-charcoal border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white-accent mb-4">Before</h3>
            <div className="bg-jet-black p-4 rounded font-mono text-sm text-gray-300 overflow-x-auto">
              <pre>{`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`}</pre>
            </div>
          </div>

          <div className="bg-charcoal border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white-accent mb-4">After</h3>
            <div className="bg-jet-black p-4 rounded font-mono text-sm text-gray-300 overflow-x-auto">
              <pre>{`function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price;
  }, 0);
}`}</pre>
            </div>
          </div>
        </div>

        <div className="bg-charcoal border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white-accent mb-4">Add Comment</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave your feedback or suggestions..."
            className="w-full h-32 px-4 py-3 bg-jet-black border border-gray-700 rounded-lg text-white-accent placeholder-gray-500 focus:outline-none focus:border-arceus-orange resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleApprove}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            ✓ Approve Changes
          </button>
          <button
            onClick={handleRequestChanges}
            className="px-6 py-3 bg-arceus-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Request Changes
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-charcoal border border-gray-700 text-white-accent rounded-lg hover:border-arceus-orange transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-8 p-4 bg-jet-black rounded-lg border border-gray-800">
          <p className="text-sm text-gray-500">
            🔧 This is a placeholder for the code review feature. In production, this would integrate with your
            GitHub repository to show real diffs and allow inline comments.
          </p>
        </div>
      </div>
    </div>
  );
}
