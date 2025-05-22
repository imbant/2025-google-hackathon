import React, { useState } from "react";
import { Checkbox, Button, Layout, Spin } from "antd";
import { GoogleGenAI, Type } from "@google/genai";
import QuizForm from "./QuizForm";
import { questions } from "./constants";

// 礼物推荐结果类型
export interface PresentRecommend {
  presentName: string;
  presentReason: string;
}

const MyForm = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = async (answers: Record<number, string[]>, questions: any[]) => {
    setLoading(true);
    try {
      // 构造 prompt
      let prompt = '请根据以下用户信息，推荐5个合适的礼物，并简要说明推荐理由：\n';
      questions.forEach((q: any, idx: number) => {
        const userAnswer = answers[idx]?.join('，') || '未选择';
        prompt += `${q.question} ${userAnswer}\n`;
      });
      // 调用大模型
      const ai = new GoogleGenAI({ apiKey: "AIzaSyAEEAD6E5-32nCpFeF2RiPHcXef7n2p1CI" });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                presentName: { type: Type.STRING },
                presentReason: { type: Type.STRING }
              }
            }
          }
        }
      });
      // 解析并 as 类型
      let result: PresentRecommend[] = [];
      try {
        result = JSON.parse(response.text || "[]") as PresentRecommend[];
      } catch (e) {
        console.error('AI返回内容解析失败', response.text);
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
        <QuizForm
          questions={questions}
          onRecommend={handleClick}
        />
      </Spin>
    </Layout>
  );
};

export default MyForm;
