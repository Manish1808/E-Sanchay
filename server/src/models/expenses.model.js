import mongoose , {Schema} from 'mongoose';

const expensesSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true}
);

export const Expenses = mongoose.model("Expenses",expensesSchema);