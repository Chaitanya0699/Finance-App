import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Types
export interface Asset {
  id?: string;
  userId: string;
  name: string;
  type: 'property' | 'vehicle' | 'gold' | 'investment' | 'other';
  currentValue: number;
  purchaseValue: number;
  acquisitionDate: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Liability {
  id?: string;
  userId: string;
  name: string;
  type: 'credit_card' | 'bill' | 'debt' | 'other';
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Loan {
  id?: string;
  userId: string;
  name: string;
  type: 'home' | 'vehicle' | 'personal' | 'education' | 'other';
  totalAmount: number;
  interestRate: number;
  duration?: number;
  emiAmount?: number;
  monthsPaid: number;
  startDate: string;
  status: 'active' | 'closed';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Expense {
  id?: string;
  userId: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SavingsGoal {
  id?: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Investment {
  id?: string;
  userId: string;
  name: string;
  type: 'stocks' | 'mutual_funds' | 'bonds' | 'etf' | 'crypto' | 'other';
  currentValue: number;
  investedAmount: number;
  investmentDate: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper function to get current user ID
const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
};

// Generic CRUD operations
class FirestoreService<T extends DocumentData> {
  constructor(private collectionName: string) {}

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userId = getCurrentUserId();
    const docData = {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as T;

    const docRef = await addDoc(collection(db, this.collectionName), docData);
    return docRef.id;
  }

  async getAll(): Promise<T[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async getByType(type: string): Promise<T[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }
}

// Service instances
export const assetsService = new FirestoreService<Asset>('assets');
export const liabilitiesService = new FirestoreService<Liability>('liabilities');
export const loansService = new FirestoreService<Loan>('loans');
export const expensesService = new FirestoreService<Expense>('expenses');
export const savingsGoalsService = new FirestoreService<SavingsGoal>('savingsGoals');
export const investmentsService = new FirestoreService<Investment>('investments');

// Specialized functions
export const dataService = {
  // Get monthly expenses
  async getMonthlyExpenses(year: number, month: number): Promise<Expense[]> {
    const userId = getCurrentUserId();
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Expense));
  },

  // Get active loans
  async getActiveLoans(): Promise<Loan[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, 'loans'),
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Loan));
  },

  // Get unpaid liabilities
  async getUnpaidLiabilities(): Promise<Liability[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, 'liabilities'),
      where('userId', '==', userId),
      where('status', '==', 'unpaid'),
      orderBy('dueDate', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Liability));
  },

  // Get active savings goals
  async getActiveSavingsGoals(): Promise<SavingsGoal[]> {
    const userId = getCurrentUserId();
    const today = new Date().toISOString().split('T')[0];
    
    const q = query(
      collection(db, 'savingsGoals'),
      where('userId', '==', userId),
      where('deadline', '>=', today),
      orderBy('deadline', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SavingsGoal));
  },

  // Update savings goal contribution
  async addSavingsContribution(goalId: string, amount: number): Promise<void> {
    const goal = await savingsGoalsService.getById(goalId);
    if (goal) {
      await savingsGoalsService.update(goalId, {
        currentAmount: goal.currentAmount + amount,
      });
    }
  },

  // Get portfolio summary
  async getPortfolioSummary() {
    const userId = getCurrentUserId();
    
    const [assets, investments, loans, liabilities] = await Promise.all([
      assetsService.getAll(),
      investmentsService.getAll(),
      loansService.getAll(),
      liabilitiesService.getAll(),
    ]);

    const totalAssets = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalLoans = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);

    return {
      totalAssets: totalAssets + totalInvestments,
      totalLiabilities: totalLoans + totalLiabilities,
      netWorth: (totalAssets + totalInvestments) - (totalLoans + totalLiabilities),
      assets,
      investments,
      loans,
      liabilities,
    };
  },
};