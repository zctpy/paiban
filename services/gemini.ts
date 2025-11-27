import { GoogleGenAI, Type } from "@google/genai";
import { AIAction, CoverStyle } from '../types';

let genAI: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAI) {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please check your configuration.");
    }
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const processWithGemini = async (text: string, action: AIAction): Promise<string> => {
  const ai = getAI();
  const modelName = 'gemini-2.5-flash';
  
  let prompt = "";
  let systemInstruction = "你是一位专业的微信公众号排版专家。你的目标是让文章结构清晰、易读且美观。";

  switch (action) {
    case 'smart_format':
      prompt = `你是一位拥有10年经验的资深排版师。请基于“内容解构”方法论，将以下纯文本转换为结构化、模块化的 Markdown 格式，以便直接生成精美的公众号文章。

**执行逻辑（请在内心完成分析，只输出最终 Markdown）：**

1.  **内容解构 (Deconstruction)**：
    *   **识别骨架**：区分引言、核心论点（H2）、支撑材料（数据/案例）、操作步骤、结论。
    *   **识别层级**：明确主标题 (#)、章节标题 (##)、子要点 (###)。

2.  **组件映射 (Mapping)**：
    *   **标题体系**：
        *   文章最开头必须有主标题 (#)。
        *   主要逻辑段落使用二级标题 (##)。
    *   **视觉容器 (引用块 >)**：
        *   将“核心观点”、“金句”、“总结性段落”放入引用块。
        *   将“案例背景”或“补充说明”放入引用块。
    *   **列表组件 (- 或 1.)**：
        *   凡是涉及“步骤”、“清单”、“要点并列”的内容，必须转换为列表。
    *   **强调体系 (**加粗**)**：
        *   **极度克制**：全篇文章仅加粗 **2-3 个** 最核心的“颠覆性结论”或“关键数据”。
        *   严禁大面积加粗，严禁加粗整句话。如果段落中没有绝对亮点，则不加粗。
    *   **分割线 (---)**：
        *   在引言结束处、主要章节之间添加分割线，增加呼吸感。

3.  **严格约束**：
    *   **保留原意**：严禁改写句子、严禁编造内容。只做结构化处理。
    *   **纯净输出**：直接输出 Markdown 内容，不要包含“好的”、“以下是排版结果”等任何废话。
    *   **Emoji 点缀**：在二级标题 (##) 的文字开头适当添加 1 个符合语境的 Emoji，增加视觉锚点。

**待排版文本：**
${text}`;
      break;
    case 'polish':
      prompt = `请将以下文本重写，使其更加生动、流畅、专业，适合微信公众号读者的阅读习惯。修正错别字。保持 Markdown 格式（标题、列表等）不变。\n\n文本：\n${text}`;
      break;
    case 'summarize':
      prompt = `请为以下文本提供一个简短、吸引人的摘要，适合作为微信公众号的“摘要”字段。字数限制在120字以内。\n\n文本：\n${text}`;
      break;
    case 'title':
      prompt = `请为这篇文章生成 5 个吸引眼球、高点击率（但不要标题党）的标题。以无序列表形式返回。\n\n文本：\n${text}`;
      break;
    case 'emoji':
      prompt = `请在以下文本的标题和关键段落中添加相关的 Emoji 表情，使其视觉上更具吸引力。不要过度使用。保持 Markdown 格式不变。\n\n文本：\n${text}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    return response.text || "未生成任何回复。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI 处理失败，请稍后重试。");
  }
};

/**
 * Step 1: Analyze text to generate a title and an image prompt.
 */
export const analyzeArticleForCover = async (content: string, style: CoverStyle): Promise<{ title: string, imagePrompt: string }> => {
  const ai = getAI();
  const modelName = 'gemini-2.5-flash';

  const stylePrompts: Record<CoverStyle, string> = {
    business: "Minimalist, professional, geometric shapes, blue and grey tones, clean background, high quality, 4k",
    illustration: "Flat vector illustration, trendy style, vibrant colors, simple composition, behance style, 4k",
    tech: "Futuristic, cyberpunk, neon lights, dark background, circuit patterns, digital art, 4k",
    warm: "Cozy, watercolor style, soft lighting, pastel colors, healing atmosphere, nature elements, 4k",
    abstract: "Abstract art, fluid gradients, modern shapes, artistic, creative, vivid colors, 4k"
  };

  const styleDesc = stylePrompts[style];

  const prompt = `
    Analyze the following article content (truncated). 
    Your task is to generate JSON output with two fields:
    1. "title": A short, catchy title for a cover image (max 8 Chinese characters or 3 English words). It must be related to the core topic.
    2. "imagePrompt": A detailed English prompt for an AI image generator. The prompt should describe a background image that matches the sentiment of the article and the style: "${styleDesc}". The image prompt should NOT contain text, letters, or words. Focus on visual elements, lighting, and composition.

    Article Content:
    ${content.slice(0, 1000)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
            }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("无法解析 AI 响应");
  } catch (error) {
    console.error("Analyze Cover Error:", error);
    throw new Error("封面分析失败");
  }
};

/**
 * Step 2: Generate the image using the prompt.
 */
export const generateCoverImage = async (prompt: string): Promise<string> => {
    const ai = getAI();
    // Use gemini-2.5-flash-image for standard image generation
    const modelName = 'gemini-2.5-flash-image'; 

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9"
                }
            }
        });

        // Extract base64 image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("未生成图片数据");
    } catch (error) {
        console.error("Generate Image Error:", error);
        throw new Error("图片生成失败，请稍后重试。");
    }
};
