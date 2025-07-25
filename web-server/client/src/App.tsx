import React, { useState } from 'react';
import HomePage from './components/HomePage';
import WorkspacePage from './components/WorkspacePage';

function App() {
  const [isWorkspaceActive, setIsWorkspaceActive] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<Array<{name: string, content: string}>>([]);

  const handlePromptSubmit = (promptText: string) => {
    setPrompt(promptText);
    setIsWorkspaceActive(true);
  };

  const handleSetGeneratedFiles = (files: Array<{name: string, content: string}>) => {
    setGeneratedFiles(files);
  };

  return (
    <div className="App min-h-screen">
      {!isWorkspaceActive ? (
        <HomePage onPromptSubmit={handlePromptSubmit} />
      ) : (
        <WorkspacePage 
          prompt={prompt} 
          onBack={() => setIsWorkspaceActive(false)}
          onSetGeneratedFiles={handleSetGeneratedFiles}
          generatedFiles={generatedFiles}
        />
      )}
    </div>
  );
}

export default App;