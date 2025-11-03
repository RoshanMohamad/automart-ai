const protect = (req, res, next) => {
    
    const {user} = req.session;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
    }
    req.user = user;
    next();
};

exports.protect = protect;