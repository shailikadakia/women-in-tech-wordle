interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  targetWord: string;
}

export function Keyboard({ onKeyPress, guesses, targetWord }: KeyboardProps) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyStatus = (key: string): 'correct' | 'present' | 'absent' | 'unused' => {
    if (key === 'ENTER' || key === 'BACKSPACE') return 'unused';
    
    let status: 'correct' | 'present' | 'absent' | 'unused' = 'unused';
    
    guesses.forEach(guess => {
      guess.split('').forEach((letter, index) => {
        if (letter === key) {
          if (targetWord[index] === key) {
            status = 'correct';
          } else if (targetWord.includes(key) && status !== 'correct') {
            status = 'present';
          } else if (status === 'unused') {
            status = 'absent';
          }
        }
      });
    });
    
    return status;
  };

  const getKeyClass = (key: string) => {
    const status = getKeyStatus(key);
    const baseClass = 'px-3 py-4 rounded transition-colors flex items-center justify-center cursor-pointer select-none';
    
    switch (status) {
      case 'correct':
        return `${baseClass} bg-[#6aaa64] text-white`;
      case 'present':
        return `${baseClass} bg-[#c9b458] text-white`;
      case 'absent':
        return `${baseClass} bg-[#787c7e] text-white`;
      default:
        return `${baseClass} bg-[#d3d6da] text-black hover:bg-[#c3c6ca]`;
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-xl mx-auto">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center">
          {row.map(key => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`${getKeyClass(key)} ${
                key === 'ENTER' || key === 'BACKSPACE' ? 'px-4 text-xs' : 'min-w-[40px]'
              }`}
            >
              {key === 'BACKSPACE' ? '←' : key === 'ENTER' ? 'ENTER' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
