import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import QuestionBox, {
  type Question,
  type QuestionType,
} from "../components/QuestionBox";
import { Plus, Type, ListChecks, Calendar, List } from "lucide-react";

const FormBuilder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileds, setFileds] = useState<Question[]>([]);
  const [requireLogin, setRequireLogin] = useState(false);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [owner, setOwner] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  interface QuestionOption {
    type: QuestionType;
    icon: React.ReactNode;
    label: string;
  }

  const options: QuestionOption[] = [
    { type: "shortAnswer", label: "Short Answer", icon: <Type size={18} /> },
    { type: "paragraph", label: "Paragraph", icon: <List size={18} /> },
    {
      type: "multipleChoice",
      label: "Multiple Choice",
      icon: <ListChecks size={18} />,
    },
    {
      type: "checkboxes",
      label: "Checkboxes",
      icon: <ListChecks size={18} />,
    },
    { type: "date", label: "Date", icon: <Calendar size={18} /> },
  ];

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      question: "",
    };
    setFileds([...fileds, newQuestion]);
    setShowOptions(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post("/api/forms", {
        title,
        description,
        fileds,
        requireLogin,
        allowAnonymous,
        owner,
        ownerEmail,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Questions designed */}
        {fileds.map((q) => (
          <QuestionBox
            key={q.id}
            id={q.id}
            type={q.type}
            question={q.question}
          />
        ))}

        <button onClick={() => setShowOptions(!showOptions)}>
          <Plus />
          {/* Option list */}
          {showOptions && (
            <div className="max-w-screen-md mx-auto px-4 py-4">
              {options.map((opt) => {
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => addQuestion(opt.type)}
                    className="flex flex-row items-center gap-2"
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </button>

        <button type="submit">Create Form</button>
      </form>
    </div>
  );
};

export default FormBuilder;
