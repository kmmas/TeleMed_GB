import { styled } from "@mui/system";
import { Box } from "@mui/material";

const SignupPageStyle = styled(Box)(({ theme }) => ({
    "& .loginTitle": {
    fontSize: theme.typography.pxToRem(30),
    fontWeight: "bold",
    paddingTop: theme.spacing(4),
    alignItems: "center",
    textAlign: "center",
    },
}));

export default SignupPageStyle;