const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const PORT = 4000;
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
	},
});
const shuffle = require("./utils/shuffle");
const deck = require("./utils/deck");
const score = require("./utils/score");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];
let tables = [];
const cloneDeck = JSON.parse(JSON.stringify(deck))

const startingHands = (table) => {
	for (let i = 0; i < 2; i++) {
		table.players.forEach(player => {
			const card = table.shoe.splice(0, 1)

			player.hand = player.hand.concat(card);
			if (player.playerName === "dealer" && player.hand.length === 1) {
				return
			} else table.countedCards = table.countedCards.concat(card);
		});
	}
	return table;
}

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);
	console.log("socket tables", tables);

	socket.on("createRoom", (name) => {
		socket.join(name);
		chatRooms.unshift({ id: generateID(), name, messages: [] });
		socket.emit("roomsList", chatRooms);
	});

	socket.on("findRoom", (id) => {
		let result = chatRooms.filter((room) => room.id == id);

		socket.emit("foundRoom", result[0].messages);
	});

	socket.on("createTable", (name) => {
		const cloneDeck = JSON.parse(JSON.stringify(deck))

		const startingDeck = shuffle(cloneDeck);

		socket.join(name);
		tables.unshift({ id: generateID(), name, shoe: startingDeck, players: [], count: 0, countedCards: [] });
		socket.emit("tableList", tables);
	});

	socket.on("findTable", (id) => {
		let result = tables.filter((table) => table.id == id);

		socket.emit("foundTable", result[0]);
	});

	socket.on("startGame", (data) => {
		const { room_id, user } = data

		let thisTable = tables.filter((table) => table.id == room_id);

		if (thisTable[0].players.length === 0) { // not when joining
			thisTable[0].players.unshift({ playerName: "dealer", hand: [], activePlayer: false })
		}

		const activePlayer = !thisTable[0].players.find(player => player?.activePlayer)
		thisTable[0].players.unshift({ playerName: user, hand: [], score: 0, activePlayer: activePlayer, chips: 10000 })

		thisTable[0] = startingHands(thisTable[0]) // only runs for users without a hand

		const thisPlayer = thisTable[0].players.filter(player => player.playerName === user)

		const { playerScore, count } = score(thisPlayer[0].hand, thisTable[0].countedCards)

		thisPlayer[0].score = playerScore
		thisTable[0].count = count

		socket.emit("gameStarted", thisTable[0]);
	});

	socket.on("newMessage", (data) => { // Similar to what dealing will be
		const { room_id, message, user, timestamp } = data;
		let result = chatRooms.filter((room) => room.id == room_id);
		const newMessage = {
			id: generateID(),
			text: message,
			user,
			time: `${timestamp.hour}:${timestamp.mins}`,
		};
		socket.to(result[0].name).emit("roomMessage", newMessage);
		result[0].messages.push(newMessage);

		socket.emit("roomsList", chatRooms);
		socket.emit("foundRoom", result[0].messages);
	});

	socket.on("hit", (data) => {
		const { room_id, user } = data;
		console.log('user hit', user)

		let result = tables.filter((room) => room.id == room_id);

		let player = result[0].players.filter((p) => p.playerName == user)

		const card = result[0].shoe.splice(0, 1)

		player[0].hand = player[0].hand.concat(card)
		result[0].countedCards = result[0].countedCards.concat(card)

		const { playerScore, count } = score(player[0].hand, result[0].countedCards)

		player[0].score = playerScore;
		result[0].count = count;

		socket.to(result[0].players).emit("playerHit", result[0].players);

		socket.emit("tableList", tables);
		socket.emit("foundTable", result[0]);
	});

	socket.on("stay", (data) => {
		const { room_id, user } = data;

		let result = tables.filter((room) => room.id == room_id);

		result[0].players.filter((p) => !p.activePlayer)[0].activePlayer = true

		result[0].players.filter((p) => p.playerName == user)[0].activePlayer = false

		const activePlayer = result[0].players.find(player => player.activePlayer)

		if (activePlayer.playerName === "dealer") {
			const dealer = result[0].players.filter(player => player.playerName === "dealer")

			result[0].countedCards = result[0].countedCards.concat(dealer[0].hand[1])

			const { playerScore, count } = score(dealer[0].hand, result[0].countedCards)

			dealer[0].score = playerScore;
			result[0].count = count;
		}

		socket.to(result[0].players).emit("playerStay", result[0].players);

		socket.emit("tableList", tables);
		socket.emit("foundTable", result[0]);

		if (activePlayer.playerName === "dealer") {
			console.log('dealer is active', activePlayer.playerName)


			socket.emit("dealerPlay", result[0], activePlayer);
		}
	});

	// socket.on("dealerPlay", (data) => {

	// })

	socket.on("reset", (data) => {
		const { room_id, betValue } = data;

		let table = tables.filter((room) => room.id == room_id);

		table[0].players.filter((p) => p.activePlayer)[0].activePlayer = false
		table[0].players[0].activePlayer = true

		const dealer = table[0].players.filter(player => player.playerName === "dealer")
		const dealerScore = dealer[0].score
		table[0].players.forEach(player => {
			if (player.playerName !== 'dealer') {
				if (player.score < dealerScore && (dealerScore < 22) || player.score > 21) {
					player.chips -= betValue
				}
				if (player.score > dealerScore && player.score < 22 || player.score < 21 && dealerScore > 21) {
					player.chips += betValue
				}
				if (player.score === 21 && player.hand.length === 2) {
					player.chips += (betValue * 1.5)
				}
			}
			player.hand = []
		})

		if (table[0].shoe.length < (table[0].players.length * 4)) {
			console.log('new deck')
			const cloneDeck = JSON.parse(JSON.stringify(deck))

			const startingDeck = shuffle(cloneDeck);

			table[0].shoe = shuffle(startingDeck)
		}

		const newTable = startingHands(table[0])

		const { playerScore, count } = score(newTable.players[0].hand, newTable.countedCards)

		dealer[0].score = 0;
		newTable.players[0].score = playerScore;
		newTable.count = count;

		socket.emit("gameReset", newTable)

		socket.emit("tableList", tables);
		socket.emit("foundTable", newTable);
	});



	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});
});

app.get("/api/rooms", (req, res) => {
	res.json(chatRooms);
});
app.get("/api/tables", (req, res) => {
	res.json(tables);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});