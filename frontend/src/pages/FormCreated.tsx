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
    <div className="flex flex-col gap-6">
      <h1>Form created successfully🎄</h1>
      <p>
        <strong>Form URL: </strong>
        <code>
          {APP_URL}/forms/{formId}
        </code>
      </p>
      <div className="flex gap-4 justify-center">
        <button onClick={handlePreview}>Preview form created</button>
        <button onClick={handleGenerate}>Generate invite link</button>
      </div>
      {status && <p>{status}</p>}
      {inviteURL && (
        <div className="flex flex-col gap-6 p-4 border border-dashed rounded-md max-w-xl mx-auto">
          <p>
            <strong>Invite Link: </strong>
            <code className="break-words">{inviteURL}</code>
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={handleCopy}>Copy link</button>
            <button onClick={handleNavigate}>Create another form</button>
          </div>
        </div>
      )}
      {/* formId（公開） → 用來填寫 UI、分享 URL */}
      {/* adminToken（秘密） → 用於管理表單 */}
    </div>
  );
};

export default FormCreated;
