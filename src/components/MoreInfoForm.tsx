import React, { useState } from "react";
import { Card, Input, Button, Layout, message } from "antd";
import { GoogleGenAI, Type } from "@google/genai";
import type { PresentRecommend } from "./MyForm";

const { TextArea } = Input;

// 公共AI请求函数
async function getPresentRecommend(prompt: string): Promise<PresentRecommend[]> {
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
  let result: PresentRecommend[] = [];
  try {
    result = JSON.parse(response.text || "[]") as PresentRecommend[];
  } catch (e) {
    message.error("AI返回内容解析失败");
  }
  return result;
}

const MoreInfoForm: React.FC = () => {
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // 读取历史推荐和用户答题
  const [history, setHistory] = useState<{ answers: Record<number, string[]>; questions: any[]; lastResult: PresentRecommend[] }>({ answers: {}, questions: [], lastResult: [] });

  React.useEffect(() => {
    // 从 window.history.state 读取
    const state = window.history.state && window.history.state.usr;
    if (state && state.answers && state.questions && state.results) {
      setHistory({ answers: state.answers, questions: state.questions, lastResult: state.results });
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 构造新 prompt
      let prompt = '请根据以下用户信息和补充信息，重新推荐5个更精准的礼物，并简要说明推荐理由：\n';
      history.questions.forEach((q: any, idx: number) => {
        const userAnswer = history.answers[idx]?.join('，') || '未选择';
        prompt += `${q.question} ${userAnswer}\n`;
      });
      prompt += `\n上一次AI推荐如下：\n`;
      history.lastResult.forEach((item, idx) => {
        prompt += `${idx + 1}. ${item.presentName}：${item.presentReason}\n`;
      });
      prompt += `\n用户补充信息：${info}\n`;
      prompt += `\n请基于所有信息，重新推荐5个礼物。`;

      const result = await getPresentRecommend(prompt);
      // 跳转到结果页并传递新数据
      window.history.pushState({ usr: { answers: history.answers, questions: history.questions, results: result } }, "", "/result");
      window.location.href = "/result";
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Card style={{ maxWidth: 600, margin: "40px auto" }}>
        <h2>补充更多信息</h2>
        <p>请在下方输入您想补充的详细信息，以帮助我们为您提供更准确的推荐：</p>
        <TextArea
          rows={6}
          value={info}
          onChange={e => setInfo(e.target.value)}
          placeholder="请输入补充信息..."
        />
        <div style={{ marginTop: 24 }}>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            disabled={!info.trim()}
          >
            提交
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default MoreInfoForm;
