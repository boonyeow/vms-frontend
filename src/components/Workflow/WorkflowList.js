import DataTable from "../SharedComponents/DataTable";
import AssignWorkflowModal from "../Users/AssignWorkflowModal";

import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { Navigate, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store";
import axios from "axios";
import { TroubleshootSharp, Construction, LibraryAddCheck } from "@mui/icons-material";

const WorkflowList = () => {

    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);

    const { token, role } = useAuthStore();
    const [workflowList, setWorkflowList] = useState([]);

    const [sUMOpen, setSUMOpen] = useState(false);

    const selectUserHandleClickOpen = () => {
        setSUMOpen(true);
    };
    
    const selectUserHandleClose = (event, reason) => {
        if (reason && reason == "backdropClick") return;
        setSUMOpen(false);
    };

    const fetchWorkflowList = async () => {
        axios
            .get(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setWorkflowList(res.data);
                console.log(res.data);
            })
            .catch((e) => console.error(e));
    };

    const publishWorkflow = async () => {
        // console.log(workflowList[selectedRow].id);
        console.log(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflowList[selectedRow].id + "/publishWorkflow");
        axios
            .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflowList[selectedRow].id + "/publishWorkflow", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((e) => console.error(e));
        
    };

    useEffect(() => { fetchWorkflowList(); }, []);

    const columns = [
        {
            name: "id",
            label: "ID",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "name",
            label: "NAME",
            options: {
                filter: true,
                sort: true,
                }
        },
        {
            name: "final",
            label: "STATUS",
            options: {
                filter: true,
                filterType: "multiselect",
                filterOptions: {
                    renderValue: (value) => ((value) ? "Published" : "Edit Mode"),
                },
                sort: true,
                customBodyRenderLite: (d, row) => {
                    return(
                        <>
                            {(workflowList[row].final) ? <Tooltip disableFocusListener title="Published And Accepting Responses"><LibraryAddCheck /></Tooltip> : <Tooltip disableFocusListener title="Edit Mode / Unpublished"><Construction /></Tooltip> }
                        </>
                    )
                },
            },
        
       },
    ]
   
    function SelectDealer(currentRowsSelected, allRowsSelected, rowsSelected) {
        // executes when row selection changes
        
        // you kind of have to save and pass back the selected rows, or the table will deselect
        // in addition, the behavior of currentRowsSelected is odd - it seems to hand back the 'last clicked' regardless
         if (rowsSelected.length==1) {
          setSelectedRow(rowsSelected);
          setSelectedRows(currentRowsSelected.map(row=>row.dataIndex));
        } else {
          setSelectedRow(0);
          setSelectedRows([]);
        }
     
    }

    function CreateNewButton() {
   
        const navigate = useNavigate();
        
        function handleClick() {
          navigate("/WorkflowCreation");
        }

        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>Create New</Button>
        )

    }

    function EditWorkflowButton() {

        const navigate = useNavigate();
   
        function handleClick() {
            console.log(workflowList[selectedRow]);
            navigate("/WorkflowEditing", { state: { id: workflowList[selectedRow].id, name: workflowList[selectedRow].name, isFinal: workflowList[selectedRow].isFinal } } );
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>Edit Workflow</Button>
        )
    }

    // to do
    function AssignWorkflowButton() {
   
        function handleClick() {
            selectUserHandleClickOpen(); // immediately opens the user select menu
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>Assign Workflow</Button>
        )
    }

    // to do
    function PublishWorkflowButton() {
   
        function handleClick() {
            publishWorkflow();
            fetchWorkflowList();
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>Publish Workflow</Button>
        )
    }

    // to do: not currently implemented in backend
    function DeleteWorkflowButton() {
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>Delete Workflow</Button>
        )
    }
   
    function DefaultToolbar() {
      return (
          <React.Fragment>
              <Box>
                  <CreateNewButton />
              </Box>
          </React.Fragment>
      );
    }

    function SelectToolbar() {
      return (
          <React.Fragment>
              <Box sx={{py: 1.75, pl: 3}}>
                  <CreateNewButton />
                  { workflowList[selectedRow].final ? <AssignWorkflowButton /> : <><EditWorkflowButton /><PublishWorkflowButton /></>}
              </Box>
          </React.Fragment>
      );
    }

    return ( ( role != "ADMIN") ? <Navigate replace to="/home" /> :
      <>
        <DataTable
          title={'Employees'}
          // data={data}
          data={workflowList}
          columns={columns}
          DefaultToolbar={DefaultToolbar}
          SelectToolbar={SelectToolbar}
          whenRowSelected={SelectDealer}
          rowsSelected={selectedRows}/>
        
        {sUMOpen && <AssignWorkflowModal
            open={sUMOpen}
            onClose={selectUserHandleClose}
            // handleSubmit={selectUserHandleSubmit}
            workflow={workflowList[selectedRow]} /* see comment in AssignWorkflowModal */
          />}
      </>
    );
    }
export default WorkflowList;