import { AppState } from './types';

const SYNC_KEY_STORAGE = 'mdac_sync_key';

export function getSyncKey(): string | null {
  return localStorage.getItem(SYNC_KEY_STORAGE);
}

export function setSyncKey(key: string): void {
  localStorage.setItem(SYNC_KEY_STORAGE, key);
}

export function clearSyncKey(): void {
  localStorage.removeItem(SYNC_KEY_STORAGE);
}

function getApiBase(): string {
  // In dev, use localhost; in prod, use relative path
  if (location.hostname === 'localhost') {
    return '';
  }
  return '';
}

export async function cloudLoad(syncKey: string): Promise<AppState | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/sync?key=${encodeURIComponent(syncKey)}`);
    if (!res.ok) return null;
    const data: AppState = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function cloudSave(syncKey: string, state: AppState): Promise<boolean> {
  try {
    const res = await fetch(`${getApiBase()}/api/sync?key=${encodeURIComponent(syncKey)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
    return res.ok;
  } catch {
    return false;
  }
}
