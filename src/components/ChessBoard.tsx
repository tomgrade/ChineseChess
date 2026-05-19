import { Piece, Position, LastMove } from '../types';
import { GamePiece } from './GamePiece';
import { BOARD_SIZE } from '../utils/board';

interface ChessBoardProps {
  board: (Piece | null)[][];
  selectedPiece: Position | null;
  validMoves: Position[];
  lastMove: LastMove | null;
  onCellClick: (row: number, col: number) => void;
}

export const ChessBoard = ({ board, selectedPiece, validMoves, lastMove, onCellClick }: ChessBoardProps) => {
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedPiece?.row === row && selectedPiece?.col === col;
  };

  const isLastMoveFrom = (row: number, col: number): boolean => {
    return lastMove?.from.row === row && lastMove?.from.col === col;
  };

  const isLastMoveTo = (row: number, col: number): boolean => {
    return lastMove?.to.row === row && lastMove?.to.col === col;
  };

  const renderCell = (row: number, col: number) => {
    const piece = board[row][col];
    const isValid = isValidMove(row, col);
    const selected = isSelected(row, col);
    const isFrom = isLastMoveFrom(row, col);
    const isTo = isLastMoveTo(row, col);
    
    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${(row + col) % 2 === 0 ? 'light' : 'dark'} ${isValid ? 'valid-move' : ''} ${isFrom ? 'last-move-from' : ''} ${isTo ? 'last-move-to' : ''}`}
        onClick={() => onCellClick(row, col)}
      >
        {piece && (
          <GamePiece
            piece={piece}
            isSelected={selected}
            onClick={() => onCellClick(row, col)}
          />
        )}
        {isValid && !piece && (
          <div className="move-indicator"></div>
        )}
        {isFrom && !piece && (
          <div className="last-move-indicator from"></div>
        )}
      </div>
    );
  };

  return (
    <div className="chess-board">
      <div className="board-container">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={`board-row ${rowIndex === 4 ? 'river-row' : ''}`}>
            {row.map((_, colIndex) => {
              if (rowIndex === 4) {
                const piece = board[rowIndex][colIndex];
                const isValid = isValidMove(rowIndex, colIndex);
                const selected = isSelected(rowIndex, colIndex);
                const isFrom = isLastMoveFrom(rowIndex, colIndex);
                const isTo = isLastMoveTo(rowIndex, colIndex);
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell river-cell ${isValid ? 'valid-move' : ''} ${isFrom ? 'last-move-from' : ''} ${isTo ? 'last-move-to' : ''}`}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                  >
                    {colIndex === 2 && !piece && (
                      <div className="river-text">楚河</div>
                    )}
                    {colIndex === 6 && !piece && (
                      <div className="river-text">汉界</div>
                    )}
                    {piece && (
                      <GamePiece
                        piece={piece}
                        isSelected={selected}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                      />
                    )}
                    {isValid && !piece && (
                      <div className="move-indicator"></div>
                    )}
                    {isFrom && !piece && (
                      <div className="last-move-indicator from"></div>
                    )}
                  </div>
                );
              }
              return renderCell(rowIndex, colIndex);
            })}
          </div>
        ))}
      </div>
      <div className="board-labels">
        <div className="row-labels">
          {Array.from({ length: BOARD_SIZE }, (_, i) => (
            <div key={i} className="label">{10 - i}</div>
          ))}
        </div>
        <div className="col-labels">
          {['一', '二', '三', '四', '五', '六', '七', '八', '九'].map((label, i) => (
            <div key={i} className="label">{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
