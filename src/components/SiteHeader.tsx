import React from "react";
import { Layout, Input, Button, Space, Image } from "antd";
import { SearchOutlined, GiftOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../assets/logo-1000*600.png";

const { Header } = Layout;

const SiteHeader: React.FC = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div className="logo" style={{ marginRight: "auto" }}>
        <Image src={logo.src} alt="GiftHint Logo" preview={false} height={64} />
      </div>
      <Input.Search
        placeholder="搜索礼物..."
        style={{ width: 200 }}
        enterButton={<SearchOutlined />}
        onSearch={(value) => console.log("Search:", value)} // Placeholder action
      />
      <Button type="text" icon={<GiftOutlined />}>
        礼物中心
      </Button>
      <Button type="text" icon={<UserOutlined />}>
        我的
      </Button>
    </Header>
  );
};

export default SiteHeader;
