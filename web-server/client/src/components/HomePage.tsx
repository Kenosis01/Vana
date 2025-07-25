import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HomePageProps {
  onPromptSubmit: (prompt: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onPromptSubmit(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* Main Headline */}
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest-text-primary mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Build something Wild 🌿
      </motion.h1>

      {/* Sub-headline */}
      <motion.p 
        className="text-lg md:text-xl text-forest-text-secondary mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Create apps and websites by chatting with AI
      </motion.p>

      {/* Prompt Box */}
      <motion.div 
        className="w-full max-w-3xl bg-forest-input rounded-2xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <textarea
          className="w-full bg-transparent border-none outline-none text-forest-text-primary placeholder-forest-text-placeholder resize-none min-h-[100px]"
          placeholder="Describe the project you want to grow..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {/* Controls */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            {/* Attachment Button */}
            <button 
              className="rounded-full w-8 h-8 border border-forest-text-secondary flex items-center justify-center text-forest-text-secondary hover:bg-forest-inputHover transition-colors"
            >
              <span>+</span>
            </button>
            
            {/* Public/Private Toggle */}
            <button 
              className="bg-forest-inputHover rounded-full px-3 py-1 text-sm text-forest-text-secondary flex items-center space-x-1 hover:bg-opacity-80 transition-colors"
              onClick={() => setIsPublic(!isPublic)}
            >
              <span>{isPublic ? '🌐' : '🔒'}</span>
              <span>{isPublic ? 'Public' : 'Private'}</span>
            </button>
          </div>
          
          {/* Submit Button */}
          <button 
            className="rounded-full w-10 h-10 bg-forest-button flex items-center justify-center text-forest-text-primary hover:bg-opacity-80 transition-colors"
            onClick={handleSubmit}
            disabled={!prompt.trim()}
          >
            <span className="text-xl">↑</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;