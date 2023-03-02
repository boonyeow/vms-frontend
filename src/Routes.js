import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";


function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage/>} />
      <Route path="/home" element={<HomePage/>} />
    </Routes>
  );
}

export default AppRoutes;
