import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import FormBuilder from "./pages/FormBuilder.tsx";
import FormCreated from "./pages/FormCreated.tsx";
import FillerForm from "./pages/FillerForm.tsx";
import FormPreview from "./pages/FormPreview.tsx";
import Submitted from "./pages/FormSubmitted.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formBuilder" element={<FormBuilder />} />
        <Route path="/formCreated/:formId" element={<FormCreated />} />
        <Route path="/formPreview/:formId" element={<FormPreview />} />
        <Route path="/forms/:formId" element={<FillerForm />} />
        <Route path="/forms/:formId/submitted" element={<Submitted />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
