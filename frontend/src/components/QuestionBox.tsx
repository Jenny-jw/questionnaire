import React, { useState } from "react";
import DatePicker from "react-datepicker";

export type QuestionType =
  | "shortAnswer"
  | "paragraph"
  | "multipleChoice"
  | "checkboxes"
  | "date";

export interface Question {
  id?: string;
  type: QuestionType;
  question: string;
  answer?: string | string[];
  options?: string[];
}

interface Props extends Question {
  mode: "creat" | "answer";
  onUpdateQuestion: (id: string, updated: Partial<Question>) => void;
  onRemove: (id: string) => void;
  onAnswerChange?: (id: string, value: string | string[]) => void;
}

const QuestionBox = ({
  id,
  type,
  mode,
  question,
  answer,
  options = [],
  onUpdateQuestion,
  onRemove,
  onAnswerChange,
}: Props) => {
  const [date, setDate] = useState<Date | null>(
    type === "date" && answer ? new Date(answer as string) : new Date()
  );
  // const handleDateChange; onSelect={handleDateSelect} 選擇的日期顏色會改變

  // CREATOR FUNCTIONS
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id) return;
    onUpdateQuestion?.(id, { question: e.target.value });
  };
  // multiplechoices & checkboxes
  const handleOptionChange = (index: number, value: string) => {
    if (!id) return;
    const newOptions = [...options];
    newOptions[index] = value;
    onUpdateQuestion?.(id, { options: newOptions });
  };

  const addOption = () => {
    if (!id) return;
    const newOptions = [...options, `Option ${options.length + 1}`];
    onUpdateQuestion?.(id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!id) return;
    const remainingOptions = options.filter((_, i) => i !== index);
    onUpdateQuestion?.(id, { options: remainingOptions });
  };
  // FILLER FUNCTIONS

  const handleAnswerChange = (value: string | string[]) => {
    if (!id) return;
    onAnswerChange?.(id, value);
  };

  // const handleDateChange = (date: Date | null) => {};

  // const dateISO =
  //   typeof answer === "string" && answer ? answer.slice(0, 10) : "";

  if (mode === "creat") {
    return (
      <div className="border border-gray-500 rounded-b-lg p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Question..."
            value={question}
            onChange={handleQuestionChange}
          />
          <button type="button" onClick={() => onRemove?.(id)}>
            Remove 🗑️
          </button>
        </div>
        <div className="flex flex-start">
          {type === "shortAnswer" && (
            <input type="text" placeholder="Short-answer text" />
          )}
          {type === "paragraph" && <textarea placeholder="Long-answer text" />}
          {(type === "multipleChoice" || type === "checkboxes") && (
            <div className="flex flex-col gap-2">
              {options.map((opt, i) => (
                <div key={i} className="flex flex-row items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    placeholder={`Option ${i + 1}`}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                  />
                  <button type="button" onClick={() => removeOption(i)}>
                    -
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="">
                + Add an option
              </button>
            </div>
          )}
          {type === "date" && (
            <DatePicker selected={date} onChange={(d) => setDate(d)} disabled />
          )}
        </div>
      </div>
    );
  }
  if (mode === "answer") {
    return (
      <div className="border border-gray-500 rounded-b-lg p-4">
        <p>{question}</p>
        {type === "shortAnswer" && (
          <input
            type="text"
            value={(answer as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        )}
        {type === "paragraph" && (
          <textarea
            value={(answer as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        )}
        {type === "multipleChoice" &&
          options.map((opt, i) => (
            <label key={i} className="block">
              <input
                type="radio"
                name={id}
                value={opt}
                checked={answer === opt}
                onChange={() => handleAnswerChange(opt)}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        {type === "checkboxes" &&
          options.map((opt, i) => {
            const selected = Array.isArray(answer)
              ? answer.includes(opt)
              : false;
            return (
              <label key={i} className="block">
                <input
                  type="checkbox"
                  value={opt}
                  checked={selected}
                  onChange={(e) => {
                    const current = Array.isArray(answer) ? [...answer] : [];
                    if (e.target.checked) handleAnswerChange([...current, opt]);
                    else handleAnswerChange(current.filter((a) => a !== opt));
                  }}
                />
                <span className="ml-2">{opt}</span>
              </label>
            );
          })}
        {type === "date" && (
          <DatePicker
            selected={date}
            onChange={(newDate) => {
              setDate(newDate || new Date());
              handleAnswerChange(newDate?.toISOString() || "");
            }}
          />
        )}
      </div>
    );
  }

  return null;
};

export default QuestionBox;
