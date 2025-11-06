import { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { ResultModal } from './components/ResultModal';
import { getDailyWord, getTodayDateString, WomanInTech } from './api/women-in-tech';
import { toast } from 'sonner';
import { getRandomName, getWITInfo } from './api/women-in-tech';
interface GameState {
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  date: string;
}

export default function App() {
  const dailyWoman = getDailyWord();
  const targetWord = dailyWoman.name.replace(/\s/g, ''); // Remove spaces for gameplay
  const maxGuesses = 6;
  const todayDate = getTodayDateString();

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('womenInTechWordle');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's from today
      if (parsed.date === todayDate) {
        return parsed;
      }
    }
    return {
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      date: todayDate
    };
  });

  const [showResult, setShowResult] = useState(false);
  const [randomId, setRandomId] = useState<number | null>(null);
  const [randomWoman, setRandomWoman] = useState<WomanInTech | null>(null);

  // 1) Fetch the random id once
  useEffect(() => {
    (async () => {
      try {
        const id = await getRandomName();
        console.log('random id:', id);
        setRandomId(id);
      } catch (e) {
        console.error('getRandomId failed:', e);
      }
    })();
  }, []);

  // 2) When id is set, fetch the woman
  useEffect(() => {
    if (randomId === null) return;
    (async () => {
      try {
        console.log('fetching woman with id:', randomId);
        const w = await getWITInfo(randomId);
        console.log('woman:', w);
        setRandomWoman(w);
      } catch (e) {
        console.error('getWITInfo failed:', e);
      }
    })();
  }, [randomId]);


  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem('womenInTechWordle', JSON.stringify(gameState));
  }, [gameState]);

  // Show result modal when game ends
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      setTimeout(() => setShowResult(true), 500);
    }
  }, [gameState.gameStatus]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const handleKeyPress = (key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== targetWord.length) {
        toast.error(`Word must be ${targetWord.length} letters long`);
        return;
      }

      const newGuesses = [...gameState.guesses, gameState.currentGuess];
      const won = gameState.currentGuess === targetWord;
      const lost = !won && newGuesses.length >= maxGuesses;

      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing'
      });

      if (won) {
        toast.success('Congratulations! 🎉');
      } else if (lost) {
        toast.info(`The answer was ${dailyWoman.name}`);
      }
    } else if (key === 'BACKSPACE') {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1)
      });
    } else {
      if (gameState.currentGuess.length < targetWord.length) {
        setGameState({
          ...gameState,
          currentGuess: gameState.currentGuess + key
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pb-4 border-b border-gray-300">
          <h1 className="text-black mb-2">Women in Tech Wordle</h1>
          <p className="text-gray-700">
            Guess the name of an inspiring woman in tech!
          </p>
          <p className="text-gray-500 mt-1">
            {targetWord.length} letters • {maxGuesses} guesses
          </p>
        </div>

        {/* Game Board */}
        <div className="mb-8">
          <GameBoard
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            targetWord={targetWord}
            maxGuesses={maxGuesses}
          />
        </div>

        {/* Keyboard */}
        <Keyboard
          onKeyPress={handleKeyPress}
          guesses={gameState.guesses}
          targetWord={targetWord}
        />

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-600 space-y-2">
          <p>Guess the woman in tech's name (without spaces)</p>
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#6aaa64] rounded"></div>
              <span>Correct position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#c9b458] rounded"></div>
              <span>Wrong position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#787c7e] rounded"></div>
              <span>Not in word</span>
            </div>
          </div>
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          woman={dailyWoman}
          won={gameState.gameStatus === 'won'}
          guessCount={gameState.guesses.length}
        />
      </div>
    </div>
  );
}
