import { Project, SectorType, ProjectStatus, ClearanceStatus, UtilityStatus, TenderStatus, LabourStatus, MaterialStatus, WeatherDisruption, ApprovalDelay, Milestone } from '../types/project';
import { calculateRiskBreakdown, computeTotalRiskScore, getRiskLevel, generateRiskDrivers, generateRecommendations } from '../services/riskService';

// Pre-defined sector metadata for realistic synthetic data distribution
const SECTORS_META: Record<SectorType, {
  ministries: string[];
  agencies: string[];
  subSectors: string[];
  projectPrefixes: string[];
}> = {
  'Transport & Logistics': {
    ministries: ['Ministry of Road Transport and Highways', 'Ministry of Railways', 'Ministry of Ports, Shipping and Waterways', 'Ministry of Civil Aviation'],
    agencies: ['NHAI', 'DFCCIL', 'Rail Vikas Nigam Ltd', 'AAI', 'JNPA Port Trust', 'Delhi Metro Rail Corp'],
    subSectors: ['Expressways & Highways', 'Dedicated Freight Corridors', 'Metro Rail Systems', 'Major Deepwater Ports', 'International Airports'],
    projectPrefixes: ['Expansion of', 'Four-Laning of', 'Construction of High-Speed', 'Modernization of', 'Phase-II Package of'],
  },
  'Energy': {
    ministries: ['Ministry of Power', 'Ministry of New and Renewable Energy', 'Ministry of Petroleum and Natural Gas'],
    agencies: ['NTPC Limited', 'Power Grid Corporation (PGCIL)', 'NHPC', 'SECI', 'GAIL India', 'SJVN Limited'],
    subSectors: ['Ultra Mega Solar Parks', 'Hydroelectric Storage', 'High-Voltage Green Energy Corridors', 'LNG Regasification Terminals', 'Offshore Wind Farms'],
    projectPrefixes: ['Establishment of', 'Grid Integration of', 'Supercritical Thermal Unit of', 'Hydro pumped-storage at', 'Green Hydrogen Pipeline from'],
  },
  'Water & Sanitation': {
    ministries: ['Ministry of Jal Shakti', 'Ministry of Housing and Urban Affairs'],
    agencies: ['National Water Development Agency', 'State Urban Water Board', 'Central Ground Water Board', 'WAPCOS'],
    subSectors: ['Inter-Basin River Linkages', 'Mega Lift Irrigation Schemes', 'Urban Wastewater Recycling Networks', 'Regional Bulk Water Transmission'],
    projectPrefixes: ['Interlinking Canal of', 'Lift Irrigation Package at', 'Desalination Complex at', 'Bulk Pipeline Network across'],
  },
  'Communication': {
    ministries: ['Ministry of Communications', 'Ministry of Electronics and Information Technology'],
    agencies: ['BSNL', 'Bharat Broadband Network (BBNL)', 'Digital India Corp', 'RailTel Corporation'],
    subSectors: ['National Fiber Optical Network', 'Strategic Border Telecom Connectivity', 'Subsea Cable Landing Station', '5G Core Infrastructure'],
    projectPrefixes: ['Optical Fiber Deployment for', 'Broadband Expansion in', 'Carrier-grade Data Hub at', 'Satellite Ground Gateway at'],
  },
  'Social Infrastructure': {
    ministries: ['Ministry of Health and Family Welfare', 'Ministry of Education', 'Ministry of Youth Affairs and Sports'],
    agencies: ['HSCC (India) Limited', 'CPWD', 'National Buildings Construction Corp (NBCC)', 'AIIMS Engineering Cell'],
    subSectors: ['Super-Speciality Apex Hospitals (AIIMS)', 'Central Research Universities', 'National High-Performance Training Centres', 'Emergency Disaster Logistics Hubs'],
    projectPrefixes: ['Phase-III Academic Block at', '500-Bed Trauma & Surgical Unit at', 'Advanced Material Research Centre at', 'National Sports Academy at'],
  },
  'Coal': {
    ministries: ['Ministry of Coal'],
    agencies: ['Coal India Limited (CIL)', 'South Eastern Coalfields (SECL)', 'Mahanadi Coalfields (MCL)', 'CMPDI'],
    subSectors: ['First-Mile Rail Evacuation Infrastructure', 'Continuous Surface Mining Systems', 'Heavy Washery Complexes', 'Coal Gasification Pilot Plants'],
    projectPrefixes: ['First-Mile Connectivity Rapid Loading at', 'Deep Seam Longwall Extraction at', 'Automated Washery Complex at', 'Coal-to-Chemical Unit at'],
  },
  'Steel': {
    ministries: ['Ministry of Steel'],
    agencies: ['Steel Authority of India (SAIL)', 'Rashtriya Ispat Nigam (RINL)', 'NMDC Limited', 'MECON'],
    subSectors: ['Pelletization Plants', 'Blast Furnace Modernization', 'Special Grade Alloy Lines', 'Slurry Transportation Pipelines'],
    projectPrefixes: ['Modernization of Blast Furnace #5 at', 'Pelletization Plant (4 MTPA) at', 'Automated Hot Strip Mill at', 'Direct Reduced Iron Plant at'],
  },
  'Mining': {
    ministries: ['Ministry of Mines', 'Department of Atomic Energy'],
    agencies: ['NMDC Limited', 'Hindustan Copper Limited (HCL)', 'NALCO', 'IREL (India) Limited'],
    subSectors: ['Rare Earth Extraction Facilities', 'High-Grade Iron Ore Beneficiation', 'Copper Smelting & Refining Lines', 'Bauxite Mining Concessions'],
    projectPrefixes: ['Strategic Minerals Refinery at', 'Mechanized Open-Cast Iron Ore Mine at', 'Tailings Reclamation Facility at', 'Smelter Expansion Package at'],
  },
};

