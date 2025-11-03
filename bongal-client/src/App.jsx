import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./components/home/HomePage";
import NotFound from "./components/common/NotFound";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
