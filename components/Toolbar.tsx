import React, { useState } from 'react';
import { THEMES } from '../constants';
import { Theme, AIAction } from '../types';
import { Wand2, Type, FileText, Smile, Sparkles, MoreHorizontal, LayoutTemplate } from 'lucide-react';
import { Button } from './Button';

interface ToolbarProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onAIAction: (action: AIAction) => void;
  isProcessing: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  currentTheme, 
  onThemeChange, 
  onAIAction,
  isProcessing 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-3 md:px-6 shadow-sm z-20 sticky top-0 shrink-0">
      <div className="flex items-center flex-1 min-w-0 mr-2">
        <div className="flex items-center mr-3 md:mr-6 shrink-0">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800 hidden md:block ml-2">
            排版助手
          </span>
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

        {/* Theme Selector - Scrollable on mobile */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 px-1 flex-1 mask-linear-fade">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                currentTheme.id === theme.id 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span 
                className="w-3 h-3 rounded-full border border-white/20" 
                style={{ backgroundColor: theme.previewColor }}
              />
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {/* Main CTA: Smart Format */}
        <Button 
          variant="primary" 
          icon={<Sparkles className="w-4 h-4" />}
          onClick={() => onAIAction('smart_format')}
          isLoading={isProcessing}
          className="bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 border-none shadow-md text-xs md:text-sm px-3 md:px-4"
        >
          <span className="hidden sm:inline">一键智能排版</span>
          <span className="sm:hidden">智能排版</span>
        </Button>

        {/* More Tools Dropdown */}
        <div className="relative">
          <Button 
            variant="ghost" 
            onClick={() => setShowMenu(!showMenu)}
            disabled={isProcessing}
            className="px-2"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
              <div className="p-1 space-y-0.5">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  微调工具
                </div>
                <button 
                  onClick={() => { onAIAction('polish'); setShowMenu(false); }}
                  className="w-full flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Wand2 className="w-4 h-4 mr-3 text-purple-500" />
                  智能润色
                </button>
                <button 
                  onClick={() => { onAIAction('title'); setShowMenu(false); }}
                  className="w-full flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Type className="w-4 h-4 mr-3 text-blue-500" />
                  生成标题
                </button>
                <button 
                  onClick={() => { onAIAction('summarize'); setShowMenu(false); }}
                  className="w-full flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 mr-3 text-orange-500" />
                  生成摘要
                </button>
                <button 
                  onClick={() => { onAIAction('emoji'); setShowMenu(false); }}
                  className="w-full flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Smile className="w-4 h-4 mr-3 text-yellow-500" />
                  添加表情
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowMenu(false)} 
        />
      )}
    </div>
  );
};