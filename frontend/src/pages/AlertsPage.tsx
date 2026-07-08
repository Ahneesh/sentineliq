import { Card, CardContent, Stack, Typography, TextField } from '@mui/material';
import AlertCard from '../components/ui/AlertCard';
import { alerts } from '../data/mockData';

export default function AlertsPage() {
  return <Stack spacing={2}><Typography variant="h4">Alert Queue</Typography><TextField size="small" placeholder="Search alerts, traders, instruments..." /><Card><CardContent>{alerts.map(a => <AlertCard key={a.id} alert={a} />)}</CardContent></Card></Stack>;
}
