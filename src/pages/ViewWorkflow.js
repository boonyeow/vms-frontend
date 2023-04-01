import { Button, TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/SharedComponents/NavBar";
import axios from "axios";
import { useAuthStore } from "../store";

import AttachedFormsSection from "../components/Workflow/AttachedFormsSection.js";
import Swal from "sweetalert2";

const ViewWorkflow = (props) => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [workflowInfo, setWorkflowInfo] = useState({});
  const [formTemplateInfo, setFormTemplateInfo] = useState([]);

  const [attachedForms, setAttachedForms] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    fetchUserList();
    fetchWorkflowInfo();
    fetchFormTemplateInfo();
  }, []);

  useEffect(() => {
    fetchWorkflowInfo();
  }, [userMap]);

  const fetchWorkflowInfo = () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/workflows/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWorkflowInfo(res.data);
        setAttachedForms(
          res.data["forms"].map((temp) => {
            return {
              id: temp["id"],
              name: temp["name"],
              description: temp["description"],
              account: temp["account"],
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
        const newUserMap = res.data.reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});
        setUserMap(newUserMap);
      })
      .catch((e) => console.error(e));
  };

  const handleSave = (isFinal) => {
    if (workflowInfo.final === true) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Workflow is final and cannot be edited.",
        confirmButtonColor: "#262626",
      });
      return;
    }

    let data = {
      name: workflowInfo["name"],
      is_final: isFinal,
      workflow_form_assignments: attachedForms
        .filter(
          (item) =>
            //remaining objects in the array are the ones that have a non-null account property with an id property
            item.hasOwnProperty("account") &&
            item["account"] !== null &&
            item["account"].hasOwnProperty("id")
        )
        .map((item) => ({
          account: item["account"],
          formId: { id: item.id.id, revisionNo: item.id.revisionNo },
        })),
    };

    // Checks
    if (attachedForms.length !== data.workflow_form_assignments.length) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Make sure all forms have been assigned.",
        confirmButtonColor: "#262626",
      });
      return;
    }

    if (data.workflow_form_assignments.length === 0) {
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

  const onTitleChange = (e) => {
    let temp = { ...workflowInfo };
    temp["name"] = e.target.value;
    setWorkflowInfo(temp);
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
              disabled={workflowInfo["final"] === true ? true : false}
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
              defaultValue={workflowInfo.name}
              value={workflowInfo.name}
              onChange={onTitleChange}
              disabled={workflowInfo.final === true ? true : false}></TextField>
          </Box>
          <AttachedFormsSection
            formOptions={formTemplateInfo}
            attachedForms={attachedForms}
            setAttachedForms={setAttachedForms}
            disabled={workflowInfo["final"]}
            userList={userList}
          />
        </Box>
      </Container>
    </Box>
  );
};
export default ViewWorkflow;
