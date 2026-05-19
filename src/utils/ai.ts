import { Piece, Player, Position, Difficulty } from '../types';
import { getValidMoves, movePiece, isChecked, PIECE_POINTS, BOARD_SIZE, COLUMNS } from './board';

interface Move {
  from: Position;
  to: Position;
  score: number;
}

interface TranspositionEntry {
  score: number;
  depth: number;
  flag: 'exact' | 'lower' | 'upper';
}

const DIFFICULTY_DEPTH: Record<Difficulty, number> = {
  child: 1,
  middle: 3,
  elder: 5,
};

const DIFFICULTY_TIME_LIMIT: Record<Difficulty, number> = {
  child: 1000,
  middle: 3000,
  elder: 5000,
};

const transpositionTable = new Map<string, TranspositionEntry>();

const boardToKey = (board: (Piece | null)[][]): string => {
  let key = '';
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const piece = board[row][col];
      if (piece) {
        key += `${piece.player[0]}${piece.type[0]}${row}${col}`;
      } else {
        key += '-';
      }
    }
  }
  return key;
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

const orderMoves = (
  board: (Piece | null)[][],
  moves: Move[],
  player: Player,
  _maximizingPlayer: Player
): Move[] => {
  return moves.sort((a, b) => {
    const fromPieceA = board[a.from.row][a.from.col];
    const toPieceA = board[a.to.row][a.to.col];
    const fromPieceB = board[b.from.row][b.from.col];
    const toPieceB = board[b.to.row][b.to.col];
    
    let scoreA = 0;
    let scoreB = 0;
    
    if (toPieceA) {
      scoreA += PIECE_POINTS[toPieceA.type] * 10;
    }
    if (toPieceB) {
      scoreB += PIECE_POINTS[toPieceB.type] * 10;
    }
    
    if (fromPieceA?.type === 'king' && isChecked(board, player)) {
      scoreA += 100;
    }
    if (fromPieceB?.type === 'king' && isChecked(board, player)) {
      scoreB += 100;
    }
    
    return scoreB - scoreA;
  });
};

let startTime = 0;
let timeLimit = 0;

const minimax = (
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: Player,
  currentPlayer: Player
): number => {
  if (Date.now() - startTime > timeLimit) {
    return maximizingPlayer === currentPlayer ? -Infinity : Infinity;
  }
  
  const key = boardToKey(board);
  const entry = transpositionTable.get(key);
  if (entry && entry.depth >= depth) {
    if (entry.flag === 'exact') {
      return entry.score;
    } else if (entry.flag === 'lower') {
      alpha = Math.max(alpha, entry.score);
    } else if (entry.flag === 'upper') {
      beta = Math.min(beta, entry.score);
    }
    if (alpha >= beta) {
      return entry.score;
    }
  }
  
  if (depth === 0) {
    const score = evaluateBoard(board, maximizingPlayer);
    transpositionTable.set(key, { score, depth, flag: 'exact' });
    return score;
  }
  
  const moves: Move[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const piece = board[row][col];
      if (piece?.player === currentPlayer) {
        const validMoves = getValidMoves(board, { row, col });
        for (const to of validMoves) {
          moves.push({
            from: { row, col },
            to,
            score: 0,
          });
        }
      }
    }
  }
  
  if (moves.length === 0) {
    const score = currentPlayer === maximizingPlayer ? -Infinity : Infinity;
    transpositionTable.set(key, { score, depth, flag: 'exact' });
    return score;
  }
  
  const orderedMoves = orderMoves(board, moves, currentPlayer, maximizingPlayer);
  
  if (currentPlayer === maximizingPlayer) {
    let maxScore = -Infinity;
    
    for (const move of orderedMoves) {
      const { newBoard } = movePiece(board, move.from, move.to);
      const score = minimax(newBoard, depth - 1, alpha, beta, maximizingPlayer, currentPlayer === 'red' ? 'black' : 'red');
      
      if (score > maxScore) {
        maxScore = score;
      }
      
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) {
        break;
      }
      
      if (Date.now() - startTime > timeLimit) {
        break;
      }
    }
    
    let flag: 'exact' | 'lower' | 'upper' = 'exact';
    if (maxScore <= alpha) {
      flag = 'upper';
    } else if (maxScore >= beta) {
      flag = 'lower';
    }
    transpositionTable.set(key, { score: maxScore, depth, flag });
    return maxScore;
  } else {
    let minScore = Infinity;
    
    for (const move of orderedMoves) {
      const { newBoard } = movePiece(board, move.from, move.to);
      const score = minimax(newBoard, depth - 1, alpha, beta, maximizingPlayer, currentPlayer === 'red' ? 'black' : 'red');
      
      if (score < minScore) {
        minScore = score;
      }
      
      beta = Math.min(beta, minScore);
      if (beta <= alpha) {
        break;
      }
      
      if (Date.now() - startTime > timeLimit) {
        break;
      }
    }
    
    let flag: 'exact' | 'lower' | 'upper' = 'exact';
    if (minScore <= alpha) {
      flag = 'upper';
    } else if (minScore >= beta) {
      flag = 'lower';
    }
    transpositionTable.set(key, { score: minScore, depth, flag });
    return minScore;
  }
};

export const getAIMove = (
  board: (Piece | null)[][],
  player: Player,
  difficulty: Difficulty
): { from: Position; to: Position } | null => {
  transpositionTable.clear();
  
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
    const bestMoves = moves.slice(0, Math.max(1, Math.floor(moves.length / 3)));
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }
  
  const maxDepth = DIFFICULTY_DEPTH[difficulty];
  timeLimit = DIFFICULTY_TIME_LIMIT[difficulty];
  startTime = Date.now();
  
  let bestMove: Move | null = null;
  let bestScore = -Infinity;
  
  for (let depth = 1; depth <= maxDepth; depth++) {
    if (Date.now() - startTime > timeLimit) {
      break;
    }
    
    const moves: Move[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const piece = board[row][col];
        if (piece?.player === player) {
          const validMoves = getValidMoves(board, { row, col });
          for (const to of validMoves) {
            moves.push({
              from: { row, col },
              to,
              score: 0,
            });
          }
        }
      }
    }
    
    if (moves.length === 0) return null;
    
    const orderedMoves = orderMoves(board, moves, player, player);
    
    for (const move of orderedMoves) {
      if (Date.now() - startTime > timeLimit) {
        break;
      }
      
      const { newBoard } = movePiece(board, move.from, move.to);
      const score = minimax(newBoard, depth - 1, -Infinity, Infinity, player, player === 'red' ? 'black' : 'red');
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    if (bestMove && Date.now() - startTime > timeLimit * 0.8) {
      break;
    }
  }
  
  return bestMove || null;
};
