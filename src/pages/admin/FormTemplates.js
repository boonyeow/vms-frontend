import NavBar from "../../components/SharedComponents/NavBar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { Box, Container } from "@mui/system";
import { Chip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

const FormTemplates = () => {
  const { token } = useAuthStore();
  const [regexList, setRegexList] = useState([]);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [targetForm, setTargetForm] = useState(null);

  function ActionCell({
    row,
    fetchFormsList,
    token,
    navigate,
    setTargetForm,
    isFinal,
  }) {
    const onViewClick = (e) => {
      const formId = row.id;
      const formRevNo = row.revisionNo;
      navigate("/FormCreation/" + formId + "/" + formRevNo);
    };

    const onDeleteClick = async (e) => {
      const targetForm = row;
      Swal.fire({
        title: "Deleting Form Template",
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#317ecf",
        denyButtonText: "No",
        text: "Are you sure you want to delete?",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          axios
            .delete(
              process.env.REACT_APP_ENDPOINT_URL +
                `/api/forms/${targetForm.id}/${targetForm.revisionNo}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Template has been deleted.",
                confirmButtonColor: "#262626",
              });
              console.log("deleted", res.data);
              fetchFormsList();
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    };

    const onDuplicateClick = async (e) => {
      const targetForm = row;
      await axios
        .post(
          process.env.REACT_APP_ENDPOINT_URL +
            `/api/forms/${targetForm.id}/${targetForm.revisionNo}/duplicate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("duplicated", res.data);
          fetchFormsList();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Template has been duplicated.",
            confirmButtonColor: "#262626",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return (
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="action"
          size="small"
          onClick={onViewClick}>
          View
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={onDuplicateClick}>
          Duplicate
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onDeleteClick}
          disabled={isFinal}>
          Delete
        </Button>
      </Stack>
    );
  }

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "revisionNo", headerName: "Revision No." },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "is_final",
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => {
        let isFinal = params.row["is_final"];
        if (isFinal === true) {
          return (
            <Chip
              label={"Published"}
              sx={{
                bgcolor: "#e8f4ff",
                color: "primary.main",
                bgcolor: "#e8f4ff",
                color: "primary.main",
                fontWeight: "bold",
              }}></Chip>
          );
        } else {
          return (
            <Chip
              label={"Draft"}
              sx={{
                fontWeight: "bold",
              }}></Chip>
          );
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      sortable: false,
      headerAlign: "center",
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <ActionCell
          row={params.row}
          fetchFormsList={fetchFormsList}
          token={token}
          navigate={navigate}
          openDialog={openDialog}
          setTargetForm={setTargetForm}
          isFinal={params.row["is_final"]}
        />
      ),
    },
  ];
  const [formList, setFormList] = useState([]);
  const [formListOriginal, setFormListOriginal] = useState([]);
  const fetchFormsList = async () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFormListOriginal(res.data);
        const data = res.data.map((obj) => {
          return Object.entries(obj).reduce((acc, [key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) {
              acc = { ...acc, ...value };
            } else {
              acc[key] = value;
            }
            return acc;
          }, {});
        });
        setFormList(data);
      })
      .catch((e) => console.error(e));
  };
  useEffect(() => {
    fetchFormsList();
    fetchRegexList();
  }, []);

  useEffect(() => {
    fetchFormsList();
  }, [openDialog]);

  const fetchRegexList = async () => {
    await axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/regex", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRegexList(res.data);
      })
      .catch((e) => console.error(e));
  };

  const handleCreateForm = async () => {
    await axios
      .post(
        process.env.REACT_APP_ENDPOINT_URL + "/api/forms",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        fetchFormsList();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Template has been created.",
          confirmButtonColor: "#262626",
        });
      })
      .catch((e) => {
        console.log(e);
      });
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
            Form Templates
          </Typography>
          <Box>
            <Button
              variant="contained"
              sx={{ my: 2 }}
              color="action"
              onClick={handleCreateForm}
              startIcon={<AddIcon />}>
              Add New Template
            </Button>
          </Box>
        </Box>
        <Box sx={{ py: 2 }}>
          <DataGrid
            sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}
            rows={formList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            getRowId={(row) => row.id + row.revisionNo}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </Box>
      </Container>
      <Stack spacing={2} alignItems="center">
        <div style={{ height: 500, backgroundColor: "white" }}></div>
      </Stack>
    </Box>
  );
};
export default FormTemplates;
