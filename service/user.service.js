const db = require('../db').pool;
const bcrypt = require('bcrypt');
const tokenService = require('./token.service');
const UserDto = require('../dtos/user.dto');

class UserService {
	async createUser(first_name, last_name, email, phone, password) {
		const applicant = await db.query(`SELECT * FROM users WHERE email = $1`, [
			email,
		]);
		if (applicant.rows[0]) {
			return { error: 'email alredy used' };
		}
		const hashPassword = await bcrypt.hash(password, 4);
		const response = await db.query(
			`INSERT INTO users (first_name, last_name, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
			[first_name, last_name || '', email, phone || '', hashPassword]
		);
		const user = response.rows[0];
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({ ...UserDto });
		await tokenService.saveToken(user.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}

	async login(email, password) {
		const response = await db.query(
			`SELECT * FROM users WHERE email = '${email}'`
		);
		const user = response.rows[0];
		if (!user) {
			return { error: 'email not found' };
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) {
			return { error: 'wrong password' };
		}

		const userDto = new UserDto(user);

		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(user.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}

	async getUser(id) {
		const response = await db.query(`SELECT * FROM users WHERE id = ${id}`);
		const user = response.rows[0];
		if (!user) {
			return { error: 'id not found' };
		}
		const userDto = new UserDto(user);
		return { user: userDto };
	}

	async updateUser(id, userData) {
		const response = await db.query(`SELECT * FROM users WHERE id = ${id}`);
		const user = response.rows[0];
		if (!user) {
			return { error: 'wrong id' };
		}

		const hashPassword = await bcrypt.hash(userData.password, 4);
		const res = await db.query(
			`UPDATE users SET first_name = '${userData.first_name}', last_name = '${userData.last_name}', phone = '${userData.phone}', password = '${hashPassword}' WHERE id = ${id} RETURNING *`
		);
		const updateUser = res.rows[0];
		const userDto = new UserDto(updateUser);
		return { user: userDto };
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			return { error: 'not authorized' };
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDb) {
			return { error: 'not authorized' };
		}
		const user = await db.query(
			`SELECT * FROM users WHERE id = ${userData.id}`
		);
		const userDto = new UserDto(user);

		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(user.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}
}
module.exports = new UserService();
