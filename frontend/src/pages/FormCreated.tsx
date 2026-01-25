import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const FormCreated = () => {
  const { formId } = useParams();
  const APP_URL = import.meta.env.VITE_APP_URL;
  const navigate = useNavigate();
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteURL, setInviteURL] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const handlePreview = () => {
    navigate(`/formPreview/${formId}`);
  };
  const handleGenerate = async () => {
    try {
      const res = await axios.post(
        `/api/admin/forms/${formId}/invite`,
        {},
        { withCredentials: true },
      );
      setInviteToken(res.data.inviteToken);
      setInviteURL(res.data.inviteURL);
      setStatus("Invite token generated successfully~");
    } catch (err) {
      console.log(err);
      setStatus("Failed to generate invite token...");
    }
  };
  const handleCopy = async () => {
    if (!inviteURL) return;
    await navigator.clipboard.writeText(inviteURL);
    alert("Invite link copied!");
  };
  const handleNavigate = () => {
    navigate("/formBuilder");
  };

  return (
    <>
      <h1>Form created successfully 🎉</h1>
      <br />
      <p>
        Form URL: {APP_URL}/forms/{formId}
      </p>
      <button onClick={handlePreview}>Preview form created</button>
      <button onClick={handleGenerate}>Generate invite link</button>
      {status && <p>{status}</p>}
      {inviteURL && (
        <div className="mt-4">
          <p>Invite link:</p>
          <code>{inviteURL}</code>
          <br />
          <button onClick={handleCopy}>Copy link</button>
          <button onClick={handleNavigate}>Create another form</button>
        </div>
      )}

      {/* formId（公開） → 用來填寫 UI、分享 URL */}
      {/* adminToken（秘密） → 用於管理表單 */}
    </>
  );
};

export default FormCreated;
