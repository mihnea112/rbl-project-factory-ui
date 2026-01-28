// User & Auth Types
export type UserRole = 'applicant' | 'reviewer' | 'project-lead' | 'supporter' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

// Application & Project Types
export type ApplicationStream = 'A' | 'B';
export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'ai-eligible'
  | 'ai-revision'
  | 'shortlisted'
  | 'accepted'
  | 'in-pilot'
  | 'scaling'
  | 'stopped'
  | 'rejected';

export type TriageStatus = 'eligible' | 'needs-revision' | 'out-of-scope';

export interface Application {
  id: string;
  applicantId: string;
  title: string;
  description: string;
  stream: ApplicationStream;
  status: ApplicationStatus;
  triageStatus: TriageStatus;
  submittedAt?: Date;
  scores: {
    feasibility: number;    // 0-40
    scalability: number;    // 0-30
    innovation: number;     // 0-20
    alignment: number;      // 0-10
  };
  totalScore: number;
  notes?: string;
  attachments: string[];
  strategicObjective?: string;
  ecosystemLever?: string;
  chapterFit?: string;
  riskFlags?: string[];
}

export interface TriageResult {
  applicationId: string;
  status: TriageStatus;
  suggestedStream: ApplicationStream;
  scores: Application['scores'];
  reasoning: string[];
  missingInfo: string[];
  reviewerNotes?: string;
}

export interface Project {
  id: string;
  applicationId: string;
  title: string;
  description: string;
  status: 'incubation' | 'pilot' | 'scaling' | 'institutionalize' | 'stopped';
  stage: 'incubation' | 'chapter-pilot' | 'scale' | 'institutionalize' | 'exit';
  teamLead: string;
  budget: number;
  startDate: Date;
  targetOutcome: string;
  milestones: Milestone[];
  chapters?: Chapter[];
  supporterRequests: SupporterRequest[];
  impactData: ImpactData;
  nextReviewDate?: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'completed' | 'blocked';
  dueDate: Date;
  owner?: string;
  evidence?: string[];
}

export interface Chapter {
  id: string;
  name: string;
  region: string;
  pilotStart?: Date;
  capacity?: number;
  available: boolean;
}

export interface Funding {
  id: string;
  projectId: string;
  tranche: 'incubation' | 'pilot' | 'scale';
  amount: number;
  status: 'locked' | 'approved' | 'released';
  conditions: string[];
  evidenceChecklist: { item: string; completed: boolean }[];
  releaseDate?: Date;
  approvalDate?: Date;
}

export interface SupporterRequest {
  id: string;
  projectId: string;
  type: 'capital' | 'expertise' | 'network' | 'leadership';
  amount?: number;
  description: string;
  status: 'open' | 'pending' | 'fulfilled';
  pledges?: SupporterPledge[];
}

export interface SupporterPledge {
  id: string;
  supporterId: string;
  requestId: string;
  amount?: number;
  hours?: number;
  description: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
}

export interface Supporter {
  id: string;
  name: string;
  email: string;
  contributionTypes: ('capital' | 'expertise' | 'network' | 'leadership')[];
  interests: string[];
  region?: string;
  availability?: string;
  pledges: SupporterPledge[];
  createdAt: Date;
}

export interface ImpactData {
  beneficiaries?: number;
  outcomes: ImpactOutcome[];
  outputs: ImpactOutput[];
  costPerOutcome?: number;
  satisfaction?: number;
  riskRating?: 'red' | 'amber' | 'green';
  ragStatus?: 'green' | 'amber' | 'red';
}

export interface ImpactOutcome {
  metric: string;
  target: number;
  current: number;
  unit: string;
}

export interface ImpactOutput {
  metric: string;
  target: number;
  current: number;
  unit: string;
}

// Portfolio Types
export interface PortfolioStats {
  totalProjects: number;
  projectsByStage: Record<string, number>;
  totalBeneficiaries: number;
  successRate: number;
  costEfficiency: number;
  supporterEngagement: number;
}

// Admin Types
export interface StrategicObjective {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface EcosystemLever {
  id: string;
  name: string;
  description: string;
  active: boolean;
}
