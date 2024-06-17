import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(403).send('A token is required for authentication');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
};

export default authUser;

