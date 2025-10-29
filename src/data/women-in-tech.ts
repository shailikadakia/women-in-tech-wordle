export interface WomanInTech {
  name: string;
  bio: string;
  link: string;
  funFact: string;
  quote?: string;
}

export const womenInTech: WomanInTech[] = [
  {
    name: "GRACE HOPPER",
    bio: "Grace Hopper was a pioneering computer scientist and U.S. Navy rear admiral who invented one of the first compiler tools and helped develop COBOL, one of the first high-level programming languages.",
    link: "https://en.wikipedia.org/wiki/Grace_Hopper",
    funFact: "She popularized the term 'debugging' after removing an actual moth from a computer.",
    quote: "The most dangerous phrase in the language is, 'We've always done it this way.'"
  },
  {
    name: "ADA LOVELACE",
    bio: "Ada Lovelace is considered the world's first computer programmer. In 1843, she wrote the first algorithm intended to be processed by Charles Babbage's Analytical Engine.",
    link: "https://en.wikipedia.org/wiki/Ada_Lovelace",
    funFact: "She envisioned computers going beyond pure calculation to create music and art, 100 years before modern computers existed.",
    quote: "The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves."
  },
  {
    name: "HEDY LAMARR",
    bio: "Hedy Lamarr was a Hollywood actress and inventor who co-developed frequency-hopping spread spectrum technology during WWII, which became foundational to modern WiFi, GPS, and Bluetooth.",
    link: "https://en.wikipedia.org/wiki/Hedy_Lamarr",
    funFact: "She was a glamorous movie star by day and an inventor by night, holding multiple patents.",
    quote: "Any girl can be glamorous. All you have to do is stand still and look stupid."
  },
  {
    name: "RADIA PERLMAN",
    bio: "Radia Perlman is a computer programmer and network engineer known as the 'Mother of the Internet' for her invention of the Spanning Tree Protocol (STP), which made large-scale networks possible.",
    link: "https://en.wikipedia.org/wiki/Radia_Perlman",
    funFact: "She holds over 100 patents and wrote a poem to explain the Spanning Tree Protocol algorithm.",
    quote: "Don't take anyone else's word for anything. Question everything."
  },
  {
    name: "ANITA BORG",
    bio: "Anita Borg was a computer scientist who founded the Institute for Women and Technology (now the Anita Borg Institute) and created the Grace Hopper Celebration of Women in Computing.",
    link: "https://en.wikipedia.org/wiki/Anita_Borg",
    funFact: "The Anita Borg Institute continues to support women in technology through scholarships and conferences worldwide.",
    quote: "Technology is going to be the foundation of the future. Women must be a part of that future."
  },
  {
    name: "RESHMA SAUJANI",
    bio: "Reshma Saujani is the founder of Girls Who Code, a nonprofit organization working to close the gender gap in technology and empower young women to pursue careers in computer science.",
    link: "https://www.girlswhocode.com/",
    funFact: "Girls Who Code has reached over 500,000 girls across all 50 U.S. states.",
    quote: "We're raising our girls to be perfect, and we're raising our boys to be brave."
  },
  {
    name: "FRANCES ALLEN",
    bio: "Frances Allen was a pioneering computer scientist and the first woman to win the Turing Award. She made fundamental contributions to program optimization and compiler design at IBM.",
    link: "https://en.wikipedia.org/wiki/Frances_Allen",
    funFact: "She worked on classified projects including code-breaking during the Cold War.",
    quote: "The opportunity to work on challenging technical problems is what attracted me to computer science."
  }
];

// Get daily word based on date
export function getDailyWord(): WomanInTech {
  const startDate = new Date('2025-01-01');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const index = diffDays % womenInTech.length;
  return womenInTech[index];
}

// Get today's date string for localStorage key
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
