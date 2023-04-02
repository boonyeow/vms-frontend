import NavBar from "./SharedComponents/NavBar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import SendEmailButton from "../components/Email/SendEmailButton";
import { Box } from "@mui/system";

const ApprovalDataGrid = () => {
  const { token, accountId, role } = useAuthStore();
  const accId = accountId.toString();
  const navigate = useNavigate();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 1,
    },
    {
      field: "name",
      headerName: "Form Name",
      width: 120,
      valueGetter: (params) =>
        params.row.form && params.row.form.name
          ? params.row.form.name
          : params.row.formName,
    },
    {
      field: "workflowId",
      headerName: "Workflow ID",
      width: 90,
      valueGetter: (params) =>
        params.row.workflow ? params.row.workflow.id : params.row.workflowId,
    },
    {
      field: "formid",
      headerName: "Form ID",
      width: 90,
      valueGetter: (params) =>
        params.row.form?.id ? params.row.form.id.id : params.row.formId,
    },
    {
      field: "revisionNumber",
      headerName: "Revision #",
      width: 90,
      valueGetter: (params) =>
        params.row.form?.id?.revisionNo
          ? params.row.form.id.revisionNo
          : params.row.revisionNo,
    },
    {
      field: "email",
      headerName: "Assigned To",
      width: 160,
      valueGetter: (params) =>
        params.row.submittedBy?.email
          ? params.row.submittedBy.email
          : params.row.email,
    },
    {
      field: "company",
      headerName: "Company",
      width: 160,
      valueGetter: (params) =>
        params.row.submittedBy?.company
          ? params.row.submittedBy.company
          : params.row.company,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        let color = "";
        let backgroundColor = "";
        switch (params.value) {
          case "AWAITING_APPROVER":
          case "AWAITING_ADMIN":
            color = "orange";
            break;
          case "APPROVED":
            color = "green";
            break;
          case "REJECTED":
            color = "red";
            break;
          case "NOT SUBMITTED":
            break;
          default:
            break;
        }
        return (
          <div style={{ color: color, backgroundColor: backgroundColor }}>
            {params.value}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 125,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = (e) => {
          const submissionId = params.row.id;
          const formid = params.row.form.id.id;
          const revisionNo = params.row.form.id.revisionNo;
          navigate(`/formsubmission/${formid}/${revisionNo}/${submissionId}`);
        };
        return (
          <Button
            variant="contained"
            color="action"
            size="small"
            onClick={onClick}>
            View
          </Button>
        );
      },
    },
  ];

  const [formList, setFormList] = useState([]);
  let formListTemp = [];
  const fetchFormsList = () => {
    // For Approvals
    const submission = [];
    let url = "";
    if (role == "ADMIN") {
      url =
        process.env.REACT_APP_ENDPOINT_URL +
        "/api/formsubmission/getByStatus?status=AWAITING_ADMIN";
    } else if (role == "APPROVER") {
      url =
        process.env.REACT_APP_ENDPOINT_URL +
        "/api/formsubmission/getByStatus?status=AWAITING_APPROVER";
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        formListTemp = res.data;
        setFormList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchFormsList();
  }, []);

  return (
    <>
      <Box style={{ height: 500, width: "100%" }}>
        <DataGrid
          sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}
          rows={formList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) =>
            row.id +
            row.status +
            (row.workflow?.id ? row.workflow.id : row.workflowId) +
            (row.form?.id?.id ? row.form.id.id : row.formId) +
            (row.form?.id?.revisionNo ? row.form.id.revisionNo : row.revisionNo)
          }
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </>
  );
};

export default ApprovalDataGrid;
