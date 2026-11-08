import { createDefaultProfile, parseStoredProfile } from './profileState.js';

const PROFILE_KEY = 'english_study_profile';
const BACKUP_KEY = 'english_study_profile_invalid_backup';

export const loadProfile = (getStorage, today) => {
  try {
    return { ...parseStoredProfile(getStorage().getItem(PROFILE_KEY), today), readFailed: false };
  } catch {
    return { profile: createDefaultProfile(today), invalidRaw: null, readFailed: true };
  }
};

export const persistProfile = (getStorage, profile, loaded) => {
  if (loaded.readFailed) return false;
  try {
    const storage = getStorage();
    if (loaded.invalidRaw !== null) {
      let key = BACKUP_KEY;
      let existing = storage.getItem(key);
      let suffix = 2;
      while (existing !== null && existing !== loaded.invalidRaw) {
        key = `${BACKUP_KEY}_${suffix++}`;
        existing = storage.getItem(key);
      }
      if (existing === null) storage.setItem(key, loaded.invalidRaw);
    }
    storage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
};
