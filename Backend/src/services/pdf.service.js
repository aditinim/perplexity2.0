import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Blob } from "buffer";


export const processPdf = async (fileBuffer) => {

    const blob = new Blob([fileBuffer], {
        type: "application/pdf",
    });

    const loader = new PDFLoader(blob);

    const documents = await loader.load();


    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });


    const chunks = await splitter.splitDocuments(documents);


    return chunks;
};