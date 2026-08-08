/**
 * Enums for Connector-related types
 * These enums provide type safety for fixed value sets in the connector domain
 */

export enum ConnectorCategory {
  GUIDES = 'Guides',
  TEMPLATES = 'Templates',
  CHECKLISTS = 'Checklists',
  ACTIVITY_SHEETS = 'Activity Sheets',
  WORKSHEETS = 'Worksheets',
  EBOOKS = 'E-books',
  VIDEOS = 'Videos',
  AUDIO = 'Audio',
  IMAGES = 'Images',
  OTHER = 'Other',
}

export enum ConnectorFileType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  XLSX = 'XLSX',
  PPTX = 'PPTX',
  ZIP = 'ZIP',
  PNG = 'PNG',
  JPG = 'JPG',
  JPEG = 'JPEG',
  MP4 = 'MP4',
  MP3 = 'MP3',
  TEXT = 'TEXT',
}

export enum ConnectorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_REVIEW = 'pending_review',
  REJECTED = 'rejected',
}

export enum ConnectorVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PREMIUM_ONLY = 'premium_only',
}

// Array of all category values for use in dropdowns
export const CATEGORY_OPTIONS = Object.values(ConnectorCategory);

// Array of all file type values for use in dropdowns
export const FILE_TYPE_OPTIONS = Object.values(ConnectorFileType);

// File type to MIME type mapping
export const FILE_TYPE_MIME_MAP: Record<ConnectorFileType, string> = {
  [ConnectorFileType.PDF]: 'application/pdf',
  [ConnectorFileType.DOCX]:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [ConnectorFileType.XLSX]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  [ConnectorFileType.PPTX]:
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  [ConnectorFileType.ZIP]: 'application/zip',
  [ConnectorFileType.PNG]: 'image/png',
  [ConnectorFileType.JPG]: 'image/jpeg',
  [ConnectorFileType.JPEG]: 'image/jpeg',
  [ConnectorFileType.MP4]: 'video/mp4',
  [ConnectorFileType.MP3]: 'audio/mpeg',
  [ConnectorFileType.TEXT]: 'text/plain',
};

// Allowed file extensions for upload
export const ALLOWED_EXTENSIONS = [
  'pdf',
  'docx',
  'xlsx',
  'pptx',
  'zip',
  'png',
  'jpg',
  'jpeg',
  'mp4',
  'mp3',
  'txt',
];

// Maximum file size in bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
