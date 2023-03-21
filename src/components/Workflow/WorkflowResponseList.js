// this is the table to view many users' progress for ONE workflow.
import DataTable from "../SharedComponents/DataTable";

import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store";
import axios from "axios";
import { TroubleshootSharp, Construction, LibraryAddCheck } from "@mui/icons-material";

// to settle
const WorkflowResponseList = () => {

    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);

    const { token } = useAuthStore();
    const [workflowList, setWorkflowList] = useState([]);

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

    const deleteWorkflow = async () => {
        axios
            .get(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                // setWorkflowList(res.data);
            })
            .catch((e) => console.error(e));
    };

    const publishWorkflow = async () => {
        axios
            .post(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflowList[selectedRow].id + "/publishWorkflow", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                // 
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
                sort: TroubleshootSharp,
            }
        },
        {
            name: "name",
            label: "NAME",
            options: {
                filter: true,
                sort: TroubleshootSharp,
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
                sort: TroubleshootSharp,
                customBodyRenderLite: (row) => {
                    return(
                        <>
                            {(row.final) ? <Tooltip disableFocusListener title="Published And Accepting Responses"><LibraryAddCheck /></Tooltip> : <Tooltip disableFocusListener title="Edit Mode / Unpublished"><Construction /></Tooltip> }
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

    // to do
    function EditWorkflowButton() {
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}><a href='/home'>Edit Workflow</a></Button>
        )
    }

    // to do
    function SeeResponsesButton() {
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}><a href='/home'>See Responses</a></Button>
        )
    }

    // to do
    function PublishWorkflowButton() {
   
        function handleClick() {
            publishWorkflow();
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>Publish Workflow</Button>
        )
    }

    // to do
    function DeleteWorkflowButton() {
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}><a href='/home'>Delete Workflow</a></Button>
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
                  <EditWorkflowButton />
                  {/* <SeeResponsesButton /> */}
                  { selectedRow.final == "true" ? <SeeResponsesButton /> : <PublishWorkflowButton />}
                  <DeleteWorkflowButton />
              </Box>
          </React.Fragment>
      );
    }

    return (
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

      </>
    );
    }
export default WorkflowResponseList;