// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//     try {
//         // 1. Safety check: Ensure cookies object exists
//         if (!req.cookies) {
//             return res.status(500).json({ 
//                 success: false, 
//                 message: "Internal Server Error: Cookie parser not initialized." 
//             });
//         }

//         // 2. Extract token
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: "Access Denied: Log in first." 
//             });
//         }

//         // 3. Verify Token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
//         // 4. Attach user data to request
//         // Ensure your Login/Register payload uses 'id' to match this
//         req.user = decoded; 
        
//         // 5. CRITICAL: Move to the next function
//         next(); 
        
//     } catch (error) {
//         // Handle specific JWT errors to be helpful
//         const message = error.name === 'TokenExpiredError' 
//             ? "Session expired. Please log in again." 
//             : "Invalid token. Access denied.";

//         return res.status(403).json({ 
//             success: false, 
//             message: message 
//         });
//     }
// };

// module.exports = { verifyToken };