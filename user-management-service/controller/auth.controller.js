import bcrypt from 'bcrypt';
import User from '../model/UserSchema.js'

const signup = async (req, res) => {
    try {
        const { name, mobileNo, email, password, cpassword } = req.body;

        const userExist = await User.findOne({ email: email });
        
        if(userExist){
           return res.status(409).json({
                message: `User Already Registered!`
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        let hashedCPassword = await bcrypt.hash(cpassword, 10);

        const data = new User({
            name: name,
            mobileNo: mobileNo,
            email: email,
            password: hashedPassword,
            cpassword: hashedCPassword
        })

        const savedUser = await data.save();
        
        return res.json({
            statuscode: 200,
            message: 'Hurray, User Registered Successfully!',
            user: savedUser
        });
    } catch (error) {
        console.error(error);
        return res.json({
            statuscode: 500,
            error: error.message
        })
    }
}


const signin = async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;
       
        const userLogin = await User.findOne({ email: email });
        if(!userLogin){
            return res.status(422).json({
                message: 'User Not Registered.'
            });
        }

        const passwordMatch = await bcrypt.compare(password, userLogin.password);
        if(!passwordMatch){
            return res.status(401).json({
                message: 'Invalid Credentials, Please try again.'
            })
        }
        
        token = await userLogin.generateAuthToken();

        return res.status(200).json({
            message: 'Logged In Successfully!',
            token: token
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, mobileNo, email, password } = req.body;
     

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Validate email uniqueness if being updated
        if (email && (await User.findOne({ email: email }))._id.toString()!== id) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        // Update user details
        if (name) user.name = name;
        if (mobileNo) user.mobileNo = mobileNo;
        if (email) user.email = email;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        
        const updatedUser = await user.save();
        return res.json({
            statuscode: 200,
            message: "User Updated Successfully!",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const posts = await Discussion.find({ _userId: id});

        if(posts.length > 0) {
            await Discussion.deleteMany({_userId: id});
        }

        const result = await User.deleteOne({ _id: id });
        if (!result.deletedCount) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.json({
            statuscode: 200,
            message: "User Deleted Successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


const listUsers = async (req, res) => {
    try {
        const users = await User.find().sort({_id:-1}).limit(10); 

        return res.json({
            statuscode: 200,
            message: "List of Users",
            users: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const searchUserByName = async (req, res) => {
    try {
        const { name } = req.query; 
        console.log('Name: ', name);

        if (!name) {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        // Fetch all users from the database
        const users = await User.find({}).exec();

        // Perform a case-insensitive search for users with names that include the provided name
        const filteredUsers = users.filter(user => new RegExp(name, "i").test(user.name));

        if (filteredUsers.length === 0) {
            return res.status(404).json({
                message: "No users found with that name.",
            });
        }

        return res.json({
            statuscode: 200,
            message: "Search Results",
            users: filteredUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const followUser = async (req, res) => {
    const {userId} = req.params;
    const {followerId} = req.body;

    try {
        const user = await User.findById(userId);
        const follower = await User.findById(followerId);

        if(!user || !follower) {
            return res.status(404).json({
                message: 'User of follower not found'
            });
        }

        if(user.following.includes(followerId)) {
            return res.json({
                message: 'Already following.'
            });
        }

        user.followers.push(followerId);

        follower.following.push(userId);

        await user.save();
        await follower.save();

        return res.json({
            statusCode: 201,
            message: 'Followed Successfully!'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}




export { signup, signin, updateUser, deleteUser, listUsers, searchUserByName, followUser }
