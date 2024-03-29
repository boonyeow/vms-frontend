import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FormCreation from "./pages/admin/FormCreation";
import UserMgmt from "./pages/admin/UserMgmt";
import WorkflowMgmt from "./pages/admin/WorkflowMgmt";
import FormTemplates from "./pages/admin/FormTemplates";
import ViewForm from "./pages/ViewForm";
import ViewWorkflow from "./pages/ViewWorkflow";
import PastSubmissions from "./pages/PastSubmissions";
import PastApprovals from "./pages/PastApprovals";
import ViewSubmmittedForm from "./pages/ViewSubmittedForm";
import ViewAllSubmissions from "./pages/ViewAllSubmissions";

function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="FormCreation/:id/:revisionNo" element={<FormCreation />} />

      <Route path="workflow" element={<WorkflowMgmt />} />
      <Route path="user" element={<UserMgmt />} />
      <Route path="template" element={<FormTemplates />} />
      <Route path="form/:id/:revisionNo/:workflowId" element={<ViewForm />} />
      <Route
        path="formsubmission/:id/:revisionNo/:submissionId"
        element={<ViewSubmmittedForm />}
      />
      <Route path="submissions/all" element={<ViewAllSubmissions />} />
      <Route path="workflow/:id" element={<ViewWorkflow />} />
      <Route path="PastSubmissions" element={<PastSubmissions />} />
      <Route path="PastApprovals" element={<PastApprovals />} />
    </Routes>
  );
}

export default AppRoutes;
