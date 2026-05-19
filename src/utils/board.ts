import { Piece, PieceType, Player, Position } from '../types';

export const BOARD_SIZE = 10;
export const COLUMNS = 9;

export const INITIAL_BOARD: (Piece | null)[][] = [
  [
    { type: 'chariot', player: 'black', position: { row: 0, col: 0 } },
    { type: 'horse', player: 'black', position: { row: 0, col: 1 } },
    { type: 'elephant', player: 'black', position: { row: 0, col: 2 } },
    { type: 'guard', player: 'black', position: { row: 0, col: 3 } },
    { type: 'king', player: 'black', position: { row: 0, col: 4 } },
    { type: 'guard', player: 'black', position: { row: 0, col: 5 } },
    { type: 'elephant', player: 'black', position: { row: 0, col: 6 } },
    { type: 'horse', player: 'black', position: { row: 0, col: 7 } },
    { type: 'chariot', player: 'black', position: { row: 0, col: 8 } },
  ],
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    { type: 'cannon', player: 'black', position: { row: 2, col: 1 } },
    null,
    null,
    null,
    null,
    null,
    { type: 'cannon', player: 'black', position: { row: 2, col: 7 } },
    null,
  ],
  [
    { type: 'soldier', player: 'black', position: { row: 3, col: 0 } },
    null,
    { type: 'soldier', player: 'black', position: { row: 3, col: 2 } },
    null,
    { type: 'soldier', player: 'black', position: { row: 3, col: 4 } },
    null,
    { type: 'soldier', player: 'black', position: { row: 3, col: 6 } },
    null,
    { type: 'soldier', player: 'black', position: { row: 3, col: 8 } },
  ],
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    { type: 'soldier', player: 'red', position: { row: 6, col: 0 } },
    null,
    { type: 'soldier', player: 'red', position: { row: 6, col: 2 } },
    null,
    { type: 'soldier', player: 'red', position: { row: 6, col: 4 } },
    null,
    { type: 'soldier', player: 'red', position: { row: 6, col: 6 } },
    null,
    { type: 'soldier', player: 'red', position: { row: 6, col: 8 } },
  ],
  [
    null,
    { type: 'cannon', player: 'red', position: { row: 7, col: 1 } },
    null,
    null,
    null,
    null,
    null,
    { type: 'cannon', player: 'red', position: { row: 7, col: 7 } },
    null,
  ],
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    { type: 'chariot', player: 'red', position: { row: 9, col: 0 } },
    { type: 'horse', player: 'red', position: { row: 9, col: 1 } },
    { type: 'elephant', player: 'red', position: { row: 9, col: 2 } },
    { type: 'guard', player: 'red', position: { row: 9, col: 3 } },
    { type: 'king', player: 'red', position: { row: 9, col: 4 } },
    { type: 'guard', player: 'red', position: { row: 9, col: 5 } },
    { type: 'elephant', player: 'red', position: { row: 9, col: 6 } },
    { type: 'horse', player: 'red', position: { row: 9, col: 7 } },
    { type: 'chariot', player: 'red', position: { row: 9, col: 8 } },
  ],
];

export const PIECE_NAMES: Record<PieceType, { red: string; black: string }> = {
  king: { red: '帅', black: '将' },
  guard: { red: '仕', black: '士' },
  elephant: { red: '相', black: '象' },
  horse: { red: '馬', black: '馬' },
  chariot: { red: '車', black: '車' },
  cannon: { red: '炮', black: '砲' },
  soldier: { red: '兵', black: '卒' },
};

export const PIECE_POINTS: Record<PieceType, number> = {
  king: 1000,
  guard: 20,
  elephant: 20,
  horse: 40,
  chariot: 90,
  cannon: 45,
  soldier: 10,
};

export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < COLUMNS;
};

export const isInPalace = (position: Position, player: Player): boolean => {
  const rowMin = player === 'red' ? 7 : 0;
  const rowMax = player === 'red' ? 9 : 2;
  const colMin = 3;
  const colMax = 5;
  return (
    position.row >= rowMin &&
    position.row <= rowMax &&
    position.col >= colMin &&
    position.col <= colMax
  );
};

export const getKingPosition = (board: (Piece | null)[][], player: Player): Position | null => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.player === player) {
        return { row, col };
      }
    }
  }
  return null;
};

