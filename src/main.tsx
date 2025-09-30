import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Simple test to see if React is working
console.log('React app starting...');

// Start MSW in both development and production
async function startApp() {
  try {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('MSW started successfully');
  } catch (error) {
    console.error('Failed to start MSW:', error);
  }
  
  // Render the app regardless of MSW status
  console.log('Rendering React app...');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('React app rendered');
}

startApp();
