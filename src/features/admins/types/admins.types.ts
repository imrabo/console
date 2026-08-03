
export interface IAdminUser {
  id: string; // Firestore doc id (PK)
  email: string;
  fullName: string;
  displayName?: string;

  password: string;
  isActive: boolean;
  createdAt: Date; // Firestore server timestamp
}

export interface ILoginPayload {
  email: string;
  password: string;
}