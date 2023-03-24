import NavBar from "../../components/SharedComponents/NavBar";
import WorkflowList from "../../components/Workflow/WorkflowList";

import React from "react";
import { Navigate } from "react-router-dom";

const WorkflowMgmt = () => {
  const isAdmin = true;

  return (
    <>
    {(isAdmin) ?
    <><NavBar />
      <h1>Workflow Management</h1>
      <WorkflowList />
    </> : 
    <>
      <Navigate replace to="/home" />
    </> }
  </> );
};
export default WorkflowMgmt;