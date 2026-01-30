import axios from "axios";
import { useEffect, useState, React } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

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

type Answers = {
  [fieldId: string]: string | string[];
};

const FillerForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const location = useLocation();
  const inviteToken = new URLSearchParams(location.search).get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formId || !form) return;

    const formData = new FormData(e.currentTarget);
    const answers: Answers = {};

    form.fields.forEach((field) => {
      if (field.type === "checkboxes") {
        answers[field._id] = formData.getAll(`${field._id}[]`) as string[];
      } else {
        const value = formData.get(field._id);
        if (value !== null) answers[field._id] = value.toString();
      }
    });

    for (const field of form.fields) {
      if (!field.required) continue;
      const value = answers[field._id];
      if (
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        alert(`${field.question} is required`);
        return;
      }
    }

    try {
      await axios.post(`/api/forms/${formId}`, {
        form: formId,
        inviteToken,
        answers,
        isAnonymous: true,
      });
      alert("Submitted successfully 🎉");
      navigate(`/forms/${formId}/submitted`);
    } catch (err) {
      console.log(err);
      alert("Failed to submit");
    }
  };

  useEffect(() => {
    if (!formId || !inviteToken) return;
    axios
      .get(`/api/forms/${formId}?token=${inviteToken}`)
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => {
        alert("Invalid invite link");
        console.log("inviteToken: ", inviteToken);
      });
  }, [formId, inviteToken]);

  if (!form) return <div>Form is loading~</div>;

  return (
    <>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-yellow-100 mb-6">{form.description}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
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
                    <input
                      type="checkbox"
                      name={`${field._id}[]`}
                      value={opt}
                    />{" "}
                    {opt}
                  </label>
                ))}
            </div>
          ))}
          <button type="submit">Submit your answer</button>
        </form>
      </div>
      {/* {submitted && (

      )} */}
    </>
  );
};

export default FillerForm;
