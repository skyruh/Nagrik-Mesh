import { Complaint, PriorityLevel, SuspicionFlag, AIAnalysis, SolutionRecord, ExtendedComplaint } from '../types/schema';
import { HISTORICAL_SOLUTIONS } from './mock-data';

const CATEGORY_SEVERITY: Record<string, number> = {
    'Infrastructure': 40,
    'Water Supply': 30,
    'Electricity': 20,
    'Safety': 50,
    'General': 10
};

const KEYWORDS_URGENT = ['burst', 'flood', 'hospital', 'crack', 'collapse', 'fire', 'injury'];

export function calculatePriority(complaint: Partial<ExtendedComplaint>): { score: number, level: PriorityLevel } {
    let score = CATEGORY_SEVERITY[complaint.category || 'General'] || 10;

    // Keyword analysis
    const desc = (complaint.description || '').toLowerCase();
    const subj = (complaint.subject || '').toLowerCase();

    if (KEYWORDS_URGENT.some(kw => desc.includes(kw) || subj.includes(kw))) {
        score += 40;
    }

    if (desc.includes('hospital') || desc.includes('urgent') || desc.includes('serious')) {
        score += 20;
    }

    let level: PriorityLevel = 'Low';
    if (score >= 80) level = 'Critical';
    else if (score >= 60) level = 'High';
    else if (score >= 30) level = 'Moderate';

    return { score, level };
}

export function findSuggestedSolution(complaint: Partial<Complaint>): { solution: string, fromHistory: boolean } {
    const desc = (complaint.description || '').toLowerCase();

    const match = HISTORICAL_SOLUTIONS.find(s =>
        s.category === complaint.category && desc.includes(s.problemPattern)
    );

    if (match) {
        return { solution: match.effectiveSolution, fromHistory: true };
    }

    return {
        solution: `Analyze ${complaint.category} issue at ${complaint.location} and deploy field inspection team.`,
        fromHistory: false
    };
}

export function enrichComplaint(complaint: Partial<ExtendedComplaint>, existingComplaints: ExtendedComplaint[]): ExtendedComplaint {
    const { score, level } = calculatePriority(complaint);
    const { solution, fromHistory } = findSuggestedSolution(complaint);

    const similarInWard = existingComplaints.filter(c =>
        c.ward === complaint.ward && c.category === complaint.category
    ).length;

    const flags: SuspicionFlag[] = [];
    if (similarInWard >= 2) {
        flags.push({
            type: 'Frequent Pattern',
            reason: `Previous complaints similarity`,
            severity: 'Medium'
        });
        flags.push({
            type: 'Linguistic Drift',
            reason: `Unusual language`,
            severity: 'Low'
        });
    }

    const analysis: AIAnalysis = {
        department: complaint.department || complaint.category || 'General',
        rootCause: fromHistory ? 'Probable recurring infrastructure wear' : 'New singular event',
        sentiment: score > 60 ? 'Urgent' : 'Neutral',
        reliability: 0.85
    };

    return {
        ...complaint,
        id: complaint.id || `CPG-DUMMY`,
        status: complaint.status || 'Pending',
        priority: level,
        priorityScore: score,
        aiAnalysis: analysis,
        suggestedSolution: solution,
        historicalSolutionApplied: fromHistory,
        lastAction: complaint.lastAction || 'No primary action logged',
        suspicionFlags: flags,
        timestamp: complaint.timestamp || '2023-10-21T10:00:00Z',
    } as ExtendedComplaint;
}

export function getProcessedComplaints(raw: Partial<ExtendedComplaint>[]): ExtendedComplaint[] {
    const processed: ExtendedComplaint[] = [];
    for (const c of raw) {
        processed.push(enrichComplaint(c, processed));
    }
    return processed;
}
