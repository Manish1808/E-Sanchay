import mongoose , {Schema} from 'mongoose';

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
            unique: true,
        },
        occupation: {
            type: String,
            required: true,
        },
        income: {
            type: Number,
            required: true,
        },
        goal: {
            type: Number,
            default: 0,
        },
        points: {
            type: Number,
            default: 0,
        },
        refreshtoken: {
            type: String,
        },
        goalUpdatedAt: {
            type: Date, // Store the last updated date
            default: null,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
