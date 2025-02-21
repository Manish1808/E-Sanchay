import mongoose , {Schema} from 'mongoose';

const goalSchema = new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
        },
        title:{
            type:String,
            required:true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        targetAmount:{
            type:Number,
            required:true,
        },
        collectedAmount:{
            type:Number,
            default:0,
        },
        targetDate:{
            type:Date,
            required:true,
        },
        completed:{
            type:Boolean,
            default:false,
        },

    },
    {timestamps: true   }

);

export const Goal = mongoose.model("Goal", goalSchema);