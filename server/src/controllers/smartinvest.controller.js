import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const invest = AsyncHandler(async (req, res) => {
    const { income,riskLevel,language} = req.body;
    console.log("investment running...")
    if (!income || isNaN(income) || income <= 0) {
        throw new ApiError(400, "Please enter a valid monthly income");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    try {
        let prompt = `I have a monthly income of $${income} and I am looking for investment advice. I am willing to take a ${riskLevel} risk. use 60-20-20 rule for dividing the money for needs,necessities,savings and 50 30 20 rule for investing savings answer in points and answer in ${language} language no preamble`;
        const chatSession = model.startChat({ generationConfig });
        const result = await chatSession.sendMessage(prompt);

        if (!result || !result.response) {
            throw new ApiError(500, "Failed to generate response");
        }

        res.status(200).json(new ApiResponse(200, {
            message: result.response.text(),
        }, "Response generated successfully"));
    } catch (error) {
        throw new ApiError(500, "Error generating response "+error);
    }
});

export {
    invest
}