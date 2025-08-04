import { useEffect, useState } from 'react';
import { axiosInstance } from "../API/axios";

const useFetch = (term, page = 1, size = 5, URL) => {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(URL, {
                    params: {
                        term,
                        page: page - 1,
                        size
                    }
                });

                setData(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            } catch (err) {
                setError(err);
                setData([]);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetch();
    }, [term, page, size]);

    return { data, totalPages, isLoading, error };
};

export default useFetch;
