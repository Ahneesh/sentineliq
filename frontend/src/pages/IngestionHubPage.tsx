import { ChangeEvent, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ConnectorCard from '../components/data/ConnectorCard';
import UploadHistoryTable from '../components/data/UploadHistoryTable';
import ValidationSummary from '../components/data/ValidationSummary';
import { connectors, mockFindings, mockUploads } from '../data/dataPlatformMock';
import { DatasetType, UploadRecord } from '../types/dataPlatform';

export default function IngestionHubPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [datasetType, setDatasetType] = useState<DatasetType>('ORDERS');
  const [uploads, setUploads] = useState<UploadRecord[]>(mockUploads);
  const [message, setMessage] = useState<string>('');

  const csvConnector = useMemo(() => connectors.find((connector) => connector.id === 'csv'), []);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('dataset_type', datasetType);

    try {
      const response = await fetch('http://localhost:8000/api/uploads', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(await response.text());
      const created = await response.json();
      setUploads([created, ...uploads]);
      setMessage('Upload processed by SentinelIQ backend.');
    } catch {
      const localRecord: UploadRecord = {
        id: Date.now(),
        original_filename: selectedFile.name,
        status: 'COMPLETED',
        row_count: 125000,
        column_count: 14,
        error_count: 0,
        warning_count: 2,
        uploaded_by: 'local.dev',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      };
      setUploads([localRecord, ...uploads]);
      setMessage('Backend unavailable, so the prototype used local mock ingestion.');
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={900}>Data Platform</Typography>
        <Typography color="text.secondary">Enterprise ingestion hub for orders, trades, market data and reference data.</Typography>
      </Box>

      <Card sx={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #7C3AED 100%)', color: 'white' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ md: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={900}>Connect data sources</Typography>
              <Typography sx={{ color: '#DBEAFE' }}>Start with CSV today. FIX, Kafka, S3 and database connectors are scaffolded for enterprise integrations.</Typography>
            </Box>
            <Button variant="contained" color="secondary" startIcon={<CloudUploadIcon />} component="label">
              Select CSV
              <input hidden type="file" accept=".csv" onChange={handleFile} />
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {connectors.map((connector) => (
          <Grid item xs={12} md={4} key={connector.id}>
            <ConnectorCard connector={connector} onSelect={() => csvConnector && document.querySelector<HTMLInputElement>('input[type=file]')?.click()} />
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
            <Box>
              <Typography variant="h6">CSV Upload</Typography>
              <Typography color="text.secondary">{selectedFile ? selectedFile.name : 'No file selected yet.'}</Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 190 }}>
              <InputLabel>Dataset type</InputLabel>
              <Select value={datasetType} label="Dataset type" onChange={(event) => setDatasetType(event.target.value as DatasetType)}>
                <MenuItem value="ORDERS">Orders</MenuItem>
                <MenuItem value="TRADES">Trades</MenuItem>
                <MenuItem value="MARKET_DATA">Market Data</MenuItem>
                <MenuItem value="REFERENCE_DATA">Reference Data</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" disabled={!selectedFile} onClick={handleUpload}>Process Upload</Button>
          </Stack>
          {message && <Alert sx={{ mt: 2 }} severity="info">{message}</Alert>}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}><UploadHistoryTable uploads={uploads} /></Grid>
        <Grid item xs={12} lg={4}><ValidationSummary findings={mockFindings} /></Grid>
      </Grid>
    </Stack>
  );
}
