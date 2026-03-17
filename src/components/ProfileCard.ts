import { TravelerProfile } from '../types';
import { getCountryName } from '../utils/countries';

function maskPassport(num: string): string {
  if (num.length <= 4) return num;
  return num.slice(0, 2) + '*'.repeat(num.length - 4) + num.slice(-2);
}

export function renderProfileCard(
  profile: TravelerProfile,
  onEdit: () => void,
  onDelete: () => void,
  onCopy: () => void,
  onDuplicate: () => void,
): HTMLElement {
  const card = document.createElement('div');
  card.className =
    'bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow';

  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">${profile.fullName || '(未填写姓名)'}</h3>
        <p class="text-sm text-gray-500">${getCountryName(profile.nationality)}</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        profile.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
      }">
        ${profile.gender === 'Male' ? '男' : '女'}
      </span>
    </div>
    <div class="space-y-1 text-sm text-gray-600 mb-4">
      <p>护照: <span class="font-mono">${maskPassport(profile.passportNumber) || '-'}</span></p>
      <p>出生日期: ${profile.dateOfBirth || '-'}</p>
      ${profile.arrivalDate ? `<p>入境日期: ${profile.arrivalDate}</p>` : ''}
      ${profile.flightNumber ? `<p>航班: ${profile.flightNumber}</p>` : ''}
    </div>
    <div class="flex gap-2 flex-wrap">
      <button data-action="copy" class="flex-1 min-w-0 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
        复制到剪贴板
      </button>
      <button data-action="edit" class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
        编辑
      </button>
      <button data-action="duplicate" class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="复制人员">
        复制
      </button>
      <button data-action="delete" class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
        删除
      </button>
    </div>
  `;

  card.querySelector('[data-action="edit"]')!.addEventListener('click', onEdit);
  card.querySelector('[data-action="delete"]')!.addEventListener('click', onDelete);
  card.querySelector('[data-action="copy"]')!.addEventListener('click', onCopy);
  card.querySelector('[data-action="duplicate"]')!.addEventListener('click', onDuplicate);

  return card;
}
