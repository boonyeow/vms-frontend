import NavBar from "../components/SharedComponents/NavBar";
import { Box, Button, Grid } from "@mui/material";

const HomePage = () => {
  const isAdmin = true;//get user permission from database

  return (
    <>
      <NavBar />
      <h1>Home</h1>
      {isAdmin 
        ? 
        <>
          <Box sx={{ display: "flex", flexDirection: "row",justifyContent: "center" }}>
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1}}>
              <a href="/UserMgmt">User Management</a>
            </Button>
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="/WorkflowMgmt">Manage Workflow</a>
            </Button>
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="/FormMgmt">Manage Forms</a>
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row",justifyContent: "center" }}>
            {/* <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="/UserCreation">View User List</a>
            </Button> */}
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="/WorkflowCreation">Create Workflow</a>
            </Button>
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="/FormCreation">Create Forms</a>
            </Button>
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="#">Approve Forms</a>
            </Button>
          </Box>
        </>
        : 
        <>
          <Box sx={{ display: "flex", flexDirection: "row",justifyContent: "center" }}>
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="#">Forms to complete</a>
              {/* add in link for route.js and here */}
            </Button>
            <Button variant="outlined" sx={{ margin: 3, backgroundColor:"white", border:1 }}>
              <a href="#">See all Workflow</a>
              {/* add in link for route.js and here */}
            </Button>
          </Box>
        </>};
    </>
  );
};
export default HomePage;