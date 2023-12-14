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
		const cardDenomination = card.match(/\d+/) // gets the number value from the card string
		if (!cardDenomination) return // face cards and aces
		return cardDenomination[0]
	}

	// Counting cards is simply creating a metric, the count, to identify the 
	// amount of 10s in the deck. High count means more 10s.
	// Cards are valued as;
	// 2 - 6 => count increases by 1 for each
	// 7 - 9 => count does not change
	// 10 value cards and aces => count decreases by 1 for each

	cards.forEach((card) => {
		const cardScore = cardValue(card.card)

		if (card.card.includes("a")) {
			aceCount += 1
		}

		else if (tenValueCards.includes(card.card)) {
			playerScore += 10
		}

		else if (parseInt(cardScore) < 7) {
			playerScore += parseInt(cardScore)
		} else {
			playerScore += parseInt(cardScore);
		}

	});
	if (aceCount > 0) {
		// checks the value of all cards with ace as 1.
		// Then, if the score is 11 or less, increase by 10.
		// Since 2 aces at 11 === 22, only 1 ace will ever be worth 11 in a hand.
		playerScore += aceCount
		if (playerScore <= 11) {
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
			if (player.splitHands.length > 0) {
				this.splitPayout(player.splitHands, dealerScore)
			} else {
				if (player.score === 21 && player.hand.length === 2) {
					// blackjack is starting with 21 and pays 3:2
					player.chips += (player.bet * 1.5)
				}
				else if (player.score < dealerScore && (dealerScore < 22) || player.score > 21) {
					player.chips -= player.doubleDown ? player.bet * 2 : player.bet
				}
				else if (player.score > dealerScore && player.score < 22 || player.score < 21 && dealerScore > 21) {
					player.chips += player.doubleDown ? player.bet * 2 : player.bet
				}
			}

		}
		player.splitHands = []
		player.hand = []
		player.doubleDown = false
	})
	return table[0]
}

exports.splitPayout = (hands, dealerScore) => {
	hands.forEach(hand => {
		const score = this.score(hand);
		if (score === 21 && player.hand.length === 2) {
			// blackjack is starting with 21 and pays 3:2
			player.chips += (player.bet * 1.5)
		}
		else if (score < dealerScore && (dealerScore < 22) || score > 21) {
			player.chips -= player.doubleDown ? player.bet * 2 : player.bet
		}
		else if (score > dealerScore && score < 22 || score < 21 && dealerScore > 21) {
			player.chips += player.doubleDown ? player.bet * 2 : player.bet
		}
	})
}