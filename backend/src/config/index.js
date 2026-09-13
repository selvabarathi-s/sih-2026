import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

export const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/paimana_predict',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'paimana_predict',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true',
  },

  paths: {
    root: rootDir,
    data: path.resolve(rootDir, process.env.DATA_STORAGE_PATH || 'data'),
    normalized: path.resolve(rootDir, 'data/normalized'),
    snapshots: path.resolve(rootDir, 'data/snapshots'),
    metadata: path.resolve(rootDir, 'data/metadata'),
    dist: path.resolve(rootDir, 'dist'),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false',
  },

  baseline: {
    verifiedReportPeriod: 'April 2026',
    verifiedProjectCount: 1981,
    verifiedOriginalCostCr: 3712662.01,
    verifiedRevisedCostCr: 4278402.37,
    verifiedCumulativeExpenditureCr: 2036107.49,
    verifiedSnapshotCount: 10,
    verifiedDistinctProjectCount: 2185,
  }
};
