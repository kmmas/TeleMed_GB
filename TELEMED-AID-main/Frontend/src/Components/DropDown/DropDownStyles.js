import { FormControl } from "@mui/material";
import { styled } from "@mui/system";

export const FormControlStyles = styled(FormControl)(
  ({theme}) => ({
    "& span.placeholderItem": {
      color: theme.palette.grey.medium
    }
  })
);