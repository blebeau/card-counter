module.exports = playerScore = (
	cards,
	playedCards,
	// currentCount
) => {
	let playerScore = 0;
	let count = 0;
	let aceCount = 0;
	const tenValueCards = [
		"c10", "jc", "qc", "kc",
		"d10", "jd", "qd", "kd",
		"s10", "js", "qs", "ks",
		"h10", "jh", "qh", "kh",
	];

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

	return { playerScore, count };
};
