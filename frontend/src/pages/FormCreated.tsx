import type React from "react";
import { useParams, useNavigate } from "react-router-dom";

const FormCreated = () => {
  const { formId } = useParams();
  const APP_URL = import.meta.env.VITE_APP_URL;
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate(`/formPreview/${formId}`);
  };
  const handleSubmit = () => {
    navigate(`/forms/${formId}`);
  };

  return (
    <>
      <h1>Form created successfully 🎉</h1>
      <br />
      <p>
        Form URL: {APP_URL}/forms/{formId}
      </p>
      <button onClick={handlePreview}>Preview form created</button>
      <button onClick={handleSubmit}>Create and copy invite link</button>
      {/* formId（公開） → 用來填寫 UI、分享 URL */}
      {/* adminToken（秘密） → 用於管理表單 */}
    </>
  );
};

export default FormCreated;
