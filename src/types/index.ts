export type ID = string;

export type User = {
  id: ID;
  name: string;
  email: string;
  hasLinked: boolean;
  settings: {
    weeklyBudget: number;
    monthlyBudget: number;
    lockSavings: boolean;
    preventSavingsForCard: boolean;
    currency: 'USD';
  };
};

export type AccountType = 'checking' | 'savings' | 'credit';

export type Account = {
  id: ID;
  name: string;
  type: AccountType;
  last4?: string;
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
};

export type TxnType = 'debit' | 'credit' | 'transfer';

export type Transaction = {
  id: ID;
  accountId: ID;
  type: TxnType;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
  notes?: string;
  transferToAccountId?: ID;
};

export type Note = {
  id: ID;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  pinned?: boolean;
};

export type SavingsGoal = {
  id: ID;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
};

export type Bill = {
  id: ID;
  name: string;
  amount: number;
  category: Category;
  dueDate: string;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'one-time';
  isRecurring: boolean;
  reminderDays: number; // Days before due date to remind
  isPaid: boolean;
  nextDueDate: string;
  createdAt: string;
};

export const CATEGORIES = [
  'Rent',
  'Groceries', 
  'Dining',
  'Transport',
  'School/Books',
  'Subscriptions',
  'Health',
  'Entertainment',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];