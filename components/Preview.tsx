import React, { useRef, useState } from 'react';
import { Theme } from '../types';
import { parseMarkdown, parseInlineStyles } from '../utils/markdown';
import { Button } from './Button';
import { Copy, Check } from 'lucide-react';

interface PreviewProps {
  content: string;
  theme: Theme;
}

export const Preview: React.FC<PreviewProps> = ({ content, theme }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const nodes = parseMarkdown(content);
  const { styles } = theme;

  const handleCopy = async () => {
    if (!contentRef.current) return;

    try {
      const htmlContent = contentRef.current.innerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([contentRef.current.innerText], { type: 'text/plain' });
      
      const data = [new ClipboardItem({ 
        'text/html': blob,
        'text/plain': textBlob 
      })];
      
      await navigator.clipboard.write(data);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand('copy');
      selection?.removeAllRanges();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 md:bg-slate-100 relative">
        <div className="absolute top-4 right-4 z-20 md:z-10">
            <Button 
                onClick={handleCopy} 
                variant="primary"
                className={`shadow-lg transition-all ${copied ? 'bg-green-600 hover:bg-green-700' : ''} text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2`}
                icon={copied ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
            >
                {copied ? '已复制' : '复制'}
            </Button>
        </div>

      <div className="flex-1 overflow-y-auto p-0 md:p-8 flex justify-center h-full">
        {/* Mobile Frame Simulation: Only active on MD screens and up. On mobile, it's full width. */}
        <div className="
            w-full h-full 
            md:w-[375px] md:h-auto md:min-h-[600px] md:max-h-[800px]
            bg-white 
            md:shadow-2xl md:rounded-[30px] md:border-[8px] md:border-slate-800 
            overflow-hidden shrink-0 flex flex-col relative
        ">
          {/* Status Bar - Hidden on mobile */}
          <div className="h-7 bg-slate-800 w-full flex items-center justify-between px-6 hidden md:flex shrink-0">
            <div className="w-10 h-3 bg-slate-700 rounded-full"></div>
            <div className="flex space-x-1">
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>
          
          {/* WeChat Header - Hidden on mobile */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between hidden md:flex shrink-0">
             <span className="font-medium text-slate-800 text-sm">公众号名称</span>
             <span className="text-slate-400">•••</span>
          </div>

          {/* Content Area */}
          <div 
            ref={contentRef} 
            className="flex-1 overflow-y-auto overflow-x-hidden bg-white"
            // Ensure padding is appropriate for both modes (mobile full screen vs desktop frame)
            style={styles.container}
          >
            {/* Render Nodes */}
            {nodes.map((node, i) => {
              switch (node.type) {
                case 'h1':
                  return <h1 key={i} style={styles.h1}>{parseInlineStyles(node.content as string, styles)}</h1>;
                case 'h2':
                  return <h2 key={i} style={styles.h2}>{parseInlineStyles(node.content as string, styles)}</h2>;
                case 'h3':
                  return <h3 key={i} style={styles.h3}>{parseInlineStyles(node.content as string, styles)}</h3>;
                case 'blockquote':
                  return <blockquote key={i} style={styles.blockquote}>{parseInlineStyles(node.content as string, styles)}</blockquote>;
                case 'image':
                  return <img key={i} src={node.src} alt={node.alt} style={styles.image} />;
                case 'ul':
                  return (
                    <ul key={i} style={styles.list}>
                      {(node.items || []).map((item, idx) => (
                        <li key={idx} style={styles.listItem}>• {parseInlineStyles(item, styles)}</li>
                      ))}
                    </ul>
                  );
                case 'ol':
                    return (
                      <ol key={i} style={styles.list}>
                        {(node.items || []).map((item, idx) => (
                          <li key={idx} style={styles.listItem}>{idx + 1}. {parseInlineStyles(item, styles)}</li>
                        ))}
                      </ol>
                    );
                case 'hr':
                    return <hr key={i} style={{borderTop: '1px solid #eee', margin: '20px 0'}} />;
                default:
                  return <p key={i} style={styles.p}>{parseInlineStyles(node.content as string, styles)}</p>;
              }
            })}
            
            {/* Signature / Footer Placeholder (Hidden on preview to keep clean) */}
          </div>
        </div>
      </div>
    </div>
  );
};