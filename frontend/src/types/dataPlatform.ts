export type ConnectorStatus = "enabled" | "coming-soon";

export interface DataConnector {
  id: string;
  name: string;
  description: string;
  status: ConnectorStatus;
  icon?: string;
}

export type UploadStatus = "completed" | "processing" | "failed" | "queued";

export interface UploadRecord {
  id: string;
  fileName: string;
  dataset: string;
  rows: number;
  status: UploadStatus;
  validationScore: number;
  uploadedBy: string;
  startedAt: string;
  completedAt?: string;
}
