import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000",
//     withCredentials: true,
// })

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});


export const sendMessage = async ({ message, chat }) => {


    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chats/message`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                chat,
            }),
        }
    );

    return response;
};

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/${chatId}`);

    return response.data;
};

export const createChat = async (message) => {
    const response = await api.post("/api/chats/create", {
        message,
    });

    return response.data;
};

