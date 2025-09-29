import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simulate processing delay
  setTimeout(() => {
    const accounts = [
      {
        id: 'acc_1',
        name: 'Chase Checking',
        type: 'checking',
        balance: 1250.75,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'acc_2', 
        name: 'Chase Savings',
        type: 'savings',
        balance: 5000.00,
        lastUpdated: new Date().toISOString(),
      }
    ];

    const transactions = [
      {
        id: 'txn_1',
        accountId: 'acc_1',
        amount: -45.50,
        description: 'Coffee Shop',
        category: 'Food & Dining',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'debit'
      },
      {
        id: 'txn_2',
        accountId: 'acc_1', 
        amount: -120.00,
        description: 'Grocery Store',
        category: 'Groceries',
        date: new Date(Date.now() - 172800000).toISOString(),
        type: 'debit'
      }
    ];

    const savingsGoals = [
      {
        id: 'goal_1',
        name: 'Emergency Fund',
        target: 10000,
        current: 5000,
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    const notes = [
      {
        id: 'note_1',
        title: 'Budget Planning',
        content: 'Need to review monthly expenses',
        createdAt: new Date().toISOString(),
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        accounts,
        transactions,
        savingsGoals,
        notes,
      }
    });
  }, 2000);
}
