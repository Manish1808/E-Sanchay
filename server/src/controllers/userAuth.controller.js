import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const registerUser = AsyncHandler(async (req, res) => {
    const { fullname, password, mobile, income, occupation } = req.body;
    const fields = { fullname, password, mobile, income, occupation };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            throw new ApiError(400, `${key} is required`);
        }
    }
    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
        console.log("User already exists");
        throw new ApiError(400, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullname,
        mobile,
        password: hashedPassword,
        income,
        occupation
    });

    await user.save();

    const createdUser = await User.findOne({ mobile }).select("-password -refreshtoken");


    if (!createdUser) {
        console.log("User not created");
        throw new ApiError(500, "Internal Server Error");
    }

    console.log(`User: ${user._id} created successfully`);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: createdUser
    });
});

const loginUser = AsyncHandler(async (req, res) => {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
        throw new ApiError(400, "All fields are mandatory");
    }
    const existingUser = await User.findOne({ mobile });
    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    const user = await User.findById(existingUser._id).select("-password -refreshtoken");
    if (!user) {
        throw new ApiError(500, "Internal Server Error");
    }
    console.log(`User: ${user._id} logged in successfully`);
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user
    });
});


const updatepoints = AsyncHandler(async (req, res) => {
    const { points, userid } = req.body;

    if (points === undefined || userid === undefined) {
        throw new ApiError(400, "All fields are mandatory");
    }

    if (isNaN(points)) {
        throw new ApiError(400, "Points must be a number");
    }

    const existingUser = await User.findById(userid);
    
    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    // Correct points update logic
    existingUser.points += points;

    await existingUser.save();

    console.log(`User: ${existingUser._id} points updated successfully`);

    res.status(200).json({
        success: true,
        message: "User points updated successfully",
        data: existingUser
    });
});




export {
    registerUser,
    loginUser,
    updatepoints
}