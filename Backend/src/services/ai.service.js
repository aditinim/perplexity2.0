import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";
import { retrieveRelevantChunks } from "./retriever.service.js";


const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
});


const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
);


const agent = createAgent({
    model: mistralModel,
    tools: [searchInternetTool],
});


export async function generateResponse(messages, documentId) {

    try {

        const lastUserMessage = messages[messages.length - 1];

        let context = "";

        // RAG retrieval
        if (documentId) {

            const contextChunks = await retrieveRelevantChunks(
                lastUserMessage.content,
                documentId
            );

            context = contextChunks
                .map(chunk => chunk.text)
                .join("\n\n");
        }


        const response = await agent.stream(
            {
                messages: [

                    new SystemMessage(`
You are Phoenix, a helpful and precise AI assistant.

${context ? `
The user has uploaded a document. Use the following context to answer questions related to that document:

--------------------
${context}
--------------------

Only use this context when it is relevant.
` : ""}

Rules:
- Give only the final answer to the user.
- Never show raw tool outputs.
- Never show JSON responses.
- Never expose metadata or internal information.
- When using internet search, use the results only as reference.
`),

                    ...(messages.map(msg => {

                        if (msg.role === "user") {
                            return new HumanMessage(msg.content);
                        }

                        if (msg.role === "ai") {
                            return new AIMessage(msg.content);
                        }

                        return null;

                    }).filter(Boolean))

                ]
            },
            {
                streamMode: "messages",
            }
        );


        return response;


    } catch (error) {

        console.error("AI Response Error:", error);
        throw error;

    }
}



export async function generateChatTitle(message) {

    try {

        const response = await mistralModel.invoke([
            new SystemMessage(`
You generate concise titles for chat conversations.

Rules:
- Generate only a 2-4 word title.
- Do not add explanations.
- Keep it relevant to the user's first message.
`),

            new HumanMessage(`
Generate a title for this conversation:

"${message}"
`)
        ]);


        return response.text || "New Chat";


    } catch (error) {

        console.error("Chat title generation error:", error);

        return "New Chat";

    }
}