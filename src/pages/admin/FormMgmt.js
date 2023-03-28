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
  {
    field: "submissionid",
    headerName: "ID",
    width: 1,
    valueGetter: (params) => params.row.id,
  },
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
          color= 'white';
          backgroundColor = "rgba(0, 0, 255, 0.5)";
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
    width: 150,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: (params) => {
      const onClick = (e) => {
        const submissionId = params.row.id ? params.row.id : "";
        const id = params.row.form.id.id;
        const revisionNo = params.row.form.id.revisionNo;
        if (submissionId) {
          navigate(`/formsubmission/${id}/${revisionNo}/${submissionId}`);
        } else {
        let workflowId=params.row.workflow.id
          navigate(`/form/${id}/${revisionNo}/${workflowId}`);
        }
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
  let formListTemp=[]
  const fetchFormsList =  async () => {
    let url = '';
    if (role == "ADMIN") {
        url = process.env.REACT_APP_ENDPOINT_URL + "/api/formsubmission";
      } else if (role == "APPROVER") {
        url =
          process.env.REACT_APP_ENDPOINT_URL +
          "/api/formsubmission/getByStatus?status=AWAITING_APPROVER";
    } else {
      url =
        process.env.REACT_APP_ENDPOINT_URL +
        "/api/formsubmission/getByAccountId?accountId=" +
        accId;
      }
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
       .then(async (res) => {
          formListTemp=res.data
          setFormList(res.data);
          if (role === 'VENDOR') {
                await axios
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
                   const submission = [...formListTemp];
                   let len = submission.length;
                   const workflow = res.data;
                   const missingForms = [];
                   for (const workflowObj of workflow) {
                     for (const form of workflowObj.forms) {
                       const foundForm = submission.find((submissionObj) => {
                         return (
                           submissionObj.form.id.id === form.formId &&
                           submissionObj.form.id.revisionNo === form.revisionNo &&
                           submissionObj.workflow.id === workflowObj.id
                         );
                       });

                       if (!foundForm) {
                         missingForms.push({
                           id: '',
                           form:{id:{id:form.formId,revisionNo:form.revisionNo,},name:form.name},
                           status: "NOT SUBMITTED",
                           workflow: { id: workflowObj.id, name: workflowObj.name},
                         });
                       }
                     }
                   }
                   console.log(missingForms);
                   setFormList([...formListTemp, ...missingForms]);
                 });
      }
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
            getRowId={(row) => row.id +row.status +row.workflow.id +row.form.id.id+row.form.id.revisionNo }
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
