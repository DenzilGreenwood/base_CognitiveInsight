// Admin system types for pilot management
export interface PilotRequest {
  id: string;
  name: string;
  email: string;
  org: string;
  roleHint: 'regulator' | 'auditor' | 'ai_builder';
  sector: string;
  region: string;
  status: 'NEW' | 'SCOPING' | 'AGREEMENT_OUT' | 'SIGNED' | 'CONVERTED';
  ownerUserId?: string;
  tags: string[];
  score: {
    fit: number;
    feasibility: number;
    timeline: number;
    notes: string;
  };
  agreementLink?: {
    token: string;
    expiresAt: Date;
    usedAt?: Date;
  };
  audit: {
    entries: AuditEntry[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  metadata: Record<string, any>;
  timestamp: Date;
  prevHash?: string;
  currHash: string;
}

export interface SLA {
  entityId: string;
  dueAt: Date;
  kind: string;
  isOverdue: boolean;
  escalationLevel: number;
}

export interface CallLog {
  id: string;
  pilotId: string;
  date: Date;
  attendees: string[];
  notes: string;
  decisions: string[];
  nextSteps?: string[];
  createdBy: string;
}

export interface ArtifactRequest {
  id: string;
  pilotId: string;
  deliverableId: string;
  message: string;
  requestedBy: string;
  requestedAt: Date;
  dueAt: Date;
  uploadUrl?: string;
  status: 'PENDING' | 'UPLOADED' | 'OVERDUE';
}

export interface BulkAction {
  action: 'ASSIGN_REVIEWER' | 'TAG' | 'SEND_EMAIL' | 'ADVANCE_STATUS';
  requestIds: string[];
  params: Record<string, any>;
}

export interface CaseFileExport {
  pilotId: string;
  format: 'pdf' | 'zip';
  includeSections: {
    agreement: boolean;
    milestones: boolean;
    artifacts: boolean;
    decisions: boolean;
    auditLog: boolean;
  };
}

export interface MetricsSnapshot {
  id: string;
  pilotId: string;
  capturedAt: Date;
  storageDelta: number;
  p50VerifyMs: number;
  p95VerifyMs: number;
  milestoneCompletionRate: number;
  auditEffortDelta: number;
}

export interface AdminFilter {
  searchQuery?: string;
  facets: {
    sector?: string[];
    role?: string[];
    region?: string[];
    status?: string[];
    owner?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    risk?: string[];
  };
}

// Email template types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export const EMAIL_TEMPLATES = {
  INVITE: 'pilot-invite',
  AGREEMENT: 'pilot-agreement',
  SCOPING_CALL: 'scoping-call',
  WEEKLY_UPDATE: 'weekly-update',
  NUDGE: 'milestone-nudge',
  WRAP_UP: 'pilot-wrap-up'
} as const;

// Consent types
export interface ConsentRecord {
  requestId: string;
  consentType: 'CASE_STUDY' | 'METRICS_SHARING' | 'EMAIL_UPDATES';
  scope: string;
  grantedAt: Date;
  grantedBy: string;
}

// Quick tag presets
export const QUICK_TAGS = {
  SECTOR: ['financial', 'healthcare', 'government', 'insurance', 'legal'],
  RISK: ['low', 'medium', 'high', 'critical'],
  ROLE: ['regulator', 'auditor', 'ai_builder'],
  REGION: ['us', 'eu', 'apac', 'global'],
  DATA_NEEDS: ['simulated', 'real', 'hybrid']
} as const;

// Status flow definitions
export const STATUS_FLOWS = {
  REQUEST: {
    NEW: ['SCOPING', 'AGREEMENT_OUT'],
    SCOPING: ['AGREEMENT_OUT', 'NEW'],
    AGREEMENT_OUT: ['SIGNED', 'SCOPING'],
    SIGNED: ['CONVERTED'],
    CONVERTED: []
  },
  PILOT: {
    ONBOARDING: ['SCOPING', 'IMPL'],
    SCOPING: ['IMPL', 'ONBOARDING'],
    IMPL: ['VALIDATION', 'SCOPING'],
    VALIDATION: ['SYNTHESIS', 'IMPL'],
    SYNTHESIS: ['CLOSEOUT', 'VALIDATION'],
    CLOSEOUT: []
  }
} as const;

// Rubric scoring
export interface RubricScores {
  missionFit: {
    score: number; // 1-5
    notes: string;
  };
  roleClarity: {
    score: number;
    notes: string;
  };
  dataFeasibility: {
    score: number;
    notes: string;
  };
  timeline: {
    score: number;
    notes: string;
  };
  overallScore: number;
  recommendation: 'ACCEPT' | 'REJECT' | 'CONDITIONAL';
}
