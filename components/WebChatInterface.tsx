'use client';

import { useState, useEffect, useRef } from 'react';

type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: { type: string; url: string; name: string }[];
};

export function WebChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your farming assistant for Niigata. How can I help you with strategic farming planning?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() && !isAttaching) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      attachments: isAttaching 
        ? [{ type: 'image', url: '/soil-analysis.jpg', name: 'Soil Analysis Report.jpg' }]
        : undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAttaching(false);
    setIsLoading(true);
    
    try {
      // Call the local API proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(0, -1).slice(-10).map(m => ({ role: m.sender === 'ai' ? 'assistant' : m.sender, content: m.content })) // Send last 10 messages for context, excluding current user message
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, I couldn\'t generate a response. Please try again.',
        sender: 'ai',
        timestamp: new Date(data.timestamp || Date.now()),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't process your message. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file
      setIsAttaching(true);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <>
      <div className="bg-primary-50 p-4 border-b border-primary-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl mr-3">
            🤖
          </div>
          <div>
            <h2 className="font-medium">Farming Strategy Assistant</h2>
            <p className="text-sm text-gray-600">Powered by GPT-4 with agricultural expertise</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2">
                  {message.attachments.map((attachment, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded p-2 border border-gray-200 text-gray-700 text-sm flex items-center mb-2"
                    >
                      <span className="mr-2">📎</span>
                      <span>{attachment.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              <div className="text-xs mt-2 opacity-70 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center ml-2 mt-1">
                👤
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">
              🤖
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleAttachClick}
            className={`p-2 rounded-full ${
              isAttaching ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            📎
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
          
          {isAttaching && (
            <div className="ml-2 bg-primary-50 text-primary-700 text-sm px-2 py-1 rounded">
              ファイルを添付しました
            </div>
          )}
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="農業に関する質問を入力してください..."
            className="flex-1 ml-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading && !isAttaching && !inputMessage.trim()}
            className={`ml-2 p-3 rounded-lg ${
              isLoading && !isAttaching && !inputMessage.trim()
                ? 'bg-gray-200 text-gray-400'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            <span>送信</span>
          </button>
        </div>
      </form>
    </>
  );
}
