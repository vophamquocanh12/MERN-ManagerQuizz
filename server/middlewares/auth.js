const jwt = require('jsonwebtoken')

//xác thực người dùng
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
			.status(401)
			.json({success: false, message: 'Access token not found!'})
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		req.userId = decoded.userId
		req.role = decoded.role
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({success: false, message: 'Invalid token'})
	}
}

//kiểm tra quyền admin
const verifyAdmin = (req, res, next) => {
	if (req.role !== 'admin') {
		return res
			.status(403)
			.json({success: false, message: 'Access denied: Admins only'})
	}
	next()
}

//kiểm tra quyền user
const verifyUser = (req, res, next) => {
	if (req.role !== 'user') {
		return res
			.status(403)
			.json({success: false, message: 'Access denied: Users only'})
	}
	next()
}

module.exports = {verifyToken, verifyAdmin, verifyUser}