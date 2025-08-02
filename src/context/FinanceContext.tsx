import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Loan {
  id: string;
  name: string;
  type: 'personal' | 'home' | 'vehicle' | 'education' | 'other';
  totalAmount: number;
  interestRate: number;
  startDate: string;
  repaymentMode: 'emi' | 'full';
  emiAmount?: number;
  duration?: number;
  monthsPaid: number;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'property' | 'vehicle' | 'gold' | 'investment' | 'other';
  currentValue: number;
  acquisitionDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Liability {
  id: string;
  name: string;
  type: 'credit_card' | 'bill' | 'debt' | 'other';
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceState {
  loans: Loan[];
  assets: Asset[];
  liabilities: Liability[];
  isLoading: boolean;
}

type FinanceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: { loans: Loan[]; assets: Asset[]; liabilities: Liability[] } }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN'; payload: Loan }
  | { type: 'DELETE_LOAN'; payload: string }
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'UPDATE_ASSET'; payload: Asset }
  | { type: 'DELETE_ASSET'; payload: string }
  | { type: 'ADD_LIABILITY'; payload: Liability }
  | { type: 'UPDATE_LIABILITY'; payload: Liability }
  | { type: 'DELETE_LIABILITY'; payload: string };

const initialState: FinanceState = {
  loans: [],
  assets: [],
  liabilities: [],
  isLoading: true,
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_DATA':
      return { ...state, ...action.payload, isLoading: false };
    case 'ADD_LOAN':
      return { ...state, loans: [...state.loans, action.payload] };
    case 'UPDATE_LOAN':
      return {
        ...state,
        loans: state.loans.map(loan => 
          loan.id === action.payload.id ? action.payload : loan
        ),
      };
    case 'DELETE_LOAN':
      return {
        ...state,
        loans: state.loans.filter(loan => loan.id !== action.payload),
      };
    case 'ADD_ASSET':
      return { ...state, assets: [...state.assets, action.payload] };
    case 'UPDATE_ASSET':
      return {
        ...state,
        assets: state.assets.map(asset => 
          asset.id === action.payload.id ? action.payload : asset
        ),
      };
    case 'DELETE_ASSET':
      return {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload),
      };
    case 'ADD_LIABILITY':
      return { ...state, liabilities: [...state.liabilities, action.payload] };
    case 'UPDATE_LIABILITY':
      return {
        ...state,
        liabilities: state.liabilities.map(liability => 
          liability.id === action.payload.id ? action.payload : liability
        ),
      };
    case 'DELETE_LIABILITY':
      return {
        ...state,
        liabilities: state.liabilities.filter(liability => liability.id !== action.payload),
      };
    default:
      return state;
  }
};

interface FinanceContextType {
  state: FinanceState;
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLoan: (loan: Loan) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAsset: (asset: Asset) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  addLiability: (liability: Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLiability: (liability: Liability) => Promise<void>;
  deleteLiability: (id: string) => Promise<void>;
  getNetWorth: () => { totalAssets: number; totalLiabilities: number; totalLoans: number; netWorth: number };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LOANS: '@finance_loans',
  ASSETS: '@finance_assets',
  LIABILITIES: '@finance_liabilities',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [loansData, assetsData, liabilitiesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LOANS),
        AsyncStorage.getItem(STORAGE_KEYS.ASSETS),
        AsyncStorage.getItem(STORAGE_KEYS.LIABILITIES),
      ]);

      const loans = loansData ? JSON.parse(loansData) : [];
      const assets = assetsData ? JSON.parse(assetsData) : [];
      const liabilities = liabilitiesData ? JSON.parse(liabilitiesData) : [];

      dispatch({ type: 'SET_DATA', payload: { loans, assets, liabilities } });
    } catch (error) {
      console.error('Error loading finance data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveLoans = async (loans: Loan[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  };

  const saveAssets = async (assets: Asset[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  };

  const saveLiabilities = async (liabilities: Liability[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.LIABILITIES, JSON.stringify(liabilities));
  };

  const addLoan = async (loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_LOAN', payload: newLoan });
    await saveLoans([...state.loans, newLoan]);
  };

  const updateLoan = async (loan: Loan) => {
    const updatedLoan = { ...loan, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_LOAN', payload: updatedLoan });
    
    const updatedLoans = state.loans.map(l => l.id === loan.id ? updatedLoan : l);
    await saveLoans(updatedLoans);
  };

  const deleteLoan = async (id: string) => {
    dispatch({ type: 'DELETE_LOAN', payload: id });
    const filteredLoans = state.loans.filter(loan => loan.id !== id);
    await saveLoans(filteredLoans);
  };

  const addAsset = async (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_ASSET', payload: newAsset });
    await saveAssets([...state.assets, newAsset]);
  };

  const updateAsset = async (asset: Asset) => {
    const updatedAsset = { ...asset, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_ASSET', payload: updatedAsset });
    
    const updatedAssets = state.assets.map(a => a.id === asset.id ? updatedAsset : a);
    await saveAssets(updatedAssets);
  };

  const deleteAsset = async (id: string) => {
    dispatch({ type: 'DELETE_ASSET', payload: id });
    const filteredAssets = state.assets.filter(asset => asset.id !== id);
    await saveAssets(filteredAssets);
  };

  const addLiability = async (liabilityData: Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLiability: Liability = {
      ...liabilityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_LIABILITY', payload: newLiability });
    await saveLiabilities([...state.liabilities, newLiability]);
  };

  const updateLiability = async (liability: Liability) => {
    const updatedLiability = { ...liability, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_LIABILITY', payload: updatedLiability });
    
    const updatedLiabilities = state.liabilities.map(l => l.id === liability.id ? updatedLiability : l);
    await saveLiabilities(updatedLiabilities);
  };

  const deleteLiability = async (id: string) => {
    dispatch({ type: 'DELETE_LIABILITY', payload: id });
    const filteredLiabilities = state.liabilities.filter(liability => liability.id !== id);
    await saveLiabilities(filteredLiabilities);
  };

  const getNetWorth = () => {
    const totalAssets = state.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalLiabilities = state.liabilities
      .filter(l => l.status === 'unpaid')
      .reduce((sum, liability) => sum + liability.amount, 0);
    
    const totalLoans = state.loans
      .filter(loan => loan.status === 'active')
      .reduce((sum, loan) => {
        if (loan.repaymentMode === 'emi' && loan.emiAmount && loan.duration) {
          const remainingMonths = loan.duration - loan.monthsPaid;
          return sum + (loan.emiAmount * remainingMonths);
        }
        return sum + loan.totalAmount;
      }, 0);

    const netWorth = totalAssets - totalLiabilities - totalLoans;

    return { totalAssets, totalLiabilities, totalLoans, netWorth };
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        addLoan,
        updateLoan,
        deleteLoan,
        addAsset,
        updateAsset,
        deleteAsset,
        addLiability,
        updateLiability,
        deleteLiability,
        getNetWorth,
      }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};