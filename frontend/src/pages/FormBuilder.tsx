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
  const [fields, setFields] = useState<Question[]>([]);
  const [requireLogin, setRequireLogin] = useState(false);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [owner, setOwner] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [showOptions, setShowOptions] = useState(false);

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
      options:
        type === "multipleChoice" || type === "checkboxes" ? ["Option 1"] : [],
    };
    setFields((prev) => [...prev, newQuestion]);
    setShowOptions(false);
  };

  const updateQuestion = (id: string, updated: Partial<Question>) => {
    setFields((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setFields((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ownerTokenHash = "123";
    const ownerTokenExpireAt = new Date();
    try {
      await axios.post("/api/forms", {
        title,
        description,
        fields,
        requireLogin,
        allowAnonymous,
        owner,
        ownerEmail,
        ownerTokenHash,
        ownerTokenExpireAt,
      });
      console.log("Form created! 🌿");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        <input
          id="description"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
        {/* Questions designed */}
        {fields.map((q) => (
          <QuestionBox
            key={q.id}
            id={q.id}
            type={q.type}
            mode="creat"
            question={q.question}
            options={q.options ?? []}
            answer={q.answer}
            onUpdateQuestion={updateQuestion}
            onRemove={removeQuestion}
          />
        ))}

        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="w-15 h-10 flex items-center justify-center ml-auto"
        >
          <Plus />
        </button>
        {/* Option list */}
        {showOptions && (
          <div className="flex flex-col gap-1">
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

        {/* Owner settings*/}
        <div className="w-full border border-gray-500 rounded-lg p-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={requireLogin}
              onChange={(e) => setRequireLogin(e.target.checked)}
              className="mr-2"
            />
            Fillers need to login
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={allowAnonymous}
              onChange={(e) => setAllowAnonymous(e.target.checked)}
              className="mr-2"
            />
            Filler can stay anonymous
          </label>
          <input
            id="owner"
            type="text"
            placeholder="Owner name"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full mt-2"
          />
          <input
            id="ownerEmail"
            type="text"
            placeholder="Owner Email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            className="w-full mt-2"
          />
        </div>

        <button type="submit">Create Form</button>
      </form>
    </div>
  );
};

export default FormBuilder;
