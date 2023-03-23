import NavBar from "../../components/SharedComponents/NavBar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";


const FormTemplates = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
function AuthorizedAccountsCell({ value }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleChipClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 const handleClose = () => {
   setAnchorEl(null);
 };
  const chips = value.map((account, index) => (
    <>
      {index < 2 ? (
        <Chip size="small" key={account.id} label={account.name} />
      ) : index === 3 ? (
        <Chip
          size="small"
          key={account.id}
          label={`${value.length - 3} more`}
          onClick={handleChipClick}
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        />
      ) : null}
    </>
  ));

  const dropdownItems = value.slice(3).map((account) => (
    <MenuItem  key={account.id}>
    {account.name}
    </MenuItem>
  ));

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{chips}</div>
      <div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
        >
          {dropdownItems}
        </Menu>
      </div>
    </div>
  );
}


const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "revisionNo", headerName: "Revision No.", width: 150 },
  { field: "name", headerName: "Name", width: 180 },
  {
    field: "authorizedAccounts",
    headerName: "Authorized Accounts",
    width: 260,
    renderCell: (params) => <AuthorizedAccountsCell value={params.value} />,
  },
  {
    field: "action",
    headerName: "Action",
    width: 300,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: (params) => {
      const onViewClick = (e) => {
        const currentRow = params.row;
        return alert(JSON.stringify(currentRow, null, 4));
      };

      const onDeleteClick = async (e) => {
        const targetForm = params.row;

        await axios
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
            console.log("deleted", res.data);
            fetchFormsList();
          })
          .catch((e) => {
            console.log(e);
          });
      };
      const onDuplicateClick = async (e) => {
        const targetForm = params.row;

        await axios
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
            console.log("deleted", res.data);
            fetchFormsList();
          })
          .catch((e) => {
            console.log(e);
          });
      };

      return (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={onViewClick}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={onDuplicateClick}
          >
            Duplicate
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onDeleteClick}
          >
            Delete
          </Button>
        </Stack>
      );
    },
  },
];
  const [formList, setFormList] = useState([
    // {
    //   id: 1,
    //   revisionNo: 2,
    //   name: "test",
    //   authorizedAccounts: [
    //     { id: 1, name: "test", email: "eee@fdfd.com" },
    //     { id: 2, name: "test1", email: "12@fdfd.com" },
    //     { id: 3, name: "test2", email: "43@fdfd.com" },
    //     { id: 3, name: "test2", email: "43@fdfd.com" },
    //     { id: 3, name: "test2", email: "43@fdfd.com" },
    //     { id: 3, name: "test2", email: "43@fdfd.com" },
    //     { id: 3, name: "test2", email: "43@fdfd.com" },
    //     { id: 3, name: "test2", email: "43@fdfd.com" },
    //   ],
    // },
  ]);
  const [formListOriginal, setFormListOriginal] = useState([]);
  const fetchFormsList = async () => {
    axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/forms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFormListOriginal(res.data)

        const data = res.data.map((obj) => {
          return Object.entries(obj).reduce((acc, [key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) {
              // If the value is an object, spread its properties into the accumulator
              acc = { ...acc, ...value };
            } else {
              // Otherwise, add the property to the accumulator as is
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
  }, []);

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
        // Create form  successful
        console.log("success", res.data);
        navigate("/FormCreation/" + res.data.id + "/" + res.data.revisionNo);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <NavBar />
      <h1 style={{ textAlign: "center" }}>Form Templates</h1>

      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2} >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleCreateForm}
          >
            Create New
          </Button>

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
            autoHeight
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      </Stack>
    </>
  );
};
export default FormTemplates;
