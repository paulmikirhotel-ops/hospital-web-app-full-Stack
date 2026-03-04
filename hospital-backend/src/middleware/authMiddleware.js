const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Login required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // We use req.user so that both .id and .role are available
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid session" });
    }
};

const isAdmin = (req, res, next) => {
    // This works because verifyToken ran first and set req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }
};

// You MUST export them like this
module.exports = { verifyToken, isAdmin };