const GUEST_DAILY_CHALLENGES_KEY = 'zirna_guest_daily_challenges_v1';
const GUEST_MODAL_DISMISSED_KEY = 'zirna_guest_modal_dismissed_v1';
const DEFAULT_GUEST_DAILY_LIMIT = 3;

interface GuestDayRecord {
  dateStr: string; // YYYY-MM-DD
  completedCount: number;
  completedChallenges: string[]; // moduleId:challengeId
}

const getTodayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getGuestChallengeLimit = (): number => {
  try {
    const raw = localStorage.getItem('zirna_admin_settings_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.guestChallengeLimit === 'number') {
        return parsed.guestChallengeLimit;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_GUEST_DAILY_LIMIT;
};

export const getGuestChallengesTodayCount = (): number => {
  try {
    const raw = localStorage.getItem(GUEST_DAILY_CHALLENGES_KEY);
    if (!raw) return 0;
    const record: GuestDayRecord = JSON.parse(raw);
    if (record.dateStr === getTodayStr()) {
      return record.completedCount;
    }
    return 0;
  } catch {
    return 0;
  }
};

export const recordGuestChallengeCompletion = (moduleId: string, challengeId: string): {
  count: number;
  limitReached: boolean;
} => {
  const today = getTodayStr();
  let record: GuestDayRecord = {
    dateStr: today,
    completedCount: 0,
    completedChallenges: [],
  };

  try {
    const raw = localStorage.getItem(GUEST_DAILY_CHALLENGES_KEY);
    if (raw) {
      const parsed: GuestDayRecord = JSON.parse(raw);
      if (parsed.dateStr === today) {
        record = parsed;
      }
    }
  } catch {
    // Reset on error
  }

  const key = `${moduleId}:${challengeId}`;
  if (!record.completedChallenges.includes(key)) {
    record.completedChallenges.push(key);
    record.completedCount = record.completedChallenges.length;
    try {
      localStorage.setItem(GUEST_DAILY_CHALLENGES_KEY, JSON.stringify(record));
    } catch {
      // Ignore
    }
  }

  const limit = getGuestChallengeLimit();
  const limitReached = record.completedCount >= limit;
  if (limitReached && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zirna_guest_challenge_complete'));
  }
  return {
    count: record.completedCount,
    limitReached,
  };
};

export const isGuestLimitReached = (): boolean => {
  const count = getGuestChallengesTodayCount();
  const limit = getGuestChallengeLimit();
  return count >= limit;
};

export const resetGuestDailyCountForTesting = (): void => {
  localStorage.removeItem(GUEST_DAILY_CHALLENGES_KEY);
  localStorage.removeItem(GUEST_MODAL_DISMISSED_KEY);
};
