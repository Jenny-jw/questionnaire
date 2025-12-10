import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import FormBuilder from "./pages/FormBuilder.tsx";
import FormCreated from "./pages/FormCreated.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formBuilder" element={<FormBuilder />} />
        <Route path="/formCreated/:formId" element={<FormCreated />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
