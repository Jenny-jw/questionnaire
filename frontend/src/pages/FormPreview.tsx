import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type FieldType =
  | "shortAnswer"
  | "paragraph"
  | "multipleChoice"
  | "checkboxes"
  | "date";

interface Field {
  _id: string;
  question: string;
  type: FieldType;
  options: string[];
  required: boolean;
}

interface Form {
  _id: string;
  title: string;
  description: string;
  fields: Field[];
}

const FormPreview = () => {
  const { formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    axios.get(`/api/admin/forms/${formId}`).then((res) => {
      setForm(res.data);
    });
  }, [formId]);

  if (!form) return <div>Form is loading~</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{form.title}</h1>
      {form.description && (
        <p className="text-yellow-100 mb-6">{form.description}</p>
      )}
      <form className="flex flex-col gap-8 w-full">
        {form.fields.map((field) => (
          <div key={field._id} className="flex flex-col gap-2">
            <label className="w-full font-medium text-left">
              {field.question}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            {field.type === "shortAnswer" && (
              <input
                type="text"
                name={field._id}
                className="mx-4 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            )}
            {field.type === "paragraph" && (
              <textarea
                rows={4}
                name={field._id}
                className="mx-4 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            )}
            {field.type === "date" && (
              <input
                type="date"
                name={field._id}
                className="mx-4 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            )}
            {field.type === "multipleChoice" &&
              field.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="mx-6 flex item-center gap-2 text-sm"
                >
                  <input type="radio" name={field._id} value={opt} /> {opt}
                </label>
              ))}
            {field.type === "checkboxes" &&
              field.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="mx-6 flex item-center gap-2 text-sm"
                >
                  <input type="checkbox" name={`${field._id}[]`} value={opt} />{" "}
                  {opt}
                </label>
              ))}
          </div>
        ))}
      </form>
    </div>
  );
};

export default FormPreview;
