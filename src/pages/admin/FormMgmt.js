import NavBar from "../../components/SharedComponents/NavBar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import SendEmailButton from "../../components/Email/SendEmailButton"

const FormMgmt = () => {
  const { role } = useAuthStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const columns = [
    { field: "id", headerName: "ID", width: 1 },
    {
      field: "name",
      headerName: "Form Name",
      width: 160,
      valueGetter: (params) => params.row.form.name,
    },
    {
      field: "formid",
      headerName: "Form ID",
      width: 120,
      valueGetter: (params) => params.row.form.id.id,
    },
    {
      field: "revisionNumber",
      headerName: "Form Revision#",
      width: 160,
      valueGetter: (params) => params.row.form.id.revisionNo,
    },
    {
      field: "email",
      headerName: "Submitted By",
      width: 160,
      valueGetter: (params) => params.row.submittedBy.email,
    },
    {
      field: "company",
      headerName: "Company",
      width: 160,
      valueGetter: (params) => params.row.submittedBy.company,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        let color = "";
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
          default:
            break;
        }
        return <div style={{ color: color }}>{params.value}</div>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = (e) => {
          const submissionId = params.row.id;
          const id = params.row.form.id.id;
          const revisionNo = params.row.form.id.revisionNo;
          navigate("/formsubmission/" + submissionId);
          navigate(`/formsubmission/${id}/${revisionNo}/${submissionId}`);
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
    const [formListOriginal, setFormListOriginal] = useState([]);
    const fetchFormsList = async () => {
      axios
        .get(process.env.REACT_APP_ENDPOINT_URL + "/api/formsubmission", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setFormList(res.data);
        })
        .catch((e) => console.error(e));
    };


 useEffect(() => {
   fetchFormsList();
 }, []);



  return (
    <>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Form Management</h1>

      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="flex-end">
        {role==='ADMIN' ? <SendEmailButton/> : ''}
        </Stack>
        <div
          style={{ height: 500, maxWidth: "100%", backgroundColor: "white" }}
        >
          <DataGrid
            rows={formList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
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
export default FormMgmt;
