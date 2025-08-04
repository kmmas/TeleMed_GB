import { axiosInstance } from "../API/axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setSnackbar } from "../Redux/snackBarSlice";

const useDelete = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Added 'data' parameter here
    const deleteItem = async (
        url,
        data,
        deleteCallback,
        successMessage = null,
        errorMessage,
        errorCallback = null,
        showSnackbar = true
    ) => {
        setLoading(true);
        // Pass 'data' as the second argument to axiosInstance.delete
        try {
            const response = await axiosInstance
                .delete(url, { data }) // axios.delete can accept a config object with a 'data' key for the request body
                ;
            setLoading(false);
            if (successMessage) {
                dispatch(
                    setSnackbar({
                        open: showSnackbar,
                        message: successMessage,
                        error: false,
                    })
                );
            }
            deleteCallback(response.data);
            return response.data;
        } catch (error) {
            dispatch(
                setSnackbar({
                    open: true,
                    message: errorMessage ||
                        error.response?.data?.message ||
                        "Internal Server Error!",
                    error: true,
                })
            );
            setLoading(false);
            if (errorCallback) {
                errorCallback(error);
            }
            return false;
        }
    };

    return { loading, deleteItem };
};

export default useDelete;
