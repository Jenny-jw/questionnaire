import { useParams } from "react-router-dom";

const FormCreated = () => {
  const { formId } = useParams();
  const APP_URL = import.meta.env.VITE_APP_URL;

  return (
    <>
      <h1>Form created successfully 🎉</h1>
      <br />
      <p>
        Form URL: {APP_URL}/forms/{formId}
      </p>
      <button>Copy URL</button>
      <button>Open the form</button>
      {/* formId（公開） → 用來填寫 UI、分享 URL */}
      {/* adminToken（秘密） → 用於管理表單 */}
    </>
  );
};

export default FormCreated;
