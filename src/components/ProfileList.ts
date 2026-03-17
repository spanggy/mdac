import { TravelerProfile } from '../types';
import { getProfiles, deleteProfile, saveProfile, exportAllData, importAllData } from '../storage';
import { renderProfileCard } from './ProfileCard';
import { copyProfileToClipboard } from '../utils/clipboard';
import { createEmptyProfile } from '../types';

export function renderProfileList(
  container: HTMLElement,
  onEdit: (id: string) => void,
  onSetup: () => void,
): void {
  const profiles = getProfiles();

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">MDAC 入境卡助手</h1>
          <p class="text-sm text-gray-500 mt-1">管理人员信息，一键填写马来西亚入境卡</p>
        </div>
        <div class="flex gap-2">
          <button id="btn-setup" class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            使用说明
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <button id="btn-add" class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + 添加人员
        </button>
        <button id="btn-export" class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          导出数据
        </button>
        <label id="btn-import" class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          导入数据
          <input type="file" accept=".json" class="hidden" id="import-file" />
        </label>
      </div>

      <!-- Profile Grid -->
      <div id="profile-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      </div>

      <!-- Empty State -->
      ${
        profiles.length === 0
          ? `<div class="text-center py-16 text-gray-400">
              <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <p class="text-lg font-medium">还没有人员信息</p>
              <p class="text-sm mt-1">点击"添加人员"开始创建</p>
            </div>`
          : ''
      }

      <!-- Toast -->
      <div id="toast" class="fixed bottom-6 right-6 hidden">
        <div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
          已复制到剪贴板
        </div>
      </div>
    </div>
  `;

  // Render profile cards
  const grid = container.querySelector('#profile-grid')!;
  profiles.forEach((profile) => {
    const card = renderProfileCard(
      profile,
      () => onEdit(profile.id),
      () => {
        if (confirm(`确定删除 ${profile.fullName || '此人员'} 的信息吗？`)) {
          deleteProfile(profile.id);
          renderProfileList(container, onEdit, onSetup);
        }
      },
      async () => {
        const ok = await copyProfileToClipboard(profile);
        showToast(container, ok ? '已复制到剪贴板' : '复制失败，请重试');
      },
      () => {
        duplicateProfile(profile);
        renderProfileList(container, onEdit, onSetup);
      },
    );
    grid.appendChild(card);
  });

  // Event listeners
  container.querySelector('#btn-add')!.addEventListener('click', () => {
    const newProfile = createEmptyProfile();
    saveProfile(newProfile);
    onEdit(newProfile.id);
  });

  container.querySelector('#btn-setup')!.addEventListener('click', onSetup);

  container.querySelector('#btn-export')!.addEventListener('click', () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mdac-profiles-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  container.querySelector('#import-file')!.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importAllData(reader.result as string);
      if (ok) {
        renderProfileList(container, onEdit, onSetup);
        showToast(container, '导入成功');
      } else {
        showToast(container, '导入失败，文件格式不正确');
      }
    };
    reader.readAsText(file);
  });
}

function duplicateProfile(source: TravelerProfile): void {
  const newProfile: TravelerProfile = {
    ...source,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fullName: source.fullName + ' (副本)',
  };
  saveProfile(newProfile);
}

function showToast(container: HTMLElement, message: string): void {
  const toast = container.querySelector('#toast')!;
  toast.querySelector('div')!.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}
