import { AppState, TravelerProfile } from './types';
import { getSyncKey, cloudSave } from './sync';

const STORAGE_KEY = 'mdac_profiles';
const CURRENT_VERSION = 1;

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profiles: [], version: CURRENT_VERSION };
    const state: AppState = JSON.parse(raw);
    return state;
  } catch {
    return { profiles: [], version: CURRENT_VERSION };
  }
}

function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleCloudSync(state);
}

function scheduleCloudSync(state: AppState): void {
  const key = getSyncKey();
  if (!key) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    const ok = await cloudSave(key, state);
    window.dispatchEvent(new CustomEvent('mdac-sync', { detail: { ok } }));
  }, 1000);
}

export function replaceState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getProfiles(): TravelerProfile[] {
  return loadState().profiles;
}

export function getProfile(id: string): TravelerProfile | undefined {
  return loadState().profiles.find((p) => p.id === id);
}

export function saveProfile(profile: TravelerProfile): void {
  const state = loadState();
  const index = state.profiles.findIndex((p) => p.id === profile.id);
  profile.updatedAt = new Date().toISOString();
  if (index >= 0) {
    state.profiles[index] = profile;
  } else {
    state.profiles.push(profile);
  }
  saveState(state);
}

export function deleteProfile(id: string): void {
  const state = loadState();
  state.profiles = state.profiles.filter((p) => p.id !== id);
  saveState(state);
}

export function exportAllData(): string {
  return JSON.stringify(loadState(), null, 2);
}

export function importAllData(json: string): boolean {
  try {
    const state: AppState = JSON.parse(json);
    if (!Array.isArray(state.profiles)) return false;
    saveState(state);
    return true;
  } catch {
    return false;
  }
}
