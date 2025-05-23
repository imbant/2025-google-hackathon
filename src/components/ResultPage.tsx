import React, { useEffect, useState } from "react";
import { Card, List, Button, Layout } from "antd";
import type { PresentRecommend } from "./MyForm";

const ResultPage: React.FC = () => {
  const [results, setResults] = useState<PresentRecommend[]>([]);

  useEffect(() => {
    const state = window.history.state && window.history.state.usr;
    setResults(state?.results || []);
  }, []);

  // 10个推荐，分三列错落分布
  const columns = [[], [], []] as PresentRecommend[][];
  results.slice(0, 10).forEach((item, idx) => {
    // 0:中 1:左 2:右 3:中 4:左 5:右 ...
    const colIdx = idx % 3 === 0 ? 1 : idx % 3 === 1 ? 0 : 2;
    columns[colIdx].push(item);
  });

  const handleCardClick = (item: PresentRecommend) => {
    // 这里假设 presentSuggestion 和 presentSummary 字段可能存在
    window.history.pushState({ usr: { gift: item, summary: item.presentSummary } }, "", "/gift-detail");
    window.location.href = "/gift-detail";
  };

  // 采用更专业的马卡龙配色（鹅黄色、淡蓝色等，参考colordrop.io/pastel-palette）
  const macaronColors = [
    '#FFF9E3', // 鹅黄
    '#E3F0FF', // 淡蓝
    '#FCE4EC', // 粉
    '#E3FFE9', // 淡绿
    '#F3E3FF', // 淡紫
    '#FFE3F0', // 粉紫
    '#E3F7FF', // 青蓝
    '#FFF3E3', // 奶油
    '#E3E9FF', // 淡蓝紫
    '#F6FFE3'  // 淡黄绿
  ];
  const macaronImgs = [
    '/src/assets/hero.svg',
    '/src/assets/object-one.svg',
    '/src/assets/object-two.svg',
    '/src/assets/object-three.svg',
    '/src/assets/start.svg',
    '/src/assets/cta.svg',
    '/src/assets/hiw.svg',
    '/src/assets/logo-dark.svg',
    '/src/assets/image.png',
    '/src/assets/WechatIMG25.png'
  ];

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f7f8fa" }}>
      <div style={{ maxWidth: 1200, margin: "40px auto" }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>该结果基于AI智能匹配，欢迎补充更多信息以提升准确性</span>
          <Button type="default" onClick={() => window.location.href = "/moreinfo"}>补充信息</Button>
        </div>
        <h2>AI 礼物推荐结果</h2>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* 中间列最高，左右列次之 */}
          {[1,0,2].map((colIdx, visualIdx) => (
            <div
              key={colIdx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                marginTop:
                  visualIdx === 0 ? 0 : 40 // 中间列0，左右列40
              }}
            >
              {columns[colIdx].map((item, idx) => (
                <Card
                  key={item.presentName + idx}
                  title={<span style={{ fontWeight: idx === 0 ? 700 : 500 }}>{idx === 0 ? `🏆 ${item.presentName}` : item.presentName}</span>}
                  style={{
                    boxShadow: '0 4px 16px rgba(202,85,93,0.10)',
                    cursor: 'pointer',
                    borderRadius: 18,
                    background: macaronColors[(colIdx * 3 + idx) % macaronColors.length],
                    border: 'none',
                    minHeight: 180,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                  }}
                  bodyStyle={{ padding: 20, paddingTop: 32 }}
                  onClick={() => handleCardClick(item)}
                  hoverable
                >
                  <img
                    src={macaronImgs[(colIdx * 3 + idx) % macaronImgs.length]}
                    alt="icon"
                    style={{
                      width: 48,
                      height: 48,
                      position: 'absolute',
                      top: 12,
                      right: 16,
                      opacity: 0.18,
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  />
                  <div style={{ color: '#CA555D', fontSize: 16, fontWeight: 500, zIndex: 1, position: 'relative', marginBottom: 8 }}>{item.presentReason}</div>
                  <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>
                    <b>标签：</b>{item.tags && item.tags.length > 0 ? item.tags.join(' / ') : '无'}
                  </div>
                  <div style={{ color: '#888', fontSize: 14 }}>
                    <b>价格区间：</b>{typeof item.minPrice === 'number' && typeof item.maxPrice === 'number' ? `${item.minPrice}元 - ${item.maxPrice}元` : '未知'}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
        <Button type="primary" style={{ marginTop: 32 }} onClick={() => window.location.href = "/"}>返回首页</Button>
      </div>
    </div>
  );
};

export default ResultPage;
