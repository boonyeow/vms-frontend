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
import Approval from "./pages/Approval";

function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="FormCreation/:id/:revisionNo" element={<FormCreation />} />
      <Route path="FormMgmt" element={<FormMgmt />} />
      <Route path="WorkflowCreation" element={<WorkflowCreation />} />
      <Route path="WorkflowEditing" element={<WorkflowEditing />} />
      <Route path="workflow" element={<WorkflowMgmt />} />
      <Route path="user" element={<UserMgmt />} />
      <Route path="template" element={<FormTemplates />} />
      <Route path="form/:id/:revisionNo/:workflowId" element={<ViewForm />} />
      <Route
        path="formsubmission/:id/:revisionNo/:submissionid"
        element={<ViewForm />}
      />
      <Route path="workflow/:id" element={<ViewWorkflow />} />
      <Route path="Approvals" element={<Approval />} />
    </Routes>
  );
}

export default AppRoutes;
