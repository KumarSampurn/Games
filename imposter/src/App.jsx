import React, { useEffect, useState } from 'react';
import { easyWords, extremeWords } from './data/words';
import './App.css';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 20;
const DEFAULT_PLAYERS = 6;
const STORAGE_KEY = 'imposter-player-count';
const NAMES_STORAGE_KEY = 'imposter-player-names';
const MODE_STORAGE_KEY = 'imposter-mode';
const IMPOSTER_COUNT_STORAGE_KEY = 'imposter-count';
const IMPOSTER_HISTORY_STORAGE_KEY = 'imposter-history';
const REFERENCE_HISTORY_STORAGE_KEY = 'imposter-reference-history';
const DEFAULT_MODE = 'easy';
const DEFAULT_IMPOSTERS = 1;

function maxImposters(playerCount) {
  return Math.max(1, Math.floor((playerCount - 1) / 2));
}

function randomReference(mode, previousWords = [], history = {}) {
  const references = mode === 'extreme' ? extremeWords : easyWords.map((word) => ({ word, category: 'everyday' }));
  const excludedWords = Array.isArray(previousWords) ? previousWords : [previousWords];
  const availableReferences = references.filter((reference) => !excludedWords.includes(reference.word));
  const highestCount = Math.max(...availableReferences.map((reference) => history[reference.word] || 0), 0);
  const weightedReferences = availableReferences.map((reference) => ({ reference, weight: highestCount - (history[reference.word] || 0) + 1 }));
  const totalWeight = weightedReferences.reduce((total, reference) => total + reference.weight, 0);
  let threshold = Math.random() * totalWeight;
  const selected = weightedReferences.find((reference) => {
    threshold -= reference.weight;
    return threshold < 0;
  });
  return (selected || weightedReferences[weightedReferences.length - 1]).reference.word;
}

function normalizedName(name) {
  return name.trim().toLowerCase();
}

function weightedImposters(playerNames, imposterCount, history) {
  const counts = playerNames.map((name) => history[normalizedName(name)] || 0);
  const highestCount = Math.max(...counts, 0);
  const candidates = playerNames.map((name, index) => ({ playerNumber: index + 1, weight: highestCount - counts[index] + 1 }));
  const selected = [];

  while (selected.length < imposterCount && candidates.length) {
    const totalWeight = candidates.reduce((total, candidate) => total + candidate.weight, 0);
    let threshold = Math.random() * totalWeight;
    const selectedIndex = candidates.findIndex((candidate) => {
      threshold -= candidate.weight;
      return threshold < 0;
    });
    selected.push(candidates.splice(selectedIndex < 0 ? candidates.length - 1 : selectedIndex, 1)[0].playerNumber);
  }

  return selected;
}

