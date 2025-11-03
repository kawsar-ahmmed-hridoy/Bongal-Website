import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./components/home/HomePage";
import NotFound from "./components/common/NotFound";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
