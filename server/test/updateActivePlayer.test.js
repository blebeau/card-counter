const updateActivePlayer = require("../utils/updateActivePlayer");

let players = [
	{
		playerName: "player 1",
		activePlayer: true,
	},
	{
		playerName: "player 2",
		activePlayer: false,
	},
	{
		playerName: "player 3",
		activePlayer: false,
	},
	{
		playerName: "dealer",
		activePlayer: false,
	},
]

test('check scores are correct', async () => {
	players = updateActivePlayer(players);

	expect(players[0].activePlayer).toBe(false)
	expect(players[1].activePlayer).toBe(true)
	expect(players[2].activePlayer).toBe(false)
	expect(players[3].activePlayer).toBe(false)

	players = updateActivePlayer(players);

	expect(players[0].activePlayer).toBe(false)
	expect(players[1].activePlayer).toBe(false)
	expect(players[2].activePlayer).toBe(true)
	expect(players[3].activePlayer).toBe(false)

	players = updateActivePlayer(players);

	expect(players[0].activePlayer).toBe(false)
	expect(players[1].activePlayer).toBe(false)
	expect(players[2].activePlayer).toBe(false)
	expect(players[3].activePlayer).toBe(true)

	players = updateActivePlayer(players);

	expect(players[0].activePlayer).toBe(true)
	expect(players[1].activePlayer).toBe(false)
	expect(players[2].activePlayer).toBe(false)
	expect(players[3].activePlayer).toBe(false)
});