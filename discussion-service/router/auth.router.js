import express from 'express';
import  authUser  from '../middleware/authUser.js';

import { createDiscussion, updateDiscussion, likeDiscussion, unlikeDiscussion, addComment, editComment,
         deleteComment, likeComment, addReply, deleteDiscusion, listDiscussionByTextOrTag, 
         getDiscussionById
       } from '../controller/auth.controller.js';


const auth = express.Router();


auth.post('/discussions', authUser, createDiscussion);
auth.put('/discussion/:id', authUser,  updateDiscussion);
auth.post('/discussion/like/:discussionid', authUser, likeDiscussion);
auth.post('/discussion/unlike/:discussionid', authUser, unlikeDiscussion);
auth.post('/discussion/comment', authUser, addComment);
auth.patch('/discussion/edit-comment/:commentId', authUser, editComment);
auth.delete('/discussion/delete-comment/:commentId', authUser, deleteComment);
auth.post('/discussion/like-comments/:commentId', authUser, likeComment);
auth.post('/discussion/reply-comments/:commentId', authUser, addReply);
auth.delete('/discussion/delete/:id', authUser, deleteDiscusion);


auth.get('/discussions/search', listDiscussionByTextOrTag);

auth.get('/discussion/:id', getDiscussionById);



export {auth}
