export default function handler(req, res) {
  const savingsGoals = [
    {
      id: 'goal_1',
      name: 'Emergency Fund',
      target: 10000,
      current: 5000,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'goal_2',
      name: 'Vacation Fund',
      target: 2000,
      current: 500,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  if (req.method === 'GET') {
    return res.status(200).json(savingsGoals);
  }

  if (req.method === 'POST') {
    const newGoal = {
      ...req.body,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return res.status(200).json(newGoal);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
