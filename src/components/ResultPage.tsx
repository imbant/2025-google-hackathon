import React, { useEffect, useState } from "react";
import { Card, List, Button, Layout } from "antd";
import type { PresentRecommend } from "./MyForm";

const ResultPage: React.FC = () => {
  // 通过 window.history.state 读取结果
  const [results, setResults] = useState<PresentRecommend[]>([]);

  useEffect(() => {
    // Astro 推荐通过 window.history.state 传递数据
    const state = window.history.state && window.history.state.usr;
    setResults(state?.results || []);
  }, []);

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Card style={{ maxWidth: 700, margin: "40px auto" }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>该结果基于AI智能匹配，欢迎补充更多信息以提升准确性</span>
          <Button type="default" onClick={() => window.location.href = "/moreinfo"}>补充信息</Button>
        </div>
        <h2>AI 礼物推荐结果</h2>
        <List
          itemLayout="vertical"
          dataSource={results}
          renderItem={(item, idx) => (
            <List.Item>
              <Card
                title={`${idx + 1}. ${item.presentName}`}
                style={{ marginBottom: 16 }}
              >
                <div><b>推荐理由：</b>{item.presentReason}</div>
              </Card>
            </List.Item>
          )}
        />
        <Button type="primary" onClick={goHome}>返回首页</Button>
      </Card>
    </Layout>
  );
};

export default ResultPage;
