// src/features/users/constants/index.ts

import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';


/**
 * Query Keys for TanStack Query
 */
export const QUERY_KEYS = {
  /**
   * User-specific queries
   */
  user: (id?: string) => ({
    key: 'user',
    params: id ? { id } : {},
  }),

  /**
   * Users list queries
   */
  users: (filters?: Record<string, unknown>) => ({
    key: COLLECTIONS.USERS,
    params: filters || {},
  }),

  /**
   * Pagination parameters
   */
  pagination: {
    page: 'page',
    limit: 'limit',
    offset: 'offset',
  },

  /**
   * Sorting parameters
   */
  sorting: {
    field: 'field',
    direction: 'direction',
  },

  /**
   * Filtering parameters
   */
  filtering: {
    search: 'search',
    status: 'status',
    membershipType: 'membershipType',
    isActive: 'isActive',
    isExpert: 'isExpert',
  },
} as const;

/**
 * User Status Options
 */
export const USER_STATUS = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
} as const;

/**
 * Membership Types
 */
export const MEMBERSHIP_TYPES = {
  FREE: 'free' as const,
  PREMIUM: 'premium' as const,
} as const;

/**
 * Gender Options
 */
export const GENDER_OPTIONS = {
  MALE: 'male' as const,
  FEMALE: 'female' as const,
  OTHER: 'other' as const,
} as const;

/**
 * User Permissions
 */
export const USER_PERMISSIONS = {
  CREATE: 'create' as const,
  VIEW: 'view' as const,
  EDIT: 'edit' as const,
  DELETE: 'delete' as const,
  APPROVE: 'approve' as const,
  REJECT: 'reject' as const,
} as const;

/**
 * Permission Check Helpers
 */
export const PERMISSIONS = {
  /**
   * Check if user has permission to view users
   */
  canViewUsers: (permissions: string[]) =>
    permissions.includes(USER_PERMISSIONS.VIEW),

  /**
   * Check if user has permission to create users
   */
  canCreateUsers: (permissions: string[]) =>
    permissions.includes(USER_PERMISSIONS.CREATE) ||
    permissions.includes(USER_PERMISSIONS.APPROVE),

  /**
   * Check if user has permission to edit users
   */
  canEditUsers: (permissions: string[]) =>
    permissions.includes(USER_PERMISSIONS.EDIT),

  /**
   * Check if user has permission to delete users
   */
  canDeleteUsers: (permissions: string[]) =>
    permissions.includes(USER_PERMISSIONS.DELETE),

  /**
   * Check if user has permission to approve/reject users
   */
  canApproveRejectUsers: (permissions: string[]) =>
    permissions.includes(USER_PERMISSIONS.APPROVE) ||
    permissions.includes(USER_PERMISSIONS.REJECT),

  /**
   * Check if user has full admin access to users
   */
  isAdminForUsers: (permissions: string[]) =>
    USER_PERMISSIONS.VIEW in permissions &&
    USER_PERMISSIONS.EDIT in permissions &&
    USER_PERMISSIONS.DELETE in permissions,
} as const;

/**
 * API Response Status Codes
 */
export const RESPONSE_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
} as const;

/**
 * Validation Error Messages
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Invalid email address format',
  mobileNo: 'Invalid mobile number format',
  fullName: 'Full name must be at least 2 characters long',
} as const;

/**
 * User Form Validation Schema Keys
 */
export const USER_FORM_VALIDATION_KEYS = {
  fullName: 'fullName',
  email: 'email',
  mobileNo: 'mobileNo',
  membershipType: 'membershipType',
  status: 'status',
  isActive: 'isActive',
  isExpert: 'isExpert',
} as const;

/**
 * User Document Fields (Firestore)
 */
export const USER_FIELDS = {
  firebaseUid: 'firebaseUid' as const,
  createdAt: 'createdAt' as const,
  updatedAt: 'updatedAt' as const,
  fullName: 'fullName' as const,
  email: 'email' as const,
  mobileNo: 'mobileNo' as const,
  membershipType: 'membershipType' as const,
  coinBalance: 'coinBalance' as const,
  status: 'status' as const,
  isActive: 'isActive' as const,
  isExpert: 'isExpert' as const,
  dateOfBirth: 'dateOfBirth' as const,
  gender: 'gender' as const,
  preferences: 'preferences' as const,
  children: 'children' as const,
} as const;

/**
 * User Document Field Types
 */
export const USER_FIELD_TYPES = {
  [USER_FIELDS.firebaseUid]: 'string',
  [USER_FIELDS.createdAt]: 'timestamp',
  [USER_FIELDS.updatedAt]: 'timestamp',
  [USER_FIELDS.fullName]: 'string',
  [USER_FIELDS.email]: 'string',
  [USER_FIELDS.mobileNo]: 'string',
  [USER_FIELDS.membershipType]: 'string',
  [USER_FIELDS.coinBalance]: 'number',
  [USER_FIELDS.status]: 'string',
  [USER_FIELDS.isActive]: 'boolean',
  [USER_FIELDS.isExpert]: 'boolean',
  [USER_FIELDS.dateOfBirth]: 'timestamp',
  [USER_FIELDS.gender]: 'string',
  [USER_FIELDS.preferences]: 'object',
  [USER_FIELDS.children]: 'array',
} as const;

export default {
  COLLECTIONS,
  QUERY_KEYS,
  USER_STATUS,
  MEMBERSHIP_TYPES,
  GENDER_OPTIONS,
  USER_PERMISSIONS,
  PERMISSIONS,
  RESPONSE_STATUS,
  VALIDATION_MESSAGES,
  USER_FORM_VALIDATION_KEYS,
  USER_FIELDS,
  USER_FIELD_TYPES,
};
