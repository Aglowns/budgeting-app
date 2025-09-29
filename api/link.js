export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  setTimeout(() => {
    const accounts = [
      { id: 'acc_1', name: 'Chase Checking', type: 'checking', balance: 1250.75, last4: '1234', lastUpdated: new Date().toISOString() },
      { id: 'acc_2', name: 'Chase Savings', type: 'savings', balance: 5000.0, last4: '9876', lastUpdated: new Date().toISOString() },
    ];

    const transactions = [
      { id: 'txn_1', accountId: 'acc_1', amount: 45.5, description: 'Coffee Shop', category: 'Food & Dining', createdAt: new Date(Date.now() - 86400000).toISOString(), type: 'debit' },
      { id: 'txn_2', accountId: 'acc_1', amount: 120.0, description: 'Grocery Store', category: 'Groceries', createdAt: new Date(Date.now() - 172800000).toISOString(), type: 'debit' },
      { id: 'txn_3', accountId: 'acc_1', amount: 2500.0, description: 'Payroll Deposit', category: 'Income', createdAt: new Date(Date.now() - 259200000).toISOString(), type: 'credit' },
    ];

    const savingsGoals = [
      { id: 'goal_1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 5000, deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), priority: 'high' },
      { id: 'goal_2', name: 'Vacation Fund', targetAmount: 2000, currentAmount: 500, deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), priority: 'medium' },
    ];

    const notes = [
      { id: 'note_1', title: 'Budget Planning', content: 'Need to review monthly expenses', tags: ['budget'], createdAt: new Date().toISOString() },
      { id: 'note_2', title: 'Savings Goal', content: 'Save $500 for vacation', tags: ['savings'], createdAt: new Date(Date.now() - 86400000).toISOString() },
    ];

    res.status(200).json({
      success: true,
      data: { accounts, transactions, savingsGoals, notes },
    });
  }, 1000);
}
