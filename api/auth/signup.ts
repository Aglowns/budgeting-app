import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (email && email.includes('@bravemail.uncp.edu') && password && password.length >= 6 && name && name.length > 0) {
    const user = {
      id: 'user_123',
      name: name,
      email: email,
      isLinked: false,
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({ 
      user, 
      token: 'mock-jwt-token' 
    });
  }
  
  return res.status(400).json({ error: 'Invalid signup data' });
}
