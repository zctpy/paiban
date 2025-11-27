import React, { useState, useRef, useEffect } from 'react';
import { X, Download, RefreshCw, Type, Palette, Image as ImageIcon } from 'lucide-react';
import { CoverStyle } from '../types';
import { analyzeArticleForCover, generateCoverImage } from '../services/gemini';
import { Button } from './Button';

interface CoverGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  articleContent: string;
}

const STYLES: { id: CoverStyle; name: string; color: string }[] = [
  { id: 'business', name: '商务简约', color: '#3b82f6' },
  { id: 'illustration', name: '扁平插画', color: '#f59e0b' },
  { id: 'tech', name: '科技未来', color: '#8b5cf6' },
  { id: 'warm', name: '温暖治愈', color: '#10b981' },
  { id: 'abstract', name: '抽象几何', color: '#ec4899' },
];

export const CoverGenerator: React.FC<CoverGeneratorProps> = ({ isOpen, onClose, articleContent }) => {
  const [selectedStyle, setSelectedStyle] = useState<CoverStyle>('business');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [overlayOpacity, setOverlayOpacity] = useState(0.3);
  const [textColor, setTextColor] = useState('#ffffff');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen && !generatedImage && articleContent) {
       // Optional: Auto-generate on open could be added here, 
       // but manual trigger is better to save tokens/waiting.
    }
  }, [isOpen, articleContent, generatedImage]);

  // Draw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Image
    if (imageRef.current) {
        // Draw image covering the canvas (aspect fill)
        const img = imageRef.current;
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let renderWidth, renderHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            renderHeight = canvas.height;
            renderWidth = img.width * (canvas.height / img.height);
            offsetX = (canvas.width - renderWidth) / 2;
            offsetY = 0;
        } else {
            renderWidth = canvas.width;
            renderHeight = img.height * (canvas.width / img.width);
            offsetX = 0;
            offsetY = (canvas.height - renderHeight) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    } else {
        // Placeholder
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('点击“生成封面”开始创作', canvas.width / 2, canvas.height / 2);
    }

    // 2. Draw Overlay
    if (generatedImage) {
        ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 3. Draw Text
    if (title && generatedImage) {
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Font size adaptation
        const baseSize = 48;
        ctx.font = `bold ${baseSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        
        // Simple text wrapping or scaling could go here, for now just center
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(title, canvas.width / 2, canvas.height / 2);
    }

  }, [generatedImage, title, overlayOpacity, textColor]);

  const handleGenerate = async () => {
    if (!articleContent) {
        alert('请先在编辑器中输入文章内容');
        return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setTitle('正在分析...');

    try {
        // 1. Analyze text to get title and prompt
        const { title: suggestedTitle, imagePrompt } = await analyzeArticleForCover(articleContent, selectedStyle);
        setTitle(suggestedTitle);

        // 2. Generate Image
        const base64Data = await generateCoverImage(imagePrompt);
        
        // Load image object
        const img = new Image();
        img.src = `data:image/png;base64,${base64Data}`;
        img.onload = () => {
            imageRef.current = img;
            setGeneratedImage(base64Data);
            setIsGenerating(false);
        };
    } catch (error) {
        console.error(error);
        alert('生成失败，请重试');
        setIsGenerating(false);
        setTitle('');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `cover_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Controls */}
        <div className="w-full md:w-1/3 p-6 border-r border-slate-100 flex flex-col bg-slate-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-brand-600" />
                    封面生成器
                </h2>
                <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-6 flex-1">
                {/* Style Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">选择风格</label>
                    <div className="grid grid-cols-2 gap-2">
                        {STYLES.map(style => (
                            <button
                                key={style.id}
                                onClick={() => setSelectedStyle(style.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all border ${
                                    selectedStyle === style.id 
                                    ? 'bg-white border-brand-500 text-brand-700 shadow-sm ring-1 ring-brand-500' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: style.color }}></span>
                                {style.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <Button 
                    onClick={handleGenerate} 
                    isLoading={isGenerating}
                    className="w-full py-3 text-base shadow-brand-500/20 shadow-lg"
                >
                    {generatedImage ? '重新生成' : '开始生成'}
                </Button>

                {generatedImage && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 animate-in slide-in-from-bottom-2">
                         {/* Title Input */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center">
                                <Type className="w-3 h-3 mr-1" /> 封面标题
                            </label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>

                         {/* Color Picker */}
                         <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2 flex items-center">
                                <Palette className="w-3 h-3 mr-1" /> 文字颜色
                            </label>
                            <div className="flex space-x-2">
                                {['#ffffff', '#000000', '#fcd34d', '#ef4444', '#3b82f6'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setTextColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform ${textColor === color ? 'border-brand-500 scale-110' : 'border-slate-200'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Opacity Slider */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                遮罩浓度: {Math.round(overlayOpacity * 100)}%
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="0.8" 
                                step="0.1"
                                value={overlayOpacity}
                                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Right: Preview */}
        <div className="w-full md:w-2/3 bg-slate-900 flex flex-col relative">
            <div className="absolute top-4 right-4 hidden md:block z-10">
                 <button onClick={onClose} className="text-white/70 hover:text-white bg-black/30 rounded-full p-2 backdrop-blur-sm transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 md:p-12 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="relative shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10" style={{ fontSize: 0 }}>
                    <canvas 
                        ref={canvasRef}
                        width={900}
                        height={506} // 16:9 Aspect Ratio
                        className="max-w-full max-h-[50vh] md:max-h-[70vh] object-contain bg-white"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
                <span className="text-slate-400 text-xs md:text-sm">
                    {generatedImage ? '提示: 电脑端右键可复制图片' : '请在左侧点击生成'}
                </span>
                <Button 
                    onClick={handleDownload} 
                    disabled={!generatedImage}
                    variant="primary"
                    className="bg-white text-slate-900 hover:bg-slate-100 border-transparent disabled:bg-slate-600 disabled:text-slate-400"
                    icon={<Download className="w-4 h-4" />}
                >
                    下载封面
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
};