export type Card = {
  card: string;
  cardLink: string;
};

export type SplitHand = {
  hand: Card[];
  score: number;
  stay: boolean;
  doubleDown: boolean;
  canSplit: boolean;
};

export type Player = {
  playerName: string;
  activePlayer: boolean;
  canSplit?: boolean;
  score: number;
  chips: number;
  bet: number;
  hand: Card[];
  splitScore?: number;
  splitHands: SplitHand[];
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
