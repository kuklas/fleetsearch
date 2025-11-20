import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import '@app/app.css';

// Determine basename dynamically based on the current location
// For GitHub Pages (/fleetsearch path), use /fleetsearch, otherwise use empty string for local dev
const getBasename = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // Check if we're on GitHub Pages
    if (hostname === 'kuklas.github.io') {
      return '/fleetsearch';
    }
    
    // Check if pathname starts with /fleetsearch (for GitHub Pages)
    if (pathname.startsWith('/fleetsearch')) {
      return '/fleetsearch';
    }
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1' || window.location.port) {
      return '';
    }
  }
  // Default to /fleetsearch for production builds
  return '/fleetsearch';
};

const App: React.FunctionComponent = () => (
  <Router basename={getBasename()}>
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  </Router>
);

export default App;
