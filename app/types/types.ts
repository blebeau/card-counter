export type Card = {
  card: string;
  cardLink: string;
};

export type Player = {
  playerName: string;
  activePlayer: boolean;
  score: number;
  chips: number;
  bet: number;
  hand: any;
};

export type TableType = {
  players: Player[];
  id: string;
  name: string;
  startingDeck: Card[];
  count: number;
  countedCards: Card[];
};

export type Message = {
  id: string;
  text: string;
  user: string;
  time: string;
};

export type Rooms = {
  id: string;
  name: string;
  messages: Message[];
};
