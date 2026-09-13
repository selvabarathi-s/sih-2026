// ==============================================================================
// PAIMANA PREDICT — REFERENCE MASTER DATA SERVICE
// Official Taxonomies aligned with MoSPI, PMO, and Central Sector Project Guidelines
// ==============================================================================

export class ReferenceDataService {
  constructor() {
    this.ministries = [
      { code: 'MORTH', name: 'Ministry of Road Transport and Highways' },
      { code: 'MOR', name: 'Ministry of Railways' },
      { code: 'MOP', name: 'Ministry of Power' },
      { code: 'MOPNG', name: 'Ministry of Petroleum and Natural Gas' },
      { code: 'DOT', name: 'Department of Telecommunications' },
      { code: 'MOHUA', name: 'Ministry of Housing and Urban Affairs' },
      { code: 'MOPSW', name: 'Ministry of Ports, Shipping and Waterways' },
      { code: 'MOCA', name: 'Ministry of Civil Aviation' },
      { code: 'MNRE', name: 'Ministry of New and Renewable Energy' },
      { code: 'DOC', name: 'Department of Chemicals and Petrochemicals' },
    ];

    this.sectors = [
      { code: 'ROAD', name: 'Road Transport and Highways', ministryCode: 'MORTH' },
      { code: 'RAIL', name: 'Railways', ministryCode: 'MOR' },
      { code: 'POWER', name: 'Power', ministryCode: 'MOP' },
      { code: 'PETROLEUM', name: 'Petroleum', ministryCode: 'MOPNG' },
      { code: 'TELECOM', name: 'Telecommunications', ministryCode: 'DOT' },
      { code: 'URBAN', name: 'Urban Development', ministryCode: 'MOHUA' },
      { code: 'SHIPPING', name: 'Shipping and Ports', ministryCode: 'MOPSW' },
      { code: 'AVIATION', name: 'Civil Aviation', ministryCode: 'MOCA' },
      { code: 'RENEWABLE', name: 'Renewable Energy', ministryCode: 'MNRE' },
    ];

    this.states = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
      'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
      'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry', 'Multi-State'
    ];

    this.agencies = [
      { code: 'NHAI', name: 'National Highways Authority of India', ministry: 'MORTH' },
      { code: 'NHSRCL', name: 'National High Speed Rail Corporation Limited', ministry: 'MOR' },
      { code: 'RVNL', name: 'Rail Vikas Nigam Limited', ministry: 'MOR' },
      { code: 'DFCCIL', name: 'Dedicated Freight Corridor Corporation of India', ministry: 'MOR' },
      { code: 'BBNL', name: 'Bharat Broadband Network Limited', ministry: 'DOT' },
      { code: 'NTPC', name: 'NTPC Limited', ministry: 'MOP' },
      { code: 'PGCIL', name: 'Power Grid Corporation of India Limited', ministry: 'MOP' },
      { code: 'IOCL', name: 'Indian Oil Corporation Limited', ministry: 'MOPNG' },
      { code: 'GAIL', name: 'GAIL (India) Limited', ministry: 'MOPNG' },
      { code: 'ONGC', name: 'Oil and Natural Gas Corporation', ministry: 'MOPNG' },
      { code: 'DMRC', name: 'Delhi Metro Rail Corporation', ministry: 'MOHUA' },
    ];

    this.milestoneTypes = [
      { code: 'DPR_APPROVAL', name: 'Detailed Project Report (DPR) Approval', sequence: 1 },
      { code: 'LAND_ACQUISITION_3A', name: 'Land Acquisition Section 3(A) Notification', sequence: 2 },
      { code: 'LAND_ACQUISITION_3D', name: 'Land Acquisition Section 3(D) Declaration', sequence: 3 },
      { code: 'FOREST_CLEARANCE_STG1', name: 'Forest Clearance (Stage 1 In-Principle)', sequence: 4 },
      { code: 'FOREST_CLEARANCE_STG2', name: 'Forest Clearance (Stage 2 Final)', sequence: 5 },
      { code: 'ENVIRONMENT_CLEARANCE', name: 'MoEFCC Environmental Clearance', sequence: 6 },
      { code: 'UTILITY_SHIFTING', name: 'Utility Shifting (Power/Water Lines)', sequence: 7 },
      { code: 'FINANCIAL_CLOSURE', name: 'Financial Closure / Sanctioned Expenditure Authority', sequence: 8 },
      { code: 'CIVIL_WORKS_COMMENCE', name: 'Commencement of Core Civil Works', sequence: 9 },
      { code: 'SUBSTRUCTURE_COMPLETE', name: 'Substructure / Foundation Works Complete', sequence: 10 },
      { code: 'SUPERSTRUCTURE_COMPLETE', name: 'Superstructure / Pavement / Track Laying Complete', sequence: 11 },
      { code: 'EQUIPMENT_INSTALLATION', name: 'Electrification / Signaling / Equipment Erection', sequence: 12 },
      { code: 'TRIAL_COMMISSIONING', name: 'Integrated Testing & Trial Commissioning', sequence: 13 },
      { code: 'COMMERCIAL_OPERATION', name: 'Commercial Operation Date (COD) / Public Dedication', sequence: 14 },
    ];

    this.riskCategories = [
      { code: 'SCHEDULE_SLIPPAGE', name: 'Schedule Slippage & Milestone Latency' },
      { code: 'COST_ESCALATION', name: 'Budgetary Overrun & Price Index Variation' },
      { code: 'STATUTORY_CLEARANCE', name: 'Statutory, Forest & Environmental Clearances' },
      { code: 'LAND_ACQUISITION', name: 'Right of Way (ROW) & Land Handover Deficit' },
      { code: 'CONTRACTOR_DISTRESS', name: 'Contractor Financial Distress & Equipment Shortage' },
      { code: 'TECHNICAL_SCOPE', name: 'Scope Revision, DPR Inadequacy & Engineering Variation' },
      { code: 'QUALITY_ASSURANCE', name: 'Material Strength & Construction Quality Defect' },
      { code: 'INTER_AGENCY_STALEMATE', name: 'Inter-Agency / Inter-Ministerial Coordination Deadlock' },
    ];

    this.interventionTypes = [
      { code: 'EMPOWERED_COMMITTEE_REVIEW', name: 'MoSPI Empowered Committee Special Review' },
      { code: 'INTER_MINISTERIAL_TASKFORCE', name: 'Inter-Ministerial Taskforce Clearance' },
      { code: 'DISTRICT_COLLECTOR_ESCALATION', name: 'State Chief Secretary / District Collector Land Intervention' },
      { code: 'CONTRACTOR_LIQUIDATED_DAMAGES', name: 'Issue Show Cause Notice & Liquidated Damages Penalty' },
      { code: 'EXPEDITED_CLEARANCE_CABINET', name: 'Cabinet Committee on Economic Affairs (CCEA) Fast-track' },
      { code: 'FINANCIAL_LIQUIDITY_RELEASE', name: 'Emergency Working Capital / Milestone Partial Release' },
      { code: 'SCOPE_RATIONALIZATION', name: 'Scope Rationalization & Value Engineering Review' },
      { code: 'CONTRACT_TERMINATION_RETENDER', name: 'Contract Termination & Balance Work Retendering' },
    ];

    this.documentTypes = [
      { code: 'MONTHLY_SITE_INSPECTION', name: 'Monthly Site Inspection & Progress Verification Report' },
      { code: 'MATERIAL_TEST_CERT', name: 'Third-Party NABL Accredited Material Test Certificate' },
      { code: 'ROW_HANDOVER_PROTOCOL', name: 'Right of Way (ROW) Joint Measurement Handover Protocol' },
      { code: 'FOREST_CLEARANCE_LETTER', name: 'MoEFCC Stage-2 Final Clearance Letter' },
      { code: 'UTILITY_SHIFTING_NOC', name: 'Discom / Jal Board Utility Relocation NOC' },
      { code: 'CONTRACTOR_BANK_GUARANTEE', name: 'Performance Bank Guarantee (PBG) Verification' },
      { code: 'REVISED_COST_ESTIMATE', name: 'Revised Cost Estimate (RCE) Sanction Note' },
      { code: 'GEOTAGGED_PHOTOS', name: 'Geo-tagged High Resolution Progress Photographs' },
    ];

    this.qualityIssueTypes = [
      { code: 'CONCRETE_STRENGTH_FAIL', name: 'Concrete Compressive Strength Non-Compliance (28-day core test)' },
      { code: 'SUBGRADE_COMPACTION', name: 'Subgrade Soil Compaction Below Standard Proctor Density' },
      { code: 'STEEL_TENSILE_DEFICIT', name: 'TMT Rebar Yield Strength & Elongation Defect' },
      { code: 'ASPHALT_BINDER_DEFECT', name: 'Bitumen VG-30 Penetration / Marshall Stability Flaw' },
      { code: 'WELDING_DEFECT', name: 'Ultrasonic Flaw Detected in Structural Girder Welding' },
      { code: 'ALIGNMENT_DEVIATION', name: 'Geodetic Survey Alignment Deviation Exceeding Tolerance' },
    ];

    this.approvalTypes = [
      { code: 'MONTHLY_DATA_SUBMISSION', name: 'Project Monthly Physical & Financial Report Approval' },
      { code: 'MILESTONE_EXTENSION', name: 'Milestone Target Extension Sanction' },
      { code: 'REVISED_SANCTION_BUDGET', name: 'Revised Administrative Sanction & Cost Approval' },
      { code: 'CASE_RESOLUTION_SIGNOFF', name: 'Root Cause Investigation Case Resolution Sign-off' },
      { code: 'DATA_CORRECTION_APPROVAL', name: 'Historical Data Ingestion Error Correction Approval' },
    ];
  }

  getAllMasterData() {
    return {
      ministries: this.ministries,
      sectors: this.sectors,
      states: this.states,
      agencies: this.agencies,
      milestoneTypes: this.milestoneTypes,
      riskCategories: this.riskCategories,
      interventionTypes: this.interventionTypes,
      documentTypes: this.documentTypes,
      qualityIssueTypes: this.qualityIssueTypes,
      approvalTypes: this.approvalTypes,
    };
  }

  getMinistries() { return this.ministries; }
  getSectors(ministryCode) {
    if (!ministryCode) return this.sectors;
    return this.sectors.filter(s => s.ministryCode.toLowerCase() === ministryCode.toLowerCase());
  }
  getStates() { return this.states; }
  getAgencies(ministryCode) {
    if (!ministryCode) return this.agencies;
    return this.agencies.filter(a => a.ministry.toLowerCase() === ministryCode.toLowerCase());
  }
  getMilestoneTypes() { return this.milestoneTypes; }
  getRiskCategories() { return this.riskCategories; }
  getInterventionTypes() { return this.interventionTypes; }
  getDocumentTypes() { return this.documentTypes; }
  getQualityIssueTypes() { return this.qualityIssueTypes; }
  getApprovalTypes() { return this.approvalTypes; }
}

export const referenceDataService = new ReferenceDataService();
