import React, { useState } from "react";
import { Checkbox, Button, Layout } from "antd";
import { GoogleGenAI } from "@google/genai";
import QuizForm from "./QuizForm";

const MyForm = () => {
  const [checked, setChecked] = useState(false);
  const handleClick = async (answers: Record<number, string[]>, questions: any[]) => {
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
    });
    console.log('AI推荐：', response.text);
  };
  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <QuizForm
        questions={[
          {
            type: "single",
            question: "TA是您的？",
            options: [
              { label: "家人", value: "家人" },
              { label: "恋人", value: "恋人" },
              { label: "朋友", value: "朋友" },
              { label: "同事", value: "同事" },
              { label: "领导", value: "领导" }
            ]
          },
          {
            type: "single",
            question: "您想送TA礼物的原因？",
            options: [
              { label: "纪念日", value: "纪念日" },
              { label: "节日", value: "节日" },
              { label: "TA的生日", value: "TA的生日" },
              { label: "初识，拉进关系", value: "初识，拉进关系" },
              { label: "拍马屁", value: "拍马屁" },
              { label: "日常惊喜", value: "日常惊喜" }
            ]
          },
          {
            type: "single",
            question: "被送礼人的年龄？",
            options: [
              { label: "0-9岁", value: "0-9岁" },
              { label: "10岁-18岁", value: "10岁-18岁" },
              { label: "19岁-25岁", value: "19岁-25岁" },
              { label: "26岁-40岁", value: "26岁-40岁" },
              { label: "41岁-60岁", value: "41岁-60岁" },
              { label: "61岁及以上", value: "61岁及以上" }
            ]
          },
          {
            type: "single",
            question: "您的预算？",
            options: [
              { label: "0-50元", value: "0-50元" },
              { label: "51元-100元", value: "51元-100元" },
              { label: "101元-200元", value: "101元-200元" },
              { label: "201元-500元", value: "201元-500元" },
              { label: "500元-1000元", value: "500元-1000元" },
              { label: "1000元以上", value: "1000元以上" }
            ]
          },
          {
            type: "multiple",
            question: "TA符合以下哪些描述？",
            options: [
              { label: "手作达人", value: "手作达人" },
              { label: "技术控", value: "技术控" },
              { label: "音乐发烧友", value: "音乐发烧友" },
              { label: "喜欢拍拍拍", value: "喜欢拍拍拍" },
              { label: "注重养生", value: "注重养生" },
              { label: "对TA还不熟", value: "对TA还不熟" }
            ]
          }
        ]}
        onRecommend={handleClick}
      />
    </Layout>
  );
};

export default MyForm;
