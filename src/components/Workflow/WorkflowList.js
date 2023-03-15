import DataTable from "../SharedComponents/DataTable";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

// to settle
const data = [
    { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
    { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
    ];
   
// to settle
const columns = [
 {
  name: "name",
  label: "Name",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "company",
  label: "Company",
  options: {
   filter: true,
   sort: false,
  }
 },
]

const WorkflowList = () => {
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
   
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
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>Edit Workflow</Button>
        )
    }

    // to do
    function SeeResponsesButton() {
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:3}} onClick={handleClick}>See Responses</Button>
        )
    }

    // to do
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
                  <EditWorkflowButton />
                  <SeeResponsesButton />
                  <DeleteWorkflowButton />
              </Box>
          </React.Fragment>
      );
    }

    return (
      <>
        <DataTable
          title={'Employees'}
          data={data}
          columns={columns}
          DefaultToolbar={DefaultToolbar}
          SelectToolbar={SelectToolbar}
          whenRowSelected={SelectDealer}
          rowsSelected={selectedRows}/>

      </>
    );
    }
export default WorkflowList;