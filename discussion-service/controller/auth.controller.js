import  Discussion  from '../model/DiscussionSchema.js';
import { Comment } from '../model/CommentSchema.js';
import { Reply } from '../model/ReplySchema.js';

const createDiscussion = async (req, res) => {
    try {
        const {text, image,hashtags, isStandalone} = req.body;
        const {userId} = req.user;

        let initialIsStandalone = isStandalone || false;

        const discussion = new Discussion({
            text: text,
            image: image,
            hashtags: hashtags,
            userId: userId,
            isStandalone: initialIsStandalone
        });

        const savedDiscussion = await discussion.save();

        return res.json({
            statuscode: 201,
            message: 'Discussion Created Successfully!',
            discussion: savedDiscussion
        });
    } catch (error) {
        console.error(error);
        return res.status(500).res.josn({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}


const updateDiscussion = async (req, res) => {
    console.log('Hit update discussion');
    try {
        const {id} = req.params;
        const {text,image,hashtags} = req.body;
        
        const discussion = await Discussion.findById(id);
        if(!discussion){
            return res.status(404).json({
                message: 'Discussion not found'
            });
        }

        if (text) discussion.text = text;
        if (image) discussion.image = image;
        if (hashtags) discussion.hashtags = hashtags;
    
        const updatedDiscussion = await discussion.save();
    
        return res.json({
          statuscode: 200,
          message: "Discussion Updated Successfully!",
          discussion: updatedDiscussion,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
    });
    }
}

const deleteDiscusion = async (req, res) => {
    try {
        const { id } = req.params;

    const discussion = await Discussion.findByIdAndDelete(id);
    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    return res.json({
      statuscode: 200,
      message: "Discussion Deleted Successfully!",
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Internal Server Error",
          error: error.message,
        }); 
    }
}

const likeDiscussion = async (req, res) => {
    const {discussionid} = req.params;
    const {_id} = req.user;

    const discussion = await Discussion.findById(discussionid);
    if(!discussion) {
        return res.status(404).json({
            message: 'Discussion not found'
        })
    }

    const existingLike = discussion.likes.some((like) => like.equals(_id));
    if(existingLike){
        return res.status(400).json({
            message: 'You have already liked the discussion.'
        })
    }

    discussion.likes.push(_id);
    await discussion.save();

    return res.json({
        statuscode: 201,
        message: 'Liked discussion successfully'
    })
}

const unlikeDiscussion = async (req, res) => {
    const {discussionid} = req.params;
    const {_id} = req.user;

    const discussion = await Discussion.findById(discussionid);
    if(!discussion) {
        return res.status(404).json({
            message: 'Decision not found'
        })
    }

    const index = discussion.likes.findIndex((like) => like.equals(_id));
    if(index === -1){
        return res.status(400).json({
            message: 'You have not liked this discussion'
        })
    }

    discussion.likes.splice(index, 1);
    await discussion.save();

    return res.json({
        statuscode: 201,
        message: 'Unliked discussion successfully'
    })
}

const addComment = async (req, res) => {
    const {discussionId, userId, text} = req.body;

    const comment = new Comment({
        text: text,
        userId: userId,
        discussionId: discussionId,
        createdAt: new Date()
    });

    const savedComment = await comment.save();

    const discussion = await Discussion.findById(discussionId);

    if(!discussion){
        return res.status(404).json({
            statusCode: 404,
            message: 'Discussion not found.'
        });
    }

    discussion.comments.push(savedComment._id);

    await discussion.save();

    return res.json({
        statuscode: 201,
        message: 'Comment added successfully!',
        comment: savedComment
    })
}


const editComment = async (req, res) => {
    const {commentId} = req.params;
    const {_id} = req.user;
    const {text} = req.body;
    

    const comment = await Comment.findById(commentId);
    if(!comment){
        return res.status(404).json({
            message: 'Comment not found'
        })
    }

    console.log(comment.userId.toString());

    if(comment.userId.toString() !== _id) {
        return res.status(403).json({
            message: 'Not authorized to edit this comment'
        })
    }

    comment.text = text;
    await comment.save();

    return res.json({
        statuscode: 201,
        message: 'Comment edited successfully'
    })
}

const deleteComment = async (req, res) => {
    const {commentId} = req.params;
    const {_id} = req.user;

    const comment = await Comment.findById(commentId);
    if(!comment){
        return res.status(404).json({
            message: 'Comment not found'
        })
    }

    if(comment.userId.toString() !== _id) {
        return res.status(403).json({
            message: 'Not authorized to delete this comment'
        })
    }

    const discussions = await Discussion.find().exec();
 
    const discussionWithComment = discussions.find(discussion => 
        discussion.comments.some(comment => comment._id.equals(commentId))
    );
    
    if(!discussionWithComment){
        return res.status(404).json({
            message: 'Discussion not found'
        })
    }

    const commentIndex = discussionWithComment.comments.findIndex(c => c._id.equals(commentId));
    if(commentIndex === -1) {
        return res.status(404).json({
            message: 'Comment not found in discussion'
        });
    }

    discussionWithComment.comments.splice(commentIndex, 1);
    await discussionWithComment.save();

    await Comment.deleteOne({_id: commentId});

    return res.json({
        message: 'Comment deleted successfully'
    })
}

const likeComment = async (req, res) => {
    const { commentId } = req.params;
    const { _id } = req.user;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        const existingLike = comment.likes.some((like) => like.equals(_id));
        if(existingLike) {
            return res.status(400).json({
                message: 'You have already liked this comment.'
            });
        }

        comment.likes.push(_id);
        await comment.save();

        return res.json({
            statuscode: 201,
            message: 'Liked comment successfully.'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message 
        });
    }
}

const addReply = async (req, res) => {
    const { commentId } = req.params;
    const { _id } = req.user;
    const { text } = req.body;
    
    const reply = new Reply({
        text: text,
        userId: _id,
        commentId: commentId,
        createdAt: new Date()
    });

    const savedReply = await reply.save();

    const comment = await Comment.findById(commentId);
    if(!comment){
        return res.status(404).json({
            message: 'Comment not found'
        });
    }

    comment.replies.push(savedReply._id);
    await comment.save();

    return res.json({
        statuscode: 201,
        message: 'Reply added successfully',
        reply: savedReply
    });
}

const listDiscussionByTextOrTag = async (req, res) => {
    try {
        const { searchText, tag } = req.query;
        console.log('Search Text: ', searchText);
        console.log('Tag: ', tag);

        let query = {};

        if (searchText) {
          query.$or = [
            { text: { $regex: searchText, $options: 'i' } },
            { hashtags: { $in: [searchText] } },
          ];
        }

        if (tag) {
          query.hashtags = tag;
        }

        const discussions = await Discussion.find(query).sort({_id:-1}).limit(10); 
        console.log('Discussion: ', discussions);
        return res.json({
          statuscode: 200,
          message: "List of Discussions",
          discussions: discussions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Internal Server Error",
          error: error.message,
    });
    }
}

const getDiscussionById = async (req, res) => {
    const {id} = req.params;

    const discussion = await Discussion.findById(id).populate('userId');
    discussion.views += 1;
    const viewedDiscussion = await discussion.save();

    return res.json({
        discussion: viewedDiscussion
    })
}


export { createDiscussion, updateDiscussion, deleteDiscusion, likeDiscussion, unlikeDiscussion,
         addComment, editComment, deleteComment, likeComment, addReply, listDiscussionByTextOrTag,
         getDiscussionById
       }