export const isChecked = (board: (Piece | null)[][], player: Player): boolean => {
  const kingPos = getKingPosition(board, player);
  if (!kingPos) return false;

  const opponent: Player = player === 'red' ? 'black' : 'red';

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const piece = board[row][col];
      if (piece?.player === opponent) {
        const moves = getValidMoves(board, { row, col }, false);
        if (moves.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const getValidMoves = (
  board: (Piece | null)[][],
  position: Position,
  checkCheck: boolean = true
): Position[] => {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  const moves: Position[] = [];

  switch (piece.type) {
    case 'king':
      const kingMoves = [
        { row: position.row - 1, col: position.col },
        { row: position.row + 1, col: position.col },
        { row: position.row, col: position.col - 1 },
        { row: position.row, col: position.col + 1 },
      ].filter(p => isValidPosition(p.row, p.col) && isInPalace(p, piece.player));
      
      for (const move of kingMoves) {
        const targetPiece = board[move.row][move.col];
        if (!targetPiece || targetPiece.player !== piece.player) {
          moves.push(move);
        }
      }
      break;

    case 'guard':
      const guardMoves = [
        { row: position.row - 1, col: position.col - 1 },
        { row: position.row - 1, col: position.col + 1 },
        { row: position.row + 1, col: position.col - 1 },
        { row: position.row + 1, col: position.col + 1 },
      ].filter(p => isValidPosition(p.row, p.col) && isInPalace(p, piece.player));
      
      for (const move of guardMoves) {
        const targetPiece = board[move.row][move.col];
        if (!targetPiece || targetPiece.player !== piece.player) {
          moves.push(move);
        }
      }
      break;

    case 'elephant':
      const elephantMoves = [
        { row: position.row - 2, col: position.col - 2 },
        { row: position.row - 2, col: position.col + 2 },
        { row: position.row + 2, col: position.col - 2 },
        { row: position.row + 2, col: position.col + 2 },
      ].filter(p => isValidPosition(p.row, p.col));
      
      for (const move of elephantMoves) {
        if (piece.player === 'red' && move.row < 5) continue;
        if (piece.player === 'black' && move.row > 4) continue;
        
        const midRow = (position.row + move.row) / 2;
        const midCol = (position.col + move.col) / 2;
        if (board[midRow][midCol]) continue;
        
        const targetPiece = board[move.row][move.col];
        if (!targetPiece || targetPiece.player !== piece.player) {
          moves.push(move);
        }
      }
      break;

    case 'horse':
      const horseMoves = [
        { row: position.row - 2, col: position.col - 1 },
        { row: position.row - 2, col: position.col + 1 },
        { row: position.row - 1, col: position.col - 2 },
        { row: position.row - 1, col: position.col + 2 },
        { row: position.row + 1, col: position.col - 2 },
        { row: position.row + 1, col: position.col + 2 },
        { row: position.row + 2, col: position.col - 1 },
        { row: position.row + 2, col: position.col + 1 },
      ].filter(p => isValidPosition(p.row, p.col));
      
      for (const move of horseMoves) {
        const dr = move.row - position.row;
        const dc = move.col - position.col;
        
        let blockerRow: number;
        let blockerCol: number;
        
        if (Math.abs(dr) === 2) {
          blockerRow = position.row + (dr > 0 ? 1 : -1);
          blockerCol = position.col;
        } else {
          blockerRow = position.row;
          blockerCol = position.col + (dc > 0 ? 1 : -1);
        }
        
        if (board[blockerRow][blockerCol]) continue;
        
        const targetPiece = board[move.row][move.col];
        if (!targetPiece || targetPiece.player !== piece.player) {
          moves.push(move);
        }
      }
      break;

    case 'chariot':
      const directions = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 },
      ];
      
      for (const { dr, dc } of directions) {
        let r = position.row + dr;
        let c = position.col + dc;
        while (isValidPosition(r, c)) {
          const targetPiece = board[r][c];
          if (!targetPiece) {
            moves.push({ row: r, col: c });
          } else {
            if (targetPiece.player !== piece.player) {
              moves.push({ row: r, col: c });
            }
            break;
          }
          r += dr;
          c += dc;
        }
      }
      break;

    case 'cannon':
      const directions2 = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 },
      ];
      
      for (const { dr, dc } of directions2) {
        let r = position.row + dr;
        let c = position.col + dc;
        let hasJumped = false;
        
        while (isValidPosition(r, c)) {
          const targetPiece = board[r][c];
          
          if (!targetPiece) {
            if (!hasJumped) {
              moves.push({ row: r, col: c });
            }
          } else {
            if (hasJumped) {
              if (targetPiece.player !== piece.player) {
                moves.push({ row: r, col: c });
              }
              break;
            }
            hasJumped = true;
          }
          r += dr;
          c += dc;
        }
      }
      break;

    case 'soldier':
      const step = piece.player === 'red' ? -1 : 1;
      const soldierMoves = [
        { row: position.row + step, col: position.col },
      ];
      
      const hasCrossedRiver = piece.player === 'red' ? position.row < 5 : position.row > 4;
      if (hasCrossedRiver) {
        soldierMoves.push(
          { row: position.row, col: position.col - 1 },
          { row: position.row, col: position.col + 1 }
        );
      }
      
      for (const move of soldierMoves) {
        if (!isValidPosition(move.row, move.col)) continue;
        
        const targetPiece = board[move.row][move.col];
        if (!targetPiece || targetPiece.player !== piece.player) {
          moves.push(move);
        }
      }
      break;
  }

  if (checkCheck) {
    return moves.filter(move => {
      const newBoard = board.map(row => [...row]);
      newBoard[move.row][move.col] = piece;
      newBoard[position.row][position.col] = null;
      return !isChecked(newBoard, piece.player);
    });
  }

  return moves;
};

export const movePiece = (
  board: (Piece | null)[][],
  from: Position,
  to: Position
): { newBoard: (Piece | null)[][]; captured: Piece | null } => {
  const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
  const piece = newBoard[from.row][from.col];
  const captured = newBoard[to.row][to.col];
  
  if (piece) {
    piece.position = { ...to };
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;
  }
  
  return { newBoard, captured };
};

export const checkWinner = (board: (Piece | null)[][], player: Player): Player | null => {
  const opponent: Player = player === 'red' ? 'black' : 'red';
  const kingPos = getKingPosition(board, opponent);
  
  if (!kingPos) return player;
  
  const hasValidMoves = () => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const piece = board[row][col];
        if (piece?.player === opponent) {
          const moves = getValidMoves(board, { row, col });
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  };
  
  if (!hasValidMoves()) return player;
  
  return null;
};
