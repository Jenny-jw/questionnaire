import { useNavigate, useParams } from "react-router-dom";

const FormSubmitted = () => {
  const navigate = useNavigate();
  const { formId } = useParams();

  return (
    <>
      <h1>Succefully submitted yout form~</h1>
      <p>You can refill you form</p>
      <p>Or create your own form!</p>
      <br />
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Start a new form
      </button>
      <button
        onClick={() => {
          navigate(`/forms/${formId}`);
        }}
      >
        Refill your form
      </button>
    </>
  );
};

export default FormSubmitted;
