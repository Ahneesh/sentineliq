export interface UploadRecord {
  id: number;
  file_name: string;
  dataset_type: string;
  row_count: number;
  status: string;
  validation_score: number;
  uploaded_by: string;
  created_at: string;
}

export interface ColumnProfile {
  name: string;
  inferred_type: string;
  null_count: number;
  null_percentage: number;
  distinct_count: number;
  completeness: number;
  statistics: Record<string, unknown>;
}

export interface DatasetProfile {
  id: number;
  upload_id: number;
  file_name: string;
  row_count: number;
  column_count: number;
  duplicate_rows: number;
  null_percentage: number;
  quality_score: number;
  schema: ColumnProfile[];
  statistics: {
    type_counts?: Record<string, number>;
    file_size_bytes?: number;
    [key: string]: unknown;
  };
  created_at: string;
}
