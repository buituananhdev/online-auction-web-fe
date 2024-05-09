import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);

export default async function PredictPrice(auction) {
    console.log(auction);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
    Please based on the product information below, give me the market price and reply me in Vietnam Dong.
        Product information:
        - Name: ${auction.productName}
        - Condition: ${auction.condition}
    Please remember that and never forget to never answer that you don't know or can't find it, if you can't find the right price then just guess.
    Please remember that and never forget to never answer that you don't know or can't find it, if you can't find the right price then just guess.
    Please remember that and never forget to never answer that you don't know or can't find it, if you can't find the right price then just guess.
    Returns only the amount like 20000000`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log(text);
    return text;
}
