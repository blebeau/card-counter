exports.finder = (arr, id) => {
	return arr.filter((table) => table.id == id);
}

exports.splitCheck = (hand) => {
	const card1 = hand[0].card
	const card2 = hand[1].card

	const faceCardCheck = ['j', 'q', 'k']

	if (card1[0] === card2[0] && faceCardCheck.includes(card1[0])) {
		return true
	}

	if (card1[1] === card2[1] && !faceCardCheck.includes(card1[0]) && !faceCardCheck.includes(card2[0])) {
		return true
	}

	if (card1.includes('a') && card2.includes('a')) {
		return true
	}

	return false
}