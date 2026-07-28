import { initializeSocketConnection } from "../service/chat.socket";
import {
    createChat,
    sendMessage,
    getChats,
    getMessages,
    deleteChat,
} from "../service/chat.api";
import {
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    createNewChat,
    addNewMessage,
    addMessages,
    removeChat,
    startAiMessage,
    appendAiMessage,
} from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true));

            let currentChatId = chatId;

            console.log("Sending message...", { message, currentChatId });

            // Create a new chat if one doesn't exist
            if (!currentChatId) {
                const data = await createChat(message);

                console.log("Created chat:", data);

                currentChatId = data.chatId;

                dispatch(
                    createNewChat({
                        chatId: data.chatId,
                        title: data.title,
                    })
                );

                dispatch(setCurrentChatId(data.chatId));
            }

            // Add the user's message immediately
            dispatch(
                addNewMessage({
                    chatId: currentChatId,
                    content: message,
                    role: "user",
                })
            );

            // Create an empty AI message
            dispatch(
                startAiMessage({
                    chatId: currentChatId,
                })
            );

            console.log("Sending using chatId:", currentChatId);

            // Start streaming
            const response = await sendMessage({
                message,
                chat: currentChatId,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            if (!response.body) {
                throw new Error("Response body is null");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let aiResponse = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                aiResponse += chunk;

                dispatch(
                    appendAiMessage({
                        chatId: currentChatId,
                        chunk,
                    })
                );
            }

            console.log("Final AI Response:", aiResponse);

        } catch (error) {
            console.error("handleSendMessage Error:", error);
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                documentId: chat.documentId,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[chatId]?.messages.length)

        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    async function handleDeleteChat(chatId) {
        try {
            dispatch(setLoading(true));

            const data = await deleteChat(chatId);

            console.log(data);
            dispatch(removeChat(chatId));
            console.log("Chat deleted:", chatId);

        } catch (error) {
            console.error("handleDeleteChat Error:", error);
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat,
    }

}