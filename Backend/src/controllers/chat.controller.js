import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";
export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;
        console.log("MESSAGE CHAT ID:", chatId);
        let documentId = null;

        let title = null, chat = null;

        if (!chatId) {
            title = await generateChatTitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title
            });
        }

        const currentChat = await chatModel.findById(
            chatId || chat._id
        );

        console.log("CURRENT CHAT:", currentChat);
        console.log("DOCUMENT ID:", currentChat?.documentId);

        documentId = currentChat?.documentId;

        await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user"
        });

        const messages = await messageModel.find({
            chat: chatId || chat._id
        });

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
        });

        const stream = await generateResponse(
            messages,
            documentId
        );

        let finalResponse = "";

        for await (const chunk of stream) {

            const [messageChunk, metadata] = chunk;

            console.log(
                "TYPE:",
                messageChunk.constructor.name
            );


            if (
                messageChunk.constructor.name === "ToolMessage"
            ) {
                continue;
            }


            const content = messageChunk.content;


            if (
                !content ||
                typeof content !== "string"
            ) {
                continue;
            }


            finalResponse += content;

            res.write(content);
        }
        await messageModel.create({
            chat: chatId || chat._id,
            content: finalResponse,
            role: "ai"
        });

        res.end();

    } catch (error) {
        console.error("Error in sendMessage:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }

        if (!res.writableEnded) {
            res.end();
        }
    }
}

export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}

export const createChat = async (req, res) => {
    try {
        const { message } = req.body;

        const title = await generateChatTitle(message);

        const chat = await chatModel.create({
            title,
            user: req.user.id,
        });

        console.log("CREATE CHAT");
        console.log(chat._id.toString());

        res.status(201).json({
            chatId: chat._id.toString(),
            title: chat.title,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};