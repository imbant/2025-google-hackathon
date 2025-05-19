import React, { useState } from "react";
import { Button, Radio, Checkbox, Card, Layout } from "antd";

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

const QuizForm: React.FC<QuizFormProps> = ({ questions, onRecommend }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const isLast = current === questions.length - 1;
  const q = questions[current];

  const handleChange = (val: string | string[]) => {
    setAnswers({ ...answers, [current]: Array.isArray(val) ? val : [val] });
  };

  const handleNext = () => {
    if (!isLast) setCurrent(current + 1);
  };

  const handleRecommend = () => {
    if (onRecommend) onRecommend(answers, questions);
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Card style={{ maxWidth: 600, margin: "40px auto" }}>
        <h3>{`第${current + 1}题/${questions.length}`}</h3>
        <div style={{ marginBottom: 16 }}>{q.question}</div>
        {q.type === "single" ? (
          <Radio.Group
            value={answers[current]?.[0]}
            onChange={e => handleChange(e.target.value)}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {q.options.map(opt => (
              <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
            ))}
          </Radio.Group>
        ) : (
          <Checkbox.Group
            value={answers[current] || []}
            onChange={handleChange}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {q.options.map(opt => (
              <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
            ))}
          </Checkbox.Group>
        )}
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
