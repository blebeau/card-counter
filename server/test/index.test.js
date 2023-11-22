const startingHands = require('../utils/startingHand')
const deck = require("../utils/deck");
const finder = require("../utils/helpers")

const testingTable = [{
	id: 1,
	players: [
		{ playerName: "player1", hand: [] },
		{ playerName: "player2", hand: [] },
		{ playerName: "dealer", hand: [] }
	],
	shoe: deck,
	countedCards: []
},
{
	id: 2,
	players: [
		{ playerName: "player1", hand: [] },
		{ playerName: "player2", hand: [] },
		{ playerName: "dealer", hand: [] }
	],
	shoe: deck,
	countedCards: []
}
]

test('Starting Hands', async () => {
	const table = await startingHands(testingTable[0])
	console.log('table', table)
	testingTable[0].players.forEach(player => {
		expect(player.hand.length).toBe(2)
	});
});

test('Check finder returns correct item', async () => {
	const table = finder(testingTable, 1)
	expect(table[0].id).toBe(1)
});