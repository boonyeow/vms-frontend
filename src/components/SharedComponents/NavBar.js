import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import AdbIcon from "@mui/icons-material/Adb";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const { token } = useAuthStore();
  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const vendor = [
    {
      name: "Forms",
      list: null,
      path: "/FormList",
    },
    {
      name: "Workflows",
      list: null,
      path: "/Workflows",
    },
  ];
  const { role } = useAuthStore();
    const navigate = useNavigate();
  const { accountId } = useAuthStore();
  const admin = [
    {
      name: "User",
      list: null,
      path: "/UserMgmt",
    },
    {
      name: "Forms",
      list: [ "Manage Forms", "Form Templates"],
      path: [ "/FormMgmt","/FormTemplates"],
    },
    {
      name: "Workflows",
      list: ["Create Workflow", "Manage Workflow"],
      path: ["/WorkflowCreation", "/WorkflowMgmt"],
    },
  ];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

  const handleClick = (event,pageName) => {
      setAnchorEl((prev) => ({
          ...prev,
          [pageName]:event.currentTarget,
    }));
  };
  const handleClose = (pageName) => {
    setAnchorEl((prev) => ({
      ...prev,
      [pageName]: null,
    }));
  };
  const logout = () => {
    useAuthStore.getState().clearStore();
    navigate("/");

  }


  return (
    <div style={{ marginBottom: 30 }}>
      <AppBar
        position="static"
        style={{ top: 0, left: 0, position: "absolute" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/home"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Quantum VMS
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                textDecoration: "none",
              }}
            >
              Quantum VMS
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {/* if is admin then use admin list else use vendor list */}
              {role == "ADMIN"
                ? admin.map((page) =>
                    // if there is a list then will make dropdown tab
                    page.list ? (
                      <Box sx={{ flexGrow: 0 }} key={page.name}>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <Button
                                variant="contained"
                                {...bindTrigger(popupState)}
                                style={{ boxShadow: "none" }}
                              >
                                <Typography>{page.name}</Typography>
                                <KeyboardArrowDownIcon
                                  style={{ color: "white", width: "0.7em" }}
                                />
                              </Button>
                              <Menu {...bindMenu(popupState)}>
                                {page.list.map((item, index) => (
                                  <MenuItem onClick={popupState.close}>
                                    <Link
                                      to={page.path[index]}
                                      style={{ textDecoration: "none" }}
                                    >
                                      <Typography textAlign="center">
                                        {item}
                                      </Typography>
                                    </Link>
                                  </MenuItem>
                                ))}
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </Box>
                    ) : (
                      <Box sx={{ flexGrow: 0 }} key={page.name}>
                        <Button>
                          <Link
                            to={page.path}
                            style={{ textDecoration: "none" }}
                          >
                            <Typography
                              textAlign="center"
                              sx={{ color: "white" }}
                            >
                              {page.name}
                            </Typography>
                          </Link>
                        </Button>
                      </Box>
                    )
                  )
                : vendor.map((page) => (
                    <Box sx={{ flexGrow: 0 }} key={page.name}>
                      <Button>
                        <Link to={page.path} style={{ textDecoration: "none" }}>
                          <Typography
                            textAlign="center"
                            sx={{ color: "white" }}
                          >
                            {page.name}
                          </Typography>
                        </Link>
                      </Button>
                    </Box>
                  ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Stack justifyContent="center" alignItems="center">
                <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <React.Fragment>
                      <IconButton
                        {...bindTrigger(popupState)}
                        sx={{ padding: 0 }}
                      >
                        <AccountCircleIcon fontSize="large" color="light" />
                      </IconButton>
                      <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={logout}>
                          <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
                <Typography textAlign="center">{role}</Typography>
              </Stack>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
export default NavBar;
