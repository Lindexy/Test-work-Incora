const { body } = require('express-validator');

module.exports = [
	body('email').isEmail(),
	body('first_name').isAlpha(),
	body('last_name').isAlpha().optional({ nullable: true }),
	body('phone').isMobilePhone().optional({ nullable: true }),
	body('password').isLength({ min: 3, max: 32 }),
];
