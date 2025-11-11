import { createContext, useContext, useState } from 'react';

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('DeepSeek V3');
  const [currentProject, setCurrentProject] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    selectedModel,
    setSelectedModel,
    currentProject,
    setCurrentProject,
    currentSession,
    setCurrentSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
