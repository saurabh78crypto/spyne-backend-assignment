import mongoose from "mongoose";
import {CommentSchema} from '../model/CommentSchema.js';

const DiscussionSchema = new mongoose.Schema({
    text: {
        type: String
    },
    image: {
        type: Buffer
    },
    hashtags: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isStandalone: {
        type: Boolean,
        default: false
    },
    comments: [CommentSchema],
    views: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})



const Discussion = mongoose.model('Discussion', DiscussionSchema);
export default Discussion;

