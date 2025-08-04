import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  error: false,
};

export const snackBarSlice = createSlice({
  name: "snackBar",
  initialState,
  reducers: {
    setSnackbar: (state, action) => {
      state.open = action.payload.open;
      state.message = action.payload.message;
      state.error = action.payload.error;
    },
  },
});

export const { setSnackbar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
