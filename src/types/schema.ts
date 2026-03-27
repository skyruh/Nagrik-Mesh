export type PriorityLevel = 'Critical' | 'High' | 'Moderate' | 'Low';

export type ComplaintStatus = 'Pending' | 'Flagged' | 'Resolved' | 'In Progress' | 'Processing' | 'Escalated';

export interface SuspicionFlag {
    type: string;
    reason: string;
    severity: 'Low' | 'Medium' | 'High';
}

export interface AIAnalysis {
    rootCause: string;
    sentiment: 'Frustrated' | 'Neutral' | 'Urgent' | 'Negative/Upset';
    department: string;
    reliability: number; // 0-1
}

export interface Complaint {
    id: string;
    category: string;
    description: string;
    location: string;
    ward: string;
    timestamp: string;
    status: ComplaintStatus;
    priority: PriorityLevel;
    priorityScore: number;
    aiAnalysis: AIAnalysis;
    suggestedSolution: string;
    historicalSolutionApplied: boolean;
    suspicionFlags: SuspicionFlag[];
}

export interface ExtendedComplaint extends Complaint {
    citizenName: string;
    department: string;
    subject: string;
    dateFiled: string;
    lastAction: string;
}

export interface SolutionRecord {
    category: string;
    problemPattern: string;
    effectiveSolution: string;
    lastUsed: string;
    successRate: number;
}
