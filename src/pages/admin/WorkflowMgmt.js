import NavBar from "../../components/SharedComponents/NavBar";
import WorkflowList from "../../components/Workflow/WorkflowList";

import React from "react"

const WorkflowMgmt = () => {
    return (
      <>
        <NavBar />
        <h1>Workflow Management</h1>
        <WorkflowList />
      </>
    );
};
export default WorkflowMgmt;