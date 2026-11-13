import { StorageConsentPreferences, DEFAULT_STORAGE_CONSENT } from '../types/legal';

const CONSENT_STORAGE_KEY = 'zirna_storage_consent_v1';

export const KNOWN_LOCAL_STORAGE_KEYS = [
  {
    key: 'fraction_game_score',
    module: 'Fraction Grid Game MIZO',
    category: 'functional',
    purpose: 'Saves your current score during challenge mode sessions.',
    dataSample: 'Integer value (e.g., 40)',
    essential: false,
  },
  {
    key: 'fraction_game_streak',
    module: 'Fraction Grid Game MIZO',
    category: 'functional',
    purpose: 'Tracks consecutive correct answers to award bonus multipliers.',
    dataSample: 'Integer value (e.g., 3)',
    essential: false,
  },
  {
    key: 'fraction_game_lang',
    module: 'Fraction Grid Game MIZO',
    category: 'functional',
    purpose: 'Remembers your language choice (English or Mizo) for voice and text.',
    dataSample: "'en' or 'mizo'",
    essential: false,
  },
  {
    key: 'symmetry_match_lang',
    module: 'Symmetry Mirror Match',
    category: 'functional',
    purpose: 'Stores your preferred interface language for symmetry puzzles.',
    dataSample: "'en' or 'mizo'",
    essential: false,
  },
  {
    key: 'symmetry_match_stars',
    module: 'Symmetry Mirror Match',
    category: 'functional',
    purpose: 'Records level completion stars (1-3 stars across 30 puzzles).',
    dataSample: 'Array of star ratings per level',
    essential: false,
  },
  {
    key: 'zirna_storage_consent_v1',
    module: 'Zirna Platform Core',
    category: 'essential',
    purpose: 'Persists your consent preferences regarding local browser storage.',
    dataSample: 'Consent JSON configuration',
    essential: true,
  },
] as const;

export function getStoredConsent(): StorageConsentPreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse storage consent from localStorage:', err);
    return null;
  }
}

export function saveConsent(preferences: Partial<StorageConsentPreferences>): StorageConsentPreferences {
  const current = getStoredConsent() || DEFAULT_STORAGE_CONSENT;
  const updated: StorageConsentPreferences = {
    ...current,
    ...preferences,
    hasConsented: true,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save storage consent to localStorage:', err);
  }

  return updated;
}

export function resetConsent(): void {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to reset consent:', err);
  }
}

export interface StoredDataItem {
  key: string;
  module: string;
  category: string;
  purpose: string;
  value: string | null;
  sizeBytes: number;
}

export function inspectAllStoredData(): StoredDataItem[] {
  const items: StoredDataItem[] = [];

  KNOWN_LOCAL_STORAGE_KEYS.forEach(info => {
    try {
      const val = localStorage.getItem(info.key);
      items.push({
        key: info.key,
        module: info.module,
        category: info.category,
        purpose: info.purpose,
        value: val,
        sizeBytes: val ? new Blob([val]).size : 0,
      });
    } catch {
      items.push({
        key: info.key,
        module: info.module,
        category: info.category,
        purpose: info.purpose,
        value: null,
        sizeBytes: 0,
      });
    }
  });

  return items;
}

export function clearAllZirnaLocalData(): { clearedKeys: string[]; totalKeys: number } {
  const clearedKeys: string[] = [];

  KNOWN_LOCAL_STORAGE_KEYS.forEach(info => {
    if (info.key !== CONSENT_STORAGE_KEY) {
      try {
        if (localStorage.getItem(info.key) !== null) {
          localStorage.removeItem(info.key);
          clearedKeys.push(info.key);
        }
      } catch (err) {
        console.warn(`Could not remove ${info.key}:`, err);
      }
    }
  });

  return {
    clearedKeys,
    totalKeys: clearedKeys.length,
  };
}

export function exportLocalDataAsJson(): string {
  const data: Record<string, string | null> = {};
  KNOWN_LOCAL_STORAGE_KEYS.forEach(info => {
    try {
      data[info.key] = localStorage.getItem(info.key);
    } catch {
      data[info.key] = null;
    }
  });

  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    platform: 'ZIRNA STEM STUDIO',
    version: '1.0.0',
    description: 'User local browser storage snapshot for Zirna STEM educational modules',
    items: data,
  }, null, 2);
}
