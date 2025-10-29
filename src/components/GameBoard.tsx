interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  maxGuesses: number;
}

export function GameBoard({ guesses, currentGuess, targetWord, maxGuesses }: GameBoardProps) {
  const wordLength = targetWord.length;

  const getLetterStatus = (guess: string, index: number): 'correct' | 'present' | 'absent' | 'empty' => {
    if (!guess[index]) return 'empty';
    
    const letter = guess[index];
    const targetLetter = targetWord[index];
    
    if (letter === targetLetter) {
      return 'correct';
    }
    
    if (targetWord.includes(letter)) {
      return 'present';
    }
    
    return 'absent';
  };

  const getTileClass = (status: 'correct' | 'present' | 'absent' | 'empty') => {
    switch (status) {
      case 'correct':
        return 'bg-[#6aaa64] border-[#6aaa64] text-white';
      case 'present':
        return 'bg-[#c9b458] border-[#c9b458] text-white';
      case 'absent':
        return 'bg-[#787c7e] border-[#787c7e] text-white';
      default:
        return 'bg-white border-[#d3d6da] text-black';
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
        const guess = rowIndex < guesses.length 
          ? guesses[rowIndex] 
          : rowIndex === guesses.length 
            ? currentGuess 
            : '';
        
        const isSubmitted = rowIndex < guesses.length;

        return (
          <div key={rowIndex} className="flex gap-1.5 justify-center">
            {Array.from({ length: wordLength }).map((_, colIndex) => {
              const letter = guess[colIndex] || '';
              const status = isSubmitted ? getLetterStatus(guess, colIndex) : 'empty';
              
              return (
                <div
                  key={colIndex}
                  className={`w-14 h-14 border-2 flex items-center justify-center transition-all ${getTileClass(status)}`}
                >
                  <span className="uppercase text-[2rem] leading-[2rem]">{letter}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
