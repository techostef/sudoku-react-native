export type Language = 'en' | 'id';

export interface Translations {
  // Home / Index
  home: {
    subtitle: string;
    gridSize: string;
    grid9x9: string;
    grid16x16: string;
    difficulty: string;
    startGame: string;
    journey: string;
    records: string;
    theme: string;
    language: string;
    settings: string;
    chooseLanguage: string;
    done: string;
    chooseTheme: string;
    easy: string;
    easyDesc: string;
    moderate: string;
    moderateDesc: string;
    hard: string;
    hardDesc: string;
    expert: string;
    expertDesc: string;
    extreme: string;
    extremeDesc: string;
  };
  // Game screen
  game: {
    mistakes: string;
    restart: string;
    restartPuzzle: string;
    restartDesc: string;
    cancel: string;
    hint: string;
    hintsLeft: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    played: string;
    won: string;
    lost: string;
    best: string;
    streak: string;
    bestTimes: string;
    noRecords: string;
    noRecordsDesc: string;
    clearAllRecords: string;
    clearAllDesc: string;
    clearAll: string;
    cancel: string;
    grid: string;
    difficulty: string;
    time: string;
    mistakes: string;
    resultWon: string;
    resultLost: string;
  };
  // Settings
  settings: {
    title: string;
    sound: string;
    soundDesc: string;
    highlightRelated: string;
    highlightRelatedDesc: string;
    showRemaining: string;
    showRemainingDesc: string;
  };
  // Journey
  journey: {
    title: string;
    levels: string;
    stars: string;
    rank: string;
    resetJourney: string;
    resetDesc: string;
    reset: string;
    cancel: string;
    zone: string;
    difficulty: string;
    difficultyHint: string;
    rerollDifficulty: string;
    play: string;
  };
  // Overlays
  overlay: {
    congratulations: string;
    puzzleSolved: string;
    time: string;
    mistakes: string;
    difficulty: string;
    newGame: string;
    nextLevel: string;
    journeyComplete: string;
    journeyMap: string;
    gameOver: string;
    madeMistakes: string;
    retry: string;
    backToJourney: string;
    gamePaused: string;
    resume: string;
  };
}

const en: Translations = {
  home: {
    subtitle: 'Challenge your mind',
    gridSize: 'Grid Size',
    grid9x9: '9×9 grid',
    grid16x16: '16×16 grid',
    difficulty: 'Difficulty',
    startGame: 'Start Game',
    journey: 'Journey',
    records: 'Records',
    theme: 'Theme',
    language: 'Language',
    settings: 'Settings',
    chooseLanguage: 'Choose Language',
    done: 'Done',
    chooseTheme: 'Choose Theme',
    easy: 'Easy',
    easyDesc: 'Great for beginners',
    moderate: 'Moderate',
    moderateDesc: 'A fair challenge',
    hard: 'Hard',
    hardDesc: 'For experienced players',
    expert: 'Expert',
    expertDesc: 'Serious puzzlers only',
    extreme: 'Extreme',
    extremeDesc: 'Ultimate challenge',
  },
  game: {
    mistakes: 'Mistakes',
    restart: 'Restart',
    restartPuzzle: 'Restart Puzzle?',
    restartDesc: 'This will clear all your progress and reset the timer.',
    cancel: 'Cancel',
    hint: 'Hint',
    hintsLeft: 'left',
  },
  dashboard: {
    title: 'Records',
    played: 'Played',
    won: 'Won',
    lost: 'Lost',
    best: 'Best',
    streak: 'Streak',
    bestTimes: 'Best Times by Difficulty',
    noRecords: 'No Records Yet',
    noRecordsDesc: 'Complete or lose a game to see your records here',
    clearAllRecords: 'Clear All Records?',
    clearAllDesc: 'This will permanently delete all your game records. This action cannot be undone.',
    clearAll: 'Clear All',
    cancel: 'Cancel',
    grid: 'Grid',
    difficulty: 'Difficulty',
    time: 'Time',
    mistakes: 'Mistakes',
    resultWon: 'Won',
    resultLost: 'Lost',
  },
  journey: {
    title: 'Journey',
    levels: 'Levels',
    stars: 'Stars',
    rank: 'Rank',
    resetJourney: 'Reset Journey?',
    resetDesc: 'This will reset all your journey progress. All unlocked levels and stars will be lost.',
    reset: 'Reset',
    cancel: 'Cancel',
    zone: 'Zone',
    difficulty: 'Difficulty',
    difficultyHint: 'Difficulty is randomly assigned based on your level progression',
    rerollDifficulty: 'Re-roll Difficulty',
    play: 'Play',
  },
  settings: {
    title: 'Settings',
    sound: 'Sound Effects',
    soundDesc: 'Play sounds during gameplay',
    highlightRelated: 'Highlight Related Cells',
    highlightRelatedDesc: 'Highlight cells in the same row, column, and box',
    showRemaining: 'Show Number Count',
    showRemainingDesc: 'Show how many times each number can still be placed',
  },
  overlay: {
    congratulations: 'Congratulations!',
    puzzleSolved: 'You solved the puzzle!',
    time: 'Time',
    mistakes: 'Mistakes',
    difficulty: 'Difficulty',
    newGame: 'New Game',
    nextLevel: 'Next Level',
    journeyComplete: 'Journey Complete!',
    journeyMap: 'Journey Map',
    gameOver: 'Game Over',
    madeMistakes: 'You made 3 mistakes',
    retry: 'Retry',
    backToJourney: 'Back to Journey',
    gamePaused: 'Game Paused',
    resume: 'Resume',
  },
};