function newRound(playerNames, mode, previousWord = '', imposterCount = DEFAULT_IMPOSTERS, imposterHistory = {}, referenceHistory = {}) {
  return { playerNames, playerCount: playerNames.length, mode, secretWord: randomReference(mode, [previousWord], referenceHistory), imposters: weightedImposters(playerNames, imposterCount, imposterHistory), currentPlayer: 1, viewed: false, revealed: false };
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

function Setup({ playerCount, playerNames, imposterCount, mode, onModeChange, onPlayerCountChange, onImposterCountChange, onPlayerNameChange, onShuffle, onStart }) {
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

  return <main className="screen screen-setup"><h1>IMPOSTER</h1><section className="setup-panel"><div className="setup-heading"><div><span className="panel-label">Players</span><strong>{playerCount}</strong></div><div className="player-count"><button className="stepper-button" onClick={() => onPlayerCountChange(playerCount - 1)} disabled={playerCount <= MIN_PLAYERS} aria-label="Remove player">-</button><button className="stepper-button" onClick={() => onPlayerCountChange(playerCount + 1)} disabled={playerCount >= MAX_PLAYERS} aria-label="Add player">+</button></div></div><div className="player-names">{playerNames.map((name, index) => <label className={`name-field ${duplicateIndexes.includes(index) || emptyIndexes.includes(index) ? 'has-error' : ''}`} key={index}><span>{index + 1}</span><input value={name} onChange={(event) => onPlayerNameChange(index, event.target.value)} placeholder={`Player ${index + 1}`} maxLength="24" aria-label={`Name for player ${index + 1}`} /></label>)}</div><button className="shuffle-button" onClick={onShuffle}>Shuffle <span aria-hidden="true">↻</span></button><div className="imposter-setting"><div><span className="panel-label">Imposters</span><strong>{imposterCount}</strong></div><div className="player-count"><button className="stepper-button" onClick={() => onImposterCountChange(imposterCount - 1)} disabled={imposterCount <= 1} aria-label="Remove imposter">-</button><button className="stepper-button" onClick={() => onImposterCountChange(imposterCount + 1)} disabled={imposterCount >= maxImposters(playerCount)} aria-label="Add imposter">+</button></div></div>{hasInvalidNames && <p className="validation-message">Use a unique name for every player.</p>}<div className="mode-section"><span className="panel-label">Mode</span><div className="mode-switch" role="group" aria-label="Game mode"><button className={mode === 'easy' ? 'is-selected' : ''} onClick={() => onModeChange('easy')}>Easy</button><button className={mode === 'extreme' ? 'is-selected' : ''} onClick={() => onModeChange('extreme')}>Extreme</button></div><p className="mode-helper">{mode === 'easy' ? 'Simple everyday words' : 'Indian internet & pop culture'}</p></div></section><button className="primary-button start-button" onClick={onStart} disabled={hasInvalidNames}>Start Game <span aria-hidden="true">→</span></button></main>;
}

function RoleDistribution({ round, onReveal, onSkip, onNext }) {
  const isLastPlayer = round.currentPlayer === round.playerCount;
  const canAdvance = round.viewed && !round.revealed;
  const isImposter = round.imposters.includes(round.currentPlayer);
  const role = isImposter ? 'IMPOSTER' : round.secretWord;
  return <main className="screen role-screen"><div className="player-progress">{round.currentPlayer} / {round.playerCount}</div><h2>Pass the phone to</h2><p className="current-player-name">{round.playerNames[round.currentPlayer - 1]}</p><button className={`role-card ${round.revealed ? 'is-revealed' : ''}`} onClick={onReveal} aria-label={round.revealed ? 'Hide role' : 'Reveal role'}><span className="card-kicker">{round.revealed ? 'YOUR ROLE' : 'TAP TO REVEAL'}</span><span className={`role-value ${isImposter && round.revealed ? 'imposter-value' : ''}`}>{round.revealed ? role : '?'}</span><span className="card-hint">{round.revealed ? 'Tap to hide' : 'Keep it secret'}</span></button>{round.currentPlayer === 1 && !isImposter && round.revealed && <button className="secondary-button skip-button" onClick={onSkip}>Skip Word <span aria-hidden="true">↻</span></button>}<button className="primary-button next-button" onClick={onNext} disabled={!canAdvance}>{isLastPlayer ? 'Start the Game' : 'Next Player'} <span aria-hidden="true">→</span></button></main>;
}

function GameInProgress({ onReveal }) {
  return <main className="screen game-screen"><h2>Everyone ready?</h2><p className="screen-copy">Give clues, discuss, and vote.</p><button className="primary-button reveal-button" onClick={onReveal}>Reveal the Imposter <span aria-hidden="true">→</span></button></main>;
}

function Result({ round, onPlayAgain, onSetup }) {
  const imposterNames = round.imposters.map((playerNumber) => round.playerNames[playerNumber - 1]).join(', ');
  const hasMultipleImposters = round.imposters.length > 1;
  return <main className="screen result-screen"><h2>{hasMultipleImposters ? 'The Imposters were' : 'The Imposter was'}</h2><p className="imposter-name">{imposterNames}</p><div className="answer-panel"><span>The reference was</span><strong>{round.secretWord}</strong></div><div className="result-actions"><button className="primary-button" onClick={onPlayAgain}>Play Again <span aria-hidden="true">↻</span></button><button className="secondary-button" onClick={onSetup}>Back to Setup</button></div></main>;
}

export default function App() {
  const [playerCount, setPlayerCount] = useState(() => { const saved = Number(sessionStorage.getItem(STORAGE_KEY)); return saved >= MIN_PLAYERS && saved <= MAX_PLAYERS ? saved : DEFAULT_PLAYERS; });
  const [playerNames, setPlayerNames] = useState(() => { const savedNames = JSON.parse(sessionStorage.getItem(NAMES_STORAGE_KEY) || 'null'); return Array.from({ length: playerCount }, (_, index) => savedNames?.[index] || `Player ${index + 1}`); });
  const [imposterCount, setImposterCount] = useState(() => { const saved = Number(sessionStorage.getItem(IMPOSTER_COUNT_STORAGE_KEY)); return saved >= 1 && saved <= maxImposters(playerCount) ? saved : DEFAULT_IMPOSTERS; });
  const [imposterHistory, setImposterHistory] = useState(() => JSON.parse(sessionStorage.getItem(IMPOSTER_HISTORY_STORAGE_KEY) || '{}'));
  const [referenceHistory, setReferenceHistory] = useState(() => JSON.parse(sessionStorage.getItem(REFERENCE_HISTORY_STORAGE_KEY) || '{}'));
  const [mode, setMode] = useState(() => sessionStorage.getItem(MODE_STORAGE_KEY) || DEFAULT_MODE);
  const [screen, setScreen] = useState('setup');
  const [round, setRound] = useState(null);
  const [lastWord, setLastWord] = useState('');
  useEffect(() => { sessionStorage.setItem(STORAGE_KEY, String(playerCount)); }, [playerCount]);
  useEffect(() => { sessionStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(playerNames)); }, [playerNames]);
  useEffect(() => { sessionStorage.setItem(IMPOSTER_COUNT_STORAGE_KEY, String(imposterCount)); }, [imposterCount]);
  useEffect(() => { sessionStorage.setItem(IMPOSTER_HISTORY_STORAGE_KEY, JSON.stringify(imposterHistory)); }, [imposterHistory]);
  useEffect(() => { sessionStorage.setItem(REFERENCE_HISTORY_STORAGE_KEY, JSON.stringify(referenceHistory)); }, [referenceHistory]);
  useEffect(() => { sessionStorage.setItem(MODE_STORAGE_KEY, mode); }, [mode]);
  const updatePlayerCount = (value) => { const nextCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, value)); setPlayerCount(nextCount); setImposterCount((current) => Math.min(current, maxImposters(nextCount))); setPlayerNames((current) => Array.from({ length: nextCount }, (_, index) => current[index] || `Player ${index + 1}`)); };
  const updateImposterCount = (value) => setImposterCount(Math.max(1, Math.min(maxImposters(playerCount), value)));
  const updatePlayerName = (index, name) => setPlayerNames((current) => current.map((currentName, nameIndex) => nameIndex === index ? name : currentName));
  const shufflePlayers = () => setPlayerNames((current) => shuffle(current));
  const startRound = () => { const names = shuffle(playerNames.map((name) => name.trim())); setPlayerNames(names); const nextRound = newRound(names, mode, lastWord, imposterCount, imposterHistory, referenceHistory); setLastWord(nextRound.secretWord); setRound(nextRound); setScreen('roles'); };
  const revealRole = () => setRound((current) => ({ ...current, revealed: !current.revealed, viewed: true }));
  const skipWord = () => setRound((current) => current.currentPlayer === 1 && !current.imposters.includes(current.currentPlayer) ? { ...current, secretWord: randomReference(current.mode, [current.secretWord, lastWord], referenceHistory), viewed: false, revealed: false } : current);
  const nextPlayer = () => { if (!round.viewed || round.revealed) return; if (round.currentPlayer === round.playerCount) setScreen('playing'); else setRound((current) => ({ ...current, currentPlayer: current.currentPlayer + 1, viewed: false, revealed: false })); };
  const backToSetup = () => { setRound(null); setScreen('setup'); };
  const revealResult = () => { if (!round) return; setImposterHistory((current) => round.imposters.reduce((history, playerNumber) => { const name = normalizedName(round.playerNames[playerNumber - 1]); return { ...history, [name]: (history[name] || 0) + 1 }; }, current)); setReferenceHistory((current) => ({ ...current, [round.secretWord]: (current[round.secretWord] || 0) + 1 })); setScreen('result'); };
  const playAgain = () => { const names = shuffle(round.playerNames); setPlayerNames(names); const nextRound = newRound(names, round.mode, lastWord, round.imposters.length, imposterHistory, referenceHistory); setLastWord(nextRound.secretWord); setRound(nextRound); setScreen('roles'); };
  return <div className="app-shell"><Header />{screen === 'setup' && <Setup playerCount={playerCount} playerNames={playerNames} imposterCount={imposterCount} mode={mode} onModeChange={setMode} onPlayerCountChange={updatePlayerCount} onImposterCountChange={updateImposterCount} onPlayerNameChange={updatePlayerName} onShuffle={shufflePlayers} onStart={startRound} />}{screen === 'roles' && round && <RoleDistribution round={round} onReveal={revealRole} onSkip={skipWord} onNext={nextPlayer} />}{screen === 'playing' && <GameInProgress onReveal={revealResult} />}{screen === 'result' && round && <Result round={round} onPlayAgain={playAgain} onSetup={backToSetup} />}</div>;
}
