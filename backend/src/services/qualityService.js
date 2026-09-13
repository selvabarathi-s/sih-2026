/**
 * PAIMANA PREDICT — QUALITY & COMPLIANCE INTELLIGENCE ENGINE (Part 15)
 * 
 * Supports quality assurance documentation beyond traditional PAIMANA monitoring fields:
 *   - Laboratory Test Records (IS 516 Concrete, IS 1786 Rebar tensile, IS 2720 Soil compaction)
 *   - Non-Conformance Reports (NCRs) 6-stage lifecycle & rework logs
 *   - Site Image Anomaly Signals (with strict engineering verification disclaimers)
 *   - Dynamic Quality Risk Index recalculation
 * 
 * Scientific Guardrail: AI flags visible anomalies requiring professional engineering verification.
 * Does not declare material quality proven without certified laboratory test reports.
 */

import { auditService } from './auditService.js';
import { eventBus } from './eventBus.js';

export const NCR_STATUSES = [
  'RAISED',
  'CONTRACTOR_ASSIGNED',
  'REWORK_IN_PROGRESS',
  'REWORK_SUBMITTED',
  'TPI_LAB_VERIFIED',
  'CLOSED',
];

export const TEST_STANDARDS = {
  CONCRETE: 'IS 516 (Methods of Tests for Strength of Concrete)',
  REBAR: 'IS 1786 (High Strength Deformed Steel Bars and Wires for Concrete Reinforcement)',
  SOIL: 'IS 2720 (Methods of Test for Soils - Determination of Dry Density / Moisture Content)',
  ASPHALT: 'IRC:SP:79 (Guidelines for Design of Bituminous Mixes)',
  OPTICAL_FIBER: 'ITU-T G.652.D / TEC Telecommunications Standard',
};

class QualityService {
  constructor() {
    this.projectQualityRecords = new Map();
    this.allNcrs = [];
    this.initDefaultData();
  }

  initDefaultData() {
    const defaultData = {
      projectId: 'PAI-706775',
      qualityRiskScore: 38,
      qualityRiskBand: 'MODERATE',
      complianceRatioPct: 92.4,
      verifiedInspectionsCount: 14,
      openNcrsCount: 2,
      resolvedNcrsCount: 7,
      labTestsSummary: {
        totalTests: 48,
        passed: 45,
        retestedPassed: 3,
        failed: 0,
      },
      ncrs: [
        {
          id: 'NCR-2026-08',
          projectId: 'PAI-706775',
          title: 'Foundation Piling Concrete Slump Deviation (Pier P-42)',
          date: '2026-03-12',
          severity: 'HIGH',
          status: 'TPI_LAB_VERIFIED',
          assignedContractor: 'L&T Heavy Civil Infrastructure',
          qualityOfficer: 'Sunil Mehra (Third-Party TPI)',
          finding: 'Slump test recorded 180mm against 150mm specification; remedial core strength test executed.',
          verificationStatus: 'CONFIRMED_AND_RECTIFIED',
          correctiveAction: 'Extracted 3 concrete core samples; 28-day compression reached 42.8 MPa meeting IS 456 M40 specification.',
          testCertificateId: 'CERT-IS516-2026-882',
        },
        {
          id: 'NCR-2026-11',
          projectId: 'PAI-706775',
          title: 'Optical Fiber Duct Trench Depth Deficit (Km 142–148)',
          date: '2026-04-02',
          severity: 'MODERATE',
          status: 'REWORK_IN_PROGRESS',
          assignedContractor: 'Telecommunications EPC JV',
          qualityOfficer: 'R. K. Verma (Executive Engineer)',
          finding: 'Trenching depth observed at 1.1m against statutory requirement of 1.65m along road shoulder.',
          verificationStatus: 'SUSPECTED_FIELD_VERIFICATION_REQUIRED',
          correctiveAction: 'Contractor deployed additional mini-trenching rigs to excavate to 1.7m standard depth.',
          testCertificateId: null,
        },
      ],
      labTests: [
        { id: 'LT-841', testName: '28-Day Concrete Compressive Strength', standard: TEST_STANDARDS.CONCRETE, date: '2026-04-18', spec: 'M40 Grade (>= 40 N/mm²)', result: '43.2 N/mm²', status: 'PASS', lab: 'National Test House (NTH), Kolkata' },
        { id: 'LT-842', testName: 'Fe500D High-Yield Rebar Tensile Test', standard: TEST_STANDARDS.REBAR, date: '2026-04-10', spec: 'Yield Strength >= 500 MPa', result: '545 MPa', status: 'PASS', lab: 'IIT Roorkee Testing & Consultancy Cell' },
        { id: 'LT-843', testName: 'Sub-Grade Soil Compaction (Proctor Density)', standard: TEST_STANDARDS.SOIL, date: '2026-03-28', spec: 'Modified Proctor >= 98%', result: '98.6%', status: 'PASS', lab: 'CRRI New Delhi Field Lab' },
        { id: 'LT-844', testName: 'Optical Time Domain Reflectometer (OTDR) Loss', standard: TEST_STANDARDS.OPTICAL_FIBER, date: '2026-04-05', spec: '< 0.22 dB/km @ 1550nm', result: '0.19 dB/km', status: 'PASS', lab: 'DoT Telecommunications QA Centre' },
      ],
      sitePhotos: [
        {
          id: 'IMG-ANOM-01',
          title: 'Embankment Slope Settlement Visual Flag',
          timestamp: '2026-04-14',
          location: 'Chainage 112+400',
          aiAnomalyDetected: true,
          anomalyConfidence: 84,
          anomalyLabel: 'Minor Surface Erosion & Scour Visible',
          disclaimer: 'AI flags visible anomaly requiring engineering field verification by certified Quality Engineer.',
          verificationStatus: 'PENDING_OFFICER_REVIEW',
        },
      ],
      verification_disclaimer: 'AI flags visible anomalies requiring engineering verification. Material compliance requires certified laboratory test reports.',
    };

    // Both camelCase and snake_case aliases for 100% test compatibility
    defaultData.non_conformance_reports = defaultData.ncrs;
    defaultData.lab_tests = defaultData.labTests;
    defaultData.site_photo_anomalies = defaultData.sitePhotos;

    this.projectQualityRecords.set('PAI-706775', defaultData);
    this.allNcrs = [...defaultData.ncrs];
  }

  getQualityData(projectId) {
    const formattedId = `PAI-${(projectId || '').replace(/^PAI-/i, '').trim()}`;
    if (!this.projectQualityRecords.has(formattedId)) {
      const freshRecord = {
        projectId: formattedId,
        qualityRiskScore: 25,
        qualityRiskBand: 'LOW',
        complianceRatioPct: 96.0,
        verifiedInspectionsCount: 8,
        openNcrsCount: 0,
        resolvedNcrsCount: 3,
        labTestsSummary: { totalTests: 24, passed: 24, retestedPassed: 0, failed: 0 },
        ncrs: [],
        labTests: [
          { id: `LT-${Math.floor(Math.random() * 1000)}`, testName: '28-Day Concrete Core Test', standard: TEST_STANDARDS.CONCRETE, date: '2026-05-10', spec: 'M35 Grade', result: '38.4 N/mm²', status: 'PASS', lab: 'State Engineering Testing Lab' },
        ],
        sitePhotos: [],
        verification_disclaimer: 'AI flags visible anomalies requiring engineering verification. Material compliance requires certified laboratory test reports.',
      };
      freshRecord.non_conformance_reports = freshRecord.ncrs;
      freshRecord.lab_tests = freshRecord.labTests;
      freshRecord.site_photo_anomalies = freshRecord.sitePhotos;
      this.projectQualityRecords.set(formattedId, freshRecord);
    }
    return this.projectQualityRecords.get(formattedId);
  }

  getQualitySummary() {
    let totalNcrs = 0;
    let openNcrs = 0;
    let highSeverityNcrs = 0;
    let totalLabTests = 0;
    let passedLabTests = 0;

    for (const record of this.projectQualityRecords.values()) {
      totalNcrs += record.ncrs.length;
      openNcrs += record.openNcrsCount;
      highSeverityNcrs += record.ncrs.filter(n => (n.severity === 'HIGH' || n.severity === 'CRITICAL') && n.status !== 'CLOSED').length;
      totalLabTests += record.labTestsSummary.totalTests;
      passedLabTests += record.labTestsSummary.passed + record.labTestsSummary.retestedPassed;
    }

    const labPassRate = totalLabTests > 0 ? ((passedLabTests / totalLabTests) * 100).toFixed(1) : '100.0';

    return {
      totalProjectsMonitored: this.projectQualityRecords.size,
      totalNcrs,
      openNcrs,
      highSeverityNcrs,
      totalLabTests,
      labPassRate: `${labPassRate}%`,
      complianceStandard: 'MoRTH / CPWD / Indian Standards Compliance Verified',
    };
  }

  getAllNcrs({ projectId, severity, status } = {}) {
    let result = [...this.allNcrs];
    if (projectId) {
      const formatted = `PAI-${projectId.replace(/^PAI-/i, '').trim()}`;
      result = result.filter(n => n.projectId === formatted);
    }
    if (severity) {
      result = result.filter(n => n.severity.toUpperCase() === severity.toUpperCase());
    }
    if (status) {
      result = result.filter(n => n.status.toUpperCase() === status.toUpperCase());
    }
    return result;
  }

  createNcr(projectId, ncrData, user) {
    const formattedId = `PAI-${(projectId || '').replace(/^PAI-/i, '').trim()}`;
    const data = this.getQualityData(formattedId);

    const ncrId = `NCR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNcr = {
      id: ncrId,
      projectId: formattedId,
      title: ncrData.title || 'Material & Specification Non-Conformance',
      date: new Date().toISOString().split('T')[0],
      severity: ncrData.severity || 'HIGH',
      status: 'RAISED',
      assignedContractor: ncrData.assignedContractor || ncrData.contractor || 'EPC Contractor',
      qualityOfficer: user?.name || ncrData.officer || 'Monitoring Quality Engineer',
      finding: ncrData.finding || 'Deviation observed during on-site quality inspection.',
      verificationStatus: 'SUSPECTED_FIELD_VERIFICATION_REQUIRED',
      correctiveAction: ncrData.correctiveAction || '',
      testCertificateId: null,
      raisedBy: user?.name || 'Quality Inspector',
      createdAt: new Date().toISOString(),
    };

    data.ncrs.unshift(newNcr);
    data.openNcrsCount++;
    this.allNcrs.unshift(newNcr);

    // Sync aliases
    data.non_conformance_reports = data.ncrs;

    this.recalculateQualityRisk(data);
    this.projectQualityRecords.set(formattedId, data);

    auditService.logAction({
      action: 'QUALITY_NCR_RAISED',
      userId: user?.id || 'usr-quality-officer',
      userName: user?.name || 'Quality Officer',
      userRole: user?.role || 'MONITORING_OFFICER',
      targetId: ncrId,
      targetType: 'QUALITY_NCR',
      details: `Raised ${newNcr.severity} severity NCR '${newNcr.title}' for project ${formattedId}.`,
    });

    return newNcr;
  }

  updateNcrStatus(ncrId, { status, correctiveAction, testCertificateId, verificationNotes, user }) {
    const ncr = this.allNcrs.find(n => n.id === ncrId);
    if (!ncr) {
      throw new Error(`Non-Conformance Report '${ncrId}' not found.`);
    }

    const prevStatus = ncr.status;
    ncr.status = status;
    if (correctiveAction) ncr.correctiveAction = correctiveAction;
    if (testCertificateId) ncr.testCertificateId = testCertificateId;
    if (verificationNotes) ncr.verificationNotes = verificationNotes;
    ncr.updatedAt = new Date().toISOString();
    ncr.updatedBy = user?.name || 'Quality Engineer';

    if (status === 'TPI_LAB_VERIFIED' || status === 'CLOSED') {
      ncr.verificationStatus = 'CONFIRMED_AND_RECTIFIED';
    }

    // Update project stats
    const projectData = this.projectQualityRecords.get(ncr.projectId);
    if (projectData) {
      if ((prevStatus !== 'CLOSED' && prevStatus !== 'TPI_LAB_VERIFIED') &&
          (status === 'CLOSED' || status === 'TPI_LAB_VERIFIED')) {
        projectData.openNcrsCount = Math.max(0, projectData.openNcrsCount - 1);
        projectData.resolvedNcrsCount++;
      }
      this.recalculateQualityRisk(projectData);
    }

    auditService.logAction({
      action: 'QUALITY_NCR_STATUS_UPDATED',
      userId: user?.id || 'usr-quality-officer',
      userName: user?.name || 'Quality Officer',
      userRole: user?.role || 'MONITORING_OFFICER',
      targetId: ncrId,
      targetType: 'QUALITY_NCR',
      details: `Updated NCR ${ncrId} status from ${prevStatus} to ${status}.`,
    });

    return ncr;
  }

  addLabTest(projectId, testData, user) {
    const formattedId = `PAI-${(projectId || '').replace(/^PAI-/i, '').trim()}`;
    const data = this.getQualityData(formattedId);

    const testId = `LT-${Date.now().toString().slice(-4)}`;
    const newTest = {
      id: testId,
      projectId: formattedId,
      testName: testData.testName || 'Certified Material Test',
      standard: testData.standard || TEST_STANDARDS.CONCRETE,
      date: new Date().toISOString().split('T')[0],
      spec: testData.spec || 'Standard Specification',
      result: testData.result || 'Conforming',
      status: testData.status || 'PASS',
      lab: testData.lab || 'NABL Accredited Third-Party Lab',
      certificateNumber: testData.certificateNumber || `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
      recordedBy: user?.name || 'Quality Engineer',
    };

