import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
    },
    mobileNo: {
        type: 'string',
        unique: true,
        required: true,
    },
    email: {
        type: 'string',
        unique: true,
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    tokens: [
        {
            token: {
                type: 'string',
                required: true,
            }
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});


// Generating Tokens
UserSchema.methods.generateAuthToken = async function () {
    const {JWT_SECRET_KEY} = process.env; 
    try {
        let token = jwt.sign({_id:this._id}, JWT_SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        this.tokens.push({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('USER', UserSchema);
export default User;

