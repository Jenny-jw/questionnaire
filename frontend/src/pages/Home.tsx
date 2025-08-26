import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>Create your own forms~ 🪼</h1>
      <button
        onClick={() => {
          navigate("/formBuilder");
        }}
      >
        Start a new form
      </button>
    </>
  );
};

export default Home;
