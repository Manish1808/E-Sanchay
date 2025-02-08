import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Expenses } from "../models/expenses.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";


const updateGoal = AsyncHandler(async (req, res) => {
    res.send("helo")
});




// ✅ Create an expense
const createExpense = AsyncHandler(async (req, res) => {
    const { userId, title, amount, date } = req.body;

    if (!userId || !title || !amount) {
        throw new ApiError(400, "All fields are required");
    }

    const newExpense = await Expenses.create({ userId, title, amount, date });

    res.status(201).json({
        success: true,
        message: "Expense added successfully",
        expense: newExpense,
    });
});

// ✅ Fetch all expenses of a user
const getExpenses = AsyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const expenses = await Expenses.find({ userId }).sort({ date: -1 });

    res.status(200).json({
        success: true,
        expenses,
    });
});

// ✅ Update an expense
const updateExpense = AsyncHandler(async (req, res) => {
    const { expenseId } = req.params;
    const { title, amount, date } = req.body;

    const updatedExpense = await Expenses.findByIdAndUpdate(
        expenseId,
        { title, amount, date },
        { new: true, runValidators: true }
    );

    if (!updatedExpense) {
        throw new ApiError(404, "Expense not found");
    }

    res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        expense: updatedExpense,
    });
});

// ✅ Delete an expense
const deleteExpense = AsyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    const deletedExpense = await Expenses.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
        throw new ApiError(404, "Expense not found");
    }

    res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
    });
});


const summarizeExpenses = AsyncHandler(async (req, res) => {
    const { expenses } = req.body;

    if (!expenses || expenses.length === 0) {
        return res.status(400).json({ summary: "No expenses to summarize." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const formattedExpenses = expenses.map(exp => ({
        category: exp.category || "Uncategorized",
        amount: exp.amount,
        date: exp.date ? new Date(exp.date).toDateString() : "Unknown Date"
    }));

    const prompt = `
  **Smart Expense Analysis & Investment Guidance (₹ - Indian Rupees)**  

  Analyze the following expenses and provide insights on spending habits:  
  ${JSON.stringify(formattedExpenses, null, 2)}

  **Your Task:**  
  1. Categorize the expenses and identify areas of high or unnecessary spending.  
  2. Detect spending patterns, such as frequent purchases or high-cost habits.  
  3. Offer personalized suggestions to optimize spending and cut down on avoidable expenses.  
  4. Motivate the user to redirect savings into productive investments or financial goals.  
  5. Suggest beginner-friendly investment options in India (e.g., Mutual Funds, SIPs, Fixed Deposits, PPF, etc.).  

  **Tone:** Encouraging, insightful, and action-driven.  
  **Response Limit:** Keep it within 200 words for quick understanding.  
  **Final Goal:** Help the user make smarter financial decisions, reduce unnecessary expenses, and grow their wealth effectively in India!  
`;


    try {
        const chatSession = model.startChat();
        const result = await chatSession.sendMessage(prompt);

        if (!result || !result.response) {
            throw new ApiError(500, "Failed to generate response");
        }

        res.status(200).json(new ApiResponse(200, {
            message: result.response.text(),
        }, "Response generated successfully"));
    } catch (error) {
        throw new ApiError(500, "Error generating response");
    }
});

export {
    updateGoal,
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    summarizeExpenses
}