const { getCount, score, payout } = require('../utils/score');

const testingTable = [
	{
		id: 2,
		players: [
			{
				playerName: "player1",
				hand: [
					{ card: 'd3', cardLink: '../utils/PNG-cards/d3.png' },
					{ card: 'd6', cardLink: '../utils/PNG-cards/d6.png' },
					{ card: 'd9', cardLink: '../utils/PNG-cards/d9.png' },
				],
				chips: 100,
				betAmount: 50
			},
			{
				playerName: "player2",
				hand: [
					{ card: 's10', cardLink: '../utils/PNG-cards/s10.png' },
					{ card: 'd10', cardLink: '../utils/PNG-cards/d10.png' }
				],
				chips: 100,
				betAmount: 50
			},
			{
				playerName: "player3",
				hand: [
					{ card: 'aceh', cardLink: '../utils/PNG-cards/aceh.png' },
					{ card: 'h10', cardLink: '../utils/PNG-cards/h10.png' }
				],
				chips: 100,
				betAmount: 50
			},
			{
				playerName: "dealer",
				hand: [
					{ card: 'kc', cardLink: '../utils/PNG-cards/kc.png' },
					{ card: 'jc', cardLink: '../utils/PNG-cards/jc.png' }
				]
			}
		],
		// shoe: deck,
		countedCards: [
			{ card: 'd3', cardLink: '../utils/PNG-cards/d3.png' },
			{ card: 'd6', cardLink: '../utils/PNG-cards/d6.png' },
			{ card: 'd9', cardLink: '../utils/PNG-cards/d9.png' },
			{ card: 'kd', cardLink: '../utils/PNG-cards/kd.png' },
			{ card: 's10', cardLink: '../utils/PNG-cards/d9.png' },
			{ card: 'h10', cardLink: '../utils/PNG-cards/d9.png' }
		]
	}
]

test('check scores are correct', async () => {
	const count = getCount(testingTable[0].countedCards)
	expect(count).toBe(-1)
});

test('check scores are correct', async () => {
	const player1 = score(testingTable[0].players[0].hand)
	const player2 = score(testingTable[0].players[1].hand)
	const player3 = score(testingTable[0].players[2].hand)

	expect(player1).toBe(18)
	expect(player2).toBe(20)
	expect(player3).toBe(21)
});

test('check chips update correctly', async () => {
	const player1 = testingTable[0].players[0]
	const player2 = testingTable[0].players[1]
	const player3 = testingTable[0].players[2]

	expect(player1.chips).toBe(100)
	expect(player2.chips).toBe(100)
	expect(player3.chips).toBe(100)

	const newTable = payout(testingTable)
	console.log(JSON.stringify(newTable))
	console.log(JSON.stringify(testingTable))
	expect(newTable.players[0].chips).toBe(50)
	expect(newTable.players[1].chips).toBe(150)
	expect(newTable.players[2].chips).toBe(175)
});