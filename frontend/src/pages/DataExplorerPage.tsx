import { Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';

const rows = [
  { event: 'ORDER_CREATED', trader: 'Michael Chen', instrument: 'AAPL', side: 'BUY', quantity: '250,000', timestamp: '09:30:01.232' },
  { event: 'ORDER_CANCELLED', trader: 'Michael Chen', instrument: 'AAPL', side: 'BUY', quantity: '250,000', timestamp: '09:30:01.612' },
  { event: 'TRADE_EXECUTED', trader: 'Michael Chen', instrument: 'AAPL', side: 'SELL', quantity: '75,000', timestamp: '09:30:02.004' },
  { event: 'PRICE_UPDATE', trader: '-', instrument: 'AAPL', side: '-', quantity: '-', timestamp: '09:30:02.100' },
];

export default function DataExplorerPage() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" fontWeight={900}>Data Explorer</Typography>
        <Typography color="text.secondary">Search canonical market events before they become detector evidence.</Typography>
      </div>
      <Card>
        <CardContent>
          <TextField fullWidth label="Search events, traders, instruments or upload lineage" placeholder="Example: cancelled orders above 1m shares" sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Trader</TableCell>
                <TableCell>Instrument</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={`${row.event}-${index}`} hover>
                  <TableCell><Chip label={row.event} size="small" /></TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{row.trader}</TableCell>
                  <TableCell>{row.instrument}</TableCell>
                  <TableCell>{row.side}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
