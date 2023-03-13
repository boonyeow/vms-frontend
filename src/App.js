import AppRoutes from "./Routes";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./swal2.css";
import { GlobalStyles } from "@mui/material";

//https://react-icons.github.io/react-icons - icon docs

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: "#e7ebf0",
            fontFamily: "Roboto",
          },
        }}
      />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
