import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FormCreated = () => {
  const { formId } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`/api/forms/${formId}/responses`, { withCredentials: true })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Expired token"));
  }, [formId]);

  return (
    <>
      <h1>Form created successfully 🎉</h1>
      <br />
      <p>URL of the form you created:</p>
      {/* formId（公開） → 用來填寫 UI、分享 URL */}
      {/* adminToken（秘密） → 用於管理表單 */}
      <p>Form ID: {formId}</p>
      <p>{message}</p>
      {/* <p>Your creator token is: {ownerTokenHash}</p> */}
    </>
  );
};

export default FormCreated;
