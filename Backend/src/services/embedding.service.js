import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
    model: "mistral-embed",
    apiKey: process.env.MISTRAL_API_KEY,
});

export const createEmbeddings = async (chunks) => {
    const vectors = await embeddings.embedDocuments(
        chunks.map((chunk) => chunk.pageContent)
    );

    return vectors;
};