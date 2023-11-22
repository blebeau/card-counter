module.exports = startingHands = (table) => {
	for (let i = 0; i < 2; i++) {
		table.players.forEach(player => {
			const card = table.shoe.splice(0, 1)

			player.hand = player.hand.concat(card);
			if (player.playerName === "dealer" && player.hand.length === 1) {
				return
			} else table.countedCards = table.countedCards.concat(card);
		});
	}
	return table;
}