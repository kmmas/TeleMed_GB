import CustomSnackbar from "../src/Components/Snackbar/Snackbar.jsx";
import { CssBaseline } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import AppRoutes from './AppRoutes/AppRoutes.jsx';
import themeCreator from "./Themes/themeCreator";

function App() {
  const theme = useTheme();

  const customTheme = themeCreator(theme);

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <div className="App">
        <AppRoutes />
      </div>
      <CustomSnackbar />
    </ThemeProvider>
  );
}

export default App;
