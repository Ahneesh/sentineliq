export type ConnectorStatus = "enabled" | "coming-soon";

export interface DataConnector {
  id: string;
  name: string;
  description: string;
  status: ConnectorStatus;
}

export type UploadStatus = "COMPLETED" | "PROCESSING" | "FAILED" | "QUEUED";

export interface UploadRecord {
  id: number;
  file_name: string;
  dataset_type: string;
  row_count: number;
  status: UploadStatus;
  validation_score: number;
  uploaded_by: string;
  created_at: string;
}
