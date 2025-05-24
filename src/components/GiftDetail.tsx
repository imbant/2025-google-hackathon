import React, { useEffect, useState } from "react";
import { Card, Button, Layout, Spin, Image } from "antd";
import { GoogleGenAI, Modality } from "@google/genai";
import type { PresentRecommend } from "./MyForm";
import BrowseMore from "./BrowseMore";
import { getApiKey } from "../utils/getApiKey";

const GiftDetail: React.FC = () => {
  const [gift, setGift] = useState<PresentRecommend | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    // 从 window.history.state 读取礼物详情和 summary
    const state =
     window.history.state && window.history.state.usr;
    if (state && state.gift) {
      setGift(state.gift);
      setSummary(state.summary || "");
      // 生成礼物图片
      generateGiftImage(state.gift);
    }
  }, []);

  const generateGiftImage = async (giftData: PresentRecommend) => {
    setImageLoading(true);
    try {
      const ai = new GoogleGenAI({
        apiKey: getApiKey(),
      });

      // 构造专业的图片生成 prompt
      const contents = `请创建一个精美的产品展示图片，展示以下礼物：${giftData.presentName}。
      
图片要求：
- 高质量的产品渲染效果，具有专业的商业摄影风格
- 简洁优雅的背景，突出产品本身
- 柔和的光影效果，营造温馨的礼物氛围
- 颜色搭配要协调，体现礼物的特质：${giftData.tags?.join('、') || '精美'}
- 整体风格要现代且有质感
- 如果是实物产品，请展示其最佳角度和细节
- 添加一些装饰元素（如包装盒、丝带等）来增强礼物的感觉

特别说明：这是一个${giftData.presentReason}的礼物推荐，请确保图片风格与推荐理由相符。`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      // 处理响应，提取图片数据
      if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            // 转换为 data URL 用于浏览器显示
            const dataUrl = `data:image/png;base64,${imageData}`;
            setGeneratedImage(dataUrl);
            break;
          }
        }
      }
    } catch (error) {
      console.error("图片生成失败:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (!gift) {
    return <div style={{ textAlign: 'center', marginTop: 80 }}>未找到礼物详情</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Card style={{ maxWidth: 600, margin: "40px auto", borderRadius: 18 }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: '#CA555D', marginBottom: 8 }}>{gift.presentName}</h2>
        <div style={{ fontSize: 16, color: '#888', marginBottom: 24 }}>{summary}</div>
        
        {/* 礼物预览图片区域 */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#CA555D', marginBottom: 12 }}>礼物预览</div>
          {imageLoading ? (
            <div style={{ 
              background: '#f5f5f5', 
              borderRadius: 12, 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Spin size="large" tip="AI正在为您生成礼物预览图..." />
            </div>
          ) : generatedImage ? (
            <Image
              src={generatedImage}
              alt={`${gift.presentName}预览图`}
              style={{ 
                maxWidth: '100%', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}
              preview={{
                mask: '点击预览大图'
              }}
            />
          ) : (
            <div style={{ 
              background: '#f5f5f5', 
              borderRadius: 12, 
              height: 200, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#999'
            }}>
              图片生成失败，请刷新重试
            </div>
          )}
        </div>

        <div style={{ background: '#FFF9E3', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: '#CA555D', marginBottom: 12 }}>推荐理由</div>
          <div style={{ color: '#444', marginBottom: 18 }}>{gift.presentReason}</div>
          {gift.presentSuggestion && (
            <>
              <div style={{ fontWeight: 600, color: '#CA555D', marginBottom: 12 }}>送礼建议</div>
              <div style={{ color: '#444', marginBottom: 18 }}>{gift.presentSuggestion}</div>
            </>
          )}
          <div style={{ fontWeight: 600, color: '#CA555D', marginBottom: 12 }}>标签</div>
          <div style={{ color: '#888', marginBottom: 18 }}>{gift.tags && gift.tags.length > 0 ? gift.tags.join(' / ') : '无'}</div>
          <div style={{ fontWeight: 600, color: '#CA555D', marginBottom: 12 }}>价格区间</div>
          <div style={{ color: '#888' }}>{typeof gift.minPrice === 'number' && typeof gift.maxPrice === 'number' ? `${gift.minPrice}元 - ${gift.maxPrice}元` : '未知'}</div>
        </div>
        <Button type="primary" onClick={goBack}>返回全部结果</Button>
      </Card>

      {/* 随便逛逛组件 */}
      <BrowseMore />
    </Layout>
  );
};

export default GiftDetail;
