export default function handler(req, res) {
  const savingsGoals = [
    {
      id: 'goal_1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 5000,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
    },
    {
      id: 'goal_2',
      name: 'Vacation Fund',
      targetAmount: 2000,
      currentAmount: 500,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
    }
  ];

  if (req.method === 'GET') {
    return res.status(200).json(savingsGoals);
  }

  if (req.method === 'POST') {
    const newGoal = {
      ...req.body,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return res.status(200).json(newGoal);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
