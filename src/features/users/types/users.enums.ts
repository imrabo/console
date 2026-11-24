/**
 * Enums for User-related types
 * These enums provide type safety for fixed value sets in the user domain
 */

export enum MembershipType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Relationship {
  MOM = 'MOM',
  DAD = 'DAD',
  GRAND_MOM = 'GRAND_MOM',
  GRAND_DAD = 'GRAND_DAD',
  NANNY = 'NANNY',
}

export enum ThemeMode {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export enum EmailPreferenceType {
  VILLAGES = 'VILLAGES',
  MEETUPS = 'MEETUPS',
  FEED = 'FEED',
  RESOURCES = 'RESOURCES',
  PROFILE = 'PROFILE',
}
