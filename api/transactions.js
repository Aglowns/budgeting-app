export default function handler(req, res) {
  const transactions = [
    {
      id: 'txn_1',
      accountId: 'acc_1',
      amount: 45.5,
      description: 'Coffee Shop',
      category: 'Food & Dining',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      type: 'debit'
    },
    {
      id: 'txn_2',
      accountId: 'acc_1', 
      amount: 120.0,
      description: 'Grocery Store',
      category: 'Groceries',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      type: 'debit'
    },
    {
      id: 'txn_3',
      accountId: 'acc_1',
      amount: 2500.0,
      description: 'Payroll Deposit',
      category: 'Income',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      type: 'credit'
    }
  ];

  if (req.method === 'GET') {
    return res.status(200).json(transactions);
  }

  if (req.method === 'POST') {
    const newTransaction = {
      ...req.body,
      id: `txn_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return res.status(200).json(newTransaction);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
