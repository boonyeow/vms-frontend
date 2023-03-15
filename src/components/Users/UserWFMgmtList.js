// MAJOR WIP
import DataTable from "../SharedComponents/DataTable";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";

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

const UserWFMgmtList = () => {
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

    function NewUserButton() {
        
        function handleClick() {
            // doSomething();
        }

        return (
            <Button variant='outlined' sx={{mr:3, mt:1}} onClick={handleClick}>Create New</Button>
        )

    }

    // to do
    function UpdateUserButton() {
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:1}} onClick={handleClick}>Save Changes</Button>
        )
    }

    // to do
    function DeleteUserButton() {
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:1}} onClick={handleClick}>See Responses</Button>
        )
    }

    // to do
    function SeeWorkflowButton() {

        const navigate = useNavigate();
   
        function handleClick() {
            // doSomething();
        }
    
        return (
            <Button variant='outlined' sx={{mr:1}} onClick={handleClick}>Manage Workflows</Button>
        )
    }
   
    function DefaultToolbar() {
      return (
           <React.Fragment>
                <Box>
                    <TextField size='small' sx={{mr:1}} id="company_name" label="Company Name" variant="outlined"/>
                    <TextField size='small' sx={{mr:1}} id="company_email" label="Company Email" variant="outlined"/>
                    <TextField size='small' sx={{mr:1}} id="acc_password" label="Password" variant="outlined"/>
                    <select defaultValue="vendor" sx={{mr:2}} style={{marginRight:5, width: 140, height:40, fontSize:15}}>
                        <option value="vendor">Vendor</option>
                        <option value="approver">Approver</option>
                        <option value="administrator">Administrator</option>
                    </select>
                </Box>
                <Box>
                    <NewUserButton />
                </Box>
          </React.Fragment>
      );
    }

    function SelectToolbar() {
        return (
            <React.Fragment>
                <Box sx={{pl: 3}}>
                    <TextField size='small' sx={{mr:1}} id="company_name" label="Company Name" variant="outlined"/>
                    <TextField size='small' sx={{mr:1}} id="company_email" label="Company Email" variant="outlined"/>
                    <TextField size='small' sx={{mr:1}} id="acc_password" label="Password" variant="outlined"/>
                    <select defaultValue="vendor" sx={{mr:2}} style={{marginRight:5, width: 140, height:40, fontSize:15}}>
                        <option value="vendor">Vendor</option>
                        <option value="approver">Approver</option>
                        <option value="administrator">Administrator</option>
                    </select>
                </Box>
                <Box sx={{pl: 3, pt: 1}}>
                    <UpdateUserButton />
                    <DeleteUserButton />
                    <SeeWorkflowButton />
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
export default UserWFMgmtList;