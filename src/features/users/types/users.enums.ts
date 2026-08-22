/**
 * Enums for User-related types
 * These enums provide type safety for fixed value sets in the user domain
 */

export enum MembershipType {
  FREE = 'free',
  PREMIUM = 'premium',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum EmailPreferenceType {
  VILLAGES = 'workspaces',
  MEETUPS = 'agents',
  FEED = 'feed',
  RESOURCES = 'connectors',
  PROFILE = 'profile',
}
