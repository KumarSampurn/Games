import React, { useEffect, useState } from 'react';
import { easyWords, extremeWords } from './data/words';
import './App.css';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 20;
const DEFAULT_PLAYERS = 6;
const STORAGE_KEY = 'imposter-player-count';
const NAMES_STORAGE_KEY = 'imposter-player-names';
const MODE_STORAGE_KEY = 'imposter-mode';
const DEFAULT_MODE = 'easy';

function randomReference(mode, previousWords = []) {
  const references = mode === 'extreme' ? extremeWords : easyWords.map((word) => ({ word, category: 'everyday' }));
  const excludedWords = Array.isArray(previousWords) ? previousWords : [previousWords];
  const availableReferences = references.filter((reference) => !excludedWords.includes(reference.word));
  return availableReferences[Math.floor(Math.random() * availableReferences.length)].word;
}

function newRound(playerNames, mode, previousWord = '') {
  return { playerNames, playerCount: playerNames.length, mode, secretWord: randomReference(mode, [previousWord]), imposter: Math.floor(Math.random() * playerNames.length) + 1, currentPlayer: 1, viewed: false, revealed: false };
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function Header() {
  return <header className="app-header"><span className="collection-label">EPSILONCODES GAMES</span></header>;
}

function Setup({ playerCount, playerNames, mode, onModeChange, onPlayerCountChange, onPlayerNameChange, onShuffle, onStart }) {
  const duplicateIndexes = playerNames.reduce((duplicates, name, index) => {
    const normalized = name.trim().toLowerCase();
    if (normalized && playerNames.some((otherName, otherIndex) => otherIndex !== index && otherName.trim().toLowerCase() === normalized)) duplicates.push(index);
    return duplicates;
  }, []);
  const emptyIndexes = playerNames.reduce((empty, name, index) => {
    if (!name.trim()) empty.push(index);
    return empty;
  }, []);
  const hasInvalidNames = duplicateIndexes.length > 0 || emptyIndexes.length > 0;

  return <main className="screen screen-setup"><h1>IMPOSTER</h1><section className="setup-panel"><div className="setup-heading"><div><span className="panel-label">Players</span><strong>{playerCount}</strong></div><div className="player-count"><button className="stepper-button" onClick={() => onPlayerCountChange(playerCount - 1)} disabled={playerCount <= MIN_PLAYERS} aria-label="Remove player">-</button><button className="stepper-button" onClick={() => onPlayerCountChange(playerCount + 1)} disabled={playerCount >= MAX_PLAYERS} aria-label="Add player">+</button></div></div><div className="player-names">{playerNames.map((name, index) => <label className={`name-field ${duplicateIndexes.includes(index) || emptyIndexes.includes(index) ? 'has-error' : ''}`} key={index}><span>{index + 1}</span><input value={name} onChange={(event) => onPlayerNameChange(index, event.target.value)} placeholder={`Player ${index + 1}`} maxLength="24" aria-label={`Name for player ${index + 1}`} /></label>)}</div><button className="shuffle-button" onClick={onShuffle}>Shuffle <span aria-hidden="true">↻</span></button>{hasInvalidNames && <p className="validation-message">Use a unique name for every player.</p>}<div className="mode-section"><span className="panel-label">Mode</span><div className="mode-switch" role="group" aria-label="Game mode"><button className={mode === 'easy' ? 'is-selected' : ''} onClick={() => onModeChange('easy')}>Easy</button><button className={mode === 'extreme' ? 'is-selected' : ''} onClick={() => onModeChange('extreme')}>Extreme</button></div><p className="mode-helper">{mode === 'easy' ? 'Simple everyday words' : 'Indian internet & pop culture'}</p></div></section><button className="primary-button start-button" onClick={onStart} disabled={hasInvalidNames}>Start Game <span aria-hidden="true">→</span></button></main>;
}

function RoleDistribution({ round, onReveal, onSkip, onNext }) {
  const isLastPlayer = round.currentPlayer === round.playerCount;
  const canAdvance = round.viewed && !round.revealed;
  const role = round.currentPlayer === round.imposter ? 'IMPOSTER' : round.secretWord;
  return <main className="screen role-screen"><div className="player-progress">{round.currentPlayer} / {round.playerCount}</div><h2>Pass the phone to</h2><p className="current-player-name">{round.playerNames[round.currentPlayer - 1]}</p><button className={`role-card ${round.revealed ? 'is-revealed' : ''}`} onClick={onReveal} aria-label={round.revealed ? 'Hide role' : 'Reveal role'}><span className="card-kicker">{round.revealed ? 'YOUR ROLE' : 'TAP TO REVEAL'}</span><span className={`role-value ${round.currentPlayer === round.imposter && round.revealed ? 'imposter-value' : ''}`}>{round.revealed ? role : '?'}</span><span className="card-hint">{round.revealed ? 'Tap to hide' : 'Keep it secret'}</span></button>{round.currentPlayer === 1 && round.currentPlayer !== round.imposter && round.revealed && <button className="secondary-button skip-button" onClick={onSkip}>Skip Word <span aria-hidden="true">↻</span></button>}<button className="primary-button next-button" onClick={onNext} disabled={!canAdvance}>{isLastPlayer ? 'Start the Game' : 'Next Player'} <span aria-hidden="true">→</span></button></main>;
}

function GameInProgress({ onReveal }) {
  return <main className="screen game-screen"><h2>Everyone ready?</h2><p className="screen-copy">Give clues, discuss, and vote.</p><button className="primary-button reveal-button" onClick={onReveal}>Reveal the Imposter <span aria-hidden="true">→</span></button></main>;
}

function Result({ round, onPlayAgain, onSetup }) {
  return <main className="screen result-screen"><h2>The Imposter was</h2><p className="imposter-name">{round.playerNames[round.imposter - 1]}</p><div className="answer-panel"><span>The reference was</span><strong>{round.secretWord}</strong></div><div className="result-actions"><button className="primary-button" onClick={onPlayAgain}>Play Again <span aria-hidden="true">↻</span></button><button className="secondary-button" onClick={onSetup}>Back to Setup</button></div></main>;
}

export default function App() {
  const [playerCount, setPlayerCount] = useState(() => { const saved = Number(sessionStorage.getItem(STORAGE_KEY)); return saved >= MIN_PLAYERS && saved <= MAX_PLAYERS ? saved : DEFAULT_PLAYERS; });
  const [playerNames, setPlayerNames] = useState(() => { const savedNames = JSON.parse(sessionStorage.getItem(NAMES_STORAGE_KEY) || 'null'); return Array.from({ length: playerCount }, (_, index) => savedNames?.[index] || `Player ${index + 1}`); });
  const [mode, setMode] = useState(() => sessionStorage.getItem(MODE_STORAGE_KEY) || DEFAULT_MODE);
  const [screen, setScreen] = useState('setup');
  const [round, setRound] = useState(null);
  const [lastWord, setLastWord] = useState('');
  useEffect(() => { sessionStorage.setItem(STORAGE_KEY, String(playerCount)); }, [playerCount]);
  useEffect(() => { sessionStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(playerNames)); }, [playerNames]);
  useEffect(() => { sessionStorage.setItem(MODE_STORAGE_KEY, mode); }, [mode]);
  const updatePlayerCount = (value) => { const nextCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, value)); setPlayerCount(nextCount); setPlayerNames((current) => Array.from({ length: nextCount }, (_, index) => current[index] || `Player ${index + 1}`)); };
  const updatePlayerName = (index, name) => setPlayerNames((current) => current.map((currentName, nameIndex) => nameIndex === index ? name : currentName));
  const shufflePlayers = () => setPlayerNames((current) => shuffle(current));
  const startRound = () => { const names = playerNames.map((name) => name.trim()); setPlayerNames(names); const nextRound = newRound(names, mode, lastWord); setLastWord(nextRound.secretWord); setRound(nextRound); setScreen('roles'); };
  const revealRole = () => setRound((current) => ({ ...current, revealed: !current.revealed, viewed: true }));
  const skipWord = () => setRound((current) => current.currentPlayer === 1 && current.currentPlayer !== current.imposter ? { ...current, secretWord: randomReference(current.mode, [current.secretWord, lastWord]), viewed: false, revealed: false } : current);
  const nextPlayer = () => { if (!round.viewed || round.revealed) return; if (round.currentPlayer === round.playerCount) setScreen('playing'); else setRound((current) => ({ ...current, currentPlayer: current.currentPlayer + 1, viewed: false, revealed: false })); };
  const backToSetup = () => { setRound(null); setScreen('setup'); };
  const playAgain = () => { const nextRound = newRound(round.playerNames, round.mode, lastWord); setLastWord(nextRound.secretWord); setRound(nextRound); setScreen('roles'); };
  return <div className="app-shell"><Header />{screen === 'setup' && <Setup playerCount={playerCount} playerNames={playerNames} mode={mode} onModeChange={setMode} onPlayerCountChange={updatePlayerCount} onPlayerNameChange={updatePlayerName} onShuffle={shufflePlayers} onStart={startRound} />}{screen === 'roles' && round && <RoleDistribution round={round} onReveal={revealRole} onSkip={skipWord} onNext={nextPlayer} />}{screen === 'playing' && <GameInProgress onReveal={() => setScreen('result')} />}{screen === 'result' && round && <Result round={round} onPlayAgain={playAgain} onSetup={backToSetup} />}</div>;
}
