import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatasetMode } from '../types/paimana';

interface DatasetModeContextType {
  datasetMode: DatasetMode;
  isRealMode: boolean;
  isDemoMode: boolean;
  setDatasetMode: (mode: DatasetMode) => void;
  toggleDatasetMode: () => void;
}

const DatasetModeContext = createContext<DatasetModeContextType | undefined>(undefined);

export const DatasetModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with 'REAL_PAIMANA' as the default mode
  const [datasetMode, setDatasetModeState] = useState<DatasetMode>(() => {
    const saved = localStorage.getItem('paimana_dataset_mode');
    if (saved === 'AI_DEMO' || saved === 'REAL_PAIMANA') {
      return saved;
    }
    return 'REAL_PAIMANA'; // Default is REAL PAIMANA
  });

  useEffect(() => {
    localStorage.setItem('paimana_dataset_mode', datasetMode);
  }, [datasetMode]);

  const setDatasetMode = (mode: DatasetMode) => {
    setDatasetModeState(mode);
  };

  const toggleDatasetMode = () => {
    setDatasetModeState(prev => (prev === 'REAL_PAIMANA' ? 'AI_DEMO' : 'REAL_PAIMANA'));
  };

  return (
    <DatasetModeContext.Provider
      value={{
        datasetMode,
        isRealMode: datasetMode === 'REAL_PAIMANA',
        isDemoMode: datasetMode === 'AI_DEMO',
        setDatasetMode,
        toggleDatasetMode,
      }}
    >
      {children}
    </DatasetModeContext.Provider>
  );
};

export const useDatasetMode = (): DatasetModeContextType => {
  const context = useContext(DatasetModeContext);
  if (!context) {
    throw new Error('useDatasetMode must be used within a DatasetModeProvider');
  }
  return context;
};
