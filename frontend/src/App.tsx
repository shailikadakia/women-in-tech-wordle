import { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { ResultModal } from './components/ResultModal';
import { toast } from 'sonner';
import { getDaily, getRandomName, getWITInfo, WomanInTech } from './api/women-in-tech';

interface GameState {
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  date: string;
}

const OFFLINE_DAILY = {
  date: new Date().toISOString().split('T')[0],
  woman: { id: 1, name: 'Ada Lovelace' } as WomanInTech,
  target: 'ADALOVELACE',
  length: 'ADALOVELACE'.length
};

export default function App() {
  const maxGuesses = 6;
  console.log('Origin:', window.location.origin);

  const [daily, setDaily] = useState<{
    date: string;
    woman: WomanInTech;
    target: string;
    length: number;
  } | null>(null);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [randomId, setRandomId] = useState<number | null>(null);
  const [randomWoman, setRandomWoman] = useState<WomanInTech | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('[App] Fetching daily puzzle...');
        const payload = await getDaily();
        console.log('[App] Daily payload:', payload);
        setDaily({
          date: payload.date,
          woman: payload.woman,
          target: String(payload.target || '').toUpperCase(),
          length: Number(payload.length || 0)
        });
        const savedRaw = localStorage.getItem('womenInTechWordle');
        if (savedRaw) {
          const saved = JSON.parse(savedRaw) as GameState;
          if (saved?.date === payload.date) {
            console.log('[App] Restoring saved game for', payload.date);
            setGameState(saved);
            return;
          }
        }
        setGameState({ guesses: [], currentGuess: '', gameStatus: 'playing', date: payload.date });
      } catch (e: any) {
        console.error('getDaily failed:', e);
        console.warn('[App] Using OFFLINE_DAILY fallback');
        setDaily(OFFLINE_DAILY);
        setGameState({ guesses: [], currentGuess: '', gameStatus: 'playing', date: OFFLINE_DAILY.date });
        setLoadError(e?.message ?? 'Failed to load daily puzzle (using offline fallback)');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const id = await getRandomName();
        console.log('[App] Random ID:', id);
        setRandomId(id);
      } catch (e) {
        console.error('getRandomName failed:', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (randomId === null) return;
    (async () => {
      try {
        const w = await getWITInfo(randomId);
        console.log('[App] Random Woman:', w);
        setRandomWoman(w);
      } catch (e) {
        console.error('getWITInfo failed:', e);
      }
    })();
  }, [randomId]);

  useEffect(() => {
    if (gameState) localStorage.setItem('womenInTechWordle', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    if (gameState && gameState.gameStatus !== 'playing') {
      setTimeout(() => setShowResult(true), 500);
    }
  }, [gameState?.gameStatus]);

  // Keyboard handling
  const handleKeyPress = (key: string) => {
    if (!daily || !gameState || gameState.gameStatus !== 'playing') return;

    const targetWord = daily.target;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== targetWord.length) {
        toast.error(`Word must be ${targetWord.length} letters long`);
        return;
      }
      const newGuesses = [...gameState.guesses, gameState.currentGuess];
      const won = gameState.currentGuess === targetWord;
      const lost = !won && newGuesses.length >= maxGuesses;

      const next: GameState = {
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing'
      };
      setGameState(next);

      if (won) toast.success('Congratulations! 🎉');
      else if (lost) toast.info(`The answer was ${daily.woman.name}`);
    } else if (key === 'BACKSPACE') {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1)
      });
    } else {
      if (/^[A-Z]$/.test(key) && gameState.currentGuess.length < targetWord.length) {
        setGameState({
          ...gameState,
          currentGuess: gameState.currentGuess + key.toUpperCase()
        });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState?.gameStatus !== 'playing') return;
      if (e.key === 'Enter') handleKeyPress('ENTER');
      else if (e.key === 'Backspace') handleKeyPress('BACKSPACE');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, daily]);

  // Render states
  if (!daily || !gameState) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Loading…</h1>
      </div>
    );
  }

  const targetWord = daily.target;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pb-4 border-b border-gray-300">
          <h1 className="text-black mb-2">Women in Tech Wordle</h1>
          <p className="text-gray-700">Guess the name of an inspiring woman in tech!</p>
          <p className="text-gray-500 mt-1">{targetWord.length} letters • {maxGuesses} guesses</p>
          <p className="text-gray-400 text-sm mt-1">Puzzle date: {daily.date}</p>
          {loadError && <p className="text-amber-600 mt-2">Note: {loadError}</p>}
        </div>

        <div className="mb-8">
          <GameBoard
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            targetWord={targetWord}
            maxGuesses={maxGuesses}
          />
        </div>

        <Keyboard
          onKeyPress={handleKeyPress}
          guesses={gameState.guesses}
          targetWord={targetWord}
        />

        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          woman={daily.woman}
          won={gameState.gameStatus === 'won'}
          guessCount={gameState.guesses.length}
        />
      </div>
    </div>
  );
}

