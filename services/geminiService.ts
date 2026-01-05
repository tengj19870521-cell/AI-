
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeImage = async (base64Image: string, lang: 'zh' | 'en'): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error(lang === 'zh' ? "请先配置 API Key" : "Please configure API Key first");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

  const prompt = `你是一个数字图像专家实验室。请深度分析此图并将其归类为以下三类之一：
    - AI_GENERATED: AI 生成（如 Midjourney, DALL-E, Stable Diffusion）
    - DIGITAL_RENDER: 3D 渲染/CG（如 Blender, Unreal Engine, Octane）
    - AUTHENTIC_PHOTO: 真实摄影（手机或相机实拍）

    要求：
    1. 【摘要】：必须用通俗、活泼的中文写一段分析摘要（50字左右）。
    2. 【提示词】：如果判定为 AI，请务必根据画面推测其可能的英文咒语 (Prompt)。
    3. 【概率分布】：必须返回三个维度的可能性百分比 (0-100 整数)：AI 几率、渲染几率、照片几率。
    4. 【数值】：所有百分比数值必须为整数。
    5. 【结论】：verdict 必须是对应的英文枚举值。

    JSON Schema 必须严格遵守。`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{ inlineData: { data, mimeType } }, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            probabilities: {
              type: Type.OBJECT,
              properties: {
                ai: { type: Type.INTEGER },
                render: { type: Type.INTEGER },
                photo: { type: Type.INTEGER }
              },
              required: ["ai", "render", "photo"]
            },
            summary: { type: Type.STRING },
            suggestedModel: { type: Type.STRING },
            suggestedPrompt: { type: Type.STRING },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  status: { type: Type.STRING }
                },
                required: ["name", "value", "status"]
              }
            },
            artifacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["label", "description"]
              }
            }
          },
          required: ["verdict", "probabilities", "summary", "artifacts", "metrics"]
        }
      }
    });

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error(error);
    throw new Error(lang === 'zh' ? "实验室能量波动，请重试..." : "Laboratory energy flux, please retry...");
  }
};
