export type Card = {
  card: string;
  cardLink: any;
};

export type Player = {
  playerName: string;
  activePlayer: boolean;
  score: number;
  chips: number;
  bet: number;
  hand: Card[];
};

export type TableType = {
  players: Player[];
  id: string;
  name: string;
  startingDeck: Card[];
  count: number;
  countedCards: Card[];
};
