import { useState, useEffect } from 'react';
import { 
  assetsService,
  liabilitiesService,
  loansService,
  expensesService,
  savingsGoalsService,
  investmentsService,
  dataService,
  Asset,
  Liability,
  Loan,
  Expense,
  SavingsGoal,
  Investment
} from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAssets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await assetsService.getAll();
      setAssets(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [user]);

  const addAsset = async (assetData: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await assetsService.create(assetData);
      await fetchAssets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateAsset = async (id: string, assetData: Partial<Asset>) => {
    try {
      await assetsService.update(id, assetData);
      await fetchAssets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await assetsService.delete(id);
      await fetchAssets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    assets,
    loading,
    error,
    addAsset,
    updateAsset,
    deleteAsset,
    refetch: fetchAssets,
  };
}

export function useLiabilities() {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLiabilities = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await liabilitiesService.getAll();
      setLiabilities(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiabilities();
  }, [user]);

  const addLiability = async (liabilityData: Omit<Liability, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await liabilitiesService.create(liabilityData);
      await fetchLiabilities();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateLiability = async (id: string, liabilityData: Partial<Liability>) => {
    try {
      await liabilitiesService.update(id, liabilityData);
      await fetchLiabilities();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteLiability = async (id: string) => {
    try {
      await liabilitiesService.delete(id);
      await fetchLiabilities();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    liabilities,
    loading,
    error,
    addLiability,
    updateLiability,
    deleteLiability,
    refetch: fetchLiabilities,
  };
}

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLoans = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await loansService.getAll();
      setLoans(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  const addLoan = async (loanData: Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await loansService.create(loanData);
      await fetchLooans();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateLoan = async (id: string, loanData: Partial<Loan>) => {
    try {
      await loansService.update(id, loanData);
      await fetchLoans();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      await loansService.delete(id);
      await fetchLoans();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    loans,
    loading,
    error,
    addLoan,
    updateLoan,
    deleteLoan,
    refetch: fetchLoans,
  };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await expensesService.getAll();
      setExpenses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await expensesService.create(expenseData);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      await expensesService.update(id, expenseData);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expensesService.delete(id);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await savingsGoalsService.getAll();
      setGoals(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const addGoal = async (goalData: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await savingsGoalsService.create(goalData);
      await fetchGoals();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateGoal = async (id: string, goalData: Partial<SavingsGoal>) => {
    try {
      await savingsGoalsService.update(id, goalData);
      await fetchGoals();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addContribution = async (goalId: string, amount: number) => {
    try {
      await dataService.addSavingsContribution(goalId, amount);
      await fetchGoals();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    addContribution,
    refetch: fetchGoals,
  };
}

export function usePortfolioSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSummary = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await dataService.getPortfolioSummary();
      setSummary(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
}