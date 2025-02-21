import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Goal } from "../models/goal.model.js";

const creategoal = AsyncHandler(async (req, res) => {
    const { title, targetAmount, targetDate ,userid } = req.body;
    if(!title || !targetAmount || !targetDate || !userid){
        throw new ApiError("Please fill in all fields", 400);
    }
    const goal = await Goal.create({
        title,
        targetAmount,
        targetDate,
        userId: userid
    });
    if (!goal) {
        throw new ApiError("Goal not created", 500);
    }
    res.status(201).json(new ApiResponse("Goal created successfully", goal));
});

const updategoal = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Goal id is required", 400);
    }

    const { collectedAmount } = req.body;

    const goal = await Goal.findById(id);
    if (!goal) {
        throw new ApiError("Goal not found", 404);
    }

    // Ensure collectedAmount doesn't exceed targetAmount
    const updatedCollectedAmount = collectedAmount > goal.targetAmount 
        ? goal.targetAmount 
        : collectedAmount;

    // Set completed based on collectedAmount
    const isCompleted = updatedCollectedAmount >= goal.targetAmount;

    const updatedGoal = await Goal.findByIdAndUpdate(
        id,
        { collectedAmount: updatedCollectedAmount, completed: isCompleted },
        { new: true }
    );

    res.json(new ApiResponse("Goal updated successfully", updatedGoal));
});


const deletegoal = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Goal id is required", 400);
    }
    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) {
        throw new ApiError("Goal not found", 404);
    }
    res.json(new ApiResponse("Goal deleted successfully"));
});

const getgoals = AsyncHandler(async (req, res) => {
    if (!req.body.userid) {
        throw new ApiError("User id is required", 400);
    }
    const goals = await Goal.find({ userId: req.body.userid});
    if (!goals) {
        throw new ApiError("Goals not found", 404);
    }
    res.json(new ApiResponse("Goals fetched successfully", goals));
});

export { 
    creategoal,
    updategoal,
    deletegoal,
    getgoals,
};
