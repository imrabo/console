import { Gender, MembershipType, ThemeMode, UserStatus, Relationship } from './users.enums';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UserType {
  id: string;
  phoneNumber: string;
  fullName: string;
  email: string;
  fcmToken?: string;

  profileImageUrl?: string;

  children?: UserChild[];

  preferences?: UserPreferences;

  membershipType: MembershipType;

  isActive: boolean;
  isExpert: boolean;

  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  suspendedAt?: Date;
  suspendedBy?: string;

  location?: UserLocation;

  dateOfBirth: Date; // ISO Timestamp
  gender: Gender;

  lastLoginAt?: string; // ISO Timestamp
  lastActiveAt?: string; // ISO Timestamp

  createdAt: Date; // ISO Timestamp
  createdBy?: string;
  updatedAt?: Date; // ISO Timestamp
  updatedBy?: string;
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

  gender?: Gender;

  relationship?: Relationship;

  isActive?: boolean;

  isExpert?: boolean;

  isDeleted?: boolean;

  createdOn?: string;

  sortBy?: 'fullName' | 'email' | 'phoneNumber' | 'gender' | 'membershipType' | 'isActive' | 'createdAt';

  sortOrder?: 'asc' | 'desc';

  page?: number;

  limit?: number;
}

export interface UserCreateData {
  fullName: string;
  email: string;
  phoneNumber: string;
  membershipType: MembershipType;
  // dateOfBirth: Date;
  gender: Gender;
  profileImageUrl?: string;
  status?: UserStatus;
  isActive?: boolean;
  isExpert?: boolean;
  createdBy?: string;
  updatedBy?: string;
  preferences?: UserPreferences;
  // children?: UserChild[];
}

export interface UserUpdateData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  membershipType?: MembershipType;

  status?: UserStatus;
  isActive?: boolean;
  isExpert?: boolean;
  dateOfBirth?: Date;
  gender?: Gender;
  preferences?: Record<string, unknown>;
  children?: Array<Partial<UserChild>>;
  profileImageUrl?: string;
}


// export interface PaginationMeta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPreviousPage: boolean;
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   pagination: PaginationMeta;
// }
