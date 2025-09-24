import { http, HttpResponse } from 'msw';
import { 
  generateDemoUser, 
  generateDemoAccounts, 
  generateDemoTransactions,
  generateDemoSavingsGoals,
  generateDemoNotes 
} from './data';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    // Simple validation - in real app this would be proper auth
    if (email.includes('@bravemail.uncp.edu') && password.length >= 6) {
      const user = generateDemoUser(email, email.split('@')[0]);
      return HttpResponse.json({ user, token: 'mock-jwt-token' });
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const { name, email, password } = await request.json() as { 
      name: string; 
      email: string; 
      password: string; 
    };
    
    if (email.includes('@bravemail.uncp.edu') && password.length >= 6 && name.length > 0) {
      const user = generateDemoUser(email, name);
      return HttpResponse.json({ user, token: 'mock-jwt-token' });
    }
    
    return HttpResponse.json(
      { error: 'Invalid signup data' },
      { status: 400 }
    );
  }),

  // Link bank account
  http.post('/api/link', async ({ request }) => {
    await request.json(); // Read request body but don't use it
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const accounts = generateDemoAccounts();
    const transactions = generateDemoTransactions();
    const savingsGoals = generateDemoSavingsGoals();
    const notes = generateDemoNotes();
    
    return HttpResponse.json({
      success: true,
      data: {
        accounts,
        transactions,
        savingsGoals,
        notes,
      }
    });
  }),

  // Transactions
  http.get('/api/transactions', () => {
    return HttpResponse.json(generateDemoTransactions());
  }),

  http.post('/api/transactions', async ({ request }) => {
    const transaction = await request.json() as Record<string, any>;
    return HttpResponse.json({ 
      ...transaction, 
      id: `txn_${Date.now()}`,
      createdAt: new Date().toISOString() 
    });
  }),

  http.put('/api/transactions/:id', async ({ request, params }) => {
    const updates = await request.json() as Record<string, any>;
    return HttpResponse.json({ 
      ...updates, 
      id: params.id,
      updatedAt: new Date().toISOString() 
    });
  }),

  http.delete('/api/transactions/:id', ({ params }) => {
    return HttpResponse.json({ success: true, id: params.id });
  }),

  // Notes
  http.get('/api/notes', () => {
    return HttpResponse.json(generateDemoNotes());
  }),

  http.post('/api/notes', async ({ request }) => {
    const note = await request.json() as Record<string, any>;
    return HttpResponse.json({ 
      ...note, 
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString() 
    });
  }),

  http.put('/api/notes/:id', async ({ request, params }) => {
    const updates = await request.json() as Record<string, any>;
    return HttpResponse.json({ 
      ...updates, 
      id: params.id,
      updatedAt: new Date().toISOString() 
    });
  }),

  http.delete('/api/notes/:id', ({ params }) => {
    return HttpResponse.json({ success: true, id: params.id });
  }),

  // Savings goals
  http.get('/api/savings-goals', () => {
    return HttpResponse.json(generateDemoSavingsGoals());
  }),

  http.post('/api/savings-goals', async ({ request }) => {
    const goal = await request.json() as Record<string, any>;
    return HttpResponse.json({ 
      ...goal, 
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString() 
    });
  }),

  http.put('/api/savings-goals/:id', async ({ request, params }) => {
    const updates = await request.json() as Record<string, any>;
    return HttpResponse.json({ 
      ...updates, 
      id: params.id,
      updatedAt: new Date().toISOString() 
    });
  }),

  http.delete('/api/savings-goals/:id', ({ params }) => {
    return HttpResponse.json({ success: true, id: params.id });
  }),
];
