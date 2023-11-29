const tenValueCards = [
	"c10", "jc", "qc", "kc",
	"d10", "jd", "qd", "kd",
	"s10", "js", "qs", "ks",
	"h10", "jh", "qh", "kh",
];

exports.getCount = (playedCards) => {
	let count = 0;

	const cardValue = (card) => {
		const cardDenomination = card.match(/\d+/)
		if (!cardDenomination) return
		return cardDenomination[0]
	}

	playedCards.forEach((card) => {
		// gets number from the card string as a string
		const cardScore = cardValue(card.card)

		if (card.card.includes("a") || tenValueCards.includes(card.card)) {
			count -= 1
		} else if (parseInt(cardScore) < 7) {
			count += 1
		} else {
			count += 0

		}
	});
	return count;
};

exports.score = (cards) => {
	let aceCount = 0;
	let playerScore = 0;
	const cardValue = (card) => {
		const cardDenomination = card.match(/\d+/)
		if (!cardDenomination) return
		return cardDenomination[0]
	}

	cards.forEach((card) => {
		// gets number from the card string as a string
		const cardScore = cardValue(card.card)

		if (card.card.includes("a")) {
			aceCount += 1
		}

		else if (tenValueCards.includes(card.card)) {
			playerScore += 10
		}

		// adds the number to the playerScore
		else if (parseInt(cardScore) < 7) {
			playerScore += parseInt(cardScore)
		} else {
			playerScore += parseInt(cardScore);
		}

	});
	if (aceCount > 0) { // Set ace value as 1 or 11
		playerScore += aceCount
		if ((playerScore + 10) < 22) {
			playerScore += 10
		}
	}

	return playerScore;
}

exports.payout = (table) => {
	const dealer = table[0].players.filter(player => player.playerName === "dealer")
	const dealerScore = dealer[0].score
	table[0].players.forEach(player => {
		if (player.playerName !== 'dealer') {
			if (player.score === 21 && player.hand.length === 2) {
				player.chips += (player.betAmount * 1.5)
			}
			else if (player.score < dealerScore && (dealerScore < 22) || player.score > 21) {
				player.chips -= player.betAmount
			}
			else if (player.score > dealerScore && player.score < 22 || player.score < 21 && dealerScore > 21) {
				player.chips += player.betAmount
			}
		}
		player.hand = []
	})
	return table[0]
}