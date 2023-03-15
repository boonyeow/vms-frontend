import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FormCreation from "./pages/admin/FormCreation";
import FormMgmt from "./pages/admin/FormMgmt";
import UserAccMgmt from "./pages/admin/UserAccMgmt";
import UserWFMgmt from "./pages/admin/UserWFMgmt";
import WorkflowCreation from "./pages/admin/WorkflowCreation";
import WorkflowMgmt from "./pages/admin/WorkflowMgmt";


function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="FormCreation" element={<FormCreation />} />
      <Route path="FormMgmt" element={<FormMgmt />} />
      <Route path="WorkflowCreation" element={<WorkflowCreation />} />
      <Route path="WorkflowMgmt" element={<WorkflowMgmt />} />
      <Route path="UserAccMgmt" element={<UserAccMgmt />} />
      <Route path="UserWFMgmt" element={<UserWFMgmt />} />
    </Routes>
  );
}

export default AppRoutes;
