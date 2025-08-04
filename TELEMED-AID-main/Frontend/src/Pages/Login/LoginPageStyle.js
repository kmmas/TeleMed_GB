import { styled } from "@mui/system";
import { Box } from "@mui/material";

const LoginPageStyles = styled(Box)(({ theme }) => ({
  "& .loginTitle": {
    fontSize: theme.typography.pxToRem(30),
    fontWeight: "bold",
    paddingTop: theme.spacing(4),
    alignItems: "center",
    textAlign: "center",
  },
}));

export default LoginPageStyles;
