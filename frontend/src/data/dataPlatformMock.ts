import { DataConnector, DatasetAsset, UploadRecord, ValidationFinding } from '../types/dataPlatform';

export const connectors: DataConnector[] = [
  { id: 'csv', name: 'CSV Upload', description: 'Upload orders, trades, market data and reference datasets.', status: 'AVAILABLE', icon: 'csv' },
  { id: 'fix', name: 'FIX', description: 'Connect OMS/EMS order and execution flows.', status: 'COMING_SOON', icon: 'fix' },
  { id: 'kafka', name: 'Kafka', description: 'Stream market events from enterprise topics.', status: 'COMING_SOON', icon: 'kafka' },
  { id: 'rest', name: 'REST API', description: 'Push canonical trading events via API.', status: 'COMING_SOON', icon: 'api' },
  { id: 's3', name: 'S3 / Object Store', description: 'Ingest batch files from cloud storage.', status: 'COMING_SOON', icon: 's3' },
  { id: 'database', name: 'Database', description: 'Connect source trading databases directly.', status: 'COMING_SOON', icon: 'database' },
];

export const mockUploads: UploadRecord[] = [
  { id: 101, original_filename: 'orders_equities_2026_07_08.csv', status: 'COMPLETED', row_count: 348921, column_count: 18, error_count: 0, warning_count: 12, uploaded_by: 'local.dev', created_at: '2026-07-08T09:02:00Z', completed_at: '2026-07-08T09:04:21Z' },
  { id: 100, original_filename: 'trades_equities_2026_07_08.csv', status: 'COMPLETED', row_count: 98231, column_count: 16, error_count: 0, warning_count: 3, uploaded_by: 'local.dev', created_at: '2026-07-08T08:55:00Z', completed_at: '2026-07-08T08:56:03Z' },
  { id: 99, original_filename: 'market_prices_lse.csv', status: 'FAILED', row_count: 20422, column_count: 6, error_count: 2, warning_count: 8, uploaded_by: 'local.dev', created_at: '2026-07-07T17:15:00Z', completed_at: '2026-07-07T17:15:49Z' },
];

export const mockDatasets: DatasetAsset[] = [
  { id: 1, name: 'Orders', dataset_type: 'ORDERS', description: 'Canonical order lifecycle events from OMS/EMS sources.', created_at: '2026-07-08T09:00:00Z' },
  { id: 2, name: 'Trades', dataset_type: 'TRADES', description: 'Trade executions enriched with trader, account and venue context.', created_at: '2026-07-08T09:00:00Z' },
  { id: 3, name: 'Market Data', dataset_type: 'MARKET_DATA', description: 'Price, volume and market context used by surveillance detectors.', created_at: '2026-07-08T09:00:00Z' },
  { id: 4, name: 'Reference Data', dataset_type: 'REFERENCE_DATA', description: 'Instrument, venue and entity reference data.', created_at: '2026-07-08T09:00:00Z' },
];

export const mockFindings: ValidationFinding[] = [
  { severity: 'INFO', code: 'SCHEMA_VALID', message: 'Required order schema columns detected.' },
  { severity: 'WARNING', code: 'DUPLICATE_IDENTIFIER', message: '12 duplicate order identifiers found in sample validation.', row_number: 1452 },
  { severity: 'WARNING', code: 'TIMESTAMP_PRECISION', message: 'Some rows contain second-level timestamps. Millisecond precision is preferred for spoofing and layering surveillance.' },
];
