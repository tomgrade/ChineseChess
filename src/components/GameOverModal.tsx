import { Player } from '../types';

interface GameOverModalProps {
  winner: Player;
  score: number;
  playerScore: number;
  aiScore: number;
  onNewGame: () => void;
}

export const GameOverModal = ({ winner, score, playerScore, aiScore, onNewGame }: GameOverModalProps) => {
  const isPlayerWinner = winner === 'red';

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <div className="game-over-header">
          <div className="trophy-icon">
            {isPlayerWinner ? '🏆' : '😢'}
          </div>
          <h2 className="game-over-title">
            {isPlayerWinner ? '恭喜获胜！' : '游戏结束'}
          </h2>
        </div>
        
        <div className="game-over-content">
          <div className="result-text">
            {isPlayerWinner ? '您成功击败了AI！' : 'AI获得了胜利'}
          </div>
          
          <div className="score-summary">
            <div className="score-row">
              <span className="score-label">最终得分</span>
              <span className="score-value highlight">{score}</span>
            </div>
            <div className="score-row">
              <span className="score-label">玩家吃子</span>
              <span className="score-value red">{playerScore}</span>
            </div>
            <div className="score-row">
              <span className="score-label">AI吃子</span>
              <span className="score-value black">{aiScore}</span>
            </div>
          </div>
        </div>
        
        <div className="game-over-actions">
          <button className="action-btn primary" onClick={onNewGame}>
            再来一局
          </button>
        </div>
      </div>
    </div>
  );
};
