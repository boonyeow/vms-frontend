import { Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import SubmissionDataGrid from "./SubmissionDataGrid";
import ApprovalDataGrid from "./ApprovalDataGrid";
import AwaitingSubmissionsDataGrid from "./AwaitingSubmissionsDataGrid";

const TabComponent = ({ role }) => {
  const component =
    role == "ADMIN" ? (
      <AdminView />
    ) : role == "VENDOR" ? (
      <VendorView />
    ) : (
      <ApproverView />
    );
  return <Box sx={{ py: 2 }}>{component}</Box>;
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const AdminView = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const data = {};
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label="Awaiting your review" />
          <Tab label="Awaiting your submission" />
          <Tab label="Awaiting vendor's response" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <ApprovalDataGrid />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SubmissionDataGrid />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AwaitingSubmissionsDataGrid />
      </TabPanel>
    </Box>
  );
};

const VendorView = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const data = {};
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label="Awaiting your submission" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <SubmissionDataGrid />
      </TabPanel>
    </Box>
  );
};

const ApproverView = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const data = {};
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label="Awaiting your approval" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <ApprovalDataGrid />
      </TabPanel>
    </Box>
  );
};

export default TabComponent;
