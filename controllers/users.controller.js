const userService = require('../service/user.service');
const { validationResult } = require('express-validator');

class UserController {
	async createUser(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json(errors);
			}
			const { first_name, last_name, email, phone, password } = req.body;
			const userData = await userService.createUser(
				first_name,
				last_name,
				email,
				phone,
				password
			);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 2592000000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (error) {
			console.log(error);
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await userService.login(email, password);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 2592000000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (error) {
			console.log(error);
		}
	}

	async getUser(req, res, next) {
		try {
			const id = req.params.id;
			const userData = await userService.getUser(id);
			return res.json(userData);
		} catch (error) {
			console.log(error);
		}
	}

	async updateUser(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json(errors);
			}
			const id = req.params.id;
			const userData = req.body;
			const updatedUserData = await userService.updateUser(id, userData);
			return res.json(updatedUserData);
		} catch (error) {
			console.log(error);
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookie;
			const userData = await userService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 2592000000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = new UserController();
