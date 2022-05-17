const tokenService = require('../service/token.service');

module.exports = function (req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.json({ error: 'not authorized' });
		}

		const accessToken = authHeader.split(' ')[1];
		if (!accessToken) {
			return res.json({ error: 'not authorized' });
		}

		const userData = tokenService.validateAccessToken(accessToken);
		if (!userData) {
			return res.json({ error: 'not authorized' });
		}

		req.user = userData;
		next();
	} catch (error) {}
};
