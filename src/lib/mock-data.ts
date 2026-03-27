import { Complaint, SolutionRecord } from '../types/schema';

export const HISTORICAL_SOLUTIONS: SolutionRecord[] = [
    {
        category: 'Water Supply',
        problemPattern: 'leakage',
        effectiveSolution: 'Replace old PVC joints with reinforced steel couplers and recalibrate pressure valves.',
        lastUsed: '2026-02-15',
        successRate: 0.92
    },
    {
        category: 'Electricity',
        problemPattern: 'street light',
        effectiveSolution: 'Replace blown capacitor in the transformer unit and install LED bulb.',
        lastUsed: '2026-03-01',
        successRate: 0.85
    }
];

export const MOCK_COMPLAINTS: Partial<Complaint>[] = [
    {
        id: 'G-2026-001',
        category: 'Water Supply',
        description: 'Major pipe burst near St. Mary Hospital. Water flooding the street.',
        location: 'St. Mary Hospital Area',
        ward: 'Ward 12',
        timestamp: '2026-03-26T10:30:00Z',
        status: 'Pending'
    },
    {
        id: 'G-2026-002',
        category: 'Water Supply',
        description: 'Frequent leakage reported again in Ward 12 near the park.',
        location: 'Central Park North',
        ward: 'Ward 12',
        timestamp: '2026-03-26T11:45:00Z',
        status: 'Pending'
    },
    {
        id: 'G-2026-003',
        category: 'Electricity',
        description: 'Street light not working since 3 days on 5th Cross.',
        location: '5th Cross Road',
        ward: 'Ward 5',
        timestamp: '2026-03-27T08:00:00Z',
        status: 'Pending'
    },
    {
        id: 'G-2026-004',
        category: 'Infrastructure',
        description: 'Sudden structural cracks observed on the flyover pillar.',
        location: 'Main Highway Flyover',
        ward: 'Ward 8',
        timestamp: '2026-03-27T14:00:00Z',
        status: 'Pending'
    }
];
