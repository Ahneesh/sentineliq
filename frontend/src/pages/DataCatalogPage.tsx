import { Box, Grid, Stack, Typography } from '@mui/material';
import DatasetCard from '../components/data/DatasetCard';
import { mockDatasets } from '../data/dataPlatformMock';

export default function DataCatalogPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={900}>Data Catalog</Typography>
        <Typography color="text.secondary">Governed datasets available to surveillance detectors, analytics and AI investigator workflows.</Typography>
      </Box>
      <Grid container spacing={2}>
        {mockDatasets.map((dataset) => (
          <Grid item xs={12} md={6} lg={3} key={dataset.id}>
            <DatasetCard dataset={dataset} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
