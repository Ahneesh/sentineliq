import { Box, Card, CardContent, Grid, Stack, Typography, LinearProgress } from '@mui/material';
import MetricCard from '../components/ui/MetricCard';
import AlertCard from '../components/ui/AlertCard';
import { alerts, metrics } from '../data/mockData';

export default function DashboardPage() {
  return (
    <Stack spacing={3}>
      <Card sx={{ bgcolor: '#0F172A', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">Mission Control</Typography>
          <Typography sx={{ color: '#CBD5E1', mt: 1 }}>Highest priority: possible coordinated spoofing on EU Equities desk. AI recommends immediate investigation.</Typography>
        </CardContent>
      </Card>
      <Grid container spacing={2}>{metrics.map((m) => <Grid item xs={12} md={3} key={m.label}><MetricCard metric={m} /></Grid>)}</Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card><CardContent><Typography variant="h6">Priority Alerts</Typography><Box sx={{ mt: 2 }}>{alerts.slice(0,3).map(a => <AlertCard key={a.id} alert={a} />)}</Box></CardContent></Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card><CardContent><Typography variant="h6">Risk Heatmap</Typography>{['EU Equities','US Futures','Crypto','APAC Equities'].map((x,i)=><Box key={x} sx={{mt:2}}><Stack direction="row" justifyContent="space-between"><Typography>{x}</Typography><Typography>{[92,81,74,61][i]}</Typography></Stack><LinearProgress variant="determinate" value={[92,81,74,61][i]} sx={{height:10,borderRadius:5,mt:.5}} /></Box>)}</CardContent></Card>
          <Card sx={{ mt: 2 }}><CardContent><Typography variant="h6">AI Insight</Typography><Typography variant="body2" sx={{ mt: 1 }}>Three high-risk alerts share similar order-cancellation signatures and may indicate desk-level behaviour drift.</Typography></CardContent></Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
