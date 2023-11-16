export type card = {
  card: string;
  cardLink: any;
};

export type player = {
  playerName: string;
  activePlayer: boolean;
  score: number;
  chips: number;
  bet: number;
  hand: card[];
};
