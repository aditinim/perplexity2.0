import { processPdf } from "../services/pdf.service.js";
import { storeEmbeddings } from "../services/pinecone.service.js";
import { randomUUID } from "crypto";
import chatModel from "../models/chat.model.js";



export const uploadPdf = async (req, res) => {
    try {

        const file = req.file;
        const { chatId } = req.body;


        console.log("Uploaded File:", file?.originalname);
        console.log("Chat ID:", chatId);
        console.log("User ID:", req.user.id);



        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No PDF uploaded",
            });
        }


        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }



        const documentId = randomUUID();

        console.log("Generated Document ID:", documentId);



        // 1. Extract PDF and create chunks
        const chunks = await processPdf(file.buffer);

        console.log("Total Chunks:", chunks.length);



        // 2. Store embeddings in Pinecone
        await storeEmbeddings(chunks, documentId);

        console.log("Embeddings stored successfully");



        // 3. Attach documentId to chat
        const updatedChat = await chatModel.findOneAndUpdate(
            {
                _id: chatId,
                user: req.user.id
            },
            {
                document: {
                    id: documentId,
                    name: file.originalname,
                    size: file.size,
                    uploadedAt: new Date()
                }
            },
            {
                new: true
            }
        );



        if (!updatedChat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }


        console.log(
            "Chat updated with document:",
            updatedChat.document
        );



        return res.status(200).json({

            success: true,

            message: "PDF stored successfully",

            document: {
                id: documentId,
                name: file.originalname,
                size: file.size
            }

        });



    } catch (error) {

        console.error(
            "Upload Controller Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};