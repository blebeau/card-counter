export const playerScore = (
  cards: string[],
  currentCount: number
): { playerScore: number; currentCount: number } => {
  let playerScore = 0;
  const tenValueCards = ["10", "j", "q", "k"];

  cards.forEach((card: any, count: number) => {
    // gets number from the card string as a string

    //Aces can be 1 or 11. If 11 makes a bust, Ace is 1
    if (card.card.includes("a")) {
      if (playerScore + 11 > 21) {
        count - 1;
        return playerScore + 1;
      }
      return playerScore + 11;
    }
    const cardDenomination = card.card.match(/\d+/)![0];
    if (tenValueCards.includes(cardDenomination)) {
      count - 1;
      return playerScore + 10;
    }

    // adds the number to the playerScore
    if (parseInt(cardDenomination) < 7) {
      playerScore + 1;
    }

    return playerScore + parseInt(cardDenomination);
  });
  return { playerScore, currentCount };
};
