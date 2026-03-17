export interface TravelerProfile {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Personal Information
  fullName: string;
  nationality: string;
  placeOfBirth: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;

  // Passport Information
  passportNumber: string;
  passportExpiryDate: string;
  passportIssuingCountry: string;

  // Contact Information
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;

  // Travel Information
  purposeOfVisit: string;
  travelMode: string;
  flightNumber: string;
  countryOfEmbarkation: string;
  arrivalDate: string;
  departureDate: string;

  // Accommodation
  accommodationType: string;
  accommodationName: string;
  accommodationAddress: string;
  accommodationState: string;
  accommodationCity: string;
  accommodationPostcode: string;
}

export interface AppState {
  profiles: TravelerProfile[];
  version: number;
}

export type Route = 'list' | 'edit' | 'setup';

export interface RouterState {
  route: Route;
  editProfileId?: string;
}

export function createEmptyProfile(): TravelerProfile {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    fullName: '',
    nationality: 'CHN',
    placeOfBirth: 'CHN',
    gender: 'Male',
    dateOfBirth: '',
    passportNumber: '',
    passportExpiryDate: '',
    passportIssuingCountry: 'CHN',
    email: '',
    phoneCountryCode: '+86',
    phoneNumber: '',
    purposeOfVisit: 'Holiday',
    travelMode: 'Air',
    flightNumber: '',
    countryOfEmbarkation: 'CHN',
    arrivalDate: '',
    departureDate: '',
    accommodationType: 'Hotel',
    accommodationName: '',
    accommodationAddress: '',
    accommodationState: '',
    accommodationCity: '',
    accommodationPostcode: '',
  };
}
