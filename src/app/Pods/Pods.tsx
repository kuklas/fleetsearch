import * as React from 'react';
import {
  PageSection,
  Title,
  Flex,
  FlexItem,
  Button,
  SearchInput,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  PaginationVariant,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Label,
  TextInput,
  Divider,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Modal,
  Alert,
  Checkbox,
  Badge,
} from '@patternfly/react-core';
import {
  EllipsisVIcon,
  CheckCircleIcon,
  CheckIcon,
  LongArrowAltUpIcon,
  LongArrowAltDownIcon,
  ArrowsAltVIcon,
  FilterIcon,
  TimesIcon,
  ColumnsIcon,
  SearchIcon,
  GripVerticalIcon,
  PlusIcon,
  InfoCircleIcon,
  AngleLeftIcon,
  AngleRightIcon,
  CaretDownIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import './Pods.css';

// Mock pod data
interface Pod {
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  status: string;
  ready: string;
  restarts: number;
  owner: string;
  memory: string;
  cpu: string;
  created: string;
}

const mockPods: Pod[] = [
  {
    id: 'pod-1',
    name: 'clusterclaims-controller-6c8dbfbf85-drd2a',
    namespace: 'default',
    cluster: 'production-east',
    status: 'Running',
    ready: '2/2',
    restarts: 3,
    owner: 'clusterclaims-controller-6c8dbfbf85',
    memory: '46.5 MiB',
    cpu: '0.024 cores',
    created: 'Nov 7, 2025, 9:49 PM',
  },
  {
    id: 'pod-2',
    name: 'etcd-operator-6c8dbfbf85-0kjzj',
    namespace: 'kube-system',
    cluster: 'production-west',
    status: 'Running',
    ready: '2/2',
    restarts: 4,
    owner: 'etcd-operator-6c8dbfbf85',
    memory: '99.8 MiB',
    cpu: '0.003 cores',
    created: 'Nov 9, 2025, 3:04 AM',
  },
  {
    id: 'pod-3',
    name: 'prometheus-server-7d8f9c2b-1',
    namespace: 'monitoring',
    cluster: 'staging-east',
    status: 'Running',
    ready: '2/2',
    restarts: 0,
    owner: 'prometheus-server-7d8f9c2b',
    memory: '109.7 MiB',
    cpu: '0.090 cores',
    created: 'Nov 8, 2025, 2:15 PM',
  },
  {
    id: 'pod-4',
    name: 'grafana-5f8b9c1d-2',
    namespace: 'monitoring',
    cluster: 'staging-west',
    status: 'Running',
    ready: '2/2',
    restarts: 1,
    owner: 'grafana-5f8b9c1d',
    memory: '78.2 MiB',
    cpu: '0.045 cores',
    created: 'Nov 8, 2025, 2:20 PM',
  },
  {
    id: 'pod-5',
    name: 'elasticsearch-3a4b5c6d-1',
    namespace: 'logging',
    cluster: 'dev-central',
    status: 'Running',
    ready: '2/2',
    restarts: 2,
    owner: 'elasticsearch-3a4b5c6d',
    memory: '256.4 MiB',
    cpu: '0.120 cores',
    created: 'Nov 7, 2025, 10:30 AM',
  },
  {
    id: 'pod-6',
    name: 'kibana-7e8f9a0b-1',
    namespace: 'logging',
    cluster: 'dev-central',
    status: 'Running',
    ready: '2/2',
    restarts: 0,
    owner: 'kibana-7e8f9a0b',
    memory: '124.6 MiB',
    cpu: '0.067 cores',
    created: 'Nov 7, 2025, 10:35 AM',
  },
  {
    id: 'pod-7',
    name: 'app-backend-9c0d1e2f-3',
    namespace: 'app-prod',
    cluster: 'production-east',
    status: 'Running',
    ready: '2/2',
    restarts: 1,
    owner: 'app-backend-9c0d1e2f',
    memory: '189.3 MiB',
    cpu: '0.089 cores',
    created: 'Nov 6, 2025, 4:45 PM',
  },
  {
    id: 'pod-8',
    name: 'app-frontend-1a2b3c4d-5',
    namespace: 'app-prod',
    cluster: 'production-west',
    status: 'Running',
    ready: '2/2',
    restarts: 0,
    owner: 'app-frontend-1a2b3c4d',
    memory: '67.8 MiB',
    cpu: '0.034 cores',
    created: 'Nov 6, 2025, 4:50 PM',
  },
  {
    id: 'pod-9',
    name: 'test-runner-5e6f7a8b-2',
    namespace: 'qa-north',
    cluster: 'staging-east',
    status: 'Running',
    ready: '1/2',
    restarts: 2,
    owner: 'test-runner-5e6f7a8b',
    memory: '92.1 MiB',
    cpu: '0.056 cores',
    created: 'Nov 9, 2025, 8:20 AM',
  },
  {
    id: 'pod-10',
    name: 'database-proxy-8c9d0e1f-1',
    namespace: 'database',
    cluster: 'production-east',
    status: 'Running',
    ready: '2/2',
    restarts: 0,
    owner: 'database-proxy-8c9d0e1f',
    memory: '145.7 MiB',
    cpu: '0.078 cores',
    created: 'Nov 5, 2025, 11:15 AM',
  },
  // Add more pods to reach 56 total
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `pod-${i + 11}`,
    name: `pod-${i + 11}-${Math.random().toString(36).substring(7)}`,
    namespace: ['default', 'kube-system', 'monitoring', 'logging', 'app-prod', 'qa-north', 'database', 'multicluster-engine'][i % 8],
    cluster: ['production-east', 'production-west', 'staging-east', 'staging-west', 'dev-central'][i % 5],
    status: ['Running', 'Completed', 'Pending', 'CrashLoopBackOff', 'Failed', 'Terminating', 'Unknown'][i % 7], // Distribute statuses across pods
    ready: `${Math.floor(Math.random() * 2) + 1}/2`,
    restarts: Math.floor(Math.random() * 5),
    owner: `owner-${i + 11}`,
    memory: `${(Math.random() * 200 + 20).toFixed(1)} MiB`,
    cpu: `${(Math.random() * 0.1).toFixed(3)} cores`,
    created: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  })),
];

