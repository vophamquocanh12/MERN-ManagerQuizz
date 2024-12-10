const {Account} = require('../models/models')
const mongoose = require('mongoose')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const AccountController = {
	// ĐĂNG KÝ
	register: async (req, res) => {
		const {nickname, username, password, email, role} = req.body
		if (!username || !email || !password)
			return res
				.status(400)
				.json({success: false, message: 'Missing required fields'})
		try {
			// kiểm tra username hoặc email tồn tại
			const existingUser = await Account.findOne({
				$or: [{username}, {email}],
			})
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: 'Username or email already exists',
				})
			}

			// mã hóa mật khẩu
			const hashedPassword = await argon2.hash(password)

			// Xác định role (default 'user' nếu không có role)
			const userRole = role === 'admin' ? 'admin' : 'user'

			// tạo tài khoản mới
			const newAccount = new Account({
				nickname,
				username,
				email,
				password: hashedPassword,
				role: userRole,
			})
			await newAccount.save()
			return res.json({
				success: true,
				message: 'Account created successfully',
			})
		} catch (error) {
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	//ĐĂNG NHẬP
	login: async (req, res) => {
		const {username, password} = req.body
		if (!username || !password)
			return res
				.status(400)
				.json({success: false, message: 'Missing required fields'})

		try {
			// tìm tài khoản theo username
			const account = await Account.findOne({username})
			if (!account) {
				return res
					.status(404)
					.json({success: false, message: 'User not found'})
			}

			// kiểm tra mật khẩu
			const passwordValid = await argon2.verify(
				account.password,
				password
			)
			if (!passwordValid) {
				return res
					.status(400)
					.json({success: false, message: 'Incorrect password'})
			}

			// tạo access token
			const accessToken = jwt.sign(
				{userId: account._id, role: account.role},
				process.env.ACCESS_TOKEN_SECRET,
				{expiresIn: '1h'}
			)

			return res.status(200).json({
				success: true,
				message: 'Logged in successfully',
				accessToken,
			})
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// TÌM TÀI KHOẢN KHÁC
	searchAccountUsers: async (req, res) => {
		const {q} = req.query
		if (!q || q.trim() === '') {
			return res.status(400).json({
				success: false,
				message: 'Query parameter is missing or empty',
			})
		}

		try {
			const accounts = await Account.find({
				$or: [
					{username: {$regex: q, $options: 'i'}},
					{nickname: {$regex: q, $options: 'i'}},
				],
			})
			return res.json({success: true, accounts})
		} catch (error) {
			return res
				.status(500)
				.json({success: false, message: 'Internal server error'})
		}
	},
	// LẤY DANH SÁCH TÀI KHOẢN USER (chỉ Admin)
	getAllUsers: async (req, res) => {
		try {
			const accounts = await Account.find({
				role: 'user',
			}).select('-password') // không trả về mật khẩu
			return res.status(200).json({success: true, accounts})
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// CHỈNH SỬA TÀI KHOẢN ROLE USER
	updateUser: async (req, res) => {
		if (req.role !== 'admin')
			return res
				.status(403)
				.json({success: false, message: 'Permission denied'})

		const {userId, updateData} = req.body

		try {
			const user = await Account.findOne({_id: userId, role: 'user'})
			if (!user)
				return res
					.status(404)
					.json({success: false, message: 'User not found'})

			// Cập nhật thông tin tài khoản (trừ password và role)
			const fieldsToUpdate = {...updateData}
			delete fieldsToUpdate.password
			delete fieldsToUpdate.role

			Object.assign(user, fieldsToUpdate)
			user.updatedAt = Date.now()

			await user.save()
			return res.json({
				success: true,
				message: 'User updated successfully',
				user,
			})
		} catch (error) {
			console.log(error)
			return res
				.status(500)
				.json({success: false, message: 'Internal server error'})
		}
	},
	//XÓA USER
	deleteUser: async (req, res) => {
		const userId = req.params.id // ID của user cần xóa

		// Kiểm tra ID hợp lệ
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res
				.status(400)
				.json({success: false, message: 'Invalid user ID!'})
		}

		try {
			// Kiểm tra quyền Admin
			if (req.role !== 'admin') {
				return res.status(403).json({
					success: false,
					message:
						'Permission denied. Only admin can delete accounts.',
				})
			}

			// Xóa ID người dùng khỏi danh sách bạn bè của người khác
			await Account.updateMany(
				{friends: userId}, // Điều kiện: danh sách bạn có userId
				{$pull: {friends: userId}} // Xóa userId khỏi danh sách friends
			)

			// Tìm và xóa tài khoản
			const deletedUser = await Account.findByIdAndDelete(userId)

			if (!deletedUser) {
				return res
					.status(404)
					.json({success: false, message: 'User not found!'})
			}

			return res.status(200).json({
				success: true,
				message: 'User deleted successfully!',
				deletedUser,
			})
		} catch (error) {
			console.error(error)
			return res
				.status(500)
				.json({success: false, message: 'Internal server error!'})
		}
	},
}

module.exports = AccountController