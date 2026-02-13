import { Audio } from 'expo-av';

const sounds: Record<string, Audio.Sound | null> = {
  hitCorrect: null,
  hitWrong: null,
  winGame: null,
  loseGame: null,
};

const soundFiles = {
  hitCorrect: require('../../assets/sounds/hit_correct.mp3'),
  hitWrong: require('../../assets/sounds/hit_wrong.mp3'),
  winGame: require('../../assets/sounds/win_game.wav'),
  loseGame: require('../../assets/sounds/lose_game.wav'),
};

let loaded = false;

export async function loadSounds(): Promise<void> {
  if (loaded) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    for (const key of Object.keys(soundFiles) as (keyof typeof soundFiles)[]) {
      const { sound } = await Audio.Sound.createAsync(soundFiles[key]);
      sounds[key] = sound;
    }
    loaded = true;
  } catch {
    // silently fail
  }
}

export async function playSound(name: keyof typeof soundFiles): Promise<void> {
  try {
    const sound = sounds[name];
    if (!sound) return;
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    // silently fail
  }
}

export async function unloadSounds(): Promise<void> {
  for (const key of Object.keys(sounds)) {
    try {
      if (sounds[key]) {
        await sounds[key]!.unloadAsync();
        sounds[key] = null;
      }
    } catch {
      // silently fail
    }
  }
  loaded = false;
}
