import { Router } from 'express';
import { sendMessage, getChats, getMessages, deleteChat, createChat } from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const chatRouter = Router();


chatRouter.post("/message", authUser, sendMessage)

chatRouter.get("/", authUser, getChats)

chatRouter.get("/:chatId/messages", authUser, getMessages)
chatRouter.post("/create", authUser, createChat);

chatRouter.delete("/:chatId", authUser, deleteChat)

export default chatRouter;