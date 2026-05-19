export type PieceType = 'king' | 'guard' | 'elephant' | 'horse' | 'chariot' | 'cannon' | 'soldier';

export type Player = 'red' | 'black';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  type: PieceType;
  player: Player;
  position: Position;
}

export type Difficulty = 'child' | 'middle' | 'elder';

export interface LastMove {
  from: Position;
  to: Position;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: Player;
  selectedPiece: Position | null;
  validMoves: Position[];
  winner: Player | null;
  gameOver: boolean;
  difficulty: Difficulty;
  score: number;
  playerScore: number;
  aiScore: number;
  lastMove: LastMove | null;
}

export interface GameHistory {
  board: (Piece | null)[][];
  currentPlayer: Player;
}
