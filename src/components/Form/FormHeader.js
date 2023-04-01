import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const FormHeader = ({ formDetails }) => {
  return (
    <Box>
      <Typography
        component="h1"
        variant="h4"
        fontWeight="bold"
        sx={{ color: "action.main", alignSelf: "center" }}>
        {formDetails.name}
      </Typography>
      <Typography>{formDetails.description}</Typography>
    </Box>
  );
};

export default FormHeader;
