import React from "react";
import { CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material/styles';

const LoadingComponent = ({
  size = "3em",
  thickness = 4,
  color = "primary",
  style = {},
  
}) => {
  const theme = useTheme();
  return <CircularProgress size={size || theme.spacing(15) } thickness={thickness} color={color} style={{...style}} />;
};

export default LoadingComponent;
