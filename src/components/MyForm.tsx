import React, { useState } from "react";
import { Checkbox, Button, Layout, Spin } from "antd";
import { GoogleGenAI, Type } from "@google/genai";
import QuizForm from "./QuizForm";
import { questions } from "./constants";

// 礼物推荐结果类型
export interface PresentRecommend {
  presentName: string;
  presentReason: string;
  presentSuggestion: string;
  presentSummary: string;
  tags: string[];
  maxPrice: number;
  minPrice: number;
}

const MyForm = () => {
  const [loading, setLoading] = useState(false);
  const handleClick = async (
    answers: Record<number, string[]>,
    questions: any[]
  ) => {
    setLoading(true);
    try {
      // 构造 prompt
      let prompt =
        "请根据以下用户信息，推荐5个合适的礼物，并简要说明推荐理由：\n";
      questions.forEach((q: any, idx: number) => {
        const userAnswer = answers[idx]?.join("，") || "未选择";
        prompt += `${q.question} ${userAnswer}\n`;
      });
      // 调用大模型
      const ai = new GoogleGenAI({
        apiKey: "AIzaSyAEEAD6E5-32nCpFeF2RiPHcXef7n2p1CI",
      });
      const response = await ai.models.generateContent({
        // model: "gemini-2.0-flash",
        model: "models/gemini-2.5-flash-preview-05-20",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "推荐的礼物列表",
            items: {
              type: Type.OBJECT,
              description: "单个推荐的礼物",
              properties: {
                presentName: {
                  type: Type.STRING,
                  description: "推荐的礼物名称",
                },
                presentReason: {
                  type: Type.STRING,
                  description: "推荐的理由",
                },
                presentSuggestion: {
                  type: Type.STRING,
                  description: "送礼的建议",
                },
                presentSummary: {
                  type: Type.STRING,
                  description: "基于presentReason和presentSuggestion的简短总结",
                },
                tags: {
                  type: Type.ARRAY,
                  description: "这个礼物有哪些常见或通用的特征，以简短的标签形式列出，注意，每个礼物之间的标签可以相同，也可以不同，你要基于用户的选择，推测他可能想要什么标签的礼物，然后给出符合这些标签的礼物",
                  maxItems: "8",
                  items: {
                    type: Type.STRING,
                    description: "单个标签的简单又有特征的名字",
                  },
                },
                maxPrice: {
                  type: Type.NUMBER,
                  description: "推荐的礼物的价格范围中的最大值，注意，要符合用户选择的预算",
                  maximum: 20000,
                },
                minPrice: {
                  type: Type.NUMBER,
                  description: "推荐的礼物的价格范围中的最小值，注意，要符合用户选择的预算",
                  minimum: 0,
                },
              },
            },
          },
        },
      });
      // 解析并 as 类型
      let result: PresentRecommend[] = [];
      try {
        result = JSON.parse(response.text || "[]") as PresentRecommend[];
      } catch (e) {
        console.error("AI返回内容解析失败", response.text);
      }
      // 跳转到结果页并传递数据
      window.history.pushState({ usr: { results: result } }, "", "/result");
      window.location.href = "/result";
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Spin spinning={loading} tip="AI推荐中，请稍候...">
        <QuizForm questions={questions} onRecommend={handleClick} />
      </Spin>
    </Layout>
  );
};

export default MyForm;
