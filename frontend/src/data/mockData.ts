import type { Alert, Metric } from '../types/surveillance';

export const metrics: Metric[] = [
  { label: 'Open Alerts', value: '248', delta: '+12% vs yesterday', tone: 'negative' },
  { label: 'High Risk', value: '31', delta: '+4 new today', tone: 'negative' },
  { label: 'Active Cases', value: '82', delta: '7 escalated', tone: 'neutral' },
  { label: 'Avg Review Time', value: '18m', delta: '-22% this week', tone: 'positive' },
];

export const alerts: Alert[] = [
  { id: 'AL-10234', type: 'Spoofing', trader: 'Michael Chen', desk: 'EU Equities', instrument: 'AAPL', risk: 96, level: 'CRITICAL', confidence: 97, status: 'Open', age: '8m', aiSummary: 'Large buy orders cancelled within 430ms followed by opposite-side sell execution after price movement.' },
  { id: 'AL-10235', type: 'Layering', trader: 'Sarah Malik', desk: 'US Futures', instrument: 'ESU6', risk: 88, level: 'HIGH', confidence: 91, status: 'In Review', age: '24m', aiSummary: 'Multiple visible orders across price levels were cancelled after best bid movement.' },
  { id: 'AL-10236', type: 'Wash Trading', trader: 'Alex Rivera', desk: 'Crypto', instrument: 'BTC-USD', risk: 79, level: 'HIGH', confidence: 84, status: 'Open', age: '1h', aiSummary: 'Matched buy and sell activity across related accounts within a narrow time window.' },
  { id: 'AL-10237', type: 'Marking Close', trader: 'Priya Shah', desk: 'APAC Equities', instrument: 'TSLA', risk: 68, level: 'MEDIUM', confidence: 76, status: 'Escalated', age: '3h', aiSummary: 'Aggressive trading activity detected in final auction window with measurable close price impact.' },
];

export const timeline = [
  ['09:30:01.233', 'Large BUY order created', '100,000 shares at best bid'],
  ['09:30:01.455', 'Order book moved', 'Best bid increased by 2 ticks'],
  ['09:30:01.782', 'Order cancelled', 'Lifetime 549ms, no execution'],
  ['09:30:02.001', 'SELL execution', '75,000 shares executed opposite-side'],
  ['09:30:02.400', 'Alert generated', 'Spoofing detector score 96/100'],
];
