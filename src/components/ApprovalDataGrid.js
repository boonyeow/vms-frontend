import NavBar from "./SharedComponents/NavBar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import SendEmailButton from "../components/Email/SendEmailButton";

const ApprovalDataGrid = () => {
  const { token, accountId, role } = useAuthStore();
  const accId = accountId.toString();
  const navigate = useNavigate();
  const columns = [
    {
      field: "submissionid",
      headerName: "ID",
      width: 1,
      valueGetter: (params) => (params.row.id ? params.row.id : "-"),
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
          const submissionId = params.row.submissionid;
          const formid = params.row.formId;
          const revisionNo = params.row.revisionNo;
          navigate(`/formsubmission/${formid}/${revisionNo}/${submissionId}`);
        };
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onClick}
            >
              View
            </Button>
          </Stack>
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
      <Stack spacing={2} alignItems="center">
        <div
          style={{ height: 500, maxWidth: "100%", backgroundColor: "white" }}
        >
          <DataGrid
            rows={formList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) =>
              row.id +
              row.status +
              (row.workflow?.id ? row.workflow.id : row.workflowId) +
              (row.form?.id?.id ? row.form.id.id : row.formId) +
              (row.form?.id?.revisionNo
                ? row.form.id.revisionNo
                : row.revisionNo)
            }
            checkboxSelection
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      </Stack>
    </>
  );
};

export default ApprovalDataGrid;