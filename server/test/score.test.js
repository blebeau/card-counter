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
				bet: 50,
				score: 18
			},
			{
				playerName: "player2",
				hand: [
					{ card: 'jc', cardLink: '../utils/PNG-cards/jc.png' },
					{ card: 'd10', cardLink: '../utils/PNG-cards/d10.png' }
				],
				chips: 100,
				bet: 50,
				score: 20
			},
			{
				playerName: "player3",
				hand: [
					{ card: 'aceh', cardLink: '../utils/PNG-cards/aceh.png' },
					{ card: 'h10', cardLink: '../utils/PNG-cards/h10.png' }
				],
				chips: 100,
				bet: 50,
				score: 21
			},
			{
				playerName: "player4",
				hand: [
					{ card: 's10', cardLink: '../utils/PNG-cards/s10.png' },
					{ card: 'c9', cardLink: '../utils/PNG-cards/c9.png' }
				],
				chips: 100,
				bet: 50,
				score: 19
			},
			{
				playerName: "dealer",
				hand: [
					{ card: 'kc', cardLink: '../utils/PNG-cards/kc.png' },
					{ card: 'h9', cardLink: '../utils/PNG-cards/h9.png' }
				],
				score: 19
			}
		],
		// shoe: deck,
		countedCards: [
			{ card: 'd3', cardLink: '../utils/PNG-cards/d3.png' },
			{ card: 'd6', cardLink: '../utils/PNG-cards/d6.png' },
			{ card: 'd9', cardLink: '../utils/PNG-cards/d9.png' },
			{ card: 'jc', cardLink: '../utils/PNG-cards/jc.png' },
			{ card: 'd10', cardLink: '../utils/PNG-cards/d10.png' },
			{ card: 'aceh', cardLink: '../utils/PNG-cards/aceh.png' },
			{ card: 'h10', cardLink: '../utils/PNG-cards/h10.png' },
			{ card: 's10', cardLink: '../utils/PNG-cards/s10.png' },
			{ card: 'c9', cardLink: '../utils/PNG-cards/c9.png' },
			{ card: 'kc', cardLink: '../utils/PNG-cards/kc.png' },
			{ card: 'h9', cardLink: '../utils/PNG-cards/h9.png' }
		]
	}
]

test('check scores are correct', async () => {
	const count = getCount(testingTable[0].countedCards)
	expect(count).toBe(-4)
});

test('check scores are correct', async () => {
	const player1 = score(testingTable[0].players[0].hand)
	const player2 = score(testingTable[0].players[1].hand)
	const player3 = score(testingTable[0].players[2].hand)
	const player4 = score(testingTable[0].players[3].hand)
	const player5 = score(testingTable[0].players[4].hand)

	expect(player1).toBe(18)
	expect(player2).toBe(20)
	expect(player3).toBe(21)
	expect(player4).toBe(19)
	expect(player5).toBe(19)
});

test('check chips update correctly', async () => {
	const player1 = testingTable[0].players[0]
	const player2 = testingTable[0].players[1]
	const player3 = testingTable[0].players[2]
	const player4 = testingTable[0].players[3]

	expect(player1.chips).toBe(100)
	expect(player2.chips).toBe(100)
	expect(player3.chips).toBe(100)
	expect(player4.chips).toBe(100)

	payout(testingTable)
	expect(player1.chips).toBe(50)
	expect(player2.chips).toBe(150)
	expect(player3.chips).toBe(175)
	expect(player4.chips).toBe(100)
});