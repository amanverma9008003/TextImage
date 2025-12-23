import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    // support token in custom header `token` or standard `Authorization: Bearer <token>`
    const token = req.headers.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        // console.log('Token is missing');
        return res.status(401).json({ success: false, message: 'Token is missing!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // token payload might contain _id, id, or userId depending on how it was signed
        const userId = decoded._id || decoded.id || decoded.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Invalid token! login again' });
        }
        // attach to req (don't mutate req.body which may be undefined for GET requests)
        req.userId = userId;

        next();
    } catch (error) {
        //console.log(error.message, 'authentication error');
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default userAuth;