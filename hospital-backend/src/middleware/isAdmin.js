// const isAdmin = (req, res, next) => {
//     // Check if req.user exists and then check the role property within it
//     if (!req.user || req.user.role !== 'admin') {
//         return res.status(403).send({ 
//             success: false, 
//             message: "Access denied. Admins only." 
//         });
//     }
//     next();
// };

// module.exports = {isAdmin};