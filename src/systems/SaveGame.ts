const KEY = 'casa-da-mae-joana-save-v1';

interface SaveData {
  unlocked: number;
  muted: boolean;
}

function load(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<SaveData>;
      return {
        unlocked: Math.min(5, Math.max(1, data.unlocked ?? 1)),
        muted: data.muted ?? false
      };
    }
  } catch {
    /* localStorage indisponível: segue com padrão */
  }
  return { unlocked: 1, muted: false };
}

function save(data: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignora */
  }
}

export const SaveGame = {
  getUnlocked(): number {
    return load().unlocked;
  },
  unlock(level: number): void {
    const data = load();
    if (level > data.unlocked) {
      data.unlocked = Math.min(5, level);
      save(data);
    }
  },
  getMuted(): boolean {
    return load().muted;
  },
  setMuted(muted: boolean): void {
    const data = load();
    data.muted = muted;
    save(data);
  }
};
