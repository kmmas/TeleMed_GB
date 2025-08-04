import React, { useState, useEffect, useRef } from "react";
import { Snackbar, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../../Redux/snackBarSlice";

export default function CustomSnackbar() {
  const [timer, setTimer] = useState(3000);
  const currentState = useSelector((state) => state.snackBar);
  const dispatch = useDispatch();
  const prevStRef = useRef({ open: false});

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbar({ open: false, message: "", error: false }));
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    if (prevStRef.current.open) {
      setTimer(5000);
    } else {
      setTimer(3000);
    }
    prevStRef.current = currentState;
  }, [currentState]);

  return (
    <Snackbar
      open={currentState.open}
      autoHideDuration={timer}
      onClose={handleClose}
      severity="error"
      action={action}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert onClose={handleClose} severity={currentState.error ? "error" : "success"}>
        {currentState.message}
      </Alert>
    </Snackbar>
  );
}
