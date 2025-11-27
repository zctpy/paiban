import React, { useRef } from 'react';
import { 
  Bold, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  List, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Minus,
  Eraser
} from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    onChange(e.currentTarget.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Helper to insert markdown syntax
  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const isBlockElement = prefix.trim().startsWith('#') || prefix.trim().startsWith('>') || prefix.trim().startsWith('-');
    
    let replacement = '';
    let newCursorPos = 0;

    if (isBlockElement) {
        replacement = prefix + selectedText + suffix;
        newCursorPos = start + prefix.length;
    } else {
        replacement = prefix + selectedText + suffix;
        newCursorPos = start + prefix.length + selectedText.length + suffix.length; 
        if (selectedText.length === 0) {
            newCursorPos = start + prefix.length; 
        }
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      if (selectedText.length > 0 && !isBlockElement) {
         textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      } else {
         textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const clearContent = () => {
    if (window.confirm('确定要清空所有内容吗？')) {
      onChange('');
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar: Scrollable on mobile */}
      <div className="bg-slate-50 border-b border-slate-200 px-2 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap shrink-0">
        <ToolbarButton 
            onClick={() => insertFormat('**', '**')} 
            icon={<Bold className="w-4 h-4" />} 
            tooltip="加粗" 
        />
        <div className="w-px h-5 bg-slate-300 mx-1 shrink-0" />
        <ToolbarButton 
            onClick={() => insertFormat('# ')} 
            icon={<Heading1 className="w-4 h-4" />} 
            tooltip="一级标题" 
        />
        <ToolbarButton 
            onClick={() => insertFormat('## ')} 
            icon={<Heading2 className="w-4 h-4" />} 
            tooltip="二级标题" 
        />
        <ToolbarButton 
            onClick={() => insertFormat('### ')} 
            icon={<Heading3 className="w-4 h-4" />} 
            tooltip="三级标题" 
        />
        <div className="w-px h-5 bg-slate-300 mx-1 shrink-0" />
        <ToolbarButton 
            onClick={() => insertFormat('> ')} 
            icon={<Quote className="w-4 h-4" />} 
            tooltip="引用" 
        />
        <ToolbarButton 
            onClick={() => insertFormat('- ')} 
            icon={<List className="w-4 h-4" />} 
            tooltip="无序列表" 
        />
        <ToolbarButton 
            onClick={() => insertFormat('\n---\n')} 
            icon={<Minus className="w-4 h-4" />} 
            tooltip="分割线" 
        />
        <div className="w-px h-5 bg-slate-300 mx-1 shrink-0" />
        <ToolbarButton 
            onClick={() => insertFormat('[', '](url)')} 
            icon={<LinkIcon className="w-4 h-4" />} 
            tooltip="链接" 
        />
        <ToolbarButton 
            onClick={() => insertFormat('![', '](url)')} 
            icon={<ImageIcon className="w-4 h-4" />} 
            tooltip="图片" 
        />
        <div className="flex-1 min-w-[20px]" />
        <ToolbarButton 
            onClick={clearContent} 
            icon={<Eraser className="w-4 h-4 text-red-500" />} 
            tooltip="清空" 
            className="hover:bg-red-50 hover:text-red-600"
        />
      </div>

      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-6 resize-none focus:outline-none text-base leading-relaxed text-slate-900 placeholder-slate-400 font-mono bg-white"
        style={{
          fontFamily: '"Menlo", "Monaco", "Courier New", monospace, -apple-system-font'
        }}
        value={value}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="💡 快捷模式：直接将你的纯文本文章粘贴到这里，然后点击右上角的「✨ 一键智能排版」。AI 将自动为你添加标题、加粗重点并美化结构。"
        spellCheck={false}
      />
      
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex justify-between text-xs text-slate-400 shrink-0">
        <span>{value.length} 字</span>
        <span>Markdown 编辑模式</span>
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    tooltip: string;
    className?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, icon, tooltip, className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        title={tooltip}
        className={`p-2 rounded hover:bg-slate-200 text-slate-600 transition-colors shrink-0 ${className}`}
    >
        {icon}
    </button>
);