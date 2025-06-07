import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Zap, Trash2, Menu, RefreshCw, Info, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSessionId } from '../redux/auth/authSlice';

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
        <div key={`search-${pIndex}`} className="flex items-center py-2 text-purple-300 text-sm">
          <div className="mr-2 h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
          <span>{paragraph.replace('[Researching... ', 'Researching: ')}</span>
        </div>
      );
    }
    
    if (paragraph.includes('[LLM Synthesis]')) {
      return (
        <div key={`synthesis-${pIndex}`} className="flex items-center py-2 my-2 text-blue-300 text-sm border-t border-b border-blue-800/30">
          <div className="mr-2 h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
          <span>Synthesizing information and generating comprehensive response...</span>
        </div>
      );
    }
    
    // Unordered list items
    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
      return (
        <div key={`li-${pIndex}`} className="flex mb-1 pl-2">
          <span className="mr-2 text-purple-400">•</span>
          <span>{formatInlineFormatting(paragraph.substring(2))}</span>
        </div>
      );
    }
    
    // Numbered list items
    const numberedListMatch = paragraph.match(/^(\d+)\.\s(.+)$/);
    if (numberedListMatch) {
      return (
        <div key={`nli-${pIndex}`} className="flex mb-1 pl-2">
          <span className="mr-2 text-purple-400 min-w-[20px]">{numberedListMatch[1]}.</span>
          <span>{formatInlineFormatting(numberedListMatch[2])}</span>
        </div>
      );
    }
    
    // Information/notice blocks
    if (paragraph.startsWith('> ')) {
      return (
        <div key={`quote-${pIndex}`} className="border-l-4 border-purple-500 pl-3 py-1 my-2 bg-purple-500/10 rounded-r">
          {formatInlineFormatting(paragraph.substring(2))}
        </div>
      );
    }
    
    // Search result messages
    if (paragraph.includes('Starting search for:') || paragraph.includes('Search completed') || 
        paragraph.includes('Using cached search') || paragraph.includes('Pausing briefly')) {
      return (
        <div key={`status-${pIndex}`} className="text-xs text-gray-400 italic py-1">
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
 * More sophisticated than the original implementation
 */
const formatInlineFormatting = (text) => {
  if (!text) return '';
  
  // First, handle code blocks with backticks
  const codeBlocks = text.split(/(`[^`]+`)/);
  return codeBlocks.map((block, index) => {
    if (block.startsWith('`') && block.endsWith('`')) {
      // This is a code block
      return <code key={`code-${index}`} className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono text-sm">{block.slice(1, -1)}</code>;
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
 * Enhanced with proper streaming support aligned with backend implementation
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
  const sessionId = useSelector((state) => state.auth.sessionId); // Get session ID from Redux
  const token = useSelector((state) => state.auth.token); // Get token from Redux
  const isRehydrated = useSelector((state) => state._persist.rehydrated);
  const dispatch = useDispatch(); // Get dispatch to update session ID
  const [showSidebar, setShowSidebar] = useState(false);
  const [initialProjectProcessed, setInitialProjectProcessed] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inputHeight, setInputHeight] = useState(60);
  const [isSearching, setIsSearching] = useState(false); // Track search phase specifically
  const [modelType, setModelType] = useState('gemini-2.0-flash'); // Default model type
  
  // References
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageContainerRef = useRef(null);
  const isInitialLoad = useRef(true);
  
  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  const project_description = location.state?.project_description || null;

  // Define custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.5);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.7);
      }
      .text-input {
        min-height: 60px;
        resize: none;
      }
      .text-input::-webkit-scrollbar {
        width: 6px;
      }
      .text-input::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      .text-input::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.5);
        border-radius: 10px;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Process initial project description if available from router state
  useEffect(() => {
    // Ensure Redux state is rehydrated before attempting to use sessionId
    if (!isRehydrated) return;

    // This ensures we only process the initial project on first mount
    if (project_description && !initialProjectProcessed && isInitialLoad.current) {
      isInitialLoad.current = false;
      
      // Add the project description as a user message
      setMessages(prev => [
        ...prev, 
        { 
          role: 'user', 
          content: project_description,
          id: `user-${Date.now()}`
        }
      ]);
      
      // Process the project
      handleStreamingRequest(project_description, true);
      setInitialProjectProcessed(true);
    }
  }, [project_description, initialProjectProcessed]);

  // Dynamically adjust textarea height
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
      setInputHeight(Math.min(inputRef.current.scrollHeight, 150));
    }
  };

  /**
   * Main streaming request handler - improved to handle the backend's true streaming response
   * Properly separates search results and LLM synthesis phases
   * Updated to handle session ID from server response headers
   */
  const handleStreamingRequest = async (content, isInitialProject = false) => {
    if (isProcessing) return; // Prevent multiple concurrent requests
    
    setIsProcessing(true);
    setIsSearching(true);
    
    // Create endpoint URL based on the backend implementation
    const endpoint = new URL('http://localhost:10000/process/stream');
    
    // Prepare payload based on whether this is initial or follow-up
    const payload = {
      project_description: isInitialProject ? content : null,
      follow_up_question: !isInitialProject ? content : null,
      session_id: sessionId,
      model_type: modelType
    };
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Extract session ID from response headers
      const responseSessionId = response.headers.get('X-Session-ID');
      if (responseSessionId && (!sessionId || sessionId !== responseSessionId)) {
        dispatch(setSessionId(responseSessionId));
      }

      // Create streaming reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Create a temporary message for streaming content
      const messageId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '',
        id: messageId
      }]);
      
      let accumulatedContent = '';
      let isSynthesisPhase = false;
      
      // Process the stream until done
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Check if chunk contains a session ID header (can happen in first chunk)
        if (chunk.startsWith('X-Session-ID:')) {
          const headerLines = chunk.split('\n');
          const sessionIdLine = headerLines[0];
          const newSessionId = sessionIdLine.replace('X-Session-ID:', '').trim();
          
          if (newSessionId && (!sessionId || sessionId !== newSessionId)) {
            dispatch(setSessionId(newSessionId));
          }
          
          // Continue with the rest of the chunk (if any)
          if (headerLines.length > 1) {
            const contentChunk = headerLines.slice(1).join('\n');
            
            // Process the content chunk normally
            if (contentChunk.includes('[LLM Synthesis]')) {
              accumulatedContent = '[LLM Synthesis] Generating comprehensive project guide...\n\n';
              isSynthesisPhase = true;
              setIsSearching(false);
            } else if (isSynthesisPhase) {
              accumulatedContent += contentChunk;
            } else {
              accumulatedContent += contentChunk;
            }
          }
        } else {
          // Regular chunk processing
          if (chunk.includes('[LLM Synthesis]')) {
            accumulatedContent = '[LLM Synthesis] Generating comprehensive project guide...\n\n';
            isSynthesisPhase = true;
            setIsSearching(false);
          } else if (isSynthesisPhase) {
            accumulatedContent += chunk;
          } else {
            accumulatedContent += chunk;
          }
        }
        
        // Update the message with new content
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
      
    } catch (error) {
      console.error("Error streaming response:", error);
      
      // Add an error message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I encountered an error while processing your request. Please check your connection and try again.",
        id: `error-${Date.now()}`
      }]);
    } finally {
      setIsProcessing(false);
      setIsSearching(false);
    }
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
    dispatch(setSessionId(null)); // Clear session ID in Redux
    setIsProcessing(false);
    setInputValue('');
    inputRef.current?.focus();
    setInitialProjectProcessed(false); // Reset this flag for new chat
  };

  // Handle reload of last response
  const handleReload = async () => {
    setRefreshing(true);
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hello! I\'m your Artist Project Assistant. I can help you research and plan creative projects. Describe your project idea, and I\'ll provide guidance, resources, and step-by-step assistance!',
        id: 'welcome-msg'
      }
    ]);
    dispatch(setSessionId(null)); // Clear session ID in Redux
    setInputValue('');
    setIsProcessing(false);
    setInitialProjectProcessed(false); // Reset this flag for new chat
    inputRef.current?.focus();
    setRefreshing(false);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow line breaks with Shift+Enter
      setInputValue(prev => prev + '\n');
    }
  };

  // Input value change handler with height adjustment
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  // Handle model type change
  const handleModelChange = (e) => {
    setModelType(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 bg-black border-r border-white/10 w-64 p-4 transition-transform duration-300 ease-in-out h-full`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="text-purple-400 mr-2" />
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ArtfulWay</h2>
          </div>
          <button 
            onClick={() => setShowSidebar(false)}
            className="md:hidden p-1 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>
        
        <button 
          onClick={handleNewChat}
          className="flex items-center space-x-2 w-full px-3 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors mb-4"
        >
          <Zap size={18} className="text-purple-400" />
          <span>New Project</span>
        </button>
        
        {/* Model Selection */}
       {/* <div className="mb-4">
          <label htmlFor="model-select" className="block text-sm text-gray-400 mb-1">Model:</label>
          <select
            id="model-select"
            value={modelType}
            onChange={handleModelChange}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            disabled={isProcessing}
          >
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
            <option value="gpt4">GPT-4</option>
          </select>
        </div> */}
        
        <div className="border-t border-white/10 pt-4 mt-2">
          <h3 className="text-sm text-gray-400 font-medium mb-2">About This Tool</h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            The Artist Project Assistant helps you research and plan creative projects.
            It uses AI to provide personalized guidance, resources, and step-by-step assistance.
          </p>
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
          >
            <Info size={12} className="mr-1" />
            Learn more
          </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden pt-20 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        {/* Mobile Menu Button */}
        <div className="md:hidden absolute top-4 left-4 z-20">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-md bg-white/5 text-white"
          >
            <Menu size={20} />
          </button>
        </div>
        
        {/* Session ID Indicator */}
        {sessionId && (
          <div className="absolute top-4 right-4 z-20">
            <div className="px-3 py-1 bg-purple-600/20 border border-purple-600/40 rounded-full text-xs text-purple-300 flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-purple-400"></div>
              Session: {sessionId.split('-').slice(-1)[0]}
            </div>
          </div>
        )}
        
        {/* Messages Container */}
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 pt-12 md:pt-6 pb-4 custom-scrollbar"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div 
                key={message.id || index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-[90%] p-4 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/20' 
                      : 'bg-white/5 backdrop-blur-sm border border-white/10'
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
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-md p-4 relative z-10">
          <div className="max-w-3xl mx-auto relative">
            {/* Status indicator - Repositioned outside of input area */}
            {isProcessing && (
              <div className="absolute top-[-30px] left-0 text-xs text-purple-300 flex items-center bg-black/50 px-3 py-1 rounded-t-lg shadow-md">
                <div className="mr-2 h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                {isSearching ? "Researching information..." : "Generating response..."}
              </div>
            )}
          
            <textarea
              ref={inputRef}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-input custom-scrollbar"
              placeholder={isProcessing ? "Assistant is working on your request..." : "Describe your art project or ask a follow-up question..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              style={{ height: `${inputHeight}px` }}
            />
            <button
              className="absolute right-3 bottom-3 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50 transition-opacity hover:shadow-md hover:shadow-purple-500/30"
              onClick={handleSubmit}
              disabled={isProcessing || !inputValue.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="max-w-3xl mx-auto mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              {`Model: ${modelType.charAt(0).toUpperCase() + modelType.slice(1)}`}
            </div>
            <div className="flex space-x-3">
              {messages.length > 1 && (
                <button 
                  onClick={handleReload}
                  disabled={isProcessing}
                  className="text-xs flex items-center space-x-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isProcessing ? "animate-spin" : ""} />
                  <span>Regenerate</span>
                </button>
              )}
              <button 
                onClick={handleNewChat}
                className="text-xs flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
              >
                <Trash2 size={14} />
                <span>New project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] -z-10 pointer-events-none" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      </div>
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">About Artist Project Assistant</h3>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <p>
                The Artist Project Assistant helps creative professionals and hobbyists plan and execute art projects with AI-powered guidance.
              </p>
              <p>
                <strong>Key Features:</strong>
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
              className="mt-6 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}