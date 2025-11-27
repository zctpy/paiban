import React, { useState, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Theme, AIAction } from './types';
import { THEMES, DEFAULT_CONTENT } from './constants';
import { processWithGemini } from './services/gemini';
import { Edit3, Eye } from 'lucide-react';

const App: React.FC = () => {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT);
  const [debouncedContent, setDebouncedContent] = useState<string>(DEFAULT_CONTENT);
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [content]);

  const handleAIAction = async (action: AIAction) => {
    if (!process.env.API_KEY) {
        setNotification({ message: "未检测到 API Key，请检查配置。", type: 'error' });
        return;
    }

    setIsProcessingAI(true);
    setNotification(null);
    try {
      const result = await processWithGemini(content, action);
      
      if (action === 'title' || action === 'summarize') {
        const separator = `\n\n---\n**AI 生成的${action === 'title' ? '标题' : '摘要'}:**\n\n`;
        setContent(prev => prev + separator + result);
      } else {
        setContent(result);
        // On mobile, auto-switch to preview after formatting
        if (window.innerWidth < 768 && action === 'smart_format') {
          setActiveTab('preview');
        }
      }
      setNotification({ message: "AI 处理完成！", type: 'success' });
    } catch (error) {
      setNotification({ message: "AI 处理失败，请重试。", type: 'error' });
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans pb-safe">
      <Toolbar 
        currentTheme={currentTheme} 
        onThemeChange={setCurrentTheme}
        onAIAction={handleAIAction}
        isProcessing={isProcessingAI}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor: Active on mobile 'editor' tab, or always on desktop */}
        <div className={`
          flex flex-col bg-white h-full transition-opacity duration-200
          ${activeTab === 'editor' ? 'w-full opacity-100' : 'hidden opacity-0'} 
          md:w-1/2 md:flex md:opacity-100 md:border-r md:border-slate-200 z-10
        `}>
          <Editor value={content} onChange={setContent} />
        </div>

        {/* Preview: Active on mobile 'preview' tab, or always on desktop */}
        <div className={`
          h-full bg-slate-100 transition-opacity duration-200
          ${activeTab === 'preview' ? 'w-full opacity-100' : 'hidden opacity-0'} 
          md:w-1/2 md:block md:opacity-100
        `}>
          <Preview content={debouncedContent} theme={currentTheme} />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden bg-white border-t border-slate-200 flex justify-around items-center h-14 shrink-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:bg-slate-50 ${activeTab === 'editor' ? 'text-brand-600' : 'text-slate-400'}`}
        >
          <Edit3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">编辑</span>
        </button>
        <div className="w-px h-6 bg-slate-100"></div>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:bg-slate-50 ${activeTab === 'preview' ? 'text-brand-600' : 'text-slate-400'}`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-medium">预览</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white font-medium text-sm animate-in slide-in-from-bottom-5 z-50 whitespace-nowrap ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-brand-600'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default App;