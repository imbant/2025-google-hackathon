import React from "react";
import { Card, Skeleton, Space, Button } from "antd";
import {
  ShoppingOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const BrowseMore: React.FC = () => {
  // 模拟商品卡片数据
  const mockProducts = [
    { id: 1, category: "数码好物" },
    { id: 2, category: "生活用品" },
    { id: 3, category: "美妆护肤" },
    { id: 4, category: "服饰配件" },
  ];

  const ProductCard = ({ category }: { category: string }) => (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        overflow: "hidden",
      }}
      bodyStyle={{ padding: 12 }}
      actions={[
        <HeartOutlined key="like" style={{ color: "#ff4d4f" }} />,
        <ShoppingOutlined key="shop" style={{ color: "#1890ff" }} />,
        <ShareAltOutlined key="share" style={{ color: "#52c41a" }} />,
      ]}
    >
      {/* 商品图片骨架 */}
      <div style={{ width: "100%", marginBottom: 12 }}>
        <Skeleton.Image
          active
        />
      </div>

      {/* 商品信息骨架 */}
      <div style={{ marginTop: 0 }}>
        {/* 商品标题 */}
        <Skeleton
          active
          title={{ width: "80%" }}
          paragraph={{ rows: 1, width: "60%" }}
        />

        {/* 价格区域 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* 现价 */}
            <div
              style={{
                background: "#ff4d4f",
                color: "white",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              ¥
            </div>
            <Skeleton.Input size="small" active style={{ width: 50 }} />
          </div>

          {/* 原价 */}
          <Skeleton.Input size="small" active style={{ width: 40 }} />
        </div>

        {/* 标签区域 */}
        <div style={{ marginTop: 8 }}>
          <Space size={4}>
            <div
              style={{
                background: "#f6ffed",
                color: "#52c41a",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 10,
                border: "1px solid #b7eb8f",
              }}
            >
              {category}
            </div>
            <div
              style={{
                background: "#fff7e6",
                color: "#fa8c16",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 10,
                border: "1px solid #ffd591",
              }}
            >
              AI推荐
            </div>
          </Space>
        </div>

        {/* 销量和评价 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 11,
            color: "#999",
          }}
        >
          <Skeleton.Input size="small" active style={{ width: 60 }} />
          <Skeleton.Input size="small" active style={{ width: 50 }} />
        </div>
      </div>
    </Card>
  );

  return (
    <div
      style={{
        background: "#fafafa",
        padding: "24px",
        borderRadius: "12px 12px 0 0",
        marginTop: 32,
      }}
    >
      {/* 标题区域 */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            color: "#CA555D",
            fontSize: 20,
            fontWeight: 600,
            margin: 0,
            marginBottom: 8,
          }}
        >
          🎁 随便逛逛
        </h3>
        <div
          style={{
            color: "#666",
            fontSize: 14,
          }}
        >
          更多 AI 精选好物推荐即将上线
        </div>
      </div>

      {/* 商品网格 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        {mockProducts.map((product) => (
          <ProductCard key={product.id} category={product.category} />
        ))}
      </div>

      {/* 底部提示 */}
      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          padding: 16,
          background: "white",
          borderRadius: 8,
          border: "1px dashed #d9d9d9",
        }}
      >
        <div
          style={{
            color: "#8574EB",
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          🚀 敬请期待
        </div>
        <div
          style={{
            color: "#999",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          即将为您提供基于 AI 分析的
          <br />
          个性化礼物推荐和真实电商链接
        </div>
        <Button
          type="primary"
          style={{
            marginTop: 12,
            background: "linear-gradient(135deg, #CA555D 0%, #8574EB 100%)",
            border: "none",
            borderRadius: 20,
          }}
          size="small"
        >
          立即体验 AI 推荐
        </Button>
      </div>
    </div>
  );
};

export default BrowseMore;
