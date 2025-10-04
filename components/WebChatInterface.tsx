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
      content: 'こんにちは！新潟の農業AIアシスタントです。戦略的な農業計画についてどのようにお手伝いできますか？',
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
      // In a real app, this would call your backend API
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     message: userMessage.content,
      //     history: messages.map(m => ({ role: m.sender, content: m.content }))
      //   }),
      // });
      // const data = await response.json();
      
      // Mock API response delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample responses based on user input
      let aiResponse = "";
      
      if (userMessage.content.toLowerCase().includes('rice') || (userMessage.attachments && userMessage.content === '')) {
        aiResponse = `Based on the soil analysis and current climate patterns in Niigata, I recommend the following strategy for your rice cultivation:

1. **Variety Selection**: Koshihikari remains optimal for your soil pH (5.8-6.2), but consider allocating 15% of your fields to Hitomebore as a diversification strategy.

2. **Planting Schedule**: Begin transplanting in the northern fields by May 25th, followed by southern fields by June 2nd to optimize the forecasted rainfall patterns.

3. **Water Management**: Implement intermittent irrigation (3 days on, 2 days off) during the vegetative stage to reduce water usage by approximately 20% while maintaining yield.

4. **Nutrient Management**: Your soil shows slight potassium deficiency. Apply 60kg/ha of potassium sulfate before flooding.

Would you like me to create a detailed planting calendar for you with these recommendations?`;
      } else if (userMessage.content.toLowerCase().includes('profit') || userMessage.content.toLowerCase().includes('market')) {
        aiResponse = `Based on current market trends and your farm's production capacity, here's my strategic analysis:

1. **Market Outlook**: Premium rice varieties from Niigata are projected to maintain a 5-7% price premium through 2025-2026 due to increased domestic demand for high-quality rice.

2. **Profit Optimization**: 
   - Direct-to-consumer sales through local co-ops could increase your margins by 12-15%
   - Consider allocating 0.5 hectares to specialty rice varieties (Koshihikari Premium) which command a 20% higher market price
   - Value-added products like rice flour could diversify revenue streams

3. **Cost Reduction Opportunities**:
   - Implementing the smart irrigation system we discussed could reduce water costs by 18%
   - Bulk purchasing of fertilizers with neighboring farms could save approximately ¥45,000 annually

Would you like me to prepare a detailed profit projection based on these strategies?`;
      } else if (userMessage.content.toLowerCase().includes('weather') || userMessage.content.toLowerCase().includes('climate')) {
        aiResponse = `Here's my climate-informed strategic advice for your Niigata farm:

1. **Seasonal Forecast Analysis**: This year's climate models predict:
   - Earlier than usual summer temperatures by approximately 8-10 days
   - A 15% increase in heavy rainfall events during July-August
   - Extended dry periods in late August

2. **Recommended Adaptations**:
   - Adjust planting schedules forward by 7-10 days
   - Enhance field drainage systems before June 15th
   - Implement water conservation measures for late summer
   - Consider drought-tolerant rice varieties for 20% of your acreage

3. **Long-term Climate Resilience**:
   - Your south-facing slopes will experience increased heat stress - consider shade cloth systems
   - Invest in improved water storage capacity of at least 15% over the next two seasons

I can help you develop a detailed climate adaptation plan tailored to your specific field locations if you'd like.`;
      } else {
        aiResponse = `Thank you for your question about strategic farming in Niigata. To provide you with the most relevant guidance, I'd like to understand more about your specific situation:

1. What crops are you currently growing or planning to grow?
2. What aspects of farm planning are you most interested in optimizing? (e.g., yield, sustainability, profit margins, labor efficiency)
3. How large is your farming operation?
4. Do you have any specific challenges you're currently facing?

With this information, I can provide more tailored strategic recommendations for your farm in Niigata. I can also analyze soil reports, satellite imagery, or historical yield data if you'd like to share those.`;
      }
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
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
