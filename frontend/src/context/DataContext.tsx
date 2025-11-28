import { createContext } from 'react';
import { DataContextType } from '../types';

export const DataContext = createContext<DataContextType>({} as DataContextType);
