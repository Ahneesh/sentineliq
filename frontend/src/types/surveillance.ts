export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'Open' | 'In Review' | 'Escalated' | 'Closed';

export interface Alert {
  id: string;
  type: string;
  trader: string;
  desk: string;
  instrument: string;
  risk: number;
  level: RiskLevel;
  confidence: number;
  status: AlertStatus;
  age: string;
  aiSummary: string;
}

export interface Metric {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'negative' | 'neutral';
}
