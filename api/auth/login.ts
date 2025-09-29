import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Simple validation - in real app this would be proper auth
  if (email && email.includes('@bravemail.uncp.edu') && password && password.length >= 6) {
    const user = {
      id: 'user_123',
      name: email.split('@')[0],
      email: email,
      isLinked: false,
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({ 
      user, 
      token: 'mock-jwt-token' 
    });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
}
