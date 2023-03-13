import NavBar from "../../components/SharedComponents/NavBar";
import Box from '@mui/material/Box';
import UserList from "../../components/Users/UserList";
import { Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";


const UserMgmt = () => {
  var UserSelected = false;
  // hard coded for demo purpose
  const workflow_row = [
    {formId:1, workflowId:1, formName: 'Form 2', formStatus:'Pending', user:'abc'},
    {formId:2, workflowId:1, formName: 'Form 1', formStatus:'Completed', user:'abc'},
    {formId:3, workflowId:2, formName: 'Form 3', formStatus:'Pending', user:'def'},
    {formId:4, workflowId:2, formName: 'Form 2', formStatus:'Completed', user:'def'},
    {formId:5, workflowId:2, formName: 'Form 1', formStatus:'Completed', user:'def'},
  ];
  const workflow_col = [
    {field:"formId", headerName:"Form ID"},
    {field:"workflowId", headerName:"Workflow ID"},
    {field:"formName", headerName:"Form Name"},
    {field:"formStatus", headerName:"Form Status"},
    {field:"user", headerName:"User"},
  ];
  const workflowTable = workflow_row.map((row) => (
    <TableRow key={row.formId}>
        <TableCell component="th" scope="row">{row.formId}</TableCell>
        <TableCell>{row.workflowId}</TableCell>
        <TableCell>{row.formName}</TableCell>
        <TableCell>{row.formStatus}</TableCell>
    </TableRow>
  ));
  return (
    <>
      <NavBar />
      <h1>User Management</h1>
      <Button variant='outlined' sx={{mr:3}}><a href='/home'>Back to home</a></Button>
      <Button variant='outlined'> <a href='/UserCreation'>Create/Modify account</a></Button>
      <Box >
        <UserList/>
      </Box>
      <Box sx={{border:1, padding:1}}>
        <p>Table showing workflow of 1 User</p>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{workflow_col[0].headerName}</TableCell>
                <TableCell>{workflow_col[1].headerName}</TableCell>
                <TableCell>{workflow_col[2].headerName}</TableCell>
                <TableCell>{workflow_col[3].headerName}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {workflowTable}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{display:"flex",justifyContent:"center"}}>
          <Button variant='outlined' sx={{mr:3, mt:3}}>Assign Workflow</Button>
          <Button variant='outlined' sx={{mr:3, mt:3}}>Manage Workflow</Button>
          <Button variant='outlined' sx={{mr:3, mt:3}}>Send Notification</Button>
        </Box>
      </Box>

    </>
  );
};
export default UserMgmt;
