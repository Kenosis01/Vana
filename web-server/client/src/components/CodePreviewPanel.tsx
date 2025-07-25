import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CodePreviewPanelProps {
  generatedFiles: Array<{name: string, content: string}>;
}

const CodePreviewPanel: React.FC<CodePreviewPanelProps> = ({ generatedFiles }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<string | null>(
    generatedFiles.length > 0 ? generatedFiles[0].name : null
  );

  // Get the content of the selected file
  const selectedFileContent = generatedFiles.find(file => file.name === selectedFile)?.content || '';

  // Function to determine if the file is HTML (for preview)
  const isHtmlFile = selectedFile?.endsWith('.html') || selectedFile?.endsWith('.htm');

  // Function to get syntax highlighting class based on file extension
  const getLanguageClass = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
      case 'htm':
        return 'language-html';
      case 'css':
        return 'language-css';
      case 'js':
        return 'language-javascript';
      case 'ts':
      case 'tsx':
        return 'language-typescript';
      case 'json':
        return 'language-json';
      default:
        return 'language-plaintext';
    }
  };

  return (
    <div className="flex flex-col h-full bg-forest-codePane">
      {/* Tabs */}
      <div className="flex border-b border-forest-button">
        <button
          className={`px-4 py-2 ${
            activeTab === 'code'
              ? 'text-forest-text-primary border-b-2 border-forest-accent'
              : 'text-forest-text-secondary'
          }`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'preview'
              ? 'text-forest-text-primary border-b-2 border-forest-accent'
              : 'text-forest-text-secondary'
          }`}
          onClick={() => setActiveTab('preview')}
          disabled={!isHtmlFile}
        >
          Preview
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' ? (
          <div className="flex h-full">
            {/* File Explorer */}
            <div className="w-48 border-r border-forest-button overflow-y-auto">
              <ul className="py-2">
                {generatedFiles.map((file) => (
                  <li key={file.name}>
                    <button
                      className={`w-full text-left px-4 py-2 ${
                        selectedFile === file.name
                          ? 'bg-forest-button text-forest-text-primary'
                          : 'text-forest-text-secondary hover:bg-forest-inputHover'
                      }`}
                      onClick={() => setSelectedFile(file.name)}
                    >
                      {file.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-auto p-4">
              {selectedFile ? (
                <pre className={`${getLanguageClass(selectedFile)} text-forest-text-primary`}>
                  <code>{selectedFileContent}</code>
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-forest-text-secondary">
                  No file selected
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full">
            {isHtmlFile ? (
              <iframe
                title="Preview"
                className="w-full h-full border-none"
                srcDoc={selectedFileContent}
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-forest-text-secondary">
                Select an HTML file to preview
              </div>
            )}
          </div>
        )}
      </div>

      {generatedFiles.length === 0 && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sapling-container">
            <div className="sapling"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CodePreviewPanel;