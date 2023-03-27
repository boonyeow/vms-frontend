import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FormCreation from "./pages/admin/FormCreation";
import FormMgmt from "./pages/admin/FormMgmt";
import UserMgmt from "./pages/admin/UserMgmt";
import WorkflowCreation from "./pages/admin/WorkflowCreation";
import WorkflowEditing from "./pages/admin/WorkflowEditing";
import WorkflowMgmt from "./pages/admin/WorkflowMgmt";
import FormTemplates from "./pages/admin/FormTemplates";
import ViewForm from "./pages/ViewForm";
import ViewWorkflow from "./pages/ViewWorkflow";

function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="FormCreation/:id/:revisionNo" element={<FormCreation />} />
      <Route path="FormMgmt" element={<FormMgmt />} />
      <Route path="WorkflowCreation" element={<WorkflowCreation />} />
      <Route path="WorkflowEditing" element={<WorkflowEditing />} />
      <Route path="WorkflowMgmt" element={<WorkflowMgmt />} />
      <Route path="UserMgmt" element={<UserMgmt />} />
      <Route path="FormTemplates" element={<FormTemplates />} />
      {/* <Route path="/form" element={<NotFoundPage/>} /> to change this  */}
      <Route path="form/:id/:revisionNo" element={<ViewForm />} />
      <Route path="formsubmission/:id" element={<ViewForm />} />
      <Route path="workflow/:id" element={<ViewWorkflow />} />
    </Routes>
  );
}

export default AppRoutes;
