require('dotenv').config();

const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const cookieParser = require('cookie-parser');

const userRouter = require('./router/index');
const createTable = require('./db').createTable;

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/', userRouter);

// Тут мала б бути реалізація socket.io але щось піщло не так =(
// Я це бачу так: з фронта при конекті через сокет прихоидть емейл, його зберігаєм. Коли користувач робить успішний запит на /users/:id PUT шукаємо в збережених емейлах збіг і шлем туда повідомлення.

io.sockets.on('connection', function (socket) {
	socket.on('join', function (data) {
		socket.join(data.email);
	});
});

const start = async () => {
	try {
		server.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
		createTable();
	} catch (e) {
		console.log(e);
	}
};

start();
