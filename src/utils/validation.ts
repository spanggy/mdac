import { TravelerProfile } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateProfile(profile: TravelerProfile): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!profile.fullName.trim()) {
    errors.push({ field: 'fullName', message: '请输入姓名' });
  }
  if (!profile.passportNumber.trim()) {
    errors.push({ field: 'passportNumber', message: '请输入护照号' });
  }
  if (!profile.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: '请选择出生日期' });
  }
  if (!profile.passportExpiryDate) {
    errors.push({ field: 'passportExpiryDate', message: '请选择护照有效期' });
  }
  if (!profile.email.trim()) {
    errors.push({ field: 'email', message: '请输入邮箱' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push({ field: 'email', message: '邮箱格式不正确' });
  }
  if (!profile.phoneNumber.trim()) {
    errors.push({ field: 'phoneNumber', message: '请输入手机号' });
  }

  return errors;
}
