import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Zap, Trash2, Menu, RefreshCw, Info, X, User, Bell } from 'lucide-react';

/**
 * Text formatter with enhanced markdown support and streaming-specific behavior
 * - Handles research progress indicators
 * - Formats markdown elements consistently
 * - Provides visual distinction for system messages
 */
const formatMessageText = (text) => {
  if (!text) return '';
  
  // Process the text paragraph by paragraph
  const paragraphs = text.split('\n');
  
  return paragraphs.map((paragraph, pIndex) => {
    // Skip empty lines but preserve spacing
    if (!paragraph.trim()) {
      return <div key={`p-${pIndex}`} className="h-4"></div>;
    }
    
    // Headings
    if (paragraph.startsWith('# ')) {
      return <h2 key={`h-${pIndex}`} className="text-xl font-bold mt-4 mb-2">{paragraph.substring(2)}</h2>;
    }
    
    if (paragraph.startsWith('## ')) {
      return <h3 key={`h-${pIndex}`} className="text-lg font-bold mt-3 mb-2">{paragraph.substring(3)}</h3>;
    }
    
    if (paragraph.startsWith('### ')) {
      return <h4 key={`h-${pIndex}`} className="text-md font-bold mt-2 mb-1">{paragraph.substring(4)}</h4>;
    }
    
    // Status indicators for search and synthesis
    if (paragraph.includes('[Researching...')) {
      return (
        <div key={`search-${pIndex}`} className="flex items-center py-2 text-blue-600 text-sm">
          <div className="mr-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span>{paragraph.replace('[Researching... ', 'Researching: ')}</span>
        </div>
      );
    }
    
    if (paragraph.includes('[LLM Synthesis]')) {
      return (
        <div key={`synthesis-${pIndex}`} className="flex items-center py-2 my-2 text-blue-600 text-sm border-t border-b border-blue-100">
          <div className="mr-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span>Synthesizing information and generating comprehensive response...</span>
        </div>
      );
    }
    
    // Unordered list items
    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
      return (
        <div key={`li-${pIndex}`} className="flex mb-1 pl-2">
          <span className="mr-2 text-blue-600">•</span>
          <span>{formatInlineFormatting(paragraph.substring(2))}</span>
        </div>
      );
    }
    
    // Numbered list items
    const numberedListMatch = paragraph.match(/^(\d+)\.\s(.+)$/);
    if (numberedListMatch) {
      return (
        <div key={`nli-${pIndex}`} className="flex mb-1 pl-2">
          <span className="mr-2 text-blue-600 min-w-[20px]">{numberedListMatch[1]}.</span>
          <span>{formatInlineFormatting(numberedListMatch[2])}</span>
        </div>
      );
    }
    
    // Information/notice blocks
    if (paragraph.startsWith('> ')) {
      return (
        <div key={`quote-${pIndex}`} className="border-l-4 border-blue-500 pl-3 py-1 my-2 bg-blue-50 rounded-r">
          {formatInlineFormatting(paragraph.substring(2))}
        </div>
      );
    }
    
    // Search result messages
    if (paragraph.includes('Starting search for:') || paragraph.includes('Search completed') || 
        paragraph.includes('Using cached search') || paragraph.includes('Pausing briefly')) {
      return (
        <div key={`status-${pIndex}`} className="text-xs text-gray-500 italic py-1">
          {paragraph}
        </div>
      );
    }
    
    // Regular paragraphs
    return <p key={`p-${pIndex}`} className="mb-2">{formatInlineFormatting(paragraph)}</p>;
  });
};

/**
 * Formats inline text styling (bold, italic, code)
 */
const formatInlineFormatting = (text) => {
  if (!text) return '';
  
  // First, handle code blocks with backticks
  const codeBlocks = text.split(/(`[^`]+`)/);
  return codeBlocks.map((block, index) => {
    if (block.startsWith('`') && block.endsWith('`')) {
      // This is a code block
      return <code key={`code-${index}`} className="bg-gray-100 px-1 py-0.5 rounded text-blue-700 font-mono text-sm">{block.slice(1, -1)}</code>;
    }
    
    // Then handle bold and italic
    const parts = block.split(/(\*\*|\*)/);
    let isBold = false;
    let isItalic = false;
    
    return parts.map((part, pIndex) => {
      if (part === '**') {
        isBold = !isBold;
        return null;
      }
      
      if (part === '*') {
        isItalic = !isItalic;
        return null;
      }
      
      if (isBold && isItalic) {
        return <strong key={`bi-${pIndex}`} className="font-bold italic">{part}</strong>;
      } else if (isBold) {
        return <strong key={`b-${pIndex}`} className="font-bold">{part}</strong>;
      } else if (isItalic) {
        return <em key={`i-${pIndex}`} className="italic">{part}</em>;
      }
      
      return <span key={`t-${pIndex}`}>{part}</span>;
    });
  });
};

/**
 * Main Component: Artist Project Assistant Chat Interface
 * Updated with modern clean design matching the dashboard screenshot
 */
export default function ArtistAssistantChat() {
  // State management
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your Artist Project Assistant. I can help you research and plan creative projects. Describe your project idea, and I\'ll provide guidance, resources, and step-by-step assistance!',
      id: 'welcome-msg'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState('session-123'); // Mock session ID
  const [showSidebar, setShowSidebar] = useState(false);
  const [initialProjectProcessed, setInitialProjectProcessed] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inputHeight, setInputHeight] = useState(60);
  const [isSearching, setIsSearching] = useState(false);
  const [modelType, setModelType] = useState('gemini-2.0-flash');
  
  // References
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: isSearching ? 'auto' : 'smooth',
        block: 'end'
      });
    }
  }, [messages, isSearching]);

  // Focus input field on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Dynamically adjust textarea height
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
      setInputHeight(Math.min(inputRef.current.scrollHeight, 150));
    }
  };

  // Mock streaming request handler
  const handleStreamingRequest = async (content, isInitialProject = false) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setIsSearching(true);
    
    // Create a temporary message for streaming content
    const messageId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '',
      id: messageId
    }]);
    
    // Mock streaming response
    const responses = [
      '[Researching... art techniques and materials]',
      '[Researching... completed]\n\n',
      '[LLM Synthesis] Generating comprehensive project guide...\n\n',
      'Based on your project description, here\'s a comprehensive guide:\n\n',
      '## Project Overview\n',
      'This is an exciting creative project that combines traditional techniques with modern approaches.\n\n',
      '## Materials Needed\n',
      '- Canvas or paper\n',
      '- Acrylic or oil paints\n',
      '- Various brushes\n',
      '- Palette knife\n\n',
      '## Step-by-Step Process\n',
      '1. **Preparation**: Set up your workspace with proper lighting\n',
      '2. **Sketching**: Create initial composition sketches\n',
      '3. **Color Planning**: Choose your color palette\n',
      '4. **Execution**: Begin with background elements\n\n',
      '## Tips for Success\n',
      '- Take breaks to assess your progress\n',
      '- Don\'t be afraid to make adjustments\n',
      '- Document your process for future reference\n\n',
      'Would you like me to elaborate on any specific aspect of this project?'
    ];
    
    let accumulatedContent = '';
    
    for (let i = 0; i < responses.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      if (responses[i].includes('[LLM Synthesis]')) {
        setIsSearching(false);
      }
      
      accumulatedContent += responses[i];
      
      setMessages(prev => {
        const newMessages = [...prev];
        const messageIndex = newMessages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex !== -1) {
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            content: accumulatedContent
          };
        }
        
        return newMessages;
      });
    }
    
    setIsProcessing(false);
    setIsSearching(false);
  };

  // Handle user message submission
  const handleSubmit = () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message to chat
    const userMessage = { 
      role: 'user', 
      content: inputValue,
      id: `user-${Date.now()}`
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Process the message
    handleStreamingRequest(inputValue, false);
    
    // Clear input
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = '60px';
      setInputHeight(60);
    }
  };
  
  // Handle new chat creation
  const handleNewChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hello! I\'m your Artist Project Assistant. I can help you research and plan creative projects. Describe your project idea, and I\'ll provide guidance, resources, and step-by-step assistance!',
        id: 'welcome-msg'
      }
    ]);
    setIsProcessing(false);
    setInputValue('');
    inputRef.current?.focus();
    setInitialProjectProcessed(false);
  };

  // Handle reload of last response
  const handleReload = async () => {
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hello! I\'m your Artist Project Assistant. I can help you research and plan creative projects. Describe your project idea, and I\'ll provide guidance, resources, and step-by-step assistance!',
        id: 'welcome-msg'
      }
    ]);
    setInputValue('');
    setIsProcessing(false);
    setInitialProjectProcessed(false);
    inputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter' && e.shiftKey) {
      setInputValue(prev => prev + '\n');
    }
  };

  // Input value change handler with height adjustment
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900">ArtfulWay</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-700 font-medium">ACTIVE ARTIST</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">Welcome back, Ankesh!</div>
                <div className="text-sm text-gray-500">Your creative journey continues to flourish</div>
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <User size={16} />
                <span className="text-sm">Edit Profile</span>
              </button>
              <Bell size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 bg-white border-r border-gray-200 w-80 transition-transform duration-300 ease-in-out h-full pt-20 lg:pt-20`}>
        <div className="p-6">
          <button 
            onClick={handleNewChat}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all mb-6"
          >
            <Zap size={18} />
            <span className="font-medium">New Project</span>
          </button>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">📊</span>
                </div>
                <span className="text-xs text-gray-500">0%</span>
              </div>
              <div className="text-2xl font-bold">$0</div>
              <div className="text-sm text-gray-600">Monthly Earnings</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📈</span>
                </div>
                <span className="text-xs text-blue-600">New milestone!</span>
              </div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-gray-600">Completed Projects</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📋</span>
                </div>
                <span className="text-xs text-gray-500">Stay focused</span>
              </div>
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm text-gray-600">Projects in Progress</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⚡</span>
                </div>
                <span className="text-xs text-yellow-600">Excellent!</span>
              </div>
              <div className="text-2xl font-bold">33%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
          
          {/* About Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm text-gray-600 font-medium mb-2">About This Tool</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              The Artist Project Assistant helps you research and plan creative projects.
              It uses AI to provide personalized guidance, resources, and step-by-step assistance.
            </p>
            <button
              onClick={() => setShowInfoModal(true)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Info size={12} className="mr-1" />
              Learn more
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden pt-20 bg-white">
        {/* Session ID Indicator */}
        {sessionId && (
          <div className="absolute top-24 right-6 z-20">
            <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              Session: {sessionId.split('-').slice(-1)[0]}
            </div>
          </div>
        )}
        
        {/* Messages Container */}
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-6 pb-4"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div 
                key={message.id || index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm' 
                      : 'bg-gray-50 border border-gray-100 text-gray-900'
                  } relative`}
                >
                  {message.role === 'assistant' ? 
                    formatMessageText(message.content) : 
                    message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                    ))
                  }
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-6 relative z-10">
          <div className="max-w-4xl mx-auto relative">
            {/* Status indicator */}
            {isProcessing && (
              <div className="absolute top-[-35px] left-0 text-xs text-blue-600 flex items-center bg-blue-50 px-3 py-1 rounded-t-lg border border-blue-200 border-b-0">
                <div className="mr-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                {isSearching ? "Researching information..." : "Generating response..."}
              </div>
            )}
          
            <div className="relative">
              <textarea
                ref={inputRef}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={isProcessing ? "Assistant is working on your request..." : "Describe your art project or ask a follow-up question..."}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                style={{ height: `${inputHeight}px` }}
              />
              <button
                className="absolute right-3 bottom-3 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-50 transition-all hover:shadow-md disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isProcessing || !inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-3 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Model: {modelType.charAt(0).toUpperCase() + modelType.slice(1)}
            </div>
            <div className="flex space-x-4">
              {messages.length > 1 && (
                <button 
                  onClick={handleReload}
                  disabled={isProcessing}
                  className="text-xs flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isProcessing ? "animate-spin" : ""} />
                  <span>Regenerate</span>
                </button>
              )}
              <button 
                onClick={handleNewChat}
                className="text-xs flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Trash2 size={14} />
                <span>New project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 m-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">About Artist Project Assistant</h3>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                The Artist Project Assistant helps creative professionals and hobbyists plan and execute art projects with AI-powered guidance.
              </p>
              <p>
                <strong className="text-gray-900">Key Features:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Real-time research on art techniques, materials, and resources</li>
                <li>Step-by-step project planning assistance</li>
                <li>Troubleshooting common challenges</li>
                <li>Reference gathering and organization</li>
                <li>Personalized advice for your specific art medium</li>
              </ul>
              <p>
                Simply describe your project idea, and the assistant will provide comprehensive guidance tailored to your needs.
              </p>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}