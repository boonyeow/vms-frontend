import NavBar from "../components/SharedComponents/NavBar";
import { Box, Button } from "@mui/material";

const HomePage = () => {
  return (
    <>
      <NavBar />
      <h1>Home</h1>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" sx={{ margin: 3 }}>
          <a href="/UserMgmt">User Management</a>
        </Button>
        <Button variant="outlined" sx={{ margin: 3 }}>
          <a href="/WorkflowMgmt">Manage Workflow</a>
        </Button>
        <Button variant="outlined" sx={{ margin: 3 }}>
          <a href="/FormMgmt">Manage Forms</a>
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" sx={{ margin: 3 }}>
          <a href="/UserCreation">View User List</a>
        </Button>
        <Button variant="outlined" sx={{ margin: 3 }}>
          <a href="/WorkflowCreation">Create Workflow</a>
        </Button>
        <Button variant="outlined" sx={{ margin: 3 }}>
          <a href="/FormCreation">Create Forms</a>
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" sx={{ mr: 3 }}>
          <a href="#">Approve Forms</a>
        </Button>
      </Box>
    </>
  );
};
export default HomePage;