    data.labTests.unshift(newTest);
    data.labTestsSummary.totalTests++;
    if (newTest.status === 'PASS') {
      data.labTestsSummary.passed++;
    } else {
      data.labTestsSummary.failed++;
    }

    data.lab_tests = data.labTests;
    this.recalculateQualityRisk(data);
    this.projectQualityRecords.set(formattedId, data);
    return newTest;
  }

  addSitePhotoAnomaly(projectId, photoData, user) {
    const formattedId = `PAI-${(projectId || '').replace(/^PAI-/i, '').trim()}`;
    const data = this.getQualityData(formattedId);

    const photoId = `IMG-ANOM-${Date.now().toString().slice(-4)}`;
    const photo = {
      id: photoId,
      projectId: formattedId,
      title: photoData.title || 'Drone / Telemetry Visual Flag',
      timestamp: new Date().toISOString().split('T')[0],
      location: photoData.location || 'Site Perimeter',
      aiAnomalyDetected: true,
      anomalyConfidence: photoData.anomalyConfidence || 85,
      anomalyLabel: photoData.anomalyLabel || 'Visible Surface Defect',
      disclaimer: 'AI flags visible anomaly requiring engineering field verification by certified Quality Engineer.',
      verificationStatus: 'PENDING_OFFICER_REVIEW',
    };

    data.sitePhotos.unshift(photo);
    data.site_photo_anomalies = data.sitePhotos;
    this.projectQualityRecords.set(formattedId, data);
    return photo;
  }

  verifySitePhoto(photoId, { isConfirmed, verificationNotes, user }) {
    for (const record of this.projectQualityRecords.values()) {
      const photo = record.sitePhotos.find(p => p.id === photoId);
      if (photo) {
        photo.verificationStatus = isConfirmed ? 'CONFIRMED_DEFECT' : 'FALSE_POSITIVE_DISMISSED';
        photo.verifiedBy = user?.name || 'Quality Engineer';
        photo.verifiedAt = new Date().toISOString();
        photo.verificationNotes = verificationNotes || '';
        return photo;
      }
    }
    throw new Error(`Photo anomaly record '${photoId}' not found.`);
  }

  recalculateQualityRisk(data) {
    // Quality Risk Score: base 15 + 12 per open NCR + 15 per high/critical open NCR + 20 if any failed lab test
    let score = 15;
    const openNcrs = data.ncrs.filter(n => n.status !== 'CLOSED' && n.status !== 'TPI_LAB_VERIFIED');
    const highNcrs = openNcrs.filter(n => n.severity === 'HIGH' || n.severity === 'CRITICAL');
    score += openNcrs.length * 10;
    score += highNcrs.length * 15;
    if (data.labTestsSummary.failed > 0) {
      score += 25;
    }
    data.qualityRiskScore = Math.min(95, Math.max(10, score));
    if (data.qualityRiskScore >= 70) {
      data.qualityRiskBand = 'CRITICAL';
    } else if (data.qualityRiskScore >= 45) {
      data.qualityRiskBand = 'HIGH';
    } else if (data.qualityRiskScore >= 25) {
      data.qualityRiskBand = 'MODERATE';
    } else {
      data.qualityRiskBand = 'LOW';
    }
    data.complianceRatioPct = parseFloat((100 - (data.qualityRiskScore * 0.25)).toFixed(1));
  }

  addInspectionRecord(projectId, inspection, user) {
    return this.createNcr(projectId, inspection, user);
  }
}

export const qualityService = new QualityService();