const STATES = [
  'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Karnataka', 
  'Andhra Pradesh', 'Odisha', 'Madhya Pradesh', 'Rajasthan', 'West Bengal', 
  'Assam', 'Bihar', 'Telangana', 'Chhattisgarh', 'Jharkhand', 'Kerala', 'Punjab'
];

const CONTRACTORS = [
  'Larsen & Toubro Ltd', 'Tata Projects Limited', 'Afcons Infrastructure', 
  'Dilip Buildcon', 'NCC Limited', 'HCC Infrastructure', 'Megha Engineering (MEIL)', 
  'Kalpataru Power', 'KEC International', 'Shapoorji Pallonji EPC'
];

// Helper to generate realistic milestones
function generateSyntheticMilestones(baseDateStr: string, total: number, delayedCount: number): Milestone[] {
  const milestones: Milestone[] = [];
  const baseYear = parseInt(baseDateStr.split('-')[0], 10) || 2024;
  const names = [
    'Detailed Project Report & Statutory Approvals',
    'Land Demarcation & RoW Clearance',
    'Tendering & EPC Contractor Mobilization',
    'Subgrade, Foundation & Piling Works',
    'Superstructure & Heavy Civil Fabrication',
    'Electromechanical Equipment Installation',
    'Integrated Testing & Commissioning Run',
    'Statutory Safety Certification & Commercial COD',
  ];

  for (let i = 0; i < total; i++) {
    const isDelayed = i >= total - delayedCount;
    const isCompleted = i < total - delayedCount - 1;
    const delayMo = isDelayed ? Math.floor(Math.random() * 5) + 2 : 0;
    
    const year = baseYear + Math.floor(i / 2);
    const month = ((i % 2) * 6 + 3).toString().padStart(2, '0');
    const target = `${year}-${month}-15`;
    
    milestones.push({
      id: `ms-${i + 1}`,
      name: names[i % names.length] || `Milestone Phase ${i + 1}`,
      target_date: target,
      revised_date: isDelayed ? `${year}-${((parseInt(month, 10) + delayMo) % 12 || 12).toString().padStart(2, '0')}-28` : undefined,
      actual_date: isCompleted ? target : undefined,
      status: isCompleted ? 'COMPLETED' : isDelayed ? 'DELAYED' : 'ON_TRACK',
      delay_months: delayMo,
      weightage_percent: Math.round(100 / total),
    });
  }

  return milestones;
}

// 1. HERO DEMO PROJECT (Project ID: PJ-1042)
const HERO_PROJECT: Project = {
  project_id: 'PJ-1042',
  project_name: 'Eastern Freight Corridor Expansion (Package E-4)',
  ministry: 'Ministry of Railways',
  department: 'Railway Board',
  sector: 'Transport & Logistics',
  sub_sector: 'Dedicated Freight Corridors',
  state: 'Uttar Pradesh / Bihar',
  district: 'Varanasi - Sasaram Section',
  implementing_agency: 'DFCCIL (Dedicated Freight Corridor Corp)',
  project_type: 'Brownfield Corridor Electrification & Double Tracking',
  
  original_cost: 8450,
  revised_cost: 9180,
  cumulative_expenditure: 5324,
  financial_progress: 58, // 58%
  
  approved_date: '2022-04-10',
  original_start_date: '2022-08-15',
  original_completion_date: '2025-12-31',
  revised_completion_date: '2026-07-31',
  current_completion_forecast: '2026-11-30',
  physical_progress: 61,
  planned_progress: 76,
  
  milestones_total: 8,
  milestones_completed: 4,
  milestones_delayed: 3,
  milestones: generateSyntheticMilestones('2022-08-15', 8, 3),
  
  status: 'CRITICAL',
  monthly_update_date: '2026-08-28',
  contractor: 'Larsen & Toubro Ltd / DFCC JV',
  land_status: 'Severe RoW Bottleneck in 3 Districts',
  land_progress: 52, // 52%
  land_target: 90,   // 90%
  environment_clearance: 'Conditional',
  utility_shift_status: 'Critical Delay',
  tender_status: 'Awarded',
  labour_status: 'Moderate Shortage',
  material_status: 'Cost Inflation',
  weather_disruption: 'Seasonal',
  approval_delay: 'Major (>6 mo)',
  dependency_count: 5,
  
  risk_score: 82,
  risk_level: 'CRITICAL',
  risk_breakdown: {
    schedule_risk: 86,
    milestone_risk: 80,
    cost_risk: 78,
    expenditure_risk: 82,
    dependency_risk: 88,
    implementation_risk: 75,
    anomaly_score: 85,
  },
  cost_overrun_probability: 78,
  time_overrun_probability: 86,
  predicted_cost_overrun: 730,
  predicted_delay_months: 7,
  
  risk_drivers: [
    {
      id: 'drv-pj1042-land',
      name: 'Land Acquisition Delay',
      category: 'Land Acquisition',
      severity: 'CRITICAL',
      impact_points: 18,
      evidence: 'Land acquisition achieved: 52% against required baseline target of 90% (38% gap across 34km section).',
      explanation: 'Pending compensation awards and court stays on 42 parcels along the Chandauli-Bhabua stretch are preventing continuous track bed formation.',
      recommended_action: 'Empower Special Land Acquisition Officer (SLAO) with direct district tribunal resolution powers.',
    },
    {
      id: 'drv-pj1042-milestone',
      name: 'Milestone Slippage',
      category: 'Milestone Slippage',
      severity: 'CRITICAL',
      impact_points: 14,
      evidence: '3 consecutive key engineering milestones delayed past revised baseline (Track laying, Traction substations, Signaling interlocking).',
      explanation: 'Delays in track sub-ballast delivery compounded by monsoon waterlogging have halted mechanized track-laying machines (NTC).',
      recommended_action: 'Crash critical path activities with parallel signaling installation shifts during dry intervals.',
    },
    {
      id: 'drv-pj1042-expenditure',
      name: 'Low Expenditure Trajectory',
      category: 'Expenditure Trajectory',
      severity: 'HIGH',
      impact_points: 11,
      evidence: 'Cumulative expenditure progress is 58% vs planned financial progress of 76% (18% capital deployment lag).',
      explanation: 'Disputed variations in steel price adjustment clauses have delayed contractor invoice submissions for Q1-Q2.',
      recommended_action: 'Fast-track provisional price escalation settlement through DFCCIL disputed claims committee.',
    },
    {
      id: 'drv-pj1042-utility',
      name: 'Utility Shifting & Power Grid Crossing',
      category: 'Utility & Clearances',
      severity: 'HIGH',
      impact_points: 8,
      evidence: '3 high-tension 400kV PowerGrid line relocations pending clearance for >120 days.',
      explanation: 'Grid transmission shutdown windows have been repeatedly postponed to avoid agricultural peak load disconnections.',
      recommended_action: 'Direct joint scheduling between State Transmission Utility, PGCIL and DFCCIL for coordinated night-time shutdowns.',
    },
  ],
  recommendations: [
    {
      id: 'rec-pj1042-1',
      priority: 1,
      title: 'Resolve Land Acquisition Dependency & Handover Critical 34km RoW',
      category: 'Land',
      problem: 'Land acquisition progress is 52% (target: 90%), blocking two critical downstream track laying milestones.',
      evidence: 'SLAO disbursement pending in Varanasi & Kaimur districts.',
      impact: 'Drives ~4.5 months of direct critical path delay and potential idle-machinery claims.',
      action: 'Release ₹140 Cr supplementary escrow to District Revenue Officers for immediate compensation disbursement.',
      expected_benefit: 'Could reduce projected schedule exposure by approximately 2.5–3 months.',
      responsible_entity: 'DFCCIL / State Revenue Department (UP & Bihar)',
    },
    {
      id: 'rec-pj1042-2',
      priority: 2,
      title: 'Mandate Coordinated Transmission Shutdown Windows',
      category: 'Clearance',
      problem: '3 high-voltage line crossings blocking overhead electrification (OHE) mast erection.',
      evidence: 'Utility shifting status is in Critical Delay status.',
      impact: 'Halts traction substation energization tests.',
      action: 'Convene State Level Power Committee to sanction three 8-hour staggered line shutdowns.',
      expected_benefit: 'Unlocks ₹180 Cr worth of pending OHE works.',
      responsible_entity: 'PGCIL / UP Power Transmission Corp',
    },
    {
      id: 'rec-pj1042-3',
      priority: 3,
      title: 'Expedite Contractor Dispute Settlement & Double-Shift Mobilization',
      category: 'Contractor',
      problem: 'Financial progress (58%) lag due to withheld variation claims.',
      evidence: 'Price escalation clause disputes under review.',
      impact: 'Slows contractor liquidity and daily ballast dumping rates.',
      action: 'Release 75% ad-hoc payment against undisputed variation bills as per Ministry arbitration guidelines.',
      expected_benefit: 'Restores contractor cash flow and enables 24/7 track-laying operations.',
      responsible_entity: 'Project Director (DFCCIL) / Finance Division',
    },
  ],
};

// Seeded pseudorandom number generator for stable synthetic dataset across runs
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate the full portfolio of 240 projects
export function generateSyntheticPortfolio(): Project[] {
  const portfolio: Project[] = [HERO_PROJECT];
  const sectorList = Object.keys(SECTORS_META) as SectorType[];
  
  let currentId = 1043;
  let seed = 42;

  // Generate 240 additional realistic projects distributed across 8 sectors
  for (let i = 0; i < 240; i++) {
    const sector = sectorList[i % sectorList.length];
    const meta = SECTORS_META[sector];
    const state = STATES[Math.floor(seededRandom(seed++) * STATES.length)];
    const ministry = meta.ministries[Math.floor(seededRandom(seed++) * meta.ministries.length)];
    const agency = meta.agencies[Math.floor(seededRandom(seed++) * meta.agencies.length)];
    const subSector = meta.subSectors[Math.floor(seededRandom(seed++) * meta.subSectors.length)];
    const prefix = meta.projectPrefixes[Math.floor(seededRandom(seed++) * meta.projectPrefixes.length)];
    const contractor = CONTRACTORS[Math.floor(seededRandom(seed++) * CONTRACTORS.length)];

    const projectId = `PJ-${currentId++}`;
    const projectName = `${prefix} ${subSector} - Phase ${Math.floor(seededRandom(seed++) * 3) + 1} (${state})`;

    // Realistic cost distribution (₹300 Cr to ₹28,000 Cr)
    const baseCost = Math.round((seededRandom(seed++) * 7500 + 450) * (sector === 'Transport & Logistics' || sector === 'Energy' ? 1.8 : 1));
    const originalCost = Math.round(baseCost / 10) * 10;
    
    // Project age and progress variables
    const approvedYear = 2021 + Math.floor(seededRandom(seed++) * 4); // 2021-2024
    const startMonth = Math.floor(seededRandom(seed++) * 12) + 1;
    const originalDurationMonths = Math.floor(seededRandom(seed++) * 36) + 24; // 24-60 months
    
    // Realistic planned progress (20% - 95%)
    const plannedProgress = Math.min(95, Math.max(20, Math.round(seededRandom(seed++) * 70 + 25)));
    
    // Risk profile generator: ~20% Critical/High, ~40% Moderate, ~40% Low
    const riskDice = seededRandom(seed++);
    let progressGap: number;
    let costEscalationRate: number;
    let landDeficit: number;
    let clearance: ClearanceStatus;
    let utility: UtilityStatus;
    let labour: LabourStatus;
    let material: MaterialStatus;
    let approvalDelay: ApprovalDelay;
    let status: ProjectStatus;

    if (riskDice < 0.15) {
      // Critical Risk Archetype
      progressGap = Math.round(seededRandom(seed++) * 18 + 12); // 12-30% lag
      costEscalationRate = 0.12 + seededRandom(seed++) * 0.25; // 12-37% cost increase
      landDeficit = Math.round(seededRandom(seed++) * 35 + 20); // 20-55% land gap
      clearance = seededRandom(seed++) > 0.4 ? 'Pending' : 'Conditional';
      utility = 'Critical Delay';
      labour = seededRandom(seed++) > 0.5 ? 'Severe Shortage' : 'Moderate Shortage';
      material = 'Cost Inflation';
      approvalDelay = 'Major (>6 mo)';
      status = 'CRITICAL';
    } else if (riskDice < 0.35) {
      // High Risk Archetype
      progressGap = Math.round(seededRandom(seed++) * 12 + 6); // 6-18% lag
      costEscalationRate = 0.05 + seededRandom(seed++) * 0.15;
      landDeficit = Math.round(seededRandom(seed++) * 20 + 10);
      clearance = seededRandom(seed++) > 0.6 ? 'Pending' : 'In Review';
      utility = 'In Progress';
      labour = 'Moderate Shortage';
      material = seededRandom(seed++) > 0.5 ? 'Supply Disrupted' : 'Stable';
      approvalDelay = 'Minor (<3 mo)';
      status = 'DELAYED';
    } else if (riskDice < 0.70) {
      // Moderate Risk Archetype
      progressGap = Math.round(seededRandom(seed++) * 6 - 1); // -1% to 5% lag
      costEscalationRate = seededRandom(seed++) * 0.06;
      landDeficit = Math.round(seededRandom(seed++) * 10);
      clearance = 'In Review';
      utility = 'In Progress';
      labour = 'Adequate';
      material = 'Stable';
      approvalDelay = 'None';
      status = 'UNDER_WATCH';
    } else {
      // Low Risk / On Track Archetype
      progressGap = Math.round(seededRandom(seed++) * 3 - 3); // On track or slightly ahead
      costEscalationRate = 0;
      landDeficit = 0;
      clearance = 'Approved';
      utility = 'Completed';
      labour = 'Adequate';
      material = 'Stable';
      approvalDelay = 'None';
      status = plannedProgress >= 90 ? 'COMPLETED' : 'ON_TRACK';
    }

    const physicalProgress = Math.min(100, Math.max(5, plannedProgress - progressGap));
    const revisedCost = Math.round(originalCost * (1 + costEscalationRate));
    
    // Financial expenditure (roughly physical progress minus small gap)
    const financialProgress = Math.min(100, Math.max(5, Math.round(physicalProgress * (0.88 + seededRandom(seed++) * 0.20))));
    const cumulativeExpenditure = Math.round((financialProgress / 100) * revisedCost);

    const landTarget = 95;
    const landProgress = Math.min(100, Math.max(20, landTarget - landDeficit));

    const totalMilestones = Math.floor(seededRandom(seed++) * 5) + 6; // 6-10 milestones
    const delayedMilestones = progressGap > 12 ? Math.min(totalMilestones - 2, Math.floor(seededRandom(seed++) * 3) + 2) :
                              progressGap > 5 ? 1 : 0;
    const completedMilestones = Math.max(0, Math.min(totalMilestones - delayedMilestones, Math.floor((physicalProgress / 100) * totalMilestones)));

    const approvedDate = `${approvedYear}-${startMonth.toString().padStart(2, '0')}-01`;
    const origStart = `${approvedYear}-${((startMonth + 2) % 12 || 12).toString().padStart(2, '0')}-15`;
    const completionYear = approvedYear + Math.floor(originalDurationMonths / 12);
    const origCompletion = `${completionYear}-12-31`;

    const rawProject: Omit<Project, 'risk_score' | 'risk_level' | 'risk_breakdown' | 'cost_overrun_probability' | 'time_overrun_probability' | 'predicted_cost_overrun' | 'predicted_delay_months' | 'risk_drivers' | 'recommendations'> = {
      project_id: projectId,
      project_name: projectName,
      ministry,
      department: `${ministry.replace('Ministry of ', '')} Projects Division`,
      sector,
      sub_sector: subSector,
      state,
      district: `${state} Central Region`,
      implementing_agency: agency,
      project_type: 'Greenfield Strategic Infrastructure',
      
      original_cost: originalCost,
      revised_cost: revisedCost,
      cumulative_expenditure: cumulativeExpenditure,
      financial_progress: financialProgress,
      
      approved_date: approvedDate,
      original_start_date: origStart,
      original_completion_date: origCompletion,
      revised_completion_date: `${completionYear + (progressGap > 10 ? 1 : 0)}-06-30`,
      current_completion_forecast: `${completionYear + (progressGap > 12 ? 2 : progressGap > 5 ? 1 : 0)}-12-31`,
      physical_progress: physicalProgress,
      planned_progress: plannedProgress,
      
      milestones_total: totalMilestones,
      milestones_completed: completedMilestones,
      milestones_delayed: delayedMilestones,
      milestones: generateSyntheticMilestones(origStart, totalMilestones, delayedMilestones),
      
      status,
      monthly_update_date: '2026-08-25',
      contractor,
      land_status: landDeficit > 20 ? 'Substantial Pending Acquisition' : landDeficit > 5 ? 'Minor Clearances Pending' : 'Acquired & Cleared',
      land_progress: landProgress,
      land_target: landTarget,
      environment_clearance: clearance,
      utility_shift_status: utility,
      tender_status: 'Awarded',
      labour_status: labour,
      material_status: material,
      weather_disruption: 'None',
      approval_delay: approvalDelay,
      dependency_count: Math.floor(seededRandom(seed++) * 5) + 1,
    };

    // Calculate deterministic risk intelligence
    const breakdown = calculateRiskBreakdown(rawProject);
    const riskScore = computeTotalRiskScore(breakdown);
    const riskLevel = getRiskLevel(riskScore);
    
    // Predicted delay and cost escalation
    const delayMonths = progressGap > 0 ? Math.max(1, Math.round((progressGap / 3.2) + (delayedMilestones * 1.5))) : 0;
    const delayProb = Math.min(96, Math.max(5, Math.round(riskScore * 0.95 + (progressGap * 0.8))));
    
    const costEscalationDiff = Math.max(0, revisedCost - originalCost);
    const futureEscalation = Math.round(revisedCost * (delayMonths * 0.01 + (riskScore > 70 ? 0.05 : 0)));
    const totalPredictedEscalation = costEscalationDiff + futureEscalation;
    const costProb = Math.min(95, Math.max(8, Math.round(riskScore * 0.88 + (costEscalationDiff > 0 ? 15 : 0))));

    const fullProject: Project = {
      ...rawProject,
      risk_score: riskScore,
      risk_level: riskLevel,
      risk_breakdown: breakdown,
      cost_overrun_probability: costProb,
      time_overrun_probability: delayProb,
      predicted_cost_overrun: totalPredictedEscalation,
      predicted_delay_months: delayMonths,
      risk_drivers: [],
      recommendations: [],
    };

    fullProject.risk_drivers = generateRiskDrivers(fullProject);
    fullProject.recommendations = generateRecommendations(fullProject);

    portfolio.push(fullProject);
  }

  return portfolio;
}

export const SYNTHETIC_PROJECTS: Project[] = generateSyntheticPortfolio();
