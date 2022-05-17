module.exports = class UserDto {
	id;
	email;
	first_name;
	last_name;
	phone;

	constructor(user) {
		this.id = user.id;
		this.email = user.email;
		this.first_name = user.first_name;
		this.last_name = user.last_name;
		this.phone = user.phone;
	}
};
