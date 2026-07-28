import axios from "axios";

export const uploadPdf = async (formData) => {
    const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};