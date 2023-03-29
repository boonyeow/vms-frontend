import {
  Autocomplete,
  Button,
  Checkbox,
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
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/SharedComponents/NavBar";
import axios from "axios";
import { useAuthStore } from "../store";

import AttachedFormsSection from "../components/Workflow/AttachedFormsSection.js";
import AuthorizedUsersSection from "../components/Workflow/AuthorizedUsersSection";
import Swal from "sweetalert2";

const ViewWorkflow = (props) => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [workflowInfo, setWorkflowInfo] = useState({});
  const [formTemplateInfo, setFormTemplateInfo] = useState([]);

  const [attachedForms, setAttachedForms] = useState([]);
  const [userList, setUserList] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);

  useEffect(() => {
    console.log(id);
    fetchWorkflowInfo();
    fetchFormTemplateInfo();
    fetchUserList();
  }, []);

  useEffect(() => {
    console.log("hehe changed", formTemplateInfo);
  }, [formTemplateInfo]);

  useEffect(() => {
    console.log("attach", attachedForms);
  }, [attachedForms]);

  const fetchWorkflowInfo = () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAuthorizedUsers(res.data["authorizedAccountIds"]);
        setWorkflowInfo(res.data);
        // console.log("LINE 57 VIEW WORKFLOW", res.data);
        setAttachedForms(
          res.data["forms"].map((temp) => {
            return {
              id: { id: temp["formId"], revisionNo: temp["revisionNo"] },
              name: temp["name"],
              description: temp["description"],
            };
          })
        );
      });
  };
  const fetchFormTemplateInfo = () => {
    axios
      .get(
        process.env.REACT_APP_ENDPOINT_URL + "/api/forms/isFinal?state=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setFormTemplateInfo(res.data);
        console.log("fFORM TEMPLATE INFO", res.data);
      })
      .catch((e) => console.error(e));
  };

  const fetchUserList = async () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserList(res.data);
      })
      .catch((e) => console.error(e));
  };

  const handleSave = (isFinal) => {
    let data = {
      name: workflowInfo["name"],
      isFinal: isFinal,
      form_ids: attachedForms.map((item) => ({
        id: item.id.id,
        revisionNo: item.id.revisionNo,
      })),
      authorized_accounts_ids: authorizedUsers,
    };

    if (data.form_ids.length === 0 && isFinal === true) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `No forms found in workflow.`,
        confirmButtonColor: "#262626",
      });
      return;
    }

    axios
      .put(
        process.env.REACT_APP_ENDPOINT_URL +
          "/api/workflows/updateWorkflow/" +
          id,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        let customMsg = isFinal === true ? "published" : "saved";
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Workflow has been ${customMsg}.`,
          confirmButtonColor: "#262626",
        });
      })
      .catch((e) => {
        let customMsg = isFinal === true ? "publish" : "save";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Unexpected error occured. Failed to ${customMsg} workflow.`,
          confirmButtonColor: "#262626",
        });
      });
  };

  return (
    <Box>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ color: "action.main", alignSelf: "center" }}>
            View Workflow
          </Typography>
          <Box>
            <Button
              variant="outlined"
              disabled={workflowInfo["final"] === true ? true : false}
              onClick={() => {
                handleSave(false);
              }}
              sx={{ mr: 2 }}>
              Save as Draft
            </Button>
            <Button
              variant="contained"
              sx={{ my: 2 }}
              color="action"
              onClick={() => {
                handleSave(true);
              }}>
              Publish
            </Button>
          </Box>
        </Box>
        <Box sx={{ my: 2, py: 1 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1f1f1f" }}>
              Workflow Title
            </Typography>
            <TextField
              sx={{ bgcolor: "white", my: 1, width: "100%" }}
              value={workflowInfo.name}
              disabled={workflowInfo.final === true ? true : false}></TextField>
          </Box>
          <AttachedFormsSection
            formOptions={formTemplateInfo}
            attachedForms={attachedForms}
            setAttachedForms={setAttachedForms}
            disabled={workflowInfo["final"]}
          />
          {console.log("hehehe", authorizedUsers)}
          <AuthorizedUsersSection
            userList={userList}
            authorizedUsers={authorizedUsers}
            setAuthorizedUsers={setAuthorizedUsers}
          />
        </Box>
      </Container>
    </Box>
  );
};
export default ViewWorkflow;