const Pods: React.FunctionComponent = () => {
  useDocumentTitle('Pods');

  const [searchValue, setSearchValue] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<Array<{ field: string; value: string; operator?: string }>>([]);
  // Note: Filter dropdowns now sync with activeFilters, so we keep these for UI state only
  const [clusterFilter, setClusterFilter] = React.useState<string[]>([]);
  const [namespaceFilter, setNamespaceFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [ownerFilter, setOwnerFilter] = React.useState<string[]>([]);
  
  // Sync dropdown filters with activeFilters
  React.useEffect(() => {
    const clusterFilters = activeFilters.filter(f => f.field === 'cluster').map(f => f.value);
    const namespaceFilters = activeFilters.filter(f => f.field === 'namespace').map(f => f.value);
    const statusFilters = activeFilters.filter(f => f.field === 'status').map(f => f.value);
    const ownerFilters = activeFilters.filter(f => f.field === 'owner').map(f => f.value);
    
    setClusterFilter(clusterFilters);
    setNamespaceFilter(namespaceFilters);
    setStatusFilter(statusFilters);
    setOwnerFilter(ownerFilters);
  }, [activeFilters]);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [sortBy, setSortBy] = React.useState<string>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [openRowMenuId, setOpenRowMenuId] = React.useState<string | null>(null);
  const [isClusterFilterOpen, setIsClusterFilterOpen] = React.useState(false);
  const [isNamespaceFilterOpen, setIsNamespaceFilterOpen] = React.useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = React.useState(false);
  const [isOwnerFilterOpen, setIsOwnerFilterOpen] = React.useState(false);
  const [isManageColumnsOpen, setIsManageColumnsOpen] = React.useState(false);
  const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = React.useState(false);
  
  // Column management state
  const allColumns = [
    { id: 'name', label: 'Name', required: true },
    { id: 'namespace', label: 'Namespace' },
    { id: 'cluster', label: 'Cluster' },
    { id: 'status', label: 'Status' },
    { id: 'ready', label: 'Ready' },
    { id: 'restarts', label: 'Restarts' },
    { id: 'owner', label: 'Owner' },
    { id: 'memory', label: 'Memory' },
    { id: 'cpu', label: 'CPU' },
    { id: 'created', label: 'Created' },
    { id: 'node', label: 'Node' },
    { id: 'labels', label: 'Labels' },
    { id: 'ipAddress', label: 'IP address' },
    { id: 'receivingTraffic', label: 'Receiving Traffic' },
  ];
  
  const defaultVisibleColumns = ['namespace', 'cluster', 'name', 'status', 'ready', 'restarts', 'owner', 'memory', 'cpu', 'created'];
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(defaultVisibleColumns);
  const [draggedColumn, setDraggedColumn] = React.useState<string | null>(null);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const searchInputRef = React.useRef<HTMLDivElement>(null);

  // Parse search query to extract filters
  const parseSearchQuery = (query: string): Array<{ field: string; value: string; operator?: string }> => {
    const filters: Array<{ field: string; value: string; operator?: string }> = [];
    // Match patterns like "field:value" or "field:>=value" or "field:>value" or "field:!=value" or "field:!value"
    const filterRegex = /(\w+):(>=|<=|!=|!|>|<|=)?([^\s]+)/g;
    let match;
    while ((match = filterRegex.exec(query)) !== null) {
      const operator = match[2] || '=';
      filters.push({
        field: match[1],
        value: match[3],
        operator: operator === '=' ? undefined : operator
      });
    }
    return filters;
  };

  // Get current text input value (shows what user is currently typing)
  const getCurrentTextInput = () => {
    // Return the raw input value - filters are stored separately in activeFilters
    return searchInputValue;
  };

  // Close search menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchMenuOpen(false);
      }
    };

    if (isSearchMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchMenuOpen]);

  // Get unique values for filters
  const clusters = React.useMemo(() => Array.from(new Set(mockPods.map(pod => pod.cluster))), []);
  const namespaces = React.useMemo(() => Array.from(new Set(mockPods.map(pod => pod.namespace))), []);
  const statuses = ['Running', 'Completed', 'Pending', 'CrashLoopBackOff', 'Failed', 'Terminating', 'Unknown'];
  const owners = React.useMemo(() => Array.from(new Set(mockPods.map(pod => pod.owner))), []);
  const restartValues = React.useMemo(() => Array.from(new Set(mockPods.map(pod => pod.restarts))).sort((a, b) => a - b), []);
  // Extract numeric memory values (e.g., "189.3 MiB" -> 189.3)
  const memoryValues = React.useMemo(() => {
    const values = mockPods.map(pod => {
      const match = pod.memory.match(/([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    });
    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, []);
  // Extract numeric cpu values (e.g., "0.089 cores" -> 0.089)
  const cpuValues = React.useMemo(() => {
    const values = mockPods.map(pod => {
      const match = pod.cpu.match(/([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    });
    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, []);
  // Extract unique ready values (e.g., "2/2", "1/2")
  const readyValues = React.useMemo(() => {
    return Array.from(new Set(mockPods.map(pod => pod.ready))).sort();
  }, []);
  // Extract unique receivingTraffic values
  const receivingTrafficValues = React.useMemo(() => {
    return Array.from(new Set(mockPods.map(pod => {
      // Generate stable value based on pod ID (same logic as in renderTableCell)
      return (pod.id.charCodeAt(0) % 2 === 0) ? 'Yes' : 'No';
    })));
  }, []);

  // Get search suggestions based on current input
  const getSearchSuggestions = React.useMemo(() => {
    const currentText = getCurrentTextInput().toLowerCase().trim();
    if (!currentText && activeFilters.length === 0) return null;
    
    const input = currentText;

    const suggestions: {
      fields: string[];
      advancedFilters: Array<{ text: string; example: string }>;
      names: Array<{ name: string; status: string }>;
      namespaces: string[];
      owners: string[];
      numericValues: Array<{ value: number; label: string }>; // For numeric fields like restarts
      operators: string[]; // Operators for numeric fields
      showOperators: boolean; // Whether to show operators section
      showNumericValues: boolean; // Whether to show numeric values
      minMax?: { min: number; max: number }; // Min/max for numeric fields
      currentField?: string; // Track which field we're showing values for
      currentOperator?: string; // Track which operator is selected
    } = {
      fields: [],
      advancedFilters: [],
      names: [],
      namespaces: [],
      owners: [],
      numericValues: [],
      operators: [],
      showOperators: false,
      showNumericValues: false,
      minMax: undefined,
      currentField: undefined,
      currentOperator: undefined
    };

    // Check if we're in "field:" mode (e.g., "namespace:" without a value)
    const fieldMatch = input.match(/^(\w+):\s*$/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1].toLowerCase();
      suggestions.currentField = fieldName;
      
      // For numeric fields, show operators first
      if (fieldName === 'memory' || fieldName === 'cpu' || fieldName === 'restarts') {
        suggestions.showOperators = true;
        suggestions.operators = ['<=', '>=', '!=', '!', '=', '<', '>'];
        
        // Calculate min/max for the field
        if (fieldName === 'memory') {
          suggestions.minMax = {
            min: Math.min(...memoryValues),
            max: Math.max(...memoryValues)
          };
        } else if (fieldName === 'cpu') {
          suggestions.minMax = {
            min: Math.min(...cpuValues),
            max: Math.max(...cpuValues)
          };
        } else if (fieldName === 'restarts') {
          suggestions.minMax = {
            min: Math.min(...restartValues),
            max: Math.max(...restartValues)
          };
        }
      } else {
        // Show values for non-numeric fields
        if (fieldName === 'namespace') {
          suggestions.namespaces = namespaces.slice(0, 10);
        } else if (fieldName === 'cluster') {
          suggestions.namespaces = clusters.slice(0, 10);
        } else if (fieldName === 'status') {
          suggestions.namespaces = statuses.slice(0, 10);
        } else if (fieldName === 'owner') {
          suggestions.namespaces = owners.slice(0, 10);
        } else if (fieldName === 'ready') {
          suggestions.namespaces = readyValues.slice(0, 10);
        } else if (fieldName === 'receivingtraffic') {
          suggestions.namespaces = receivingTrafficValues;
        }
      }
      
      return suggestions;
    }

    // Check if we're typing a field value after "field:" or "field:operator"
    // Match patterns like "cpu:>", "cpu:>0.05", "memory:>=20", etc.
    const fieldValueMatch = input.match(/^(\w+):\s*(>=|<=|!=|!|>|<|=)?\s*(.*)$/);
    if (fieldValueMatch) {
      const fieldName = fieldValueMatch[1].toLowerCase();
      const operator = fieldValueMatch[2] || '';
      const valueInput = fieldValueMatch[3].toLowerCase();
      suggestions.currentField = fieldName;
      suggestions.currentOperator = operator;
      
      // If we have an operator but no value yet, show numeric values
      if (operator && (fieldName === 'memory' || fieldName === 'cpu' || fieldName === 'restarts')) {
        suggestions.showNumericValues = true;
        
        if (fieldName === 'memory') {
          if (valueInput) {
            const numInput = parseFloat(valueInput);
            if (!isNaN(numInput)) {
              suggestions.numericValues = memoryValues
                .filter(val => val.toString().includes(valueInput) || Math.abs(val - numInput) < 10)
                .slice(0, 20)
                .map(val => ({ value: val, label: `${val.toFixed(1)} MiB` }));
            } else {
              suggestions.numericValues = memoryValues
                .slice(0, 20)
                .map(val => ({ value: val, label: `${val.toFixed(1)} MiB` }));
            }
          } else {
            suggestions.numericValues = memoryValues
              .slice(0, 20)
              .map(val => ({ value: val, label: `${val.toFixed(1)} MiB` }));
          }
        } else if (fieldName === 'cpu') {
          if (valueInput) {
            const numInput = parseFloat(valueInput);
            if (!isNaN(numInput)) {
              suggestions.numericValues = cpuValues
                .filter(val => val.toString().includes(valueInput) || Math.abs(val - numInput) < 0.01)
                .slice(0, 20)
                .map(val => ({ value: val, label: `${val.toFixed(3)} cores` }));
            } else {
              suggestions.numericValues = cpuValues
                .slice(0, 20)
                .map(val => ({ value: val, label: `${val.toFixed(3)} cores` }));
            }
          } else {
            suggestions.numericValues = cpuValues
              .slice(0, 20)
              .map(val => ({ value: val, label: `${val.toFixed(3)} cores` }));
          }
        } else if (fieldName === 'restarts') {
          if (valueInput) {
            const numInput = parseInt(valueInput);
            if (!isNaN(numInput)) {
              suggestions.numericValues = restartValues
                .filter(val => val.toString().includes(valueInput))
                .map(val => ({ value: val, label: val.toString() }));
            } else {
              suggestions.numericValues = restartValues
                .map(val => ({ value: val, label: val.toString() }));
            }
          } else {
            suggestions.numericValues = restartValues
              .map(val => ({ value: val, label: val.toString() }));
          }
        }
        
        return suggestions;
      }
      
      if (fieldName === 'namespace') {
        suggestions.namespaces = namespaces
          .filter(ns => ns.toLowerCase().includes(valueInput))
          .slice(0, 10);
      } else if (fieldName === 'cluster') {
        suggestions.namespaces = clusters
          .filter(c => c.toLowerCase().includes(valueInput))
          .slice(0, 10);
      } else if (fieldName === 'status') {
        suggestions.namespaces = statuses
          .filter(s => s.toLowerCase().includes(valueInput))
          .slice(0, 10);
      } else if (fieldName === 'owner') {
        suggestions.namespaces = owners
          .filter(o => o.toLowerCase().includes(valueInput))
          .slice(0, 10);
      } else if (fieldName === 'restarts') {
        // Filter numeric values based on input
        const numInput = parseInt(valueInput);
        if (!isNaN(numInput)) {
          suggestions.numericValues = restartValues
            .filter(val => val.toString().includes(valueInput))
            .map(val => ({ value: val, label: val.toString() }));
        } else {
          suggestions.numericValues = restartValues
            .map(val => ({ value: val, label: val.toString() }));
        }
      } else if (fieldName === 'memory') {
        // Filter memory values based on input
        const numInput = parseFloat(valueInput);
        if (!isNaN(numInput)) {
          suggestions.numericValues = memoryValues
            .filter(val => val.toString().includes(valueInput) || Math.abs(val - numInput) < 10)
            .slice(0, 20)
            .map(val => ({ value: val, label: `${val.toFixed(1)} MiB` }));
        } else {
          suggestions.numericValues = memoryValues
            .slice(0, 20)
            .map(val => ({ value: val, label: `${val.toFixed(1)} MiB` }));
        }
      } else if (fieldName === 'cpu') {
        // Filter cpu values based on input
        const numInput = parseFloat(valueInput);
        if (!isNaN(numInput)) {
          suggestions.numericValues = cpuValues
            .filter(val => val.toString().includes(valueInput) || Math.abs(val - numInput) < 0.01)
            .slice(0, 20)
            .map(val => ({ value: val, label: `${val.toFixed(3)} cores` }));
        } else {
          suggestions.numericValues = cpuValues
            .slice(0, 20)
            .map(val => ({ value: val, label: `${val.toFixed(3)} cores` }));
        }
      } else if (fieldName === 'ready') {
        suggestions.namespaces = readyValues
          .filter(val => val.toLowerCase().includes(valueInput))
          .slice(0, 10);
      } else if (fieldName === 'receivingtraffic') {
        suggestions.namespaces = receivingTrafficValues
          .filter(val => val.toLowerCase().includes(valueInput));
      }
      
      return suggestions;
    }

    // Search by field suggestions
    const searchableFields = ['namespace', 'cluster', 'cpu', 'created', 'receivingtraffic', 'status', 'owner', 'memory', 'ready', 'restarts', 'node', 'ipaddress', 'labels'];
    suggestions.fields = searchableFields.filter(field => field.toLowerCase().startsWith(input));

    // Advanced filter examples - show when user types field names
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('memory') || lowerInput.startsWith('memor')) {
      suggestions.advancedFilters = [
        { text: 'memory:>20', example: 'greater than 20 MiB' },
        { text: 'cpu:>=0.05', example: '0.05 cores or more' },
        { text: 'restarts:>3', example: 'more than 3 restarts' }
      ];
    } else if (lowerInput.includes('cpu') || lowerInput.startsWith('cpu')) {
      suggestions.advancedFilters = [
        { text: 'cpu:>=0.05', example: '0.05 cores or more' },
        { text: 'memory:>20', example: 'greater than 20 MiB' },
        { text: 'restarts:>3', example: 'more than 3 restarts' }
      ];
    } else if (lowerInput.includes('restart') || lowerInput.startsWith('restart')) {
      suggestions.advancedFilters = [
        { text: 'restarts:>3', example: 'more than 3 restarts' },
        { text: 'memory:>20', example: 'greater than 20 MiB' },
        { text: 'cpu:>=0.05', example: '0.05 cores or more' }
      ];
    } else if (lowerInput.length > 0 && !lowerInput.includes(':')) {
      // Show advanced filters for any field search that doesn't have a colon yet
      suggestions.advancedFilters = [
        { text: 'memory:>20', example: 'greater than 20 MiB' },
        { text: 'cpu:>=0.05', example: '0.05 cores or more' },
        { text: 'restarts:>3', example: 'more than 3 restarts' }
      ];
    }

    // Name suggestions (only if not in field mode)
    suggestions.names = mockPods
      .filter(pod => pod.name.toLowerCase().includes(input))
      .slice(0, 5)
      .map(pod => ({ name: pod.name, status: pod.status }));

    // Namespace suggestions (only if not in field mode)
    if (!input.includes(':')) {
      suggestions.namespaces = namespaces
        .filter(ns => ns.toLowerCase().includes(input))
        .slice(0, 5);
    }

    // Owner suggestions (only if not in field mode)
    if (!input.includes(':')) {
      suggestions.owners = owners
        .filter(owner => owner.toLowerCase().includes(input))
        .slice(0, 5);
    }

    return suggestions;
  }, [searchInputValue, namespaces, owners, activeFilters, clusters, statuses, restartValues, memoryValues, cpuValues, readyValues, receivingTrafficValues]);

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    // Store the raw input value - don't auto-parse filters while typing
    // This allows users to type "cpu:<0.5" without immediately creating a chip
    setSearchInputValue(value);
    setIsSearchMenuOpen(value.length > 0);
    
    // Extract plain text search (without field:value patterns) for filtering
    const plainText = value.replace(/\w+:(>=|<=|!=|!|>|<|=)?[^\s]+/g, '').trim();
    setSearchValue(plainText);
    
    // Don't auto-create filters - let user press Enter or select from dropdown
  };

  // Remove a filter chip
  const removeFilter = (index: number) => {
    const newFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(newFilters);
    
    // Rebuild search input value with remaining filters and current text
    const currentText = getCurrentTextInput();
    const newFilterStrings = newFilters.map(f => {
      if (f.operator && f.operator !== '=') {
        return `${f.field}:${f.operator}${f.value}`;
      }
      return `${f.field}:${f.value}`;
    });
    
    const newValue = newFilterStrings.length > 0 && currentText
      ? `${newFilterStrings.join(' ')} ${currentText}`.trim()
      : newFilterStrings.length > 0
      ? newFilterStrings.join(' ')
      : currentText;
    
    setSearchInputValue(newValue);
    
    // Update plain text search
    const plainText = newValue.replace(/\w+:(>=|<=|>|<)?[^\s]+/g, '').trim();
    setSearchValue(plainText);
    
    if (newValue) {
      setIsSearchMenuOpen(true);
    } else {
      setIsSearchMenuOpen(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchInputValue('');
    setSearchValue('');
    setIsSearchMenuOpen(false);
  };

  // Column management handlers
  const handleRemoveColumn = (columnId: string) => {
    const column = allColumns.find(c => c.id === columnId);
    if (column?.required) return; // Don't allow removing required columns
    
    setVisibleColumns(visibleColumns.filter(id => id !== columnId));
  };

  const handleAddColumn = (columnId: string) => {
    if (visibleColumns.length >= 9) return; // Max 9 columns
    if (visibleColumns.includes(columnId)) return; // Already added
    
    setVisibleColumns([...visibleColumns, columnId]);
  };

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;
    
    const draggedIndex = visibleColumns.indexOf(draggedColumn);
    const targetIndex = visibleColumns.indexOf(targetColumnId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newColumns = [...visibleColumns];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);
    setVisibleColumns(newColumns);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  const handleRestoreDefaults = () => {
    setVisibleColumns(defaultVisibleColumns);
  };

  const handleSaveColumns = () => {
    // Columns are already saved in state, just close the modal
    setIsManageColumnsOpen(false);
  };

  const getColumnLabel = (columnId: string) => {
    return allColumns.find(c => c.id === columnId)?.label || columnId;
  };

  const isColumnRequired = (columnId: string) => {
    return allColumns.find(c => c.id === columnId)?.required || false;
  };

  const getAdditionalColumns = () => {
    return allColumns.filter(c => !visibleColumns.includes(c.id));
  };

  // Helper to render table cell content
  const renderTableCell = (pod: Pod, columnId: string) => {
    switch (columnId) {
      case 'name':
        return pod.name;
      case 'namespace':
        return pod.namespace;
      case 'cluster':
        return pod.cluster;
      case 'status':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircleIcon style={{ 
              color: pod.status === 'Running' || pod.status === 'Completed' 
                ? 'var(--pf-t--global--icon--color--status--success--default)' 
                : pod.status === 'Pending' || pod.status === 'Terminating'
                ? 'var(--pf-t--global--icon--color--status--warning--default)'
                : 'var(--pf-t--global--icon--color--status--danger--default)' 
            }} />
            <span>{pod.status}</span>
          </div>
        );
      case 'ready':
        return pod.ready;
      case 'restarts':
        return pod.restarts;
      case 'owner':
        return pod.owner;
      case 'memory':
        return pod.memory;
      case 'cpu':
        return pod.cpu;
      case 'created':
        return pod.created;
      case 'node':
        return `node-${pod.id.slice(0, 5)}`; // Mock node data
      case 'labels':
        return 'app=pod,env=prod'; // Mock labels
      case 'ipAddress':
        // Generate stable IP based on pod ID
        const hash = pod.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return `10.0.${(hash % 255)}.${((hash * 7) % 255)}`;
      case 'receivingTraffic':
        // Generate stable value based on pod ID
        return (pod.id.charCodeAt(0) % 2 === 0) ? 'Yes' : 'No';
      default:
        return '';
    }
  };

  // Helper function to count pods for a specific filter option
  const getFilterOptionCount = React.useCallback((field: string, value: string) => {
    let filtered = [...mockPods];
    
    // Apply all active filters EXCEPT the one we're counting
    const otherFilters = activeFilters.filter(f => !(f.field.toLowerCase() === field.toLowerCase() && f.value === value));
    
    // Group filters by field
    const filtersByField: Record<string, Array<{ field: string; value: string; operator?: string }>> = {};
    otherFilters.forEach(filter => {
      const fieldKey = filter.field.toLowerCase();
      if (!filtersByField[fieldKey]) {
        filtersByField[fieldKey] = [];
      }
      filtersByField[fieldKey].push(filter);
    });
    
    // Apply other filters (same logic as filteredPods)
    Object.keys(filtersByField).forEach(fieldKey => {
      const fieldFilters = filtersByField[fieldKey];
      
      if (fieldKey === 'namespace') {
        if (!fieldFilters.some(f => f.value === 'All')) {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.namespace.toLowerCase()));
        }
      } else if (fieldKey === 'cluster') {
        if (!fieldFilters.some(f => f.value === 'All')) {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.cluster.toLowerCase()));
        }
      } else if (fieldKey === 'status') {
        if (!fieldFilters.some(f => f.value === 'All')) {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.status.toLowerCase()));
        }
      } else if (fieldKey === 'owner') {
        if (!fieldFilters.some(f => f.value === 'All')) {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.owner.toLowerCase()));
        }
      }
      // Add other field filters as needed
    });
    
    // Apply plain text search if present
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(pod => 
        pod.name.toLowerCase().includes(searchLower) ||
        pod.namespace.toLowerCase().includes(searchLower) ||
        pod.cluster.toLowerCase().includes(searchLower) ||
        pod.owner.toLowerCase().includes(searchLower)
      );
    }
    
    // Now count pods matching the specific filter option
    if (field.toLowerCase() === 'cluster') {
      if (value === 'All') {
        return filtered.length;
      }
      return filtered.filter(pod => pod.cluster.toLowerCase() === value.toLowerCase()).length;
    } else if (field.toLowerCase() === 'namespace') {
      if (value === 'All') {
        return filtered.length;
      }
      return filtered.filter(pod => pod.namespace.toLowerCase() === value.toLowerCase()).length;
    } else if (field.toLowerCase() === 'status') {
      if (value === 'All') {
        return filtered.length;
      }
      return filtered.filter(pod => pod.status.toLowerCase() === value.toLowerCase()).length;
    } else if (field.toLowerCase() === 'owner') {
      if (value === 'All') {
        return filtered.length;
      }
      return filtered.filter(pod => pod.owner.toLowerCase() === value.toLowerCase()).length;
    }
    
    return 0;
  }, [activeFilters, searchValue]);

  // Filter and sort pods
  const filteredPods = React.useMemo(() => {
    let filtered = [...mockPods];

    // Group filters by field to handle multi-select (OR logic for same field)
    const filtersByField: Record<string, Array<{ field: string; value: string; operator?: string }>> = {};
    activeFilters.forEach(filter => {
      const field = filter.field.toLowerCase();
      if (!filtersByField[field]) {
        filtersByField[field] = [];
      }
      filtersByField[field].push(filter);
    });

    // Apply filters - for fields with multiple values, use OR logic
    Object.keys(filtersByField).forEach(field => {
      const fieldFilters = filtersByField[field];
      
      if (field === 'namespace') {
        // If "All" is selected, don't filter (show all)
        if (fieldFilters.some(f => f.value === 'All')) {
          // Don't filter, show all
        } else {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.namespace.toLowerCase()));
        }
      } else if (field === 'cluster') {
        // If "All" is selected, don't filter (show all)
        if (fieldFilters.some(f => f.value === 'All')) {
          // Don't filter, show all
        } else {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.cluster.toLowerCase()));
        }
      } else if (field === 'status') {
        // If "All" is selected, don't filter (show all)
        if (fieldFilters.some(f => f.value === 'All')) {
          // Don't filter, show all
        } else {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.status.toLowerCase()));
        }
      } else if (field === 'owner') {
        // If "All" is selected, don't filter (show all)
        if (fieldFilters.some(f => f.value === 'All')) {
          // Don't filter, show all
        } else {
          const values = fieldFilters.map(f => f.value.toLowerCase());
          filtered = filtered.filter(pod => values.includes(pod.owner.toLowerCase()));
        }
      } else if (field === 'restarts') {
        // Multi-select: show pods with ANY of the selected restart values
        const values = fieldFilters.map(f => parseInt(f.value));
        filtered = filtered.filter(pod => values.includes(pod.restarts));
      } else if (field === 'cpu') {
        // For numeric fields with operators, apply each filter (AND logic between different operators)
        // Multi-select: show pods with ANY of the selected cpu values (OR logic for same operator)
        const values = fieldFilters.map(f => parseFloat(f.value));
        filtered = filtered.filter(pod => {
          const podCpuMatch = pod.cpu.match(/([\d.]+)/);
          const podCpuValue = podCpuMatch ? parseFloat(podCpuMatch[1]) : 0;
          return values.some(val => {
            const filter = fieldFilters.find(f => parseFloat(f.value) === val);
            const operator = filter?.operator || '=';
            if (operator === '>=') {
              return podCpuValue >= val;
            } else if (operator === '<=') {
              return podCpuValue <= val;
            } else if (operator === '>') {
              return podCpuValue > val;
            } else if (operator === '<') {
              return podCpuValue < val;
            } else if (operator === '!=' || operator === '!') {
              return Math.abs(podCpuValue - val) >= 0.001; // Not equal
            } else {
              return Math.abs(podCpuValue - val) < 0.001; // Allow small floating point differences
            }
          });
        });
      } else if (field === 'memory') {
        // For numeric fields with operators, apply each filter (AND logic between different operators)
        // Multi-select: show pods with ANY of the selected memory values (OR logic for same operator)
        const values = fieldFilters.map(f => parseFloat(f.value));
        filtered = filtered.filter(pod => {
          const podMemoryMatch = pod.memory.match(/([\d.]+)/);
          const podMemoryValue = podMemoryMatch ? parseFloat(podMemoryMatch[1]) : 0;
          return values.some(val => {
            const filter = fieldFilters.find(f => parseFloat(f.value) === val);
            const operator = filter?.operator || '=';
            if (operator === '>=') {
              return podMemoryValue >= val;
            } else if (operator === '<=') {
              return podMemoryValue <= val;
            } else if (operator === '>') {
              return podMemoryValue > val;
            } else if (operator === '<') {
              return podMemoryValue < val;
            } else if (operator === '!=' || operator === '!') {
              return Math.abs(podMemoryValue - val) >= 0.1; // Not equal
            } else {
              return Math.abs(podMemoryValue - val) < 0.1; // Allow small floating point differences
            }
          });
        });
      } else if (field === 'ready') {
        // Multi-select: show pods with ANY of the selected ready values
        const values = fieldFilters.map(f => f.value);
        filtered = filtered.filter(pod => values.includes(pod.ready));
      } else if (field === 'receivingtraffic') {
        // Multi-select: show pods with ANY of the selected receivingTraffic values
        const values = fieldFilters.map(f => f.value.toLowerCase());
        filtered = filtered.filter(pod => {
          const podReceivingTraffic = (pod.id.charCodeAt(0) % 2 === 0) ? 'Yes' : 'No';
          return values.includes(podReceivingTraffic.toLowerCase());
        });
      }
    });

    // Plain text search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(pod =>
        pod.name.toLowerCase().includes(searchLower) ||
        pod.namespace.toLowerCase().includes(searchLower) ||
        pod.cluster.toLowerCase().includes(searchLower) ||
        pod.status.toLowerCase().includes(searchLower) ||
        pod.owner.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Pod] as string | number;
      let bValue: string | number = b[sortBy as keyof Pod] as string | number;

      // Handle numeric values
      if (sortBy === 'restarts') {
        aValue = a.restarts;
        bValue = b.restarts;
      } else if (sortBy === 'memory') {
        aValue = parseFloat(a.memory);
        bValue = parseFloat(b.memory);
      } else if (sortBy === 'cpu') {
        aValue = parseFloat(a.cpu);
        bValue = parseFloat(b.cpu);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [activeFilters, searchValue, sortBy, sortDirection]);

  // Pagination
  const paginatedPods = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredPods.slice(start, start + perPage);
  }, [filteredPods, page, perPage]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy === column) {
      // Active sort - show colored single-direction arrow
      return (
        <span style={{ color: 'var(--pf-t--global--color--brand--default)' }}>
          {sortDirection === 'asc' ? <LongArrowAltUpIcon /> : <LongArrowAltDownIcon />}
        </span>
      );
    }
    // Unsorted - show light grey double-headed arrow (PatternFly standard icon)
    return (
      <ArrowsAltVIcon style={{ 
        color: 'var(--pf-t--global--text--color--subtle)',
        opacity: 0.4,
        fontSize: '0.875em'
      }} />
    );
  };

  return (
    <PageSection hasBodyWrapper={false} padding={{ default: 'noPadding' }}>
      <div className="pods-page">
        {/* Header */}
        <div className="pods-header">
          <Title headingLevel="h1" size="2xl" style={{ marginBottom: '16px' }}>
            Pods
          </Title>
          
          {/* Global Search */}
          <div style={{ position: 'relative', marginBottom: '16px', maxWidth: '50%' }} ref={searchInputRef}>
            {/* Custom Search Input with Chips */}
            <div
              className="pods-search-with-chips"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '4px',
                minHeight: '36px',
                padding: '4px 8px',
                border: '1px solid var(--pf-t--global--border--color--default)',
                borderRadius: '4px',
                backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                cursor: 'text',
              }}
              onClick={() => {
                // Focus the input when clicking the container
                const input = document.getElementById('pods-search-input');
                input?.focus();
              }}
            >
              {/* Filter Chips */}
              {activeFilters.map((filter, index) => (
                <Label
                  key={index}
                  onClose={() => removeFilter(index)}
                  color="blue"
                  style={{ margin: 0 }}
                >
                  {filter.field}:{filter.operator && filter.operator !== '=' ? filter.operator : ''}{filter.value}
                </Label>
              ))}
              
              {/* Search Input */}
              <input
                id="pods-search-input"
                type="text"
                placeholder={activeFilters.length === 0 ? "Search by name or use filters (e.g., status:Running, ready:2/2, memory:>20)" : ""}
                value={getCurrentTextInput()}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => searchInputValue.length > 0 && setIsSearchMenuOpen(true)}
                onKeyDown={(e) => {
                  // When user presses Enter, create filter chip if there's a complete filter pattern
                  if (e.key === 'Enter') {
                    const currentText = getCurrentTextInput();
                    // Check if it's a complete filter pattern like "cpu:>0.05" or "memory:20" or "cpu:<0.5"
                    // Match: field:operator?value (operator can be >=, <=, !=, !, >, <, =)
                    const filterMatch = currentText.match(/^(\w+):(>=|<=|!=|!|>|<|=)?([^\s]+)$/);
                    if (filterMatch) {
                      const fieldName = filterMatch[1].toLowerCase();
                      const operator = filterMatch[2] || '=';
                      const value = filterMatch[3];
                      
                      // Check if this is a numeric field or any field with a value
                      if (value && value.length > 0) {
                        // Create filter chip
                        const newFilter = {
                          field: fieldName,
                          value: value,
                          operator: operator === '=' ? undefined : operator
                        };
                        const updatedFilters = [...activeFilters, newFilter];
                        setActiveFilters(updatedFilters);
                        
                        // Clear the search input
                        setSearchInputValue('');
                        setSearchValue('');
                        setIsSearchMenuOpen(false);
                        e.preventDefault();
                      }
                    }
                  }
                }}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  padding: '4px',
                }}
              />
              
              {/* Clear Button */}
              {getCurrentTextInput().length > 0 || activeFilters.length > 0 ? (
                <Button
                  variant="plain"
                  aria-label="Clear search"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllFilters();
                  }}
                  style={{ padding: '4px', minWidth: 'auto' }}
                >
                  <TimesIcon />
                </Button>
              ) : null}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchMenuOpen && getSearchSuggestions && (
              <div
                className="search-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  zIndex: 1000,
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                <Menu>
                  <MenuContent>
                    <MenuList>
                      {/* SEARCH BY FIELD */}
                      {getSearchSuggestions.fields.length > 0 && (
                        <>
                          <MenuItem isDisabled>
                            <strong>SEARCH BY FIELD</strong>
                          </MenuItem>
                          {getSearchSuggestions.fields.map((field) => (
                            <MenuItem
                              key={field}
                              onClick={() => {
                                // Replace current text with just "field:"
                                handleSearchInputChange(`${field}:`);
                              }}
                            >
                              <code>{field}:</code>
                            </MenuItem>
                          ))}
                          <Divider />
                        </>
                      )}

                      {/* OPERATORS (for numeric fields) */}
                      {getSearchSuggestions.showOperators && getSearchSuggestions.operators.length > 0 && (
                        <>
                          <MenuItem isDisabled>
                            <strong>OPERATORS</strong>
                          </MenuItem>
                          {getSearchSuggestions.minMax && (
                            <MenuItem isDisabled style={{ fontSize: '0.875em', paddingTop: '4px', paddingBottom: '4px' }}>
                              {getSearchSuggestions.currentField} values: Min: {getSearchSuggestions.minMax.min} - Max: {getSearchSuggestions.minMax.max}
                            </MenuItem>
                          )}
                          {getSearchSuggestions.operators.map((op) => (
                            <MenuItem
                              key={op}
                              onClick={() => {
                                // Replace current text with "field:operator"
                                const fieldName = getSearchSuggestions.currentField || '';
                                handleSearchInputChange(`${fieldName}:${op}`);
                              }}
                            >
                              <code>{op}</code>
                            </MenuItem>
                          ))}
                          <Divider />
                        </>
                      )}

                      {/* ADVANCED FILTERS */}
                      {getSearchSuggestions.advancedFilters.length > 0 && (
                        <>
                          <MenuItem isDisabled>
                            <strong>ADVANCED FILTERS (&gt;, &lt;, &gt;=, &lt;=)</strong>
                          </MenuItem>
                          {getSearchSuggestions.advancedFilters.map((filter, idx) => (
                            <MenuItem
                              key={idx}
                              onClick={() => {
                                handleSearchInputChange(filter.text);
                              }}
                            >
                              <code>{filter.text}</code> ({filter.example})
                            </MenuItem>
                          ))}
                          <Divider />
                        </>
                      )}

                      {/* NAME */}
                      {getSearchSuggestions.names.length > 0 && (
                        <>
                          <MenuItem isDisabled>
                            <strong>NAME</strong>
                          </MenuItem>
                          {getSearchSuggestions.names.map((pod) => (
                            <MenuItem
                              key={pod.name}
                              onClick={() => {
                                handleSearchInputChange(pod.name);
                                setIsSearchMenuOpen(false);
                              }}
                            >
                              {pod.name}
                              <span style={{ color: 'var(--pf-t--global--text--color--subtle)', marginLeft: '8px' }}>
                                {pod.status}
                              </span>
                            </MenuItem>
                          ))}
                          <Divider />
                        </>
                      )}

                      {/* NAMESPACE / FIELD VALUES */}
                      {getSearchSuggestions.namespaces.length > 0 && (
                        <>
                          <MenuItem isDisabled>
                            <strong>{getSearchSuggestions.currentField ? getSearchSuggestions.currentField.toUpperCase() : 'NAMESPACE'}</strong>
                          </MenuItem>
                          {getSearchSuggestions.namespaces.map((ns) => {
                            // Determine which field we're setting based on current input
                            const currentText = getCurrentTextInput();
                            const fieldMatch = currentText.match(/^(\w+):/);
                            const fieldName = fieldMatch ? fieldMatch[1] : 'namespace';
                            
                            // Check if this value is already selected
                            const isSelected = activeFilters.some(
                              f => f.field === fieldName && f.value === ns
                            );
                            
                            return (
                              <MenuItem
                                key={ns}
                                onClick={() => {
                                  if (isSelected) {
                                    // Remove filter if already selected
                                    const updatedFilters = activeFilters.filter(
                                      f => !(f.field === fieldName && f.value === ns)
                                    );
                                    setActiveFilters(updatedFilters);
                                  } else {
                                    // Create filter chip
                                    const newFilter = { field: fieldName, value: ns };
                                    const updatedFilters = [...activeFilters, newFilter];
                                    setActiveFilters(updatedFilters);
                                  }
                                  
                                  // Clear the search input
                                  setSearchInputValue('');
                                  setSearchValue('');
                                  setIsSearchMenuOpen(false);
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                  <span>{ns}</span>
                                  {isSelected && (
                                    <CheckIcon style={{ color: 'var(--pf-t--global--color--brand--default)' }} />
                                  )}
                                </div>
                              </MenuItem>
                            );
                          })}
                          <Divider />
                        </>
                      )}

                      {/* OWNER */}
                      {getSearchSuggestions.owners.length > 0 && (
                        <>
                          <MenuItem isDisabled>
                            <strong>OWNER</strong>
                          </MenuItem>
                          {getSearchSuggestions.owners.map((owner) => {
                            // Determine which field we're setting based on current input
                            const currentText = getCurrentTextInput();
                            const fieldMatch = currentText.match(/^(\w+):/);
                            const fieldName = fieldMatch ? fieldMatch[1] : 'owner';
                            
                            // Check if this value is already selected
                            const isSelected = activeFilters.some(
                              f => f.field === fieldName && f.value === owner
                            );
                            
                            return (
                              <MenuItem
                                key={owner}
                                onClick={() => {
                                  if (isSelected) {
                                    // Remove filter if already selected
                                    const updatedFilters = activeFilters.filter(
                                      f => !(f.field === fieldName && f.value === owner)
                                    );
                                    setActiveFilters(updatedFilters);
                                  } else {
                                    // Create filter chip
                                    const newFilter = { field: fieldName, value: owner };
                                    const updatedFilters = [...activeFilters, newFilter];
                                    setActiveFilters(updatedFilters);
                                  }
                                  
                                  // Clear the search input
                                  setSearchInputValue('');
                                  setSearchValue('');
                                  setIsSearchMenuOpen(false);
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                  <span>{owner}</span>
                                  {isSelected && (
                                    <CheckIcon style={{ color: 'var(--pf-t--global--color--brand--default)' }} />
                                  )}
                                </div>
                              </MenuItem>
                            );
                          })}
                          <Divider />
                        </>
                      )}

                      {/* NUMERIC VALUES (e.g., restarts, memory, cpu) */}
                      {getSearchSuggestions.showNumericValues && getSearchSuggestions.numericValues.length > 0 && (
                        <>
                          <MenuItem isDisabled>
                            <strong>{getSearchSuggestions.currentField ? `${getSearchSuggestions.currentField.toUpperCase()} VALUES` : 'RESTARTS'}</strong>
                          </MenuItem>
                          {getSearchSuggestions.numericValues.map((item) => {
                            const currentText = getCurrentTextInput();
                            const fieldMatch = currentText.match(/^(\w+):/);
                            const operatorMatch = currentText.match(/^(\w+):\s*(>=|<=|!=|!|>|<|=)/);
                            const fieldName = fieldMatch ? fieldMatch[1] : 'restarts';
                            const operator = operatorMatch ? operatorMatch[2] : '=';
                            
                            // Check if this value is already selected
                            const isSelected = activeFilters.some(
                              f => f.field === fieldName && f.value === item.value.toString() && (f.operator || '=') === operator
                            );
                            
                            return (
                              <MenuItem
                                key={item.value}
                                onClick={() => {
                                  if (isSelected) {
                                    // Remove filter if already selected
                                    const updatedFilters = activeFilters.filter(
                                      f => !(f.field === fieldName && f.value === item.value.toString() && (f.operator || '=') === operator)
                                    );
                                    setActiveFilters(updatedFilters);
                                  } else {
                                    // Add filter chip with operator (multi-select)
                                    const newFilter = { 
                                      field: fieldName, 
                                      value: item.value.toString(),
                                      operator: operator === '=' ? undefined : operator
                                    };
                                    const updatedFilters = [...activeFilters, newFilter];
                                    setActiveFilters(updatedFilters);
                                  }
                                  
                                  // Clear the search input after selection
                                  setSearchInputValue('');
                                  setSearchValue('');
                                  setIsSearchMenuOpen(false);
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                  <span>{item.label}</span>
                                  {isSelected && (
                                    <CheckIcon style={{ color: 'var(--pf-t--global--color--brand--default)' }} />
                                  )}
                                </div>
                              </MenuItem>
                            );
                          })}
                        </>
                      )}

                      {getSearchSuggestions.fields.length === 0 &&
                        getSearchSuggestions.advancedFilters.length === 0 &&
                        getSearchSuggestions.names.length === 0 &&
                        getSearchSuggestions.namespaces.length === 0 &&
                        getSearchSuggestions.owners.length === 0 &&
                        getSearchSuggestions.numericValues.length === 0 && (
                          <MenuItem isDisabled>
                            No suggestions found
                          </MenuItem>
                        )}
                    </MenuList>
                  </MenuContent>
                </Menu>
              </div>
            )}
          </div>

          {/* Filters */}
          <div style={{ marginTop: '16px' }}>
            <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Dropdown
                  isOpen={isClusterFilterOpen}
                  onSelect={() => {}} // Don't close on select for multi-select
                  onOpenChange={(isOpen: boolean) => setIsClusterFilterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsClusterFilterOpen(!isClusterFilterOpen)}
                      isExpanded={isClusterFilterOpen}
                      variant="default"
                    >
                      Cluster {clusterFilter.length > 0 && `: ${clusterFilter.length} selected`}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem
                      key="all"
                      onClick={(e) => {
                        e?.stopPropagation();
                        const isAllSelected = activeFilters.some(f => f.field === 'cluster' && f.value === 'All');
                        if (isAllSelected) {
                          // Unselect "All"
                          setActiveFilters(activeFilters.filter(f => !(f.field === 'cluster' && f.value === 'All')));
                        } else {
                          // Remove all other cluster filters and add "All"
                          const otherFilters = activeFilters.filter(f => f.field !== 'cluster');
                          setActiveFilters([...otherFilters, { field: 'cluster', value: 'All' }]);
                        }
                      }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Checkbox
                            id="cluster-filter-all"
                            isChecked={activeFilters.some(f => f.field === 'cluster' && f.value === 'All')}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          All
                        </FlexItem>
                        <FlexItem>
                          <Badge isRead>{getFilterOptionCount('cluster', 'All')}</Badge>
                        </FlexItem>
                      </Flex>
                    </DropdownItem>
                    {clusters.map(cluster => {
                      const isSelected = activeFilters.some(f => f.field === 'cluster' && f.value === cluster);
                      return (
                        <DropdownItem
                          key={cluster}
                          onClick={(e) => {
                            e?.stopPropagation();
                            // Toggle selection when clicking the dropdown item
                            if (isSelected) {
                              setActiveFilters(activeFilters.filter(f => !(f.field === 'cluster' && f.value === cluster)));
                            } else {
                              // Remove "All" if it exists, then add the specific cluster
                              const otherFilters = activeFilters.filter(f => !(f.field === 'cluster' && f.value === 'All'));
                              if (!otherFilters.some(f => f.field === 'cluster' && f.value === cluster)) {
                                setActiveFilters([...otherFilters, { field: 'cluster', value: cluster }]);
                              }
                            }
                          }}
                        >
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <Checkbox
                                id={`cluster-filter-${cluster}`}
                                isChecked={isSelected}
                                onChange={() => {}}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FlexItem>
                            <FlexItem flex={{ default: 'flex_1' }}>
                              {cluster}
                            </FlexItem>
                            <FlexItem>
                              <Badge isRead>{getFilterOptionCount('cluster', cluster)}</Badge>
                            </FlexItem>
                          </Flex>
                        </DropdownItem>
                      );
                    })}
                  </DropdownList>
                </Dropdown>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={isNamespaceFilterOpen}
                  onSelect={() => {}} // Don't close on select for multi-select
                  onOpenChange={(isOpen: boolean) => setIsNamespaceFilterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsNamespaceFilterOpen(!isNamespaceFilterOpen)}
                      isExpanded={isNamespaceFilterOpen}
                      variant="default"
                    >
                      Namespace {namespaceFilter.length > 0 && `: ${namespaceFilter.length} selected`}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem
                      key="all"
                      onClick={(e) => {
                        e?.stopPropagation();
                        const isAllSelected = activeFilters.some(f => f.field === 'namespace' && f.value === 'All');
                        if (isAllSelected) {
                          // Unselect "All"
                          setActiveFilters(activeFilters.filter(f => !(f.field === 'namespace' && f.value === 'All')));
                        } else {
                          // Remove all other namespace filters and add "All"
                          const otherFilters = activeFilters.filter(f => f.field !== 'namespace');
                          setActiveFilters([...otherFilters, { field: 'namespace', value: 'All' }]);
                        }
                      }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Checkbox
                            id="namespace-filter-all"
                            isChecked={activeFilters.some(f => f.field === 'namespace' && f.value === 'All')}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          All
                        </FlexItem>
                        <FlexItem>
                          <Badge isRead>{getFilterOptionCount('namespace', 'All')}</Badge>
                        </FlexItem>
                      </Flex>
                    </DropdownItem>
                    {namespaces.map(namespace => {
                      const isSelected = activeFilters.some(f => f.field === 'namespace' && f.value === namespace);
                      return (
                        <DropdownItem
                          key={namespace}
                          onClick={(e) => {
                            e?.stopPropagation();
                            // Toggle selection when clicking the dropdown item
                            if (isSelected) {
                              setActiveFilters(activeFilters.filter(f => !(f.field === 'namespace' && f.value === namespace)));
                            } else {
                              // Remove "All" if it exists, then add the specific namespace
                              const otherFilters = activeFilters.filter(f => !(f.field === 'namespace' && f.value === 'All'));
                              if (!otherFilters.some(f => f.field === 'namespace' && f.value === namespace)) {
                                setActiveFilters([...otherFilters, { field: 'namespace', value: namespace }]);
                              }
                            }
                          }}
                        >
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <Checkbox
                                id={`namespace-filter-${namespace}`}
                                isChecked={isSelected}
                                onChange={() => {}}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FlexItem>
                            <FlexItem flex={{ default: 'flex_1' }}>
                              {namespace}
                            </FlexItem>
                            <FlexItem>
                              <Badge isRead>{getFilterOptionCount('namespace', namespace)}</Badge>
                            </FlexItem>
                          </Flex>
                        </DropdownItem>
                      );
                    })}
                  </DropdownList>
                </Dropdown>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={isStatusFilterOpen}
                  onSelect={() => {}} // Don't close on select for multi-select
                  onOpenChange={(isOpen: boolean) => setIsStatusFilterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                      isExpanded={isStatusFilterOpen}
                      variant="default"
                    >
                      Status {statusFilter.length > 0 && `: ${statusFilter.length} selected`}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem
                      key="all"
                      onClick={(e) => {
                        e?.stopPropagation();
                        const isAllSelected = activeFilters.some(f => f.field === 'status' && f.value === 'All');
                        if (isAllSelected) {
                          // Unselect "All"
                          setActiveFilters(activeFilters.filter(f => !(f.field === 'status' && f.value === 'All')));
                        } else {
                          // Remove all other status filters and add "All"
                          const otherFilters = activeFilters.filter(f => f.field !== 'status');
                          setActiveFilters([...otherFilters, { field: 'status', value: 'All' }]);
                        }
                      }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Checkbox
                            id="status-filter-all"
                            isChecked={activeFilters.some(f => f.field === 'status' && f.value === 'All')}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          All
                        </FlexItem>
                        <FlexItem>
                          <Badge isRead>{getFilterOptionCount('status', 'All')}</Badge>
                        </FlexItem>
                      </Flex>
                    </DropdownItem>
                    {statuses.map(status => {
                      const isSelected = activeFilters.some(f => f.field === 'status' && f.value === status);
                      return (
                        <DropdownItem
                          key={status}
                          onClick={(e) => {
                            e?.stopPropagation();
                            // Toggle selection when clicking the dropdown item
                            if (isSelected) {
                              setActiveFilters(activeFilters.filter(f => !(f.field === 'status' && f.value === status)));
                            } else {
                              // Remove "All" if it exists, then add the specific status
                              const otherFilters = activeFilters.filter(f => !(f.field === 'status' && f.value === 'All'));
                              if (!otherFilters.some(f => f.field === 'status' && f.value === status)) {
                                setActiveFilters([...otherFilters, { field: 'status', value: status }]);
                              }
                            }
                          }}
                        >
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <Checkbox
                                id={`status-filter-${status}`}
                                isChecked={isSelected}
                                onChange={() => {}}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FlexItem>
                            <FlexItem flex={{ default: 'flex_1' }}>
                              {status}
                            </FlexItem>
                            <FlexItem>
                              <Badge isRead>{getFilterOptionCount('status', status)}</Badge>
                            </FlexItem>
                          </Flex>
                        </DropdownItem>
                      );
                    })}
                  </DropdownList>
                </Dropdown>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={isOwnerFilterOpen}
                  onSelect={() => {}} // Don't close on select for multi-select
                  onOpenChange={(isOpen: boolean) => setIsOwnerFilterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsOwnerFilterOpen(!isOwnerFilterOpen)}
                      isExpanded={isOwnerFilterOpen}
                      variant="default"
                    >
                      Owner {ownerFilter.length > 0 && `: ${ownerFilter.length} selected`}
                    </MenuToggle>
                  )}
                >
                  <DropdownList style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <DropdownItem
                      key="all"
                      onClick={(e) => {
                        e?.stopPropagation();
                        const isAllSelected = activeFilters.some(f => f.field === 'owner' && f.value === 'All');
                        if (isAllSelected) {
                          // Unselect "All"
                          setActiveFilters(activeFilters.filter(f => !(f.field === 'owner' && f.value === 'All')));
                        } else {
                          // Remove all other owner filters and add "All"
                          const otherFilters = activeFilters.filter(f => f.field !== 'owner');
                          setActiveFilters([...otherFilters, { field: 'owner', value: 'All' }]);
                        }
                      }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Checkbox
                            id="owner-filter-all"
                            isChecked={activeFilters.some(f => f.field === 'owner' && f.value === 'All')}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          All
                        </FlexItem>
                        <FlexItem>
                          <Badge isRead>{getFilterOptionCount('owner', 'All')}</Badge>
                        </FlexItem>
                      </Flex>
                    </DropdownItem>
                    {owners.map(owner => {
                      const isSelected = activeFilters.some(f => f.field === 'owner' && f.value === owner);
                      return (
                        <DropdownItem
                          key={owner}
                          onClick={(e) => {
                            e?.stopPropagation();
                            // Toggle selection when clicking the dropdown item
                            if (isSelected) {
                              setActiveFilters(activeFilters.filter(f => !(f.field === 'owner' && f.value === owner)));
                            } else {
                              // Remove "All" if it exists, then add the specific owner
                              const otherFilters = activeFilters.filter(f => !(f.field === 'owner' && f.value === 'All'));
                              if (!otherFilters.some(f => f.field === 'owner' && f.value === owner)) {
                                setActiveFilters([...otherFilters, { field: 'owner', value: owner }]);
                              }
                            }
                          }}
                        >
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <Checkbox
                                id={`owner-filter-${owner}`}
                                isChecked={isSelected}
                                onChange={() => {}}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FlexItem>
                            <FlexItem flex={{ default: 'flex_1' }}>
                              {owner}
                            </FlexItem>
                            <FlexItem>
                              <Badge isRead>{getFilterOptionCount('owner', owner)}</Badge>
                            </FlexItem>
                          </Flex>
                        </DropdownItem>
                      );
                    })}
                  </DropdownList>
                </Dropdown>
              </FlexItem>
              <FlexItem>
                <Button
                  variant="plain"
                  aria-label="Manage columns"
                  onClick={() => setIsManageColumnsOpen(!isManageColumnsOpen)}
                >
                  <ColumnsIcon />
                </Button>
              </FlexItem>
            </Flex>
          </div>
        </div>

      {/* Table and Content */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', minHeight: 0 }}>
        {/* Table */}
        <Card style={{ margin: '24px' }}>
          <CardBody>
            {/* Pagination Row */}
            <Flex 
              spaceItems={{ default: 'spaceItemsMd' }} 
              alignItems={{ default: 'alignItemsCenter' }}
              style={{ marginBottom: '16px' }}
              justifyContent={{ default: 'justifyContentFlexEnd' }}
            >

          {/* Pagination */}
          <FlexItem>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Range Text and Total Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>
                  {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredPods.length)} of {filteredPods.length}
                </span>
                <Dropdown
                  isOpen={isPerPageDropdownOpen}
                  onSelect={() => setIsPerPageDropdownOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsPerPageDropdownOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsPerPageDropdownOpen(!isPerPageDropdownOpen)}
                      isExpanded={isPerPageDropdownOpen}
                      variant="plain"
                      style={{ padding: '4px', minWidth: 'auto' }}
                      aria-label="Items per page"
                    >
                      <CaretDownIcon />
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="10" onClick={() => { setPerPage(10); setPage(1); }}>
                      10 per page
                    </DropdownItem>
                    <DropdownItem key="20" onClick={() => { setPerPage(20); setPage(1); }}>
                      20 per page
                    </DropdownItem>
                    <DropdownItem key="50" onClick={() => { setPerPage(50); setPage(1); }}>
                      50 per page
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </div>

              {/* Navigation Arrows */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Button
                  variant="plain"
                  aria-label="Previous page"
                  onClick={() => setPage(page - 1)}
                  isDisabled={page === 1}
                  style={{ 
                    padding: '4px',
                    color: page === 1 ? 'var(--pf-t--global--text--color--subtle)' : 'var(--pf-t--global--text--color--default)'
                  }}
                >
                  <AngleLeftIcon />
                </Button>
                <Button
                  variant="plain"
                  aria-label="Next page"
                  onClick={() => setPage(page + 1)}
                  isDisabled={page * perPage >= filteredPods.length}
                  style={{ 
                    padding: '4px',
                    color: page * perPage >= filteredPods.length ? 'var(--pf-t--global--text--color--subtle)' : 'var(--pf-t--global--text--color--default)'
                  }}
                >
                  <AngleRightIcon />
                </Button>
              </div>
            </div>
          </FlexItem>
        </Flex>

        {/* Table or Empty State */}
        {filteredPods.length === 0 ? (
          <EmptyState icon={SearchIcon}>
            <Title headingLevel="h2" size="lg">
              No results found
            </Title>
            <EmptyStateBody>
              No nodes match your current filter criteria. Try adjusting your search or clearing some filters.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="link" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </EmptyStateActions>
          </EmptyState>
        ) : (
          <>
            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                    {visibleColumns.map(columnId => (
                      <th
                        key={columnId}
                        style={{ padding: '12px', textAlign: 'left', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort(columnId)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{getColumnLabel(columnId)}</span>
                          <SortIcon column={columnId} />
                        </div>
                      </th>
                    ))}
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPods.map(pod => (
                    <tr
                      key={pod.id}
                      style={{
                        borderBottom: '1px solid var(--pf-t--global--border--color--default)',
                      }}
                    >
                      {visibleColumns.map(columnId => (
                        <td key={columnId} style={{ padding: '12px' }}>
                          {renderTableCell(pod, columnId)}
                        </td>
                      ))}
                      <td style={{ padding: '12px', textAlign: 'right', position: 'relative' }}>
                        <Dropdown
                          isOpen={openRowMenuId === pod.id}
                          onSelect={() => setOpenRowMenuId(null)}
                          onOpenChange={(isOpen: boolean) => {
                            if (!isOpen) {
                              setOpenRowMenuId(null);
                            }
                          }}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              variant="plain"
                              aria-label="Row actions menu"
                              style={{ padding: '4px' }}
                              onClick={() => setOpenRowMenuId(openRowMenuId === pod.id ? null : pod.id)}
                              isExpanded={openRowMenuId === pod.id}
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem key="view" onClick={() => console.log('View', pod.id)}>
                              View details
                            </DropdownItem>
                            <DropdownItem key="logs" onClick={() => console.log('Logs', pod.id)}>
                              View logs
                            </DropdownItem>
                            <DropdownItem key="exec" onClick={() => console.log('Exec', pod.id)}>
                              Execute command
                            </DropdownItem>
                            <DropdownItem key="restart" onClick={() => console.log('Restart', pod.id)}>
                              Restart
                            </DropdownItem>
                            <DropdownItem key="delete" onClick={() => console.log('Delete', pod.id)}>
                              Delete
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                itemCount={filteredPods.length}
                page={page}
                perPage={perPage}
                onSetPage={(_, newPage) => setPage(newPage)}
                onPerPageSelect={(_, newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                }}
                variant={PaginationVariant.bottom}
                perPageOptions={[
                  { title: '10', value: 10 },
                  { title: '20', value: 20 },
                  { title: '50', value: 50 },
                ]}
              />
            </div>
          </>
        )}
          </CardBody>
        </Card>
      </div>
    </div>

    {/* Manage Columns Modal */}
    <Modal
      width="45%"
      isOpen={isManageColumnsOpen}
      onClose={() => setIsManageColumnsOpen(false)}
      aria-label="Manage columns"
    >
      {/* Modal Header */}
      <div style={{
        padding: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--pf-t--global--border--color--default)',
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
      }}>
        <Title headingLevel="h1" size="2xl">
          Manage columns
        </Title>
      </div>

      <div style={{ padding: '24px' }}>
        <p style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
          Selected columns will appear in the table. Drag to reorder.
        </p>

        <Alert
          variant="info"
          isInline
          title={
            <div>
              <div>You can select up to 9 columns</div>
              <div>The namespace column is only shown when in "All projects"</div>
            </div>
          }
          style={{ marginBottom: '24px' }}
        />

        {/* Selected Columns Section */}
        <div style={{ marginBottom: '32px' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
            Selected columns
          </Title>
          <div style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '4px' }}>
            {visibleColumns.map((columnId, index) => {
              const column = allColumns.find(c => c.id === columnId);
              const isRequired = isColumnRequired(columnId);
              
              return (
                <div
                  key={columnId}
                  draggable={!isRequired}
                  onDragStart={() => handleDragStart(columnId)}
                  onDragOver={(e) => handleDragOver(e, columnId)}
                  onDragEnd={handleDragEnd}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: index < visibleColumns.length - 1 ? '1px solid var(--pf-t--global--border--color--default)' : 'none',
                    cursor: isRequired ? 'default' : 'move',
                    backgroundColor: draggedColumn === columnId ? 'var(--pf-t--global--background--color--secondary--default)' : 'transparent',
                  }}
                >
                  <div style={{ marginRight: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    <GripVerticalIcon />
                  </div>
                  <div style={{ flex: 1 }}>
                    {getColumnLabel(columnId)}
                    {isRequired && <span style={{ color: 'var(--pf-t--global--text--color--subtle)', marginLeft: '8px' }}>(required)</span>}
                  </div>
                  {!isRequired && (
                    <Button
                      variant="link"
                      onClick={() => handleRemoveColumn(columnId)}
                      style={{ color: 'var(--pf-t--global--color--danger--default)', padding: 0 }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Columns Section */}
        <div style={{ marginBottom: '24px' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
            Additional columns
          </Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {getAdditionalColumns().map(column => (
              <Button
                key={column.id}
                variant="secondary"
                onClick={() => handleAddColumn(column.id)}
                isDisabled={visibleColumns.length >= 9}
                icon={<PlusIcon />}
                iconPosition="left"
              >
                {column.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
          <div>
            <Button variant="primary" onClick={handleSaveColumns} style={{ marginRight: '16px' }}>
              Save
            </Button>
            <Button variant="secondary" onClick={() => setIsManageColumnsOpen(false)}>
              Cancel
            </Button>
          </div>
          <Button variant="link" onClick={handleRestoreDefaults}>
            Restore default columns
          </Button>
        </div>
      </div>
    </Modal>
    </PageSection>
  );
};

export { Pods };

