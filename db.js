const Pool = require('pg').Pool;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

async function createTable() {
	const text = `
            CREATE TABLE IF NOT EXISTS "users" (
                "id" SERIAL,
                "first_name" VARCHAR(100) NOT NULL,
                "last_name" VARCHAR(100),
                "email" VARCHAR(100) NOT NULL,
                "phone" VARCHAR(15),
                "password" VARCHAR(255) NOT NULL,
				"token" TEXT,
                PRIMARY KEY ("id")
            );`;
	pool.query(text).then((result) => {
		if (result) {
			console.log('Table created');
		}
	});
}

module.exports = { pool, createTable };
