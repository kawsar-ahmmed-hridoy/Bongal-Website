import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./components/home/HomePage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<HomePage />} />
      </Routes>
  );
}

export default App;
