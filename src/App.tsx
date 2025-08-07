import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ContractReview from "@/pages/ContractReview";
import Translator from "@/pages/Translator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contract-review" element={<ContractReview />} />
        <Route path="/translator" element={<Translator />} />
      </Routes>
    </Router>
  );
}
