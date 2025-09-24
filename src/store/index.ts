import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Account, Transaction, Note, SavingsGoal, Bill } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Data
  accounts: Account[];
  transactions: Transaction[];
  notes: Note[];
  savingsGoals: SavingsGoal[];
  bills: Bill[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addSavingsGoal: (goal: SavingsGoal) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  addBill: (bill: Bill) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markBillAsPaid: (id: string) => void;
  resetData: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  accounts: [],
  transactions: [],
  notes: [],
  savingsGoals: [],
  bills: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ ...initialState }),
      setUser: (user: User) => set({ user }),
      
      setAccounts: (accounts: Account[]) => set({ accounts }),
      setTransactions: (transactions: Transaction[]) => set({ transactions }),
      
      addTransaction: (transaction: Transaction) => 
        set((state) => ({ 
          transactions: [transaction, ...state.transactions] 
        })),
      
      updateTransaction: (id: string, transaction: Partial<Transaction>) =>
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...transaction } : t
          )
        })),
      
      deleteTransaction: (id: string) =>
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        })),
      
      addNote: (note: Note) => 
        set((state) => ({ 
          notes: [note, ...state.notes] 
        })),
      
      updateNote: (id: string, note: Partial<Note>) =>
        set((state) => ({
          notes: state.notes.map(n => 
            n.id === id ? { ...n, ...note } : n
          )
        })),
      
      deleteNote: (id: string) =>
        set((state) => ({
          notes: state.notes.filter(n => n.id !== id)
        })),
      
      addSavingsGoal: (goal: SavingsGoal) => 
        set((state) => ({ 
          savingsGoals: [goal, ...state.savingsGoals] 
        })),
      
      updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map(g => 
            g.id === id ? { ...g, ...goal } : g
          )
        })),
      
      deleteSavingsGoal: (id: string) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.filter(g => g.id !== id)
        })),
      
      updateAccount: (id: string, account: Partial<Account>) =>
        set((state) => ({
          accounts: state.accounts.map(a => 
            a.id === id ? { ...a, ...account } : a
          )
        })),
      
      // Bill actions
      addBill: (bill: Bill) =>
        set((state) => ({
          bills: [...state.bills, bill]
        })),
      
      updateBill: (id: string, bill: Partial<Bill>) =>
        set((state) => ({
          bills: state.bills.map(b => 
            b.id === id ? { ...b, ...bill } : b
          )
        })),
      
      deleteBill: (id: string) =>
        set((state) => ({
          bills: state.bills.filter(b => b.id !== id)
        })),
      
      markBillAsPaid: (id: string) =>
        set((state) => ({
          bills: state.bills.map(b => 
            b.id === id ? { ...b, isPaid: true } : b
          )
        })),
      
      resetData: () => set({ ...initialState, user: get().user, isAuthenticated: get().isAuthenticated }),
    }),
    {
      name: 'uncp-budgeting-storage',
    }
  )
);