import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            default: "New Chat",
            trim: true,
        },

        document: {
            id: {
                type: String,
                default: null,
            },

            name: {
                type: String,
                default: null,
            },

            size: {
                type: Number,
                default: null,
            },

            uploadedAt: {
                type: Date,
                default: null,
            }
        },
    },
    {
        timestamps: true,
    }
);


const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;