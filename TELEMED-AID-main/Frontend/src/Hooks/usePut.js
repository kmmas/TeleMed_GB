import { axiosInstance } from "../API/axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setSnackbar } from "../Redux/snackBarSlice";

const usePut = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const putItem = async (
        url,
        item,
        postCallback = () => {}, // Default to an empty function
        successMessage = null,
        errorMessage = "Internal Server Error!", // Default error message
        errorCallback = () => {}, // Default to an empty function
        showSnackbar = true
    ) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(url, item);
            setLoading(false); // Set loading to false on success

            if (showSnackbar && successMessage) {
                // Check both showSnackbar and successMessage
                dispatch(
                    setSnackbar({
                        open: true,
                        message: successMessage,
                        error: false,
                    })
                );
            }
            postCallback(response.data, item); // Pass both response data and original item
            return response.data;
        } catch (error) {
            setLoading(false); // Set loading to false on error

            if (showSnackbar) {
                dispatch(
                    setSnackbar({
                        open: true,
                        message: errorMessage || error.response?.data?.message,
                        error: true,
                    })
                );
            }
            errorCallback(error);
            return null; // Return null on error for consistency with useGet
        }
    };

    return { loading, putItem };
};

export default usePut;
