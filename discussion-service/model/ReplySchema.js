import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
    text: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    createdAt: {
        type: Date
    }
});


const Reply = mongoose.model('Reply', ReplySchema);
export {ReplySchema, Reply};

