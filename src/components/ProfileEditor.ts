import { TravelerProfile } from '../types';
import { getProfile, saveProfile } from '../storage';
import { countries, malaysianStates, purposeOfVisitOptions, travelModeOptions, accommodationTypeOptions } from '../utils/countries';
import { validateProfile } from '../utils/validation';

function selectOptions(options: { value: string; label: string }[], selected: string): string {
  return options.map((o) => `<option value="${o.value}" ${o.value === selected ? 'selected' : ''}>${o.label}</option>`).join('');
}

function countryOptions(selected: string): string {
  return selectOptions(
    countries.map((c) => ({ value: c.code, label: `${c.nameZh} (${c.name})` })),
    selected,
  );
}

function phoneCodeOptions(selected: string): string {
  const seen = new Set<string>();
  return countries
    .filter((c) => {
      if (seen.has(c.phone)) return false;
      seen.add(c.phone);
      return true;
    })
    .map((c) => `<option value="${c.phone}" ${c.phone === selected ? 'selected' : ''}>${c.phone}</option>`)
    .join('');
}

function field(label: string, name: string, content: string, required = false): string {
  return `
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
      ${content}
      <p class="text-red-500 text-xs mt-1 hidden" data-error="${name}"></p>
    </div>
  `;
}

function input(name: string, value: string, type = 'text', placeholder = ''): string {
  return `<input name="${name}" type="${type}" value="${value}" placeholder="${placeholder}" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />`;
}

function select(name: string, options: string): string {
  return `<select name="${name}" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">${options}</select>`;
}

