/**
 * Connector type definitions based on ConnectorsEntity model
 */

export interface Connector {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: string;
  fileType: string;
  creatorId: string;
  downloads: number;
  isPremium: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ConnectorFilters {
  search?: string;
  category?: string;
  fileType?: string;
  isPremium?: boolean;
  creatorId?: string;
  minDownloads?: number;
  maxDownloads?: number;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
}

export interface ConnectorCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface ConnectorStats {
  totalConnectors: number;
  totalDownloads: number;
  mostPopularCategory: string;
  mostDownloadedConnector: Connector | null;
  premiumConnectors: number;
  freeConnectors: number;
}

export type CreateConnectorInput = Omit<Connector, 'id' | 'createdAt' | 'updatedAt' | 'downloads'>;
export type UpdateConnectorInput = Partial<Omit<Connector, 'id' | 'createdAt' | 'creatorId'>>;

// Re-export enums from connectors.enums for backward compatibility
export {
  ConnectorCategory as ConnectorCategoryEnum,
  ConnectorFileType as ConnectorFileTypeEnum,
  ConnectorStatus,
  ConnectorVisibility,
  CATEGORY_OPTIONS,
  FILE_TYPE_OPTIONS,
  FILE_TYPE_MIME_MAP,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
} from './connector.enums';
