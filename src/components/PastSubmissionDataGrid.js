import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { Box } from "@mui/system";

const PastSubmissionDataGrid = () => {
  const { token, accountId, role } = useAuthStore();
  const accId = accountId.toString();
  const navigate = useNavigate();
  const columns = [
    {
      field: "id",
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
      width: 70,
      valueGetter: (params) =>
        params.row.form?.id ? params.row.form.id.id : params.row.formId,
    },
    {
      field: "revisionNumber",
      headerName: "Revision #",
      width: 80,
      valueGetter: (params) =>
        params.row.form?.id?.revisionNo
          ? params.row.form.id.revisionNo
          : params.row.revisionNo,
    },
    {
      field: "dateOfSubmission",
      headerName: "Date of Submission",
      width: 160,
    },
    {
      field: "reviewedBy",
      headerName: "Latest Reviewer",
      width: 160,
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
          console.log("hey row", params.row);
          navigate(`/formsubmission/${formid}/${revisionNo}/${submissionId}`);
        };
        return (
          <Button
            variant="contained"
            color="action"
            size="small"
            onClick={onClick}
          >
            View
          </Button>
        );
      },
    },
  ];

  const [formList, setFormList] = useState([]);

  const fetchFormsList = () => {
    let url =
      process.env.REACT_APP_ENDPOINT_URL +
      "/api/formsubmission/getByAccountId?accountId=" +
      accId;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const items = [];
        for (const item of res.data) {
          items.push({
            id: item.id,
            formName: item.form.name,
            workflowId: item.workflow.id,
            formId: item.form.id.id,
            revisionNo: item.form.id.revisionNo,
            dateOfSubmission: item.dateOfSubmission,
            status: item.status,
            reviewedBy:
              item.reviewedByApprover != null
                ? item.reviewedByApprover.email
                : item.reviewedByAdmin != null
                ? item.reviewedByAdmin.email
                : "-",
          });
        }
        setFormList(items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchFormsList();
  }, []);

  return (
    <Box
      style={{
        height: 500,
        width: "100%",
      }}
    >
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
  );
};

export default PastSubmissionDataGrid;
