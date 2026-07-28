import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { uploadPdf } from "../controllers/upload.controller.js";
import { retrieveRelevantChunks } from "../services/retriever.service.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post(
    "/",
    authUser,
    upload.single("pdf"),
    uploadPdf
);



router.get("/test-retrieve", async (req, res) => {
    try {
        const results = await retrieveRelevantChunks(
            "Which organ system controls all activities of our body?"
        );

        res.status(200).json({
            results
        });

    } catch (error) {
        console.error("Retrieval Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


export default router;