import NavBar from "../../components/SharedComponents/NavBar";
import Box from '@mui/material/Box';
import UserList from "../../components/Users/UserList";
import { TextField, Button } from "@mui/material";


const UserMgmt = () => {
  var UserSelected = false;
  return (
    <>
      <NavBar />
      <h1>User Management</h1>
      <Button variant='outlined' sx={{mr:3}}><a href='/home'>Back to home</a></Button>
      <Button variant='outlined'> <a href='/home'>See User Workflow</a></Button>
      <Box >
        <UserList/>
      </Box>
      {/* when user not selected */}
      <Box sx={{mt:4, mt:4}}>
        <TextField sx={{mr:2}} id="company_name" label="Company Name" variant="outlined"/>
        <TextField sx={{mr:2}} id="company_email" label="Company Email" variant="outlined"/>
        <TextField sx={{mr:2}} id="acc_password" label="Password" variant="outlined"/>
        {/* dropdown for account type */}
      </Box>
      <Box sx={{mt:4, mt:4}}>
        <Button variant='outlined' sx={{mr:3}}>Create</Button>
      </Box>

      {/* when user selected */}
    </>
  );
};
export default UserMgmt;
