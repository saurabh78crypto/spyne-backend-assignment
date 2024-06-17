import express from 'express';
import authUser from '../middleware/authUser.js'
import { signup, signin, updateUser, deleteUser, listUsers, searchUserByName, followUser } from '../controller/auth.controller.js';

const auth = express.Router();

auth.post('/users/reguser', signup);
auth.post('/users/login', signin);
auth.put('/users/update/:id', authUser,  updateUser);
auth.delete('/users/delete/:id', authUser, deleteUser);
auth.get('/users/listusers', listUsers);
auth.get('/users/search', searchUserByName);
auth.post('/users/follow/:userId', authUser, followUser);

export {auth}