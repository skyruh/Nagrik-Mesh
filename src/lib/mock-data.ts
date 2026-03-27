import { ExtendedComplaint, SolutionRecord } from '../types/schema';

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

export const MOCK_COMPLAINTS: Partial<ExtendedComplaint>[] = [
    {
        id: 'CPG-2023-A01',
        citizenName: 'Ramesh Kumar',
        department: 'MoHFW',
        subject: 'Vaccine shorta...',
        category: 'Health',
        description: 'Serious delay in Pension disbursement (EPFO) submitted stref apposito deiry in mise important to pro...',
        location: 'Ward 12',
        ward: 'Ward 12',
        dateFiled: '21/10/23',
        status: 'Pending',
        lastAction: 'Assign'
    },
    {
        id: 'CPG-2023-A02',
        citizenName: 'Priya Singh',
        department: 'MoE',
        subject: 'Vaccine shorta...',
        category: 'Education',
        description: 'School fee reimbursement pending for 3 months.',
        location: 'District Office',
        ward: 'Ward 5',
        dateFiled: '21/10/23',
        status: 'Pending',
        lastAction: 'Assign'
    },
    {
        id: 'CPG-2023-A03',
        citizenName: 'Ramesh Kumar',
        department: 'MoHFW',
        subject: 'Vaccine shorta...',
        category: 'Health',
        description: 'Medical supply shortage in government clinic.',
        location: 'St. Mary Hospital Area',
        ward: 'Ward 12',
        dateFiled: '21/10/23',
        status: 'Pending',
        lastAction: 'Assign'
    },
    {
        id: 'CPG-2023-B14',
        citizenName: 'Priya Singh',
        department: 'MoE',
        subject: 'School Fee...',
        category: 'Education',
        description: 'Higher education fund transfer delay.',
        location: 'Regional Office',
        ward: 'Ward 5',
        dateFiled: '21/10/23',
        status: 'Processing',
        lastAction: 'Verify'
    },
    {
        id: 'CPG-2023-C33',
        citizenName: 'Rakesh Verma',
        department: 'MoHFW',
        subject: 'Railway Delay',
        category: 'Transport',
        description: 'Repeated delays in local train services during peak hours.',
        location: 'Station Area',
        ward: 'Ward 8',
        dateFiled: '21/10/23',
        status: 'Escalated',
        lastAction: 'Escalated'
    }
];
