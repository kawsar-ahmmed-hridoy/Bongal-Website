import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />} />
      </Routes>
  );
}

export default App;
