import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';
import App from '@/App';

// Setup MSW server for testing
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  it('renders login page by default', () => {
    render(<App />);
    
    // Check for login page elements
    expect(screen.getByText('UNCP Student Budgeting')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your UNCP student account')).toBeInTheDocument();
  });

  it('shows signup link', () => {
    render(<App />);
    
    expect(screen.getByText('Create one')).toBeInTheDocument();
  });
});
