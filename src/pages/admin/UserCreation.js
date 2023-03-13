import NavBar from "../../components/SharedComponents/NavBar";
import Box from '@mui/material/Box';
import { TextField, Button } from "@mui/material";
import UserList from "../../components/Users/UserList";


const UserCreation = () => {
  var UserSelected = false;
  var NewUser = true;
  return (
      <>
      <NavBar/>
      <h1>User Creation</h1>
      <Button variant='outlined' sx={{mr:3}}><a href='/UserMgmt'>Back to User Management</a></Button>
      {/* collapsible for account creation */}
      <Button variant='outlined'> <a href='/UserCreation'>Create/Modify account</a></Button>
      <Box>
        <UserList/>
      </Box>
      
      {/* click on user row can see workflow */}
      {/* User Creation */}
      <Box>
        <Box sx={{mt:4}}>
          <TextField sx={{mr:2}} id="company_name" label="Company Name" variant="outlined"/>
          <TextField sx={{mr:2}} id="company_email" label="Company Email" variant="outlined"/>
          <TextField sx={{mr:2}} id="acc_password" label="Password" variant="outlined"/>
          {/* dropdown for account type */}
        </Box>
        <Box sx={{mt:4}}>
          <Button variant='outlined' sx={{mr:3}}>Create</Button>
        </Box>
      </Box>
      </>
  );
};
export default UserCreation;