export interface Country {
  code: string;
  name: string;
  nameZh: string;
  phone: string;
}

export const countries: Country[] = [
  { code: 'CHN', name: 'China', nameZh: '中国', phone: '+86' },
  { code: 'MYS', name: 'Malaysia', nameZh: '马来西亚', phone: '+60' },
  { code: 'SGP', name: 'Singapore', nameZh: '新加坡', phone: '+65' },
  { code: 'JPN', name: 'Japan', nameZh: '日本', phone: '+81' },
  { code: 'KOR', name: 'South Korea', nameZh: '韩国', phone: '+82' },
  { code: 'TWN', name: 'Taiwan', nameZh: '中国台湾', phone: '+886' },
  { code: 'HKG', name: 'Hong Kong', nameZh: '中国香港', phone: '+852' },
  { code: 'MAC', name: 'Macau', nameZh: '中国澳门', phone: '+853' },
  { code: 'THA', name: 'Thailand', nameZh: '泰国', phone: '+66' },
  { code: 'IDN', name: 'Indonesia', nameZh: '印度尼西亚', phone: '+62' },
  { code: 'VNM', name: 'Vietnam', nameZh: '越南', phone: '+84' },
  { code: 'PHL', name: 'Philippines', nameZh: '菲律宾', phone: '+63' },
  { code: 'IND', name: 'India', nameZh: '印度', phone: '+91' },
  { code: 'USA', name: 'United States', nameZh: '美国', phone: '+1' },
  { code: 'GBR', name: 'United Kingdom', nameZh: '英国', phone: '+44' },
  { code: 'AUS', name: 'Australia', nameZh: '澳大利亚', phone: '+61' },
  { code: 'CAN', name: 'Canada', nameZh: '加拿大', phone: '+1' },
  { code: 'DEU', name: 'Germany', nameZh: '德国', phone: '+49' },
  { code: 'FRA', name: 'France', nameZh: '法国', phone: '+33' },
  { code: 'NZL', name: 'New Zealand', nameZh: '新西兰', phone: '+64' },
  { code: 'BRN', name: 'Brunei', nameZh: '文莱', phone: '+673' },
  { code: 'MMR', name: 'Myanmar', nameZh: '缅甸', phone: '+95' },
  { code: 'KHM', name: 'Cambodia', nameZh: '柬埔寨', phone: '+855' },
  { code: 'LAO', name: 'Laos', nameZh: '老挝', phone: '+856' },
];

export const malaysianStates = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka',
  'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang',
  'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
];

export const purposeOfVisitOptions = [
  'Holiday', 'Business', 'Social Visit', 'Transit', 'Education',
  'Employment', 'Medical', 'Official/Government', 'Others',
];

export const travelModeOptions = ['Air', 'Land', 'Sea'];

export const accommodationTypeOptions = ['Hotel', 'Residence', 'Others'];

export function getCountryName(code: string): string {
  const c = countries.find((c) => c.code === code);
  return c ? `${c.nameZh} (${c.name})` : code;
}
