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

const startingHands = require("./utils/startingHand");
const finder = require("./utils/helpers");

const { getCount, score, payout } = require('./utils/score');
const updateActivePlayer = require('./utils/updateActivePlayer');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];
let tables = [];

const splitCheck = (hand) => {
	const card1 = hand[0].card
	const card2 = hand[1].card

	const faceCardCheck = ['j', 'q', 'k']

	return (card1[0] === card2[0] && faceCardCheck.includes(card1[0]))
		|| (card1[1] === card2[1] && !faceCardCheck.includes(card1[0]))
		|| card1.length > 2
}

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createRoom", (name) => {
		socket.join(name);
		chatRooms.unshift({ id: generateID(), name, messages: [] });
		socket.emit("roomsList", chatRooms);
	});

	socket.on("findRoom", (id) => {
		let room = finder(chatRooms, id)

		socket.emit("foundRoom", room[0].messages);
	});

	socket.on("createTable", (name) => {
		const cloneDeck = JSON.parse(JSON.stringify(deck))

		const startingDeck = shuffle(cloneDeck);

		socket.join(name);
		tables.unshift({
			id: generateID(), name, shoe: startingDeck,
			players: [], count: 0, countedCards: []
		});
		socket.emit("tableList", tables);
	});

	socket.on("findTable", (id) => {
		let result = finder(tables, id)

		socket.emit("foundTable", result[0]);
	});

	socket.on("startGame", (data) => {
		const { room_id, user } = data

		let thisTable = finder(tables, room_id)

		if (thisTable[0].players.length === 0) { // not when joining
			thisTable[0].players.unshift({ playerName: "dealer", hand: [], activePlayer: false })
		}

		const activePlayer = !thisTable[0].players.find(player => player?.activePlayer)
		thisTable[0].players.unshift({
			playerName: user, hand: [], score: 0,
			activePlayer: activePlayer,
			chips: 10000, bet: 50,
			doubleDown: false,
			canSplit: false,
		})

		thisTable[0] = startingHands(thisTable[0]) // only runs for users without a hand

		const offerInsurance = thisTable[0].players.find(player => player.playerName === "dealer" &&
			player.hand[1].card.includes("a")
		)

		if (offerInsurance) {
			socket.emit("offerInsurance")
		}

		const thisPlayer = thisTable[0].players.filter(player => player.playerName === user)

		const playerScore = score(thisPlayer[0].hand)
		const count = getCount(thisTable[0].countedCards)

		thisPlayer[0].canSplit = splitCheck(thisPlayer[0].hand)

		thisPlayer[0].score = playerScore
		thisTable[0].count = count

		socket.emit("gameStarted", thisTable[0]);
	});

	socket.on("newMessage", (data) => {
		const { room_id, message, user, timestamp } = data;
		let room = finder(chatRooms, room_id)
		const newMessage = {
			id: generateID(),
			text: message,
			user,
			time: `${timestamp.hour}:${timestamp.mins}`,
		};
		socket.to(room[0].name).emit("roomMessage", newMessage);
		room[0].messages.push(newMessage);

		socket.emit("roomsList", chatRooms);
		socket.emit("foundRoom", result[0].messages);
	});

	socket.on("hit", (data) => {
		const { room_id, user, doubleDown } = data;
		let table = finder(tables, room_id)

		let player = table[0].players.filter((p) => p.playerName == user)

		player[0].doubleDown = doubleDown || false

		const card = table[0].shoe.splice(0, 1)

		if (player[0].canSplit) {
			player[0].splitHand = player[0].splitHand.concat(card)
			table[0].countedCards = table[0].countedCards.concat(card)

			const playerScore = score(player[0].splitHand)
			const count = getCount(table[0].countedCards)

			player[0].splitScore = playerScore;
			table[0].count = count;
		} else {
			player[0].hand = player[0].hand.concat(card)
			table[0].countedCards = table[0].countedCards.concat(card)

			const playerScore = score(player[0].hand)
			const count = getCount(table[0].countedCards)

			player[0].score = playerScore;
			table[0].count = count;
		}

		socket.emit("tableList", tables);
		socket.emit("foundTable", table[0]);
	});

	socket.on("dealerHit", (data) => {
		const { room_id } = data;
		let table = finder(tables, room_id)

		let player = table[0].players.filter((p) => p.playerName == "dealer")

		const card = table[0].shoe.splice(0, 1)

		player[0].hand = player[0].hand.concat(card)
		table[0].countedCards = table[0].countedCards.concat(card)

		const playerScore = score(player[0].hand)
		const count = getCount(table[0].countedCards)

		player[0].score = playerScore;
		table[0].count = count;

		socket.emit("tableList", tables);
		socket.emit("foundTable", table[0]);
		socket.emit("dealerPlay", player);

	});

	socket.on("stay", (data) => {
		const { room_id, user, doubleDown } = data;
		let table = finder(tables, room_id)
		let player = table[0].players.filter((p) => p.playerName == user)

		if (player[0].canSplit) {
			player[0].canSplit = false
		} else {
			player[0].doubleDown = doubleDown
			table[0].players = updateActivePlayer(table[0].players)

			const activePlayer = table[0].players.find(player => player.activePlayer)

			if (activePlayer.playerName === "dealer") {
				const dealer = table[0].players.filter(player => player.playerName === "dealer")

				table[0].countedCards = table[0].countedCards.concat(dealer[0].hand[1])

				const playerScore = score(dealer[0].hand)
				const count = getCount(table[0].countedCards)

				dealer[0].score = playerScore;
				table[0].count = count;

				socket.emit("tableList", tables);
				socket.emit("foundTable", table[0]);
				socket.emit("dealerPlay", dealer);
			}
		}

		socket.emit("tableList", tables);
		socket.emit("foundTable", table[0]);
	});

	socket.on("reset", (data) => {
		const { room_id } = data;
		let table = finder(tables, room_id)
		table[0].players = updateActivePlayer(table[0].players)
		table[0] = payout(table)

		if (table[0].shoe.length < (table[0].players.length * 4)) {
			const cloneDeck = JSON.parse(JSON.stringify(deck))

			const startingDeck = shuffle(cloneDeck);

			table[0].shoe = shuffle(startingDeck)
		}

		const newTable = startingHands(table[0])

		newTable.players.forEach(player => {
			if (player.playerName === "dealer") {
				player.score = 0;
			} else {
				player.score = score(player.hand)
			}

		});

		const count = getCount(table[0].countedCards)

		newTable.count = count;

		const offerInsurance = table[0].players.find(player =>
			player.playerName === "dealer" &&
			player.hand[1].card.includes("a")
		)

		if (offerInsurance) {
			socket.emit("offerInsurance")
		}

		socket.emit("tableList", tables);
		socket.emit("foundTable", newTable);
	});

	socket.on("insurance", (user, insuranceAmount, id) => {

		let table = finder(tables, id)

		const dealer = table[0].players.find(player => player.playerName === "dealer")
		const player = table[0].players.find(player => player.playerName === user)
		const dealerScore = score(dealer.hand)
		if (dealerScore === 21) {
			player.chips = player.chips - player.bet + (2 * insuranceAmount)
			socket.emit("dealerPlay", dealer);
		}
		else {
			player.chips -= player.bet
		}
		socket.emit("tableList", tables);
		socket.emit("foundTable", table[0]);
	})

	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});

	socket.on("doubleDown", (tableId, playerName) => {
		const { room_id, user } = data;
		let table = finder(tables, room_id)

		let player = table[0].players.filter((p) => p.playerName == user)

		const card = table[0].shoe.splice(0, 1)

		player[0].hand = player[0].hand.concat(card)
		table[0].countedCards = table[0].countedCards.concat(card)

		const playerScore = score(player[0].hand)
		const count = getCount(table[0].countedCards)

		player[0].score = playerScore;
		table[0].count = count;

		socket.emit("tableList", tables);
		socket.emit("foundTable", table[0]);
	});

	socket.on("split", (tableId, playerName) => {
		const table = tables.find(table => table.id === tableId)

		const player = table.players.find(player => player.playerName === playerName)

		player.splitHand = player.hand.splice(1, 1)

		player.score = score(player.hand)
		player.splitScore = score(player.splitHand)

		socket.emit("tableList", tables);
		socket.emit("foundTable", table[0]);
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