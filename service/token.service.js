const jwt = require('jsonwebtoken');
const db = require('../db').pool;

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
			expiresIn: '15m',
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
			expiresIn: '14d',
		});
		return {
			accessToken,
			refreshToken,
		};
	}

	validateAccessToken(accessToken) {
		try {
			const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
			return userData;
		} catch (error) {
			return null;
		}
	}

	validateRefreshToken(refreshToken) {
		try {
			const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
			return userData;
		} catch (error) {
			return null;
		}
	}

	async saveToken(userId, refreshToken) {
		try {
			await db.query(`UPDATE users SET token = $1 WHERE id = $2`, [
				refreshToken,
				userId,
			]);
		} catch (error) {
			console.log(error);
		}
	}

	async findToken(refreshToken) {
		try {
			const userData = await db.query(
				`SELECT * FROM users WHERE token = $1`[refreshToken]
			);
			const tokenFromDb = userData.rows[0].token;
			return tokenFromDb;
		} catch (error) {
			console.log(error);
		}
	}
}
module.exports = new TokenService();
