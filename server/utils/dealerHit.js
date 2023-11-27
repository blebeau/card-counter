const { getCount, score } = require('./score');


const dealerHit = (table, player) => {
	while (player[0].score < 17) {
		console.log("while loop")

		const card = table[0].shoe.splice(0, 1)

		player[0].hand = player[0].hand.concat(card)
		table[0].countedCards = table[0].countedCards.concat(card)

		const playerScore = score(player[0].hand)
		const count = getCount(table[0].countedCards)

		dealerScore = playerScore

		player[0].score = playerScore;
		table[0].count = count;
	}
	return table
}

module.exports = { dealerHit }