import { useState, useEffect, useCallback } from 'react';
import { ChessBoard } from './ChessBoard';
import { GameControls } from './GameControls';
import { GameOverModal } from './GameOverModal';
import { GameState, Difficulty, GameHistory } from '../types';
import { INITIAL_BOARD, getValidMoves, movePiece, checkWinner } from '../utils/board';
import { getAIMove } from '../utils/ai';
import { PIECE_POINTS } from '../utils/board';
const STORAGE_KEY = 'chinese-chess-score';
const createInitialState = (difficulty: Difficulty): GameState => ({
 board: INITIAL_BOARD.map(row => row.map(cell => cell ? { ...cell } : null)),
 currentPlayer: 'red',
 selectedPiece: null,
 validMoves: [],
 winner: null,
 gameOver: false,
 difficulty,
 score: parseInt(localStorage.getItem(STORAGE_KEY) || '1000'),
 playerScore: 0,
 aiScore: 0,
 lastMove: null,
});
export const Game = () => {
 const [gameState, setGameState] = useState<GameState>(() => createInitialState('middle'));
 const [history, setHistory] = useState<GameHistory[]>([]);
 const [isAIThinking, setIsAIThinking] = useState(false);
 useEffect(() => {
 localStorage.setItem(STORAGE_KEY, gameState.score.toString());
 }, [gameState.score]);
 useEffect(() => {
 if (gameState.currentPlayer === 'black' && !gameState.gameOver) {
 setIsAIThinking(true);
 const timer = setTimeout(() => {
 const move = getAIMove(gameState.board, 'black', gameState.difficulty);
 if (move) {
 handleAIMove(move.from, move.to);
 }
 setIsAIThinking(false);
 }, 800);
 return () => clearTimeout(timer);
 }
 }, [gameState.currentPlayer, gameState.board, gameState.gameOver, gameState.difficulty]);
 const handleAIMove = useCallback((from: {
 row: number;
 col: number;
 }, to: {
 row: number;
 col: number;
 }) => {
 setGameState(prev => {
 const { newBoard, captured } = movePiece(prev.board, from, to);
 const winner = checkWinner(newBoard, 'black');
 let newScore = prev.score;
 let newAiScore = prev.aiScore;
 if (captured) {
 newAiScore += PIECE_POINTS[captured.type];
 }
 if (winner === 'black') {
 newScore -= 100;
 }
 return {
 ...prev,
 board: newBoard,
 currentPlayer: 'red',
 selectedPiece: null,
 validMoves: [],
 winner,
 gameOver: winner !== null,
 score: newScore,
 aiScore: newAiScore,
 lastMove: { from, to },
 };
 });
 }, []);
 const handleCellClick = useCallback((row: number, col: number) => {
 if (gameState.currentPlayer !== 'red' || gameState.gameOver)
 return;
 const clickedPiece = gameState.board[row][col];
 if (gameState.selectedPiece) {
 if (gameState.selectedPiece.row === row && gameState.selectedPiece.col === col) {
 setGameState(prev => ({
 ...prev,
 selectedPiece: null,
 validMoves: [],
 }));
 return;
 }
 const isValidMove = gameState.validMoves.some(m => m.row === row && m.col === col);
 if (isValidMove) {
 setHistory(prev => [...prev, {
 board: gameState.board.map(r => r.map(c => c ? { ...c } : null)),
 currentPlayer: gameState.currentPlayer,
 }]);
 const { newBoard, captured } = movePiece(gameState.board, gameState.selectedPiece, { row, col });
 const winner = checkWinner(newBoard, 'red');
 let newScore = gameState.score;
 let newPlayerScore = gameState.playerScore;
 if (captured) {
 newPlayerScore += PIECE_POINTS[captured.type];
 }
 if (winner === 'red') {
 newScore += 100;
 }
 setGameState(prev => ({
 ...prev,
 board: newBoard,
 currentPlayer: 'black',
 selectedPiece: null,
 validMoves: [],
 winner,
 gameOver: winner !== null,
 score: newScore,
 playerScore: newPlayerScore,
 }));
 return;
 }
 }
 if (clickedPiece && clickedPiece.player === 'red') {
 const validMoves = getValidMoves(gameState.board, { row, col });
 setGameState(prev => ({
 ...prev,
 selectedPiece: { row, col },
 validMoves,
 }));
 }
 else {
 setGameState(prev => ({
 ...prev,
 selectedPiece: null,
 validMoves: [],
 }));
 }
 }, [gameState]);
 const handleNewGame = useCallback((difficulty?: Difficulty) => {
 const newDifficulty = difficulty || gameState.difficulty;
 setGameState(createInitialState(newDifficulty));
 setHistory([]);
 }, [gameState.difficulty]);
 const handleUndo = useCallback(() => {
 if (history.length === 0)
 return;
 const lastState = history[history.length - 1];
 setGameState(prev => ({
 ...prev,
 board: lastState.board,
 currentPlayer: lastState.currentPlayer,
 selectedPiece: null,
 validMoves: [],
 }));
 setHistory(prev => prev.slice(0, -1));
 }, [history]);
 const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
 handleNewGame(difficulty);
 }, [handleNewGame]);
 return (<div className="game-container">
 <div className="game-header">
 <h1 className="game-title">中国象棋</h1>
 <div className="subtitle">博大精深的传统智慧</div>
 </div>
 
 <div className="game-content">
 <ChessBoard board={gameState.board} selectedPiece={gameState.selectedPiece} validMoves={gameState.validMoves} lastMove={gameState.lastMove} onCellClick={handleCellClick}/>
 
 <GameControls difficulty={gameState.difficulty} score={gameState.score} playerScore={gameState.playerScore} aiScore={gameState.aiScore} currentPlayer={gameState.currentPlayer} gameOver={gameState.gameOver} winner={gameState.winner} onDifficultyChange={handleDifficultyChange} onNewGame={() => handleNewGame()} onUndo={handleUndo} canUndo={history.length > 0 && !gameState.gameOver}/>
 </div>

 {isAIThinking && (<div className="ai-thinking">
 <div className="thinking-spinner"></div>
 <span className="thinking-text">AI 思考中...</span>
 </div>)}

 {gameState.gameOver && gameState.winner && (<GameOverModal winner={gameState.winner} score={gameState.score} playerScore={gameState.playerScore} aiScore={gameState.aiScore} onNewGame={() => handleNewGame()}/>)}
 </div>);
};
