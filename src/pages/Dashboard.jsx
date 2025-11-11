import TopBar from '../components/Layout/TopBar';
import Sidebar from '../components/Layout/Sidebar';
import PreviewPanel from '../components/Layout/PreviewPanel';
import ChatInterface from '../components/Chat/ChatInterface';
import DeployButton from '../components/DeployButton';

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ChatInterface />
        <PreviewPanel />
      </div>
      <DeployButton />
    </div>
  );
}
