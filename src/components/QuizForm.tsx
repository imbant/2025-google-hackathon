import React, { useState } from "react";
import { Button, Radio, Checkbox, Card, Layout, Input } from "antd";

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  type: "single" | "multiple";
  question: string;
  options: QuizOption[];
}

export interface QuizFormProps {
  questions: QuizQuestion[];
  onRecommend?: (answers: Record<number, string[]>, questions: QuizQuestion[]) => void;
}

// 选项渲染组件，支持“其他”输入
const OptionSelector: React.FC<{
  type: "single" | "multiple";
  options: QuizOption[];
  value: string[];
  onChange: (val: string[]) => void;
}> = ({ type, options, value, onChange }) => {
  const [other, setOther] = useState("");
  const hasOther = options.some(opt => opt.value === "其他");
  const isOtherSelected = value.includes("其他");

  const handleChange = (val: string | string[]) => {
    let arr = Array.isArray(val) ? val : [val];
    // 如果取消了“其他”，清空输入
    if (!arr.includes("其他")) setOther("");
    onChange(arr);
  };

  const handleOtherInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOther(e.target.value);
    // 选中“其他”时，把输入内容作为选项
    if (type === "single") {
      onChange([e.target.value]);
    } else {
      // 多选时替换“其他”为输入内容
      const filtered = value.filter(v => v !== "其他");
      onChange([...filtered, e.target.value]);
    }
  };

  if (type === "single") {
    return (
      <>
        <Radio.Group
          value={isOtherSelected ? "其他" : value[0]}
          onChange={e => handleChange(e.target.value)}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {options.map(opt => (
            <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
          ))}
        </Radio.Group>
        {isOtherSelected && (
          <Input
            style={{ marginTop: 8, width: 240 }}
            placeholder="请输入其他内容"
            value={other}
            onChange={handleOtherInput}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <Checkbox.Group
          value={value.includes("其他") ? [...value.filter(v => v !== other && v !== "其他"), "其他"] : value}
          onChange={handleChange}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {options.map(opt => (
            <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
          ))}
        </Checkbox.Group>
        {isOtherSelected && (
          <Input
            style={{ marginTop: 8, width: 240 }}
            placeholder="请输入其他内容"
            value={other}
            onChange={handleOtherInput}
          />
        )}
      </>
    );
  }
};

const QuizForm: React.FC<QuizFormProps> = ({ questions, onRecommend }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const isLast = current === questions.length - 1;
  const q = questions[current];

  const handleChange = (val: string[]) => {
    setAnswers({ ...answers, [current]: val });
  };

  const handleNext = () => {
    if (!isLast) setCurrent(current + 1);
  };

  const handleRecommend = () => {
    if (onRecommend) onRecommend(answers, questions);
  };

  // 自动为每题加“其他”选项
  const optionsWithOther = q.options.some(opt => opt.value === "其他")
    ? q.options
    : [...q.options, { label: "其他", value: "其他" }];

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Card style={{ maxWidth: 600, margin: "40px auto" }}>
        <h3>{`第${current + 1}题/${questions.length}`}</h3>
        <div style={{ marginBottom: 16 }}>{q.question}</div>
        <OptionSelector
          type={q.type}
          options={optionsWithOther}
          value={answers[current] || []}
          onChange={handleChange}
        />
        <div style={{ marginTop: 24 }}>
          <Button
            type="primary"
            onClick={isLast ? handleRecommend : handleNext}
            disabled={!answers[current] || answers[current].length === 0}
          >
            {isLast ? "开始推荐" : "下一题"}
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default QuizForm;
