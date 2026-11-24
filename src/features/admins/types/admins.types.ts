export interface IAdminUser {
  id: string; // API record ID
  email: string;
  fullName: string;
  displayName?: string;

  password?: string;
  isActive: boolean;
  createdAt: Date | string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
