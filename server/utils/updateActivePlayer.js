module.exports = updateActivePlayer = (players) => {
	const nextActivePlayer = players.find(player =>
		player.activePlayer
	);
	const activePlayerIndex = players.findIndex(player => player.activePlayer)

	nextActivePlayer.activePlayer = false;

	if (activePlayerIndex + 1 === players.length) {
		players[0].activePlayer = true
	} else {
		players[activePlayerIndex + 1].activePlayer = true
	}
	return players;
}