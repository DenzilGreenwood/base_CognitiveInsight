// Core data models for the Pilot Workspace system

export interface Organization {
  id: string;
  name: string;
  sector: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  orgId: string;
  role: 'regulator' | 'auditor' | 'builder' | 'owner';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pilot {
  id: string;
  orgId: string;
  name: string;
  description: string;
  status: 'onboarding' | 'scoping' | 'implementation' | 'validation' | 'synthesis' | 'closeout' | 'completed';
  phases: PilotPhase[];
  successMetrics: string[];
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PilotPhase {
  phase: number;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Milestone {
  id: string;
  pilotId: string;
  title: string;
  description: string;
  phase: number;
  ownerUserId: string;
  dueAt: string;
  status: 'not_started' | 'in_progress' | 'blocked' | 'done';
  evidenceLinks: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deliverable {
  id: string;
  pilotId: string;
  role: string;
  title: string;
  description: string;
  type: 'document' | 'report' | 'checklist' | 'assessment';
  dueAt: string;
  url?: string;
  fileId?: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'approved';
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  pilotId: string;
  title: string;
  date: string;
  agenda: string[];
  notes?: string;
  decisions: string[];
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Artifact {
  id: string;
  pilotId: string;
  kind: 'doc' | 'link' | 'capsule_log' | 'note';
  title: string;
  description?: string;
  owner: string;
  visibility: 'all' | 'role_specific' | 'private';
  url?: string;
  fileId?: string;
  phase?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  pilotId: string;
  actor: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
  hashChainPtr?: string;
}

export interface Consent {
  id: string;
  pilotId: string;
  userId: string;
  caseStudyAllowed: boolean;
  scope: string;
  signedAt: string;
}

// Role-specific configurations
export interface RoleConfig {
  role: 'regulator' | 'auditor' | 'builder';
  responsibilities: string[];
  deliverables: string[];
  milestones: string[];
}

export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  regulator: {
    role: 'regulator',
    responsibilities: [
      'Review capsule evidence vs. regulatory intent (NIST AI RMF, ISO/IEC 42001, EU AI Act)',
      'Provide sufficiency feedback / acceptance criteria',
      'Validate compliance alignment'
    ],
    deliverables: [
      'Regulatory Sufficiency Notes',
      'Acceptance Criteria Rubric'
    ],
    milestones: [
      'M1: Criteria aligned',
      'M3: Mid-pilot sufficiency review',
      'M5: Final sufficiency memo'
    ]
  },
  auditor: {
    role: 'auditor',
    responsibilities: [
      'Map audit workflow; run capsule-based procedures',
      'Compare time/effort vs. baseline',
      'Validate audit process improvements'
    ],
    deliverables: [
      'Audit Workflow Map (before/after)',
      'Test Plan & Sampling Strategy',
      'Findings & Effort Reduction Report'
    ],
    milestones: [
      'M1: Workflow mapped',
      'M2: Test plan approved',
      'M4: Findings draft',
      'M5: Final auditor report'
    ]
  },
  builder: {
    role: 'builder',
    responsibilities: [
      'Integrate capsule generation in training/inference',
      'Validate LCM performance',
      'Protect IP and sensitive data'
    ],
    deliverables: [
      'Integration Plan (interfaces, red/green data handling)',
      'Performance Validation Report (latency, storage Δ)',
      'Privacy/IP Exposure Assessment'
    ],
    milestones: [
      'M1: Integration plan approved',
      'M2: Sandbox integration complete',
      'M3: Performance results posted',
      'M5: Final technical summary'
    ]
  }
};

// Phase template
export const PILOT_PHASES = [
  {
    phase: 0,
    name: 'Onboarding',
    description: 'Roles assigned; Agreement accepted; Charter finalized',
    duration: '1–2 weeks'
  },
  {
    phase: 1,
    name: 'Scoping',
    description: 'Reg: criteria draft; Auditor: workflow map; AI: integration plan',
    duration: '2–3 weeks'
  },
  {
    phase: 2,
    name: 'Implementation',
    description: 'AI team completes sandbox integration; sample capsules generated',
    duration: '3–4 weeks'
  },
  {
    phase: 3,
    name: 'Validation',
    description: 'Performance/bias/provenance checks; regulator sufficiency review',
    duration: '2–3 weeks'
  },
  {
    phase: 4,
    name: 'Synthesis',
    description: 'Auditor findings; regulator sufficiency memo; joint results review',
    duration: '2 weeks'
  },
  {
    phase: 5,
    name: 'Closeout',
    description: 'Final pilot report; consent on case study; data retention/disposition',
    duration: '1 week'
  }
];

export interface PilotKPIs {
  storageReductionTarget: number;
  storageReductionObserved?: number;
  verificationLatencyP50?: number;
  verificationLatencyP95?: number;
  milestonesOnTimePercentage: number;
  auditEffortDelta?: number;
}
