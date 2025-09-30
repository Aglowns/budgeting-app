import { useEffect } from 'react';
import { useStore } from '@/store';
import type { User } from '@/types';

export const DemoMode = () => {
  const { login, setAccounts, setTransactions, addSavingsGoal, addNote } = useStore();

  useEffect(() => {
    // Create a demo user
    const demoUser: User = {
      id: 'demo-user',
      name: 'Demo Student',
      email: 'demo@bravemail.uncp.edu',
      hasLinked: true,
      settings: {
        weeklyBudget: 200,
        monthlyBudget: 800,
        lockSavings: false,
        preventSavingsForCard: false,
        currency: 'USD',
      },
    };

    // Create demo data
    const demoAccounts = [
      {
        id: 'acc1',
        name: 'Student Checking',
        type: 'checking' as const,
        last4: '1234',
        balance: 1250.75,
      },
      {
        id: 'acc2',
        name: 'Savings Vault',
        type: 'savings' as const,
        last4: '5678',
        balance: 3500.00,
      },
    ];

    const demoTransactions = [
      {
        id: 'txn1',
        accountId: 'acc1',
        type: 'debit' as const,
        amount: 25.50,
        category: 'Dining',
        description: 'Chick-fil-A',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'txn2',
        accountId: 'acc1',
        type: 'debit' as const,
        amount: 45.00,
        category: 'Groceries',
        description: 'Food Lion',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    const demoSavingsGoals = [
      {
        id: 'goal1',
        name: 'Emergency Fund',
        targetAmount: 1000,
        currentAmount: 750,
        priority: 'high' as const,
      },
    ];

    const demoNotes = [
      {
        id: 'note1',
        title: 'Monthly Budget Review',
        content: 'Need to reduce dining out expenses.',
        tags: ['budget', 'dining'],
        createdAt: new Date().toISOString(),
        pinned: true,
      },
    ];

    // Set demo data
    login(demoUser);
    setAccounts(demoAccounts);
    setTransactions(demoTransactions);
    
    // Add demo savings goals and notes
    demoSavingsGoals.forEach(goal => addSavingsGoal(goal));
    demoNotes.forEach(note => addNote(note));
  }, [login, setAccounts, setTransactions, addSavingsGoal, addNote]);

  return null;
};
