export * from './connector.types';

export interface ConnectorFile {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreProduct {
  id: string;
  title: string;
  description: string;
  priceCoins: number;
  salesCount: number;
  status: 'Active' | 'Inactive';
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
