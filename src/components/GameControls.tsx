import { Difficulty } from '../types';

interface GameControlsProps {
  difficulty: Difficulty;
  score: number;
  playerScore: number;
  aiScore: number;
  currentPlayer: 'red' | 'black';
  gameOver: boolean;
  winner: 'red' | 'black' | null;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  child: '小孩',
  middle: '中年人',
  elder: '老者',
};

export const GameControls = ({
  difficulty,
  score,
  playerScore,
  aiScore,
  currentPlayer,
  gameOver,
  winner,
  onDifficultyChange,
  onNewGame,
  onUndo,
  canUndo,
}: GameControlsProps) => {
  return (
    <div className="game-controls">
      <div className="score-panel">
        <div className="score-item">
          <span className="score-label">总分</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="score-item">
          <span className="score-label">玩家</span>
          <span className="score-value red">{playerScore}</span>
        </div>
        <div className="score-item">
          <span className="score-label">AI</span>
          <span className="score-value black">{aiScore}</span>
        </div>
      </div>

      <div className="difficulty-panel">
        <span className="panel-title">难度选择</span>
        <div className="difficulty-buttons">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              className={`difficulty-btn difficulty-${diff} ${difficulty === diff ? 'active' : ''}`}
              onClick={() => onDifficultyChange(diff)}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>
      </div>

      <div className="status-panel">
        {gameOver ? (
          <div className="game-over">
            <span className="winner-text">
              {winner === 'red' ? '🎉 玩家胜利!' : '😢 AI胜利!'}
            </span>
          </div>
        ) : (
          <div className="current-turn">
            <span className={`turn-indicator ${currentPlayer}`}></span>
            <span className="turn-text">
              {currentPlayer === 'red' ? '玩家' : 'AI'} 回合
            </span>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="action-btn new-game" onClick={onNewGame}>
          新游戏
        </button>
        <button
          className={`action-btn undo ${!canUndo ? 'disabled' : ''}`}
          onClick={onUndo}
          disabled={!canUndo}
        >
          悔棋
        </button>
      </div>
    </div>
  );
};
