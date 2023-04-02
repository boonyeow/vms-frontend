import NavBar from "./SharedComponents/NavBar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { Box } from "@mui/system";

const AwaitingSubmissionsDataGrid = () => {
  const { token, accountId, role } = useAuthStore();
  const accId = accountId.toString();
  const navigate = useNavigate();

  const columnsTwo = [
    {
      field: "workflowId",
      headerName: "Workflow ID",
      width: 100,
      valueGetter: (params) =>
        params.row.workflow ? params.row.workflow.id : params.row.workflowId,
    },
    {
      field: "name",
      headerName: "Form Name",
      width: 160,
      valueGetter: (params) =>
        params.row.form && params.row.form.name
          ? params.row.form.name
          : params.row.formName,
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
    ,
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
            color = "black";
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
          const formId = params.row.formId;
          const revisionNo = params.row.revisionNo;
          const workflowId = params.row.workflowId;
          navigate(`/form/${formId}/${revisionNo}/${workflowId}`);
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

  const [toBeSubmittedList, setToBeSubmittedList] = useState([]);
  const fetchToBeSubmittedList = () => {
    // For Submissions
    if (role != "APPROVER") {
      let url =
        process.env.REACT_APP_ENDPOINT_URL +
        "/api/workflowFormAssignment/getUnsubmitted";

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
            if (item.formIsFinal == true) {
              items.push({
                id: item.id,
                formName: item.formName,
                workflowId: item.workflowId,
                formId: item.formId.id,
                revisionNo: item.formId.revisionNo,
                email: item.account.email,
                company: item.account.company,
                status: "NOT SUBMITTED",
              });
            }
          }
          setToBeSubmittedList(items);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchToBeSubmittedList();
  }, []);

  return (
    <>
      <Box
        style={{
          height: 500,
          width: "100%",
        }}
      >
        <DataGrid
          sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}
          rows={toBeSubmittedList}
          columns={columnsTwo}
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

export default AwaitingSubmissionsDataGrid;
