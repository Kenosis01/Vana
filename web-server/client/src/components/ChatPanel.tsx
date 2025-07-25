import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import io, { Socket } from 'socket.io-client';

interface ChatPanelProps {
  prompt: string;
  onSetGeneratedFiles: (files: Array<{name: string, content: string}>) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ prompt, onSetGeneratedFiles }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('generating', (data) => {
      setIsGenerating(true);
      if (data.progress) {
        setProgress(data.progress);
      }
    });

    socketRef.current.on('result', (data) => {
      setIsGenerating(false);
      setProgress(0);
      
      if (data.success && data.files) {
        onSetGeneratedFiles(data.files);
        
        // Add AI response message
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: `I've generated your project based on your prompt. Check out the code in the right panel!`,
          sender: 'ai',
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onSetGeneratedFiles]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial prompt as first message
  useEffect(() => {
    if (prompt && messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: prompt,
        sender: 'user',
        timestamp: Date.now()
      };
      
      setMessages([initialMessage]);
      
      // Send prompt to server
      if (socketRef.current) {
        socketRef.current.emit('prompt', { prompt });
      }
    }
  }, [prompt, messages.length]);

  const handleSendMessage = () => {
    if (newMessage.trim() && !isGenerating) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Send message to server
      if (socketRef.current) {
        socketRef.current.emit('prompt', { prompt: newMessage });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-forest-input">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`max-w-[80%] rounded-3xl p-3 ${
                message.sender === 'user' 
                  ? 'bg-forest-button text-forest-text-primary ml-auto' 
                  : 'bg-forest-inputHover text-forest-text-primary'
              }`}
            >
              {message.text}
            </div>
          </motion.div>
        ))}
        
        {isGenerating && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-forest-inputHover text-forest-text-primary rounded-3xl p-3">
              <div className="flex items-center space-x-2">
                <div className="sapling w-6 h-6"></div>
                <div>Generating your project... {progress}%</div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-forest-button p-4">
        <div className="flex items-end">
          <textarea
            className="flex-1 bg-forest-inputHover text-forest-text-primary rounded-3xl p-3 resize-none outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            rows={1}
          />
          <button
            className="ml-2 bg-forest-button text-forest-text-primary rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isGenerating}
          >
            <span className="text-xl">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;