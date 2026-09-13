import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

class SnapshotRepository {
  constructor() {
    this.snapshotsCache = null;
    this.loadData();
  }

  loadData() {
    try {
      const snapPath = path.join(config.paths.snapshots, 'paimana_historical_snapshots.json');
      if (fs.existsSync(snapPath)) {
        this.snapshotsCache = JSON.parse(fs.readFileSync(snapPath, 'utf-8'));
      }
    } catch (err) {
      console.error('Error loading snapshot repository data:', err);
    }
  }

  async findByProjectCode(projectCode) {
    if (!this.snapshotsCache) this.loadData();
    const cleanCode = projectCode.replace(/^PAI-/, '');
    const series = (this.snapshotsCache && this.snapshotsCache[cleanCode]) || [];
    // Ensure strict chronological sort
    return [...series].sort((a, b) => a.report_date_key.localeCompare(b.report_date_key));
  }

  async getHistoricalAuditStats() {
    if (!this.snapshotsCache) this.loadData();
    const allCodes = Object.keys(this.snapshotsCache || {});
    const count3Plus = allCodes.filter(c => (this.snapshotsCache[c] || []).length >= 3).length;
    const count6Plus = allCodes.filter(c => (this.snapshotsCache[c] || []).length >= 6).length;

    return {
      totalDistinctProjects: allCodes.length,
      trackedIn3PlusSnapshots: count3Plus,
      trackedIn6PlusSnapshots: count6Plus,
      snapshotPeriods: [
        'October 2025', 'November 2025', 'December 2025',
        'January 2026', 'February 2026', 'March 2026',
        'April 2026', 'May 2026', 'June 2026', 'July 2026'
      ],
    };
  }
}

export const snapshotRepository = new SnapshotRepository();
