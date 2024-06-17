import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    discussionId: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ],
})



const Comment = mongoose.model('Comment', CommentSchema);

export {CommentSchema, Comment}

