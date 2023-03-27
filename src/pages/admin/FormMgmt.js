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




const FormMgmt = () => {

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
          navigate("/formsubmission/" + submissionId);
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
          //setFormListOriginal(res.data);
          // const data = res.data.map((obj) => {
          //   return Object.entries(obj).reduce((acc, [key, value]) => {
          //     if (typeof value === "object" && !Array.isArray(value)) {
          //       // If the value is an object, spread its properties into the accumulator
          //       acc = { ...acc, ...value };
          //     } else {
          //       // Otherwise, add the property to the accumulator as is
          //       acc[key] = value;
          //     }
          //     return acc;
          //   }, {});
          // });
          setFormList(res.data);
          console.log(res.data);
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
        <Stack direction="row" spacing={2} alignItems="flex-end"></Stack>
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
