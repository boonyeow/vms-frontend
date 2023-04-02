import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { Box } from "@mui/system";

const PastApprovalDataGrid = () => {
  const { token, accountId, role, email } = useAuthStore();
  const accId = accountId.toString();
  const navigate = useNavigate();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 1,
    },
    {
      field: "formName",
      headerName: "Form Name",
      width: 120,
    },
    {
      field: "workflowId",
      headerName: "Workflow ID",
      width: 90,
    },
    {
      field: "formId",
      headerName: "Form ID",
      width: 90,
    },
    {
      field: "revisionNo",
      headerName: "Revision #",
      width: 90,
    },
    {
      field: "submittedBy",
      headerName: "Submitter",
      width: 160,
    },
    {
      field: "company",
      headerName: "Company",
      width: 120,
    },
    {
      field: "dateOfSubmission",
      headerName: "Date of Submission",
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
      field: "reviewedBy",
      headerName: "Latest Reviewer",
      width: 160,
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
          navigate(`/formsubmission/${submissionId}`);
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

  const fetchFormsList = () => {
    let url =
      process.env.REACT_APP_ENDPOINT_URL +
      "/api/formsubmission/getByReviewerId?accountId=" +
      accId;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        const items = [];
        for (const item of res.data) {
          items.push({
            id: item.id,
            formName: item.form.name,
            workflowId: item.workflow.id,
            formId: item.form.id.id,
            revisionNo: item.form.id.revisionNo,
            submittedBy: item.submittedBy.email,
            company: item.submittedBy.company,
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
        checkboxSelection
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
  );
};

export default PastApprovalDataGrid;
