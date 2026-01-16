
import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, ProjectData } from './types';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import TermsScreen from './components/TermsScreen';
import ProjectSetup from './components/ProjectSetup';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LOGIN);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const handleLogin = () => setCurrentStep(AppStep.TERMS);
  const handleAcceptTerms = () => setCurrentStep(AppStep.PROJECT_SETUP);
  const handleProjectSubmit = (data: ProjectData) => {
    setProjectData(data);
    setCurrentStep(AppStep.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentStep) {
      case AppStep.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case AppStep.TERMS:
        return <TermsScreen onAccept={handleAcceptTerms} />;
      case AppStep.PROJECT_SETUP:
        return <ProjectSetup onSubmit={handleProjectSubmit} />;
      case AppStep.DASHBOARD:
        return projectData ? <Dashboard project={projectData} /> : <ProjectSetup onSubmit={handleProjectSubmit} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {currentStep === AppStep.DASHBOARD && <Sidebar />}
      <main className={`flex-1 ${currentStep === AppStep.DASHBOARD ? 'ml-0 md:ml-0' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
