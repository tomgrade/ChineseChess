import { Piece } from '../types';
import { PIECE_NAMES } from '../utils/board';

interface GamePieceProps {
  piece: Piece;
  isSelected: boolean;
  onClick: () => void;
}

export const GamePiece = ({ piece, isSelected, onClick }: GamePieceProps) => {
  const isRed = piece.player === 'red';
  
  return (
    <div
      className={`game-piece ${isRed ? 'red' : 'black'} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="piece-symbol">{PIECE_NAMES[piece.type][piece.player]}</span>
    </div>
  );
};