export function renderProfileEditor(
  container: HTMLElement,
  profileId: string,
  onBack: () => void,
): void {
  const profile = getProfile(profileId);
  if (!profile) {
    onBack();
    return;
  }

  container.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 py-6">
      <div class="flex items-center gap-3 mb-6">
        <button id="btn-back" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900">${profile.fullName ? '编辑人员' : '新建人员'}</h1>
      </div>

      <form id="profile-form" class="space-y-6">
        <!-- Personal Information -->
        <fieldset class="space-y-4">
          <legend class="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 w-full">个人信息</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${field('姓名 (护照上的英文名)', 'fullName', input('fullName', profile.fullName, 'text', 'ZHANG SAN'), true)}
            ${field('国籍', 'nationality', select('nationality', countryOptions(profile.nationality)))}
            ${field('出生地', 'placeOfBirth', select('placeOfBirth', countryOptions(profile.placeOfBirth)))}
            ${field('性别', 'gender', select('gender', selectOptions([{ value: 'Male', label: '男' }, { value: 'Female', label: '女' }], profile.gender)))}
            ${field('出生日期', 'dateOfBirth', input('dateOfBirth', profile.dateOfBirth, 'date'), true)}
          </div>
        </fieldset>

        <!-- Passport Information -->
        <fieldset class="space-y-4">
          <legend class="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 w-full">护照信息</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${field('护照号码', 'passportNumber', input('passportNumber', profile.passportNumber, 'text', 'E12345678'), true)}
            ${field('护照有效期', 'passportExpiryDate', input('passportExpiryDate', profile.passportExpiryDate, 'date'), true)}
            ${field('签发国家', 'passportIssuingCountry', select('passportIssuingCountry', countryOptions(profile.passportIssuingCountry)))}
          </div>
        </fieldset>

        <!-- Contact Information -->
        <fieldset class="space-y-4">
          <legend class="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 w-full">联系方式</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${field('邮箱', 'email', input('email', profile.email, 'email', 'example@email.com'), true)}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">手机号 <span class="text-red-500">*</span></label>
              <div class="flex gap-2">
                <select name="phoneCountryCode" class="w-24 shrink-0 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">${phoneCodeOptions(profile.phoneCountryCode)}</select>
                <input name="phoneNumber" type="tel" value="${profile.phoneNumber}" placeholder="13800138000" class="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <p class="text-red-500 text-xs mt-1 hidden" data-error="phoneNumber"></p>
            </div>
          </div>
        </fieldset>

        <!-- Travel Information -->
        <fieldset class="space-y-4">
          <legend class="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 w-full">旅行信息</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${field('访问目的', 'purposeOfVisit', select('purposeOfVisit', selectOptions(purposeOfVisitOptions.map((o) => ({ value: o, label: o })), profile.purposeOfVisit)))}
            ${field('出行方式', 'travelMode', select('travelMode', selectOptions(travelModeOptions.map((o) => ({ value: o, label: o })), profile.travelMode)))}
            ${field('航班/车次号', 'flightNumber', input('flightNumber', profile.flightNumber, 'text', 'AK123'))}
            ${field('出发国家', 'countryOfEmbarkation', select('countryOfEmbarkation', countryOptions(profile.countryOfEmbarkation)))}
            ${field('入境日期', 'arrivalDate', input('arrivalDate', profile.arrivalDate, 'date'))}
            ${field('预计离境日期', 'departureDate', input('departureDate', profile.departureDate, 'date'))}
          </div>
        </fieldset>

        <!-- Accommodation -->
        <fieldset class="space-y-4">
          <legend class="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 w-full">住宿信息</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${field('住宿类型', 'accommodationType', select('accommodationType', selectOptions(accommodationTypeOptions.map((o) => ({ value: o, label: o })), profile.accommodationType)))}
            ${field('住宿名称', 'accommodationName', input('accommodationName', profile.accommodationName, 'text', '酒店名称'))}
            ${field('地址', 'accommodationAddress', input('accommodationAddress', profile.accommodationAddress, 'text', '详细地址'))}
            ${field('州', 'accommodationState', select('accommodationState', '<option value="">请选择</option>' + selectOptions(malaysianStates.map((s) => ({ value: s, label: s })), profile.accommodationState)))}
            ${field('城市', 'accommodationCity', input('accommodationCity', profile.accommodationCity, 'text', '城市名称'))}
            ${field('邮编', 'accommodationPostcode', input('accommodationPostcode', profile.accommodationPostcode, 'text', '50000'))}
          </div>
        </fieldset>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button type="submit" class="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            保存
          </button>
          <button type="button" id="btn-cancel" class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            取消
          </button>
        </div>
      </form>
    </div>
  `;

  // Events
  container.querySelector('#btn-back')!.addEventListener('click', onBack);
  container.querySelector('#btn-cancel')!.addEventListener('click', onBack);

  const form = container.querySelector('#profile-form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Update profile from form
    const updated: TravelerProfile = {
      ...profile,
      fullName: (formData.get('fullName') as string).toUpperCase(),
      nationality: formData.get('nationality') as string,
      placeOfBirth: formData.get('placeOfBirth') as string,
      gender: formData.get('gender') as 'Male' | 'Female',
      dateOfBirth: formData.get('dateOfBirth') as string,
      passportNumber: (formData.get('passportNumber') as string).toUpperCase(),
      passportExpiryDate: formData.get('passportExpiryDate') as string,
      passportIssuingCountry: formData.get('passportIssuingCountry') as string,
      email: formData.get('email') as string,
      phoneCountryCode: formData.get('phoneCountryCode') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      purposeOfVisit: formData.get('purposeOfVisit') as string,
      travelMode: formData.get('travelMode') as string,
      flightNumber: (formData.get('flightNumber') as string).toUpperCase(),
      countryOfEmbarkation: formData.get('countryOfEmbarkation') as string,
      arrivalDate: formData.get('arrivalDate') as string,
      departureDate: formData.get('departureDate') as string,
      accommodationType: formData.get('accommodationType') as string,
      accommodationName: formData.get('accommodationName') as string,
      accommodationAddress: formData.get('accommodationAddress') as string,
      accommodationState: formData.get('accommodationState') as string,
      accommodationCity: formData.get('accommodationCity') as string,
      accommodationPostcode: formData.get('accommodationPostcode') as string,
    };

    // Validate
    const errors = validateProfile(updated);

    // Clear previous errors
    container.querySelectorAll('[data-error]').forEach((el) => {
      el.classList.add('hidden');
      el.textContent = '';
    });

    if (errors.length > 0) {
      errors.forEach((err) => {
        const el = container.querySelector(`[data-error="${err.field}"]`);
        if (el) {
          el.textContent = err.message;
          el.classList.remove('hidden');
        }
      });
      // Scroll to first error
      const firstError = container.querySelector('[data-error]:not(.hidden)');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    saveProfile(updated);
    onBack();
  });
}
