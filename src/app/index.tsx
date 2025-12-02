import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
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

// Component to handle GitHub Pages routing fallback
const RoutingFix: React.FunctionComponent = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Fallback: if we still have ?/path in the URL, fix it
    const l = window.location;
    if (l.search && l.search[1] === '/') {
      const decoded = l.search.slice(1).split('&').map((s: string) => 
        s.replace(/~and~/g, '&')
      ).join('?');
      const pathname = l.pathname.endsWith('/') ? l.pathname.slice(0, -1) : l.pathname;
      const newPath = pathname + decoded + (l.hash || '');
      // Remove the basename from the path for navigation
      const basename = getBasename();
      const routePath = newPath.replace(basename, '') || '/';
      navigate(routePath, { replace: true });
    }
  }, [navigate]);
  
  return null;
};

const App: React.FunctionComponent = () => (
  <Router basename={getBasename()}>
    <RoutingFix />
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  </Router>
);

export default App;