const id: Translations = {
  home: {
    subtitle: 'Tantang pikiranmu',
    gridSize: 'Ukuran Grid',
    grid9x9: 'Grid 9×9',
    grid16x16: 'Grid 16×16',
    difficulty: 'Kesulitan',
    startGame: 'Mulai Permainan',
    journey: 'Perjalanan',
    records: 'Rekaman',
    theme: 'Tema',
    language: 'Bahasa',
    settings: 'Pengaturan',
    chooseLanguage: 'Pilih Bahasa',
    done: 'Selesai',
    chooseTheme: 'Pilih Tema',
    easy: 'Mudah',
    easyDesc: 'Cocok untuk pemula',
    moderate: 'Sedang',
    moderateDesc: 'Tantangan yang wajar',
    hard: 'Sulit',
    hardDesc: 'Untuk pemain berpengalaman',
    expert: 'Ahli',
    expertDesc: 'Hanya untuk puzzler serius',
    extreme: 'Ekstrem',
    extremeDesc: 'Tantangan tertinggi',
  },
  game: {
    mistakes: 'Kesalahan',
    restart: 'Ulangi',
    restartPuzzle: 'Ulangi Teka-teki?',
    restartDesc: 'Ini akan menghapus semua kemajuanmu dan mengatur ulang timer.',
    cancel: 'Batal',
    hint: 'Petunjuk',
    hintsLeft: 'tersisa',
  },
  dashboard: {
    title: 'Rekaman',
    played: 'Dimainkan',
    won: 'Menang',
    lost: 'Kalah',
    best: 'Terbaik',
    streak: 'Rentetan',
    bestTimes: 'Waktu Terbaik per Kesulitan',
    noRecords: 'Belum Ada Rekaman',
    noRecordsDesc: 'Selesaikan atau kalah dalam permainan untuk melihat rekamanmu di sini',
    clearAllRecords: 'Hapus Semua Rekaman?',
    clearAllDesc: 'Ini akan menghapus semua rekaman permainanmu secara permanen. Tindakan ini tidak dapat dibatalkan.',
    clearAll: 'Hapus Semua',
    cancel: 'Batal',
    grid: 'Grid',
    difficulty: 'Kesulitan',
    time: 'Waktu',
    mistakes: 'Kesalahan',
    resultWon: 'Menang',
    resultLost: 'Kalah',
  },
  journey: {
    title: 'Perjalanan',
    levels: 'Level',
    stars: 'Bintang',
    rank: 'Peringkat',
    resetJourney: 'Reset Perjalanan?',
    resetDesc: 'Ini akan mereset semua kemajuan perjalananmu. Semua level yang terbuka dan bintang akan hilang.',
    reset: 'Reset',
    cancel: 'Batal',
    zone: 'Zona',
    difficulty: 'Kesulitan',
    difficultyHint: 'Kesulitan ditetapkan secara acak berdasarkan perkembangan levelmu',
    rerollDifficulty: 'Acak Kesulitan',
    play: 'Main',
  },
  settings: {
    title: 'Pengaturan',
    sound: 'Efek Suara',
    soundDesc: 'Mainkan suara saat bermain',
    highlightRelated: 'Sorot Sel Terkait',
    highlightRelatedDesc: 'Sorot sel di baris, kolom, dan kotak yang sama',
    showRemaining: 'Tampilkan Hitungan Angka',
    showRemainingDesc: 'Tampilkan berapa kali setiap angka masih bisa ditempatkan',
  },
  overlay: {
    congratulations: 'Selamat!',
    puzzleSolved: 'Kamu berhasil memecahkan teka-teki!',
    time: 'Waktu',
    mistakes: 'Kesalahan',
    difficulty: 'Kesulitan',
    newGame: 'Permainan Baru',
    nextLevel: 'Level Berikutnya',
    journeyComplete: 'Perjalanan Selesai!',
    journeyMap: 'Peta Perjalanan',
    gameOver: 'Permainan Berakhir',
    madeMistakes: 'Kamu membuat 3 kesalahan',
    retry: 'Coba Lagi',
    backToJourney: 'Kembali ke Perjalanan',
    gamePaused: 'Permainan Dijeda',
    resume: 'Lanjutkan',
  },
};

export const TRANSLATIONS: Record<Language, Translations> = { en, id };

export const LANGUAGE_META: { key: Language; label: string; flag: string }[] = [
  { key: 'en', label: 'English', flag: '🇬🇧' },
  { key: 'id', label: 'Indonesia', flag: '🇮🇩' },
];
