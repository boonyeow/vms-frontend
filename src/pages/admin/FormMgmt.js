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
  const { token, accountId, role } = useAuthStore();
  const accId = accountId.toString();
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
  ...(role !== "VENDOR"
    ? [
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
      ]
    : [
        {
          field: "workflowId",
          headerName: "Workflow ID",
          width: 150,
          valueGetter: (params) => params.row.workflow.id,
        },
        {
          field: "workflowname",
          headerName: "Workflow Name",
          width: 160,
          valueGetter: (params) => params.row.workflow.name,
        },
      ]),
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
        const submissionId = params.row.id ? params.row.id : "";
        const id = params.row.form.id.id;
        const revisionNo = params.row.form.id.revisionNo;
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
  const fetchFormsList =  () => {
    let url = '';
    if (role == "ADMIN") {
        url = process.env.REACT_APP_ENDPOINT_URL + "/api/formsubmission";
      } else if (role == "APPROVER") {
        url =
          process.env.REACT_APP_ENDPOINT_URL +
          "/api/formsubmission/getByStatus?StatusType=AWAITING_APPROVER";
    } else {
      url =
        process.env.REACT_APP_ENDPOINT_URL +
        "/api/formsubmission/getByAccountId?accountId=" +
        accId;
      }
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
       .then((res) => {
         // console.log(res.data)
          setFormList(res.data);
        })
      .catch((e) => console.error(e));
        if (role === 'VENDOR') {
              axios
               .get(
                 process.env.REACT_APP_ENDPOINT_URL +
                   "/api/workflows/getWorkflowsByAccountId/" +
                   accountId,
                 {
                   headers: {
                     Authorization: `Bearer ${token}`,
                   },
                 }
               )
               .then( (res) => {
                 //console.log(res.data);
                 const submission = [...formList]
                 let len = submission.length;

                 const workflow = res.data;
                 const missingForms = [];
                 // Loop through the workflow array
                 for (const workflowObj of workflow) {
                   for (const form of workflowObj.forms) {
                     // Check if the form exists in the submission array

                     const foundForm = submission.find((submissionObj) => {
                       console.log(submissionObj)
                       console.log(form);
                       console.log(workflowObj);
                       return (
                         submissionObj.form.id.id === form.formId &&
                         submissionObj.form.id.revisionNo === form.revisionNo &&
                         submissionObj.workflow.id === workflowObj.id
                       );
                     });

                     // If the form is not found, add it to the missingForms array
                     if (!foundForm) {
                       len++
                       missingForms.push({
                         id: 10,
                         form:{id:{id:form.formId,revisionNo:form.revisionNo,},name:form.name},
                         status: "AWAITING_VENDOR",
                         workflow: { id: workflowObj.id, name: workflowObj.name},
                       });
                     }
                   }
                 }
                 console.log(missingForms);
                // setFormList([...formList,...missingForms])
                  //  setFormList((prevData) => ([...prevData,missingForms]));
                  //  console.log(formList)
               });
    }


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
          {role === "ADMIN" ? <SendEmailButton /> : ""}
        </Stack>
        <div
          style={{ height: 500, maxWidth: "100%", backgroundColor: "white" }}
        >
          <DataGrid
            rows={formList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            //getRowId={(row) => row.id +row.status +row.workflow.id +row.form.id.id+row.form.id.revisionNo }
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
