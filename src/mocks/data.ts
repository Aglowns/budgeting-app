import type { User, Account, Transaction, SavingsGoal, Note } from '@/types';
import { subDays, format } from 'date-fns';

export const generateDemoUser = (email: string, name: string): User => ({
  id: '1',
  name,
  email,
  hasLinked: false,
  settings: {
    weeklyBudget: 200,
    monthlyBudget: 800,
    lockSavings: false,
    preventSavingsForCard: false,
    currency: 'USD',
  },
});

export const generateDemoAccounts = (): Account[] => [
  {
    id: 'acc1',
    name: 'Student Checking',
    type: 'checking',
    last4: '1234',
    balance: 1250.75,
  },
  {
    id: 'acc2',
    name: 'Savings Vault',
    type: 'savings',
    last4: '5678',
    balance: 3500.00,
  },
  {
    id: 'acc3',
    name: 'Student Credit Card',
    type: 'credit',
    last4: '9012',
    balance: 245.50,
    creditLimit: 1000,
    availableCredit: 754.50,
  },
];

export const generateDemoTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories = ['Groceries', 'Dining', 'Transport', 'School/Books', 'Entertainment', 'Other'];
  const descriptions = {
    Groceries: ['Food Lion', 'Walmart Grocery', 'Harris Teeter', 'Local Market'],
    Dining: ['Chick-fil-A', 'Subway', 'Pizza Hut', 'Local Diner', 'Starbucks'],
    Transport: ['Shell Gas', 'BP Station', 'Uber', 'Bus Pass'],
    'School/Books': ['UNCP Bookstore', 'Amazon Books', 'Course Materials', 'Lab Fees'],
    Entertainment: ['Netflix', 'Movie Theater', 'Spotify', 'Gaming'],
    Other: ['ATM Withdrawal', 'Online Purchase', 'Miscellaneous'],
  };

  // Generate 12 weeks of transactions
  for (let week = 0; week < 12; week++) {
    const weekStart = subDays(new Date(), week * 7);
    
    // 3-8 transactions per week
    const transactionsThisWeek = Math.floor(Math.random() * 6) + 3;
    
    for (let i = 0; i < transactionsThisWeek; i++) {
      const dayOffset = Math.floor(Math.random() * 7);
      const transactionDate = subDays(weekStart, dayOffset);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const description = descriptions[category as keyof typeof descriptions][
        Math.floor(Math.random() * descriptions[category as keyof typeof descriptions].length)
      ];
      
      // Determine amount based on category
      let amount: number;
      switch (category) {
        case 'Groceries':
          amount = Math.floor(Math.random() * 80) + 20; // $20-$100
          break;
        case 'Dining':
          amount = Math.floor(Math.random() * 25) + 5; // $5-$30
          break;
        case 'Transport':
          amount = Math.floor(Math.random() * 40) + 10; // $10-$50
          break;
        case 'School/Books':
          amount = Math.floor(Math.random() * 200) + 50; // $50-$250
          break;
        case 'Entertainment':
          amount = Math.floor(Math.random() * 30) + 10; // $10-$40
          break;
        default:
          amount = Math.floor(Math.random() * 50) + 10; // $10-$60
      }

      // Randomly choose account (mostly checking, some credit)
      const accountId = Math.random() < 0.8 ? 'acc1' : 'acc3';

      transactions.push({
        id: `txn_${week}_${i}`,
        accountId,
        type: 'debit',
        amount,
        category,
        description,
        createdAt: format(transactionDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      });
    }
  }

  // Add some income transactions
  for (let month = 0; month < 3; month++) {
    const payDate = subDays(new Date(), month * 30 + 15);
    transactions.push({
      id: `income_${month}`,
      accountId: 'acc1',
      type: 'credit',
      amount: 800,
      category: 'Other',
      description: 'Part-time Job Deposit',
      createdAt: format(payDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    });
  }

  // Add some transfers
  transactions.push({
    id: 'transfer_1',
    accountId: 'acc1',
    type: 'transfer',
    amount: 200,
    category: 'Other',
    description: 'Transfer to Savings',
    createdAt: format(subDays(new Date(), 10), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    transferToAccountId: 'acc2',
  });

  return transactions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const generateDemoSavingsGoals = (): SavingsGoal[] => [
  {
    id: 'goal1',
    name: 'Emergency Fund',
    targetAmount: 1000,
    currentAmount: 750,
    priority: 'high',
  },
  {
    id: 'goal2',
    name: 'Spring Break Trip',
    targetAmount: 800,
    currentAmount: 200,
    deadline: format(new Date(2024, 2, 15), 'yyyy-MM-dd'),
    priority: 'medium',
  },
  {
    id: 'goal3',
    name: 'New Laptop',
    targetAmount: 1200,
    currentAmount: 350,
    priority: 'low',
  },
];

export const generateDemoNotes = (): Note[] => [
  {
    id: 'note1',
    title: 'Monthly Budget Review',
    content: 'Need to reduce dining out expenses. Spent $180 last month on restaurants.',
    tags: ['budget', 'dining'],
    createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    pinned: true,
  },
  {
    id: 'note2',
    title: 'Textbook Shopping',
    content: 'Check if used books available before buying new. Also look into rental options.',
    tags: ['school', 'books', 'savings'],
    createdAt: format(subDays(new Date(), 12), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
  },
  {
    id: 'note3',
    title: 'Gas Station Rewards',
    content: 'Shell station on Main St offers student discount on Wednesdays.',
    tags: ['transport', 'discounts'],
    createdAt: format(subDays(new Date(), 20), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
  },
];
