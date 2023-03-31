import { useParams } from "react-router-dom";
import NavBar from "../components/SharedComponents/NavBar";
import { Box, Container, Stack } from "@mui/system";
import { InputLabel, TextField, Typography } from "@mui/material";
import { useAuthStore } from "../store";
import axios from "axios";
import { useEffect, useState } from "react";
import TextboxComponentV2 from "../components/Form/TextboxComponentV2";

const ViewForm = () => {
  const { id, revisionNo, workflowId } = useParams();
  const { role, token, accountId } = useAuthStore();
  const [formData, setFormData] = useState();
  const [regexMap, setRegexMap] = useState({});
  const [submittedResponse, setSubmittedResponse] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [fieldResponses, setFieldResponses] = useState({});

  useEffect(() => {
    fetchRegexMap();
    fetchForm();
    console.log("formy", formData);
  }, []);

  useEffect(() => {
    console.log(fieldResponses);
  }, [fieldResponses]);

  const fetchForm = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/forms/${id}/${revisionNo}/fields`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setFormData(res.data);
        console.log("hehehehehe", res.data);
        let temp = {};
        for (let i = 0; i < res.data.length; i++) {
          temp[res.data[i].id] = null;
        }
        setFieldResponses(temp);
      });
  };

  const fetchRegexMap = async () => {
    await axios
      .get(process.env.REACT_APP_ENDPOINT_URL + "/api/regex", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let temp = res.data.reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {});
        setRegexMap(temp);
        console.log("regexdata", regexMap);
      })
      .catch((e) => console.error(e));
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
            View Form
          </Typography>
        </Box>
        <Stack spacing={2} sx={{ my: 2 }}>
          {formData?.map((field, idx) => {
            return (
              <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2 }}>
                {field.fieldType == "TEXTBOX" ? (
                  <TextboxComponentV2
                    fieldData={field}
                    idx={idx}
                    regexMap={regexMap}
                    fieldResponses={fieldResponses}
                    setFieldResponses={setFieldResponses}
                  />
                ) : (
                  <RadioButtonComponent fieldData={field} />
                )}
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
};

const RadioButtonComponent = ({ fieldData }) => {
  console.log("hfiel data", fieldData);
};

export default ViewForm;
