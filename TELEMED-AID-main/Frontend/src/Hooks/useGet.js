import { useDispatch } from "react-redux";
import { useState } from "react";
import { axiosInstance } from "../API/axios";
import { setSnackbar } from "../Redux/snackBarSlice";

const useGet = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getItem = async (
    URL,
    snackbar = true,
    postCallback = () => {},
    errorCallback = () => {},
    successMessage = null,
    errorMessage = "Internal Server Error!"
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(URL);
      if (snackbar) {
        dispatch(
          setSnackbar({
            open: true,
            message: successMessage,
            error: false,
          })
        );
      }
      postCallback(response.data);
      return response.data;
    } catch (error) {
      if (snackbar) {
        dispatch(
          setSnackbar({
            open: true,
            message: errorMessage || error.response?.data?.message,
            error: true,
          })
        );
      }
      errorCallback(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, getItem };
};

export default useGet;
