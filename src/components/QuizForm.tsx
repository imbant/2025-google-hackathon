import React, { useState, useEffect } from "react";
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
  value: string[]; // This value can contain actual custom strings, not just "其他"
  onChange: (val: string[]) => void;
}> = ({ type, options, value, onChange }) => {
  const [otherInputText, setOtherInputText] = useState("");

  useEffect(() => {
    // Sync otherInputText if 'value' prop contains a custom entry
    // A custom entry is one that isn't "其他" and isn't a predefined option value.
    const customValueInProp = value.find(
      (v) => v !== "其他" && !options.some((opt) => opt.value === v)
    );
    if (customValueInProp) {
      setOtherInputText(customValueInProp);
    } else {
      // If "其他" is not selected (neither as marker nor as custom text that implies "其他"),
      // or if "其他" is selected as a marker but there's no custom text, clear the input field.
      const isOtherMarkerSelected = value.includes("其他");
      if (!isOtherMarkerSelected && !customValueInProp) {
        setOtherInputText("");
      } else if (isOtherMarkerSelected && !customValueInProp) {
        // "其他" marker is selected, but no specific custom text was in the prop value for it.
        // This means the input field should be empty.
        setOtherInputText("");
      }
    }
  }, [value, options]);

  // Determines if the "Other" option (and its input field) should be considered active in the UI
  const isOtherEffectivelySelected = value.some(
    (v) => v === "其他" || (v && !options.some((opt) => opt.value === v))
  );

  const handleAntDSelectionChange = (selectionFromAntD: string | string[]) => {
    const uiChoices = Array.isArray(selectionFromAntD)
      ? selectionFromAntD
      : [selectionFromAntD];
    let newPropagatedValues: string[] = [];

    if (type === "single") {
      const singleChoice = uiChoices[0];
      if (singleChoice === "其他") {
        // If "其他" radio is clicked, propagate current custom text or "其他" marker
        newPropagatedValues = [otherInputText || "其他"];
      } else {
        // A predefined option was clicked
        setOtherInputText(""); // Clear custom text
        newPropagatedValues = [singleChoice];
      }
    } else {
      // Multiple choice
      // Start with predefined options selected in UI
      newPropagatedValues = uiChoices.filter((opt) => opt !== "其他");
      if (uiChoices.includes("其他")) {
        // If "其他" checkbox is selected, add custom text or "其他" marker
        newPropagatedValues.push(otherInputText || "其他");
      } else {
        // "其他" checkbox was deselected
        setOtherInputText(""); // Clear custom text
      }
    }
    onChange(Array.from(new Set(newPropagatedValues)));
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentCustomText = e.target.value;
    setOtherInputText(currentCustomText);
    let newPropagatedValues: string[] = [];

    if (type === "single") {
      // For single choice, selecting "Other" and typing means this is the only value
      newPropagatedValues = [currentCustomText || "其他"]; // Use text, or "其他" marker if empty
    } else {
      // Multiple choice: keep existing *predefined* selections, add/update the custom text
      newPropagatedValues = value.filter(
        (v) => options.some((opt) => opt.value === v && v !== "其他")
      );
      newPropagatedValues.push(currentCustomText || "其他"); // Add new custom text or marker
    }
    onChange(Array.from(new Set(newPropagatedValues)));
  };

  // Determine the value to pass to AntD Radio.Group or Checkbox.Group for UI selection state
  let antDWidgetValue: string | string[];
  if (type === "single") {
    const currentSingleAnswer = value[0];
    // If the answer is custom text (not "其他" marker and not in predefined options),
    // then the "其他" radio button should be visually selected.
    if (
      currentSingleAnswer &&
      currentSingleAnswer !== "其他" &&
      !options.some((opt) => opt.value === currentSingleAnswer)
    ) {
      antDWidgetValue = "其他";
    } else {
      antDWidgetValue = currentSingleAnswer || ""; // Otherwise, use the answer itself (could be "其他" marker or predefined)
    }
  } else {
    // Multiple choice: map custom text entries to "其他" for Checkbox.Group's value
    antDWidgetValue = value.map((v) => {
      if (v && v !== "其他" && !options.some((opt) => opt.value === v)) {
        return "其他"; // This custom text means "其他" checkbox is ticked
      }
      return v; // Predefined option or "其他" marker
    });
    // Ensure "其他" is unique in the list for AntD if it results from multiple custom texts or marker
    antDWidgetValue = Array.from(new Set(antDWidgetValue));
  }

  if (type === "single") {
    return (
      <>
        <Radio.Group
          value={antDWidgetValue}
          onChange={(e) => handleAntDSelectionChange(e.target.value)}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {options.map(opt => (
            <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
          ))}
        </Radio.Group>
        {isOtherEffectivelySelected && (
          <Input
            style={{ marginTop: 8, width: 240 }}
            placeholder="请输入其他内容"
            value={otherInputText}
            onChange={handleOtherInputChange}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <Checkbox.Group
          value={antDWidgetValue as string[]} // Asserting as string[] as Checkbox.Group expects this
          onChange={handleAntDSelectionChange}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {options.map(opt => (
            <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
          ))}
        </Checkbox.Group>
        {isOtherEffectivelySelected && (
          <Input
            style={{ marginTop: 8, width: 240 }}
            placeholder="请输入其他内容"
            value={otherInputText}
            onChange={handleOtherInputChange}
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
