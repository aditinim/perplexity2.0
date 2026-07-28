import { Pinecone } from "@pinecone-database/pinecone";
import { MistralAIEmbeddings } from "@langchain/mistralai";


const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});


const embeddings = new MistralAIEmbeddings({
    model: "mistral-embed",
    apiKey: process.env.MISTRAL_API_KEY,
});


export const storeEmbeddings = async (chunks, documentId) => {
    try {

        const index = pinecone.Index(
            process.env.PINECONE_INDEX_NAME
        );


        const vectors = await embeddings.embedDocuments(
            chunks.map(chunk => chunk.pageContent)
        );


        const records = chunks.map((chunk, index) => ({
            id: `${documentId}-chunk-${index}`,
            values: vectors[index],
            metadata: {
                text: chunk.pageContent,
                source: chunk.metadata.source || "",
                documentId,
            },
        }));


        await index.upsert(records);


        console.log("Stored records:", records.length);


        return true;

    } catch (error) {

        console.error("Pinecone storage error:", error);

        throw error;

    }
};