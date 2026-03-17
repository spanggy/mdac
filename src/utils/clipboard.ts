import { TravelerProfile } from '../types';

export async function copyProfileToClipboard(profile: TravelerProfile): Promise<boolean> {
  const payload = {
    _mdac_autofill: true,
    version: 1,
    data: profile,
  };
  try {
    await navigator.clipboard.writeText(JSON.stringify(payload));
    return true;
  } catch {
    // Fallback: use textarea trick
    const textarea = document.createElement('textarea');
    textarea.value = JSON.stringify(payload);
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
}
