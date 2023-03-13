import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FormCreation from "./pages/admin/FormCreation";
import FormMgmt from "./pages/admin/FormMgmt";
import UserMgmt from "./pages/admin/UserMgmt";
import WorkflowCreation from "./pages/admin/WorkflowCreation";
import WorkflowMgmt from "./pages/admin/WorkflowMgmt";
import UserCreation from "./pages/admin/UserCreation";
import FormTemplates from "./pages/admin/FormTemplates";


function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="FormCreation" element={<FormCreation />} />
      <Route path="FormMgmt" element={<FormMgmt />} />
      <Route path="WorkflowCreation" element={<WorkflowCreation />} />
      <Route path="WorkflowMgmt" element={<WorkflowMgmt />} />
      <Route path="UserMgmt" element={<UserMgmt />} />
      <Route path="UserCreation" element={<UserCreation />} />
      <Route path="FormTemplates" element={<FormTemplates />} />
    </Routes>
  );
}

export default AppRoutes;
