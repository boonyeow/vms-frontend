import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Container, Stack } from "@mui/system";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store";
import { useParams } from "react-router-dom";
import EditAuthorizedAccounts from "../components/Users/EditAuthorizedAccounts";
import NavBar from "../components/SharedComponents/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ContentPasteOffOutlined } from "@mui/icons-material";


const ViewWorkflow = (props) => {
  const [workflowData, setWorkflowData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // initialize dataLoaded state variable to false
  useEffect(() => {
    fetchWorkflowData();
  }, []);

  useEffect(() => {
    fetchWorkflowData();
  }, [openDialog]);

  useEffect(() => {
    if (role === "VENDOR") {
      getFormsSubmitted();
    }
  }, [dataLoaded]);

  const navigate = useNavigate();
  const { workflowId } = useParams();
  const { role, accountId, token } = useAuthStore();
  const [formsSubmitted, setFormsSubmitted] = useState([]);
  const [targetWorkflow, setTargetWorkflow] = useState("");
  const [authorizedUserList, setAuthorizedUserList] = useState([]);

  const editAuthorizedUsers = () => {
    setTargetWorkflow(workflowId);
    setOpenDialog(true);
  };
  const getFormsSubmitted = () => {
    axios
      .get(
        process.env.REACT_APP_ENDPOINT_URL +
          "/api/formsubmission/getByAccountId?accountId=" +
          accountId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {

        let newWorkFlowdataForms = [...workflowData.forms];
        console.log(res);
        let submissions = res.data
          .filter((object) => object.workflow.id == workflowId)
          .map((object) => {
            return {
              formId: object.form.id.id,
              revisionNo: object.form.id.revisionNo,
              status: object.status,
            };
          });
        submissions.forEach((submission) => {
          const formIndex = newWorkFlowdataForms.findIndex((form) => {
            return (
              form.formId === submission.formId &&
              form.revisionNo === submission.revisionNo
            );
          });
          if (formIndex !== -1) {
            if (!newWorkFlowdataForms[formIndex]["submission"]) {
              newWorkFlowdataForms[formIndex]["submission"]=[]
            }
              newWorkFlowdataForms[formIndex]["submission"].push(submission);
          } else {
            const newForm = {
              formId: submission.formId,
              revisionNo: submission.revisionNo,
              name:
                newWorkFlowdataForms.find(
                  (form) => form.formId === submission.formId
                )?.name ?? "",
              submissions: [],
            };
            newForm.submissions.push(submission);

            newWorkFlowdataForms.push(newForm);
          }
        });
        console.log(newWorkFlowdataForms);
           setWorkflowData((prevData) => ({
             ...prevData,
             forms: newWorkFlowdataForms,
           }));
      })
      .catch((e) => console.error(e));
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const newAuthorizedUserList = [...authorizedUserList];

    value.forEach((selectedOption) => {
      if (!newAuthorizedUserList.includes(selectedOption)) {
        newAuthorizedUserList.push(selectedOption);
      }
    });

    newAuthorizedUserList.forEach((existingOption, index) => {
      if (!value.includes(existingOption)) {
        newAuthorizedUserList.splice(index, 1);
      }
    });

    // const newAuthorizedAccounts = newAuthorizedUserList.map((user) => user.id);

    setAuthorizedUserList(newAuthorizedUserList);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    //setAuthorizedUserList([]);
  };
  const fetchWorkflowData = async () => {
    await axios
      .get(
        process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + workflowId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setWorkflowData(res.data);
        setAuthorizedUserList(res.data.authorizedAccountIds);
        console.log(res.data);
        setDataLoaded(true);
      })
      .catch((e) => console.error(e));
  };

  const viewForm = (formId, formRevisionNo) => {
    if (role === "ADMIN") {
      navigate(`../../FormCreation/${formId}/${formRevisionNo}`);
    } else {
      navigate(`../../form/${formId}/${formRevisionNo}/${workflowId}`);
    }
  };
  return (
    <Box>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ color: "action.main", alignSelf: "center" }}
          >
            View Workflow
          </Typography>
        </Box>
        <Box sx={{ my: 2, p: 1 }}>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1f1f1f" }}
            >
              Workflow Title
            </Typography>
            <TextField
              defaultValue="hello"
              sx={{ bgcolor: "white", my: 1 }}
              InputProps={{
                readOnly: role !== "admin",
              }}
              value={workflowData.name}
            />
          </Box>

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "action.main", alignSelf: "center" }}
              >
                Attached Forms
              </Typography>
              {role === "ADMIN" ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{ my: 2 }}
                  color="action"
                  onClick={() => {
                    console.log("hi");
                  }}
                >
                  Add Form
                </Button>
              ) : (
                ""
              )}
            </Box>

            <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2 }}>
              {workflowData?.forms?.map((form) => (
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "action.main", alignSelf: "center" }}
                    >
                      {form.name}
                    </Typography>
                    {role === "VENDOR"
                      ? ""
                      : ` (ID: ${form.formId} Revision No: ${form.revisionNo})`}
                    {form.submission ? (
                      <>
                       { ` Submission(s): ${form.submission?.length}`}
                        <Stack>
                          {form.submission.map((sub, index) => {
                           return ( <Stack direction="row">
                              {`${index+1}: ${sub.status}`}
                            </Stack>)
                          })}
                        </Stack>
                      </>
                    ) : (
                      ""
                    )}

                    <Button
                      size="large"
                      sx={{ my: 2 }}
                      color="primary"
                      onClick={() => {
                        viewForm(form.formId, form.revisionNo);
                      }}
                    >
                      View
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>

          {role === "ADMIN" ? (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: "action.main", alignSelf: "center" }}
                >
                  Authorized Accounts List
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{ my: 2 }}
                  color="action"
                  onClick={() => {
                    editAuthorizedUsers();
                    // setTargetWorkflow(workflowId)
                  }}
                >
                  Edit User
                </Button>
              </Box>

              <Box sx={{ my: 2 }}>
                <UserTable
                  data={workflowData ? workflowData : []}
                  dataLoaded={dataLoaded}
                  workflowId={workflowId}
                  token={token}
                  fetchWorkflowData={fetchWorkflowData}
                />
              </Box>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </Container>
      <EditAuthorizedAccounts
        handleCloseDialog={handleCloseDialog}
        authorizedUserList={authorizedUserList}
        handleChange={handleChange}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        target={targetWorkflow}
        type="workflow"
      />
    </Box>
  );
};

const deleteUser = async (row, workflowId, token, fetchWorkflowData) => {
  await axios
    .delete(
      process.env.REACT_APP_ENDPOINT_URL +
        `/api/workflows/${workflowId}/authorizedAccount?accountId=${row.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      fetchWorkflowData();
    })
    .catch((e) => console.error(e));
};


const UserTable = ({
  data,
  dataLoaded,
  workflowId,
  token,
  fetchWorkflowData,
}) => {
  let rows = data.authorizedAccounts;
  let columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email" },
    { field: "company", headerName: "Company" },
    { field: "accountType", headerName: "Type" },
    {
      field: "action",
      headerName: "Action",
      minWidth: 200,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                deleteUser(params.row, workflowId, token, fetchWorkflowData);
              }}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      {dataLoaded ? ( // only render DataGrid if data has finished loading
        <DataGrid
          sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableRowSelectionOnClick
        />
      ) : (
        <Typography variant="body1">Loading...</Typography> // show loading message if data is not loaded yet
      )}
    </>
  );
};

export default ViewWorkflow;
