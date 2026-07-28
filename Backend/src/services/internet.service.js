import { tavily as Tavily } from "@tavily/core";


const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
});


export const searchInternet = async ({ query }) => {

    try {

        if (!query) {
            return [];
        }


        const results = await tavily.search(query, {
            maxResults: 5,
        });


        return results.results.map(result => ({
            title: result.title,
            content: result.content,
        }));


    } catch (error) {

        console.error("Internet search error:", error);

        return [];

    }
};