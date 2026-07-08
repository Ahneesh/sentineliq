import { Box, Card, CardContent, Grid, Stack, Typography, Button } from '@mui/material';
import RiskBadge from '../components/ui/RiskBadge';
import { alerts, timeline } from '../data/mockData';

export default function InvestigationPage() {
  const alert = alerts[0];
  return <Stack spacing={2}><Stack direction="row" justifyContent="space-between"><Box><Typography variant="h4">Investigation Workspace</Typography><Typography color="text.secondary">{alert.id} · {alert.type} · {alert.trader}</Typography></Box><RiskBadge level={alert.level} /></Stack><Grid container spacing={2}><Grid item xs={12} md={7}><Card><CardContent><Typography variant="h6">Market Replay Timeline</Typography>{timeline.map(([t,e,d])=><Box key={t} sx={{borderLeft:'3px solid #2563EB',pl:2,mt:2}}><Typography fontWeight={800}>{t} · {e}</Typography><Typography variant="body2" color="text.secondary">{d}</Typography></Box>)}</CardContent></Card></Grid><Grid item xs={12} md={5}><Card><CardContent><Typography variant="h6">Evidence Panel</Typography>{['96% cancellation rate','Average order lifetime 430ms','Opposite-side execution after book movement','Historical similarity 94%'].map(x=><Typography key={x} sx={{mt:1}}>✓ {x}</Typography>)}</CardContent></Card><Card sx={{mt:2}}><CardContent><Typography variant="h6">AI Recommendation</Typography><Typography sx={{mt:1}}>Escalate for Level 2 review. Compare activity with previous 90-day trader baseline and related desk alerts.</Typography><Button variant="contained" sx={{mt:2}}>Generate Report</Button></CardContent></Card></Grid></Grid></Stack>;
}
