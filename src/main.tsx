import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Start MSW in development
if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
    }).then(() => {
      console.log('MSW started successfully');
    }).catch((error) => {
      console.error('Failed to start MSW:', error);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
