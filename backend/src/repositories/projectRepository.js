import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';
import { dbAdapter } from '../database/dbAdapter.js';

class ProjectRepository {
  constructor() {
    this.projectsCache = null;
    this.summaryCache = null;
    this.loadData();
  }

  loadData() {
    try {
      const projectPath = path.join(config.paths.normalized, 'paimana_april_2026.json');
      const summaryPath = path.join(config.paths.normalized, 'paimana_portfolio_summary.json');

      if (fs.existsSync(projectPath)) {
        this.projectsCache = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
      }
      if (fs.existsSync(summaryPath)) {
        this.summaryCache = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
      }
    } catch (err) {
      console.error('Error loading project repository data:', err);
    }
  }

  async findAll(options = {}) {
    if (!this.projectsCache) this.loadData();
    let results = [...(this.projectsCache || [])];

    const {
      search,
      ministry,
      sector,
      state,
      costEscalatedOnly,
      scheduleExtendedOnly,
      page = 1,
      pageSize = 20,
      limit,
      offset,
      sortBy = 'revised_cost',
      sortOrder = 'desc',
    } = options;

    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        p =>
          p.project_name.toLowerCase().includes(q) ||
          p.project_id.toLowerCase().includes(q) ||
          p.project_code.includes(q) ||
          (p.agency && p.agency.toLowerCase().includes(q)) ||
          p.ministry.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q)
      );
    }

    if (ministry) {
      results = results.filter(p => p.ministry.toLowerCase() === ministry.toLowerCase());
    }

    if (sector) {
      results = results.filter(p => p.sector.toLowerCase() === sector.toLowerCase());
    }

    if (state) {
      results = results.filter(p => p.state.toLowerCase() === state.toLowerCase());
    }

    if (costEscalatedOnly === true || costEscalatedOnly === 'true') {
      results = results.filter(p => p.is_cost_escalated);
    }

    if (scheduleExtendedOnly === true || scheduleExtendedOnly === 'true') {
      results = results.filter(p => p.is_schedule_extended);
    }

    const total = results.length;

    // Calculate pagination parameters
    const finalLimit = limit ? Number(limit) : Number(pageSize);
    const finalOffset = offset !== undefined ? Number(offset) : (Number(page) - 1) * finalLimit;
    const finalPage = offset !== undefined ? Math.floor(finalOffset / finalLimit) + 1 : Number(page);
    const totalPages = Math.ceil(total / finalLimit) || 1;

    // Sort
    results.sort((a, b) => {
      const aVal = a[sortBy] ?? 0;
      const bVal = b[sortBy] ?? 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

    const paginated = results.slice(finalOffset, finalOffset + finalLimit);

    return {
      data: paginated,
      meta: {
        total,
        page: finalPage,
        pageSize: finalLimit,
        totalPages,
        hasMore: finalOffset + finalLimit < total,
      },
      error: null,
    };
  }

  async findById(id) {
    if (!this.projectsCache) this.loadData();
    const cleanId = (id || '').trim();
    return (this.projectsCache || []).find(
      p =>
        p.project_id.toLowerCase() === cleanId.toLowerCase() ||
        p.project_code === cleanId ||
        p.project_id.toLowerCase() === `pai-${cleanId.toLowerCase()}`
    );
  }

  async getPortfolioSummary() {
    if (!this.summaryCache) this.loadData();
    return this.summaryCache;
  }
}

export const projectRepository = new ProjectRepository();
