import {axiosInstance} from "../API/axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setSnackbar } from "../Redux/snackBarSlice";

const usePost = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const postItem = (url, item, postCallback, successMessage = null , errorMessage,errorCallback = null, showSnackbar = true, method = "post") => {
        setLoading(true);
        return axiosInstance[method.toLowerCase()](url, item)
            .then((response) => {
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
                postCallback(response.data, item);
                return response.data;
            })
            .catch((error) => {
                dispatch(
                    setSnackbar({
                        open: true,
                        message: errorMessage || error.response?.data?.message  || "Internal Server Error!",
                        error: true,
                    })
                );
                setLoading(false);
                if (errorCallback) {
                    errorCallback(error);
                }
                return false;
            });
    };

    return { loading, postItem };
};

export default usePost;
