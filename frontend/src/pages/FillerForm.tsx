import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const FillerForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    axios.get(`/api/forms/${formId}`).then((res) => {
      console.log("form API response:", res.data);
      setForm(res.data);
    });
  }, [formId]);

  if (!form) return <div>Form is loading~</div>;

  return (
    <div>
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      <form>
        {form.fields.map((field) => (
          <div key={field._id} style={{ marginBottom: 16 }}>
            <label>
              {field.question}
              {field.required && " *"}
            </label>
            {field.type === "shortAnswer" && (
              <input type="text" name={field._id} />
            )}
            {field.type === "paragraph" && (
              <textarea rows={4} name={field._id} />
            )}
            {field.type === "date" && <input type="date" name={field._id} />}
            {field.type === "multipleChoice" &&
              field.options.map((opt, idx) => (
                <label key={idx}>
                  <input type="radio" name={field._id} value={opt} /> {opt}
                </label>
              ))}
            {field.type === "checkboxes" &&
              field.options.map((opt, idx) => (
                <label key={idx}>
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
export default FillerForm;
