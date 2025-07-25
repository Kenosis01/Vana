import React from 'react';
import { motion } from 'framer-motion';
import ChatPanel from './ChatPanel';
import CodePreviewPanel from './CodePreviewPanel';

interface WorkspacePageProps {
  prompt: string;
  onBack: () => void;
  onSetGeneratedFiles: (files: Array<{name: string, content: string}>) => void;
  generatedFiles: Array<{name: string, content: string}>;
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ 
  prompt, 
  onBack, 
  onSetGeneratedFiles,
  generatedFiles 
}) => {
  return (
    <motion.div 
      className="flex h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Panel - Chat */}
      <motion.div 
        className="w-1/4 h-full border-r border-forest-button"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-forest-button flex items-center">
            <button 
              className="text-forest-text-secondary hover:text-forest-text-primary mr-2"
              onClick={onBack}
            >
              ← Back
            </button>
            <h2 className="text-forest-text-primary font-medium">Chat</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel 
              prompt={prompt} 
              onSetGeneratedFiles={onSetGeneratedFiles} 
            />
          </div>
        </div>
      </motion.div>
      
      {/* Right Panel - Code & Preview */}
      <motion.div 
        className="w-3/4 h-full"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CodePreviewPanel generatedFiles={generatedFiles} />
      </motion.div>
    </motion.div>
  );
};

export default WorkspacePage;