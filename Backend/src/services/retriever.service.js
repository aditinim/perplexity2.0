import { Pinecone } from "@pinecone-database/pinecone";
import { MistralAIEmbeddings } from "@langchain/mistralai";


const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});


const embeddings = new MistralAIEmbeddings({
    model: "mistral-embed",
    apiKey: process.env.MISTRAL_API_KEY,
});


export const retrieveRelevantChunks = async (query, documentId) => {

    if (!documentId) {
        return [];
    }

    try {

        const index = pinecone.Index(
            process.env.PINECONE_INDEX_NAME
        );

        const queryVector = await embeddings.embedQuery(query);

        const result = await index.query({
            vector: queryVector,
            topK: 5,
            includeMetadata: true,
            filter: {
                documentId,
            },
        });

        return result.matches.map(match => ({
            text: match.metadata.text,
            score: match.score,
            source: match.metadata.source,
        }));

    } catch (error) {
        console.error("Retriever error:", error);
        throw error;
    }
};