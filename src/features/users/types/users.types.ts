import { Gender, MembershipType, ThemeMode, UserStatus } from "./users.enums";

export interface UserType {
  id: string;
  firebaseUid?: string;
  mobileNo: string;
  fullName: string;
  email: string;
  fcmToken?: string;

  children?: UserChild[];

  preferences?: UserPreferences;

  membershipType: MembershipType;

  isActive: boolean;
  isExpert: boolean;

  status: UserStatus;

  dateOfBirth: Date; // ISO Timestamp
  gender: Gender;

  lastLoginAt?: string; // ISO Timestamp
  lastActiveAt?: string; // ISO Timestamp

  createdAt: Date; // ISO Timestamp
      updatedAt?: Date; // ISO Timestamp
}

export interface UserChild {
  name: string;
  dob: Date; // ISO Timestamp
  gender: Gender;
}

export interface UserPreferences {
  themeMode: ThemeMode;
  languageCode: string;

  notificationsEnabled: boolean;

  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;


  biometricEnabled: boolean;

}

export interface UserFilters {
  search?: string;
  membershipType?: MembershipType;
  status?: UserStatus;
  isActive?: boolean;
  isExpert?: boolean;
  gender?: Gender;
}


export interface UserCreateData {

  fullName: string;
  email: string;
  mobileNo: string;
  membershipType: MembershipType;
  // dateOfBirth: Date;
  gender: Gender;
  preferences?: UserPreferences;
  // children?: UserChild[];

}

export interface UserUpdateData {
  fullName?: string;
  email?: string;
  mobileNo?: string;
  membershipType?: MembershipType;

  status?: UserStatus;
  isActive?: boolean;
  isExpert?: boolean;
  dateOfBirth?: Date;
  gender?: Gender;
  preferences?: Record<string, unknown>;
  children?: Array<Partial<UserChild>>;
}