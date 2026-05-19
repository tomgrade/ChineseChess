import { Piece, Player, Position, Difficulty } from '../types';
import { getValidMoves, movePiece, isChecked, PIECE_POINTS, BOARD_SIZE, COLUMNS } from './board';

interface Move {
  from: Position;
  to: Position;
  score: number;
}

const DIFFICULTY_DEPTH: Record<Difficulty, number> = {
  child: 1,
  middle: 3,
  elder: 4,
};

const evaluateBoard = (board: (Piece | null)[][], player: Player): number => {
  let score = 0;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const piece = board[row][col];
      if (piece) {
        let pieceScore = PIECE_POINTS[piece.type];
        
        if (piece.type === 'soldier') {
          const advancement = piece.player === 'red' ? 9 - row : row;
          pieceScore += advancement * 5;
        }
        
        if (piece.type === 'king') {
          const centerCol = 4;
          const distanceFromCenter = Math.abs(col - centerCol);
          pieceScore -= distanceFromCenter * 10;
        }
        
        const multiplier = piece.player === player ? 1 : -1;
        score += pieceScore * multiplier;
      }
    }
  }
  
  const opponent: Player = player === 'red' ? 'black' : 'red';
  if (isChecked(board, opponent)) {
    score += 50;
  }
  if (isChecked(board, player)) {
    score -= 50;
  }
  
  return score;
};

const minimax = (
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: Player,
  currentPlayer: Player
): { score: number; move: Move | null } => {
  if (depth === 0) {
    return { score: evaluateBoard(board, maximizingPlayer), move: null };
  }
  
  const moves: Move[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const piece = board[row][col];
      if (piece?.player === currentPlayer) {
        const validMoves = getValidMoves(board, { row, col });
        for (const to of validMoves) {
          const { newBoard } = movePiece(board, { row, col }, to);
          moves.push({
            from: { row, col },
            to,
            score: evaluateBoard(newBoard, maximizingPlayer),
          });
        }
      }
    }
  }
  
  if (moves.length === 0) {
    return { score: currentPlayer === maximizingPlayer ? -Infinity : Infinity, move: null };
  }
  
  if (currentPlayer === maximizingPlayer) {
    let maxScore = -Infinity;
    let bestMove = moves[0];
    
    for (const move of moves) {
      const { newBoard } = movePiece(board, move.from, move.to);
      const result = minimax(newBoard, depth - 1, alpha, beta, maximizingPlayer, currentPlayer === 'red' ? 'black' : 'red');
      
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) {
        break;
      }
    }
    
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = moves[0];
    
    for (const move of moves) {
      const { newBoard } = movePiece(board, move.from, move.to);
      const result = minimax(newBoard, depth - 1, alpha, beta, maximizingPlayer, currentPlayer === 'red' ? 'black' : 'red');
      
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, minScore);
      if (beta <= alpha) {
        break;
      }
    }
    
    return { score: minScore, move: bestMove };
  }
};

export const getAIMove = (
  board: (Piece | null)[][],
  player: Player,
  difficulty: Difficulty
): { from: Position; to: Position } | null => {
  const depth = DIFFICULTY_DEPTH[difficulty];
  
  if (difficulty === 'child') {
    const moves: Move[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const piece = board[row][col];
        if (piece?.player === player) {
          const validMoves = getValidMoves(board, { row, col });
          for (const to of validMoves) {
            const { newBoard } = movePiece(board, { row, col }, to);
            moves.push({
              from: { row, col },
              to,
              score: evaluateBoard(newBoard, player),
            });
          }
        }
      }
    }
    
    if (moves.length === 0) return null;
    
    moves.sort((a, b) => b.score - a.score);
    const bestMoves = moves.slice(0, Math.max(1, Math.floor(moves.length / 2)));
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }
  
  const result = minimax(board, depth, -Infinity, Infinity, player, player);
  return result.move || null;
};
