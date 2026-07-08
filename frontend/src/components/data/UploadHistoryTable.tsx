import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import StatusBadge from '../ui/StatusBadge';
import { UploadRecord } from '../../types/dataPlatform';

export default function UploadHistoryTable({ uploads }: { uploads: UploadRecord[] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Recent Uploads</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Rows</TableCell>
              <TableCell align="right">Columns</TableCell>
              <TableCell align="right">Warnings</TableCell>
              <TableCell align="right">Errors</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uploads.map((upload) => (
              <TableRow key={upload.id} hover>
                <TableCell sx={{ fontWeight: 800 }}>{upload.original_filename}</TableCell>
                <TableCell><StatusBadge status={upload.status} /></TableCell>
                <TableCell align="right">{upload.row_count.toLocaleString()}</TableCell>
                <TableCell align="right">{upload.column_count}</TableCell>
                <TableCell align="right">{upload.warning_count}</TableCell>
                <TableCell align="right">{upload.error_count}</TableCell>
                <TableCell>{upload.uploaded_by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
