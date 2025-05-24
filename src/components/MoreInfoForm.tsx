import React, { useState } from "react";
import { Card, Input, Button, Layout, message } from "antd";
import { GoogleGenAI, Type } from "@google/genai";
import type { PresentRecommend } from "./MyForm";
import { getApiKey } from "../utils/getApiKey";
import { getPresentRecommendSchema } from "../utils/getPresentRecommendSchema";
import { getPresentRecommendModel } from "../utils/getPresentRecommendModel";

const { TextArea } = Input;

// 公共AI请求函数
async function getPresentRecommend(
  prompt: string
): Promise<PresentRecommend[]> {
  const ai = new GoogleGenAI({
    apiKey: getApiKey(),
  });
  const response = await ai.models.generateContent({
    model: getPresentRecommendModel(),
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: getPresentRecommendSchema(),
    },
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
  const [history, setHistory] = useState<{
    answers: Record<number, string[]>;
    questions: any[];
    lastResult: PresentRecommend[];
  }>({ answers: {}, questions: [], lastResult: [] });

  React.useEffect(() => {
    // 从 window.history.state 读取
    const state = window.history.state && window.history.state.usr;
    if (state && state.answers && state.questions && state.results) {
      setHistory({
        answers: state.answers,
        questions: state.questions,
        lastResult: state.results,
      });
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 构造新 prompt
      let prompt =
        "请根据以下用户信息和补充信息，重新推荐10个更精准的礼物，并简要说明推荐理由：\n";
      history.questions.forEach((q: any, idx: number) => {
        const userAnswer = history.answers[idx]?.join("，") || "未选择";
        prompt += `${q.question} ${userAnswer}\n`;
      });
      prompt += `\n上一次AI推荐如下：\n`;
      history.lastResult.forEach((item, idx) => {
        prompt += `${idx + 1}. ${item.presentName}：${item.presentReason}\n`;
      });
      prompt += `\n用户补充信息：${info}\n`;
      prompt += `\n请基于所有信息，重新推荐10个礼物。`;

      const result = await getPresentRecommend(prompt);
      // 跳转到结果页并传递新数据
      window.history.pushState(
        {
          usr: {
            answers: history.answers,
            questions: history.questions,
            results: result,
          },
        },
        "",
        "/result"
      );
      window.location.href = "/result";
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Card style={{ maxWidth: 600, margin: "40px auto" }}>
        <h2>😉关于TA</h2>
        <p>建议语言简明，重点突出，您补充的内容也可以建立人物信息档案哦~</p>
        <TextArea
          rows={6}
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="请输入更多收礼人信息，如：TA是素食主义者，关注环保。"
        />
        <div style={{ marginTop: 24 }}>
          <Button>回到礼物结果页</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            disabled={!info.trim()}
          >
            开始推荐
          </Button>
          <Button>开始推荐并保存TA的档案</Button>
        </div>
        <div>
          您输入的内容，我们会发送给大模型参考，但对您的个人信息我们将遵《隐私协议》。
        </div>
      </Card>
    </Layout>
  );
};

export default MoreInfoForm;
