export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (email && email.includes('@bravemail.uncp.edu') && password && password.length >= 6) {
    const user = {
      id: 'user_123',
      name: email.split('@')[0],
      email: email,
      hasLinked: false,
      settings: {
        weeklyBudget: 125,
        monthlyBudget: 500,
        lockSavings: false,
        preventSavingsForCard: false,
        currency: 'USD',
      },
    };

    return res.status(200).json({ user, token: 'mock-jwt-token' });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
