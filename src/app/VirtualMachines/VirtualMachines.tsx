import * as React from 'react';
import {
  PageSection,
  TreeView,
  TreeViewDataItem,
  Label,
  Tooltip,
  Flex,
  FlexItem,
  Button,
  SearchInput,
  Switch,
  Title,
  Divider,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Card,
  CardBody,
  Grid,
  GridItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  PaginationVariant,
  Checkbox,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Select,
  SelectOption,
  SelectList,
  ExpandableSection,
  Split,
  SplitItem,
  Content,
  Tabs,
  Tab,
  TabTitleText,
  Breadcrumb,
  BreadcrumbItem,
  Nav,
  NavList,
  NavItem,
} from '@patternfly/react-core';
import {
  ServerIcon,
  ProjectDiagramIcon,
  DesktopIcon,
  MulticlusterIcon,
  AngleLeftIcon,
  AngleRightIcon,
  AngleDoubleDownIcon,
  AngleDoubleUpIcon,
  PlusCircleIcon,
  CaretDownIcon,
  ColumnsIcon,
  ExclamationCircleIcon,
  SyncAltIcon,
  OffIcon,
  PauseCircleIcon,
  EllipsisVIcon,
  LongArrowAltUpIcon,
  LongArrowAltDownIcon,
  PlayIcon,
  StopIcon,
  PauseIcon,
  SyncAltIcon as RefreshIcon,
  ExternalLinkAltIcon,
  CopyIcon,
  InfoCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowsAltVIcon,
  CogIcon,
  TimesIcon,
  TrashIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import './VirtualMachines.css';

// Mock data structure - in a real app, this would come from your data layer
// Generate 15 clusters, each with 20 projects, and 0-80 VMs per project
// Using a seeded random function for consistent results and better performance
const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

const generateMockData = () => {
  const statuses = ['Migrating', 'Paused', 'Provisioning', 'Running', 'Starting', 'Stopped', 'Stopping', 'Terminating', 'Unknown', 'WaitingForVolumeBinding', 'Error'];
  
  // Telco cluster names (regional/data center names)
  const clusterNames = [
    'us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1',
    'ap-northeast-1', 'sa-east-1', 'ca-central-1', 'eu-north-1', 'ap-south-1',
    'us-central-1', 'eu-west-2', 'ap-southeast-2', 'me-south-1', 'af-south-1'
  ];
  
  // Telco project/service names
  const projectNames = [
    '5G Core Network', 'VoLTE Services', 'Billing System', 'Customer Portal',
    'Network Management', 'OSS/BSS Platform', 'CDN Services', 'IoT Gateway',
    'SMS Gateway', 'MMS Services', 'Roaming Services', 'Authentication Server',
    'Policy Control', 'Charging System', 'Subscriber Database', 'API Gateway',
    'Analytics Platform', 'Monitoring System', 'Backup Services', 'Security Services'
  ];
  
  // VM name prefixes based on service types
  const vmNamePrefixes: { [key: string]: string[] } = {
    '5G Core Network': ['5gc-smf', '5gc-amf', '5gc-upf', '5gc-ausf', '5gc-udm'],
    'VoLTE Services': ['volte-ims', 'volte-sbc', 'volte-mrf', 'volte-as'],
    'Billing System': ['billing-db', 'billing-app', 'billing-api', 'billing-worker'],
    'Customer Portal': ['portal-web', 'portal-api', 'portal-cache', 'portal-lb'],
    'Network Management': ['nms-server', 'nms-db', 'nms-collector', 'nms-ui'],
    'OSS/BSS Platform': ['oss-server', 'bss-server', 'oss-db', 'bss-db'],
    'CDN Services': ['cdn-edge', 'cdn-origin', 'cdn-cache', 'cdn-dns'],
    'IoT Gateway': ['iot-gateway', 'iot-broker', 'iot-processor', 'iot-storage'],
    'SMS Gateway': ['sms-gateway', 'sms-router', 'sms-db', 'sms-queue'],
    'MMS Services': ['mms-server', 'mms-storage', 'mms-gateway'],
    'Roaming Services': ['roaming-hub', 'roaming-db', 'roaming-gateway'],
    'Authentication Server': ['auth-server', 'auth-db', 'auth-cache'],
    'Policy Control': ['pcrf-server', 'pcrf-db', 'pcrf-cache'],
    'Charging System': ['ocs-server', 'ocs-db', 'ocs-queue'],
    'Subscriber Database': ['hss-server', 'hss-db', 'hss-backup'],
    'API Gateway': ['api-gateway', 'api-lb', 'api-cache'],
    'Analytics Platform': ['analytics-spark', 'analytics-kafka', 'analytics-db'],
    'Monitoring System': ['monitoring-prometheus', 'monitoring-grafana', 'monitoring-alert'],
    'Backup Services': ['backup-server', 'backup-storage', 'backup-scheduler'],
    'Security Services': ['security-firewall', 'security-ids', 'security-vpn']
  };
  
  const clusters: Array<{
    id: string;
    name: string;
    namespaces: Array<{
      id: string;
      name: string;
      vms: Array<{ id: string; name: string; status: string }>;
    }>;
  }> = [];

  let vmCounter = 1;
  let randomSeed = 12345; // Starting seed

  for (let clusterIndex = 0; clusterIndex < 15; clusterIndex++) {
    const clusterId = `cluster-${clusterIndex + 1}`;
    const clusterName = clusterNames[clusterIndex] || `cluster-${clusterIndex + 1}`;
    const namespaces: Array<{
      id: string;
      name: string;
      vms: Array<{ id: string; name: string; status: string }>;
    }> = [];

    // Reduced to 10 projects per cluster to prevent performance issues
    // 15 clusters × 10 projects × 3 VMs = 450 VMs max
    for (let projectIndex = 0; projectIndex < 10; projectIndex++) {
        const namespaceId = `ns-cluster-${clusterIndex + 1}-project-${projectIndex + 1}`;
        const projectName = projectNames[(clusterIndex * 10 + projectIndex) % projectNames.length];
        const namespaceName = projectName;
        const random = seededRandom(randomSeed++);
        const numVMs = Math.floor(random() * 81); // Random 0-80 (for data simulation)
        const vms: Array<{ id: string; name: string; status: string }> = [];
        
        // Limit to prevent performance issues - cap at 3 VMs per project for rendering
        // This gives us max 15 clusters × 10 projects × 3 VMs = 450 VMs total
        const maxVMsToRender = Math.min(numVMs, 3);
        
        // Get VM name prefixes for this project
        const prefixes = vmNamePrefixes[projectName] || ['vm'];

      for (let vmIndex = 0; vmIndex < maxVMsToRender; vmIndex++) {
        const status = statuses[Math.floor(random() * statuses.length)];
        const prefix = prefixes[vmIndex % prefixes.length];
        const vmNumber = String(Math.floor(vmCounter / prefixes.length) + 1).padStart(2, '0');
        const vmName = `${prefix}-${vmNumber}`;
        
        vms.push({
          id: `vm-${vmCounter}`,
          name: vmName,
          status: status,
        });
        vmCounter++;
      }

      namespaces.push({
        id: namespaceId,
        name: namespaceName,
        vms: vms,
      });
    }

    clusters.push({
      id: clusterId,
      name: clusterName,
      namespaces: namespaces,
    });
  }

  // Wrap in cluster sets structure (even though we don't show cluster sets in the tree)
  return [
    {
      id: 'cs-all',
      name: 'All Clusters',
      clusters: clusters,
    },
  ];
};

// Generate data once and cache it
const mockClusterSets = generateMockData();

const VirtualMachines: React.FunctionComponent = () => {
  useDocumentTitle('Virtual machines');

  const [selectedTreeNode, setSelectedTreeNode] = React.useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = React.useState('');
  const [showOnlyWithVMs, setShowOnlyWithVMs] = React.useState(true);
  const [isTreeExpanded, setIsTreeExpanded] = React.useState(true);
  const [sidebarWidth, setSidebarWidth] = React.useState(350);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('All');
  const [osFilter, setOSFilter] = React.useState<string>('All');
  const [clusterFilter, setClusterFilter] = React.useState<string>('All');
  const [projectFilter, setProjectFilter] = React.useState<string | string[]>('All');
  const [isClusterFilterOpen, setIsClusterFilterOpen] = React.useState(false);
  const [isProjectFilterOpen, setIsProjectFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [selectedVMs, setSelectedVMs] = React.useState<string[]>([]);
  const [isSummaryExpanded, setIsSummaryExpanded] = React.useState(true);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isBulkSelectOpen, setIsBulkSelectOpen] = React.useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = React.useState(false);
  const [isOSFilterOpen, setIsOSFilterOpen] = React.useState(false);
  const [isToolbarActionsOpen, setIsToolbarActionsOpen] = React.useState(false);
  const [isManageColumnsOpen, setIsManageColumnsOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<string>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [openRowMenuId, setOpenRowMenuId] = React.useState<string | null>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = React.useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = React.useState(false);
  const [isAdvancedSearchActive, setIsAdvancedSearchActive] = React.useState(false);
  const [expandedNodes, setExpandedNodes] = React.useState<string[]>([]);
  const [treeKey, setTreeKey] = React.useState(0);
  const [selectedVMDetails, setSelectedVMDetails] = React.useState<string | null>(null);
  const [vmDetailsActiveTab, setVmDetailsActiveTab] = React.useState<string>('overview');
  const searchInputRef = React.useRef<HTMLDivElement>(null);
  
  // Saved searches
  const [savedSearches, setSavedSearches] = React.useState<Array<{
    id: string;
    name: string;
    description: string;
    // Advanced search parameters
    advancedSearchName: string;
    advancedSearchCluster: string;
    advancedSearchProject: string;
    advancedSearchDescription: string;
    advancedSearchStatus: string;
    advancedSearchOS: string;
    advancedSearchVCPUOperator: string;
    advancedSearchVCPUValue: string;
    advancedSearchMemoryOperator: string;
    advancedSearchMemoryValue: string;
    advancedSearchMemoryUnit: string;
    advancedSearchStorageClass: string;
    advancedSearchGPU: boolean;
    advancedSearchHostDevices: boolean;
    advancedSearchDateCreated: string;
    advancedSearchIPAddress: string;
  }>>([]);
  const [isSaveSearchModalOpen, setIsSaveSearchModalOpen] = React.useState(false);
  const [saveSearchName, setSaveSearchName] = React.useState('');
  const [saveSearchDescription, setSaveSearchDescription] = React.useState('');
  const [isSavedSearchesOpen, setIsSavedSearchesOpen] = React.useState(false);

  // Advanced search form state
  const [advancedSearchName, setAdvancedSearchName] = React.useState('');
  const [advancedSearchCluster, setAdvancedSearchCluster] = React.useState('all');
  const [advancedSearchProject, setAdvancedSearchProject] = React.useState('all');
  const [advancedSearchDescription, setAdvancedSearchDescription] = React.useState('');
  const [advancedSearchStatus, setAdvancedSearchStatus] = React.useState('');
  const [advancedSearchOS, setAdvancedSearchOS] = React.useState('');
  const [advancedSearchVCPUOperator, setAdvancedSearchVCPUOperator] = React.useState('greater');
  const [advancedSearchVCPUValue, setAdvancedSearchVCPUValue] = React.useState('');
  const [advancedSearchMemoryOperator, setAdvancedSearchMemoryOperator] = React.useState('greater');
  const [advancedSearchMemoryValue, setAdvancedSearchMemoryValue] = React.useState('');
  const [advancedSearchMemoryUnit, setAdvancedSearchMemoryUnit] = React.useState('GiB');
  const [advancedSearchStorageClass, setAdvancedSearchStorageClass] = React.useState('');
  const [advancedSearchGPU, setAdvancedSearchGPU] = React.useState(false);
  const [advancedSearchHostDevices, setAdvancedSearchHostDevices] = React.useState(false);
  const [advancedSearchDateCreated, setAdvancedSearchDateCreated] = React.useState('any');
  const [advancedSearchIPAddress, setAdvancedSearchIPAddress] = React.useState('');
  const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(true);
  const [isNetworkExpanded, setIsNetworkExpanded] = React.useState(false);

  // Advanced search dropdown states
  const [isAdvSearchClusterOpen, setIsAdvSearchClusterOpen] = React.useState(false);
  const [isAdvSearchProjectOpen, setIsAdvSearchProjectOpen] = React.useState(false);
  const [isAdvSearchStatusOpen, setIsAdvSearchStatusOpen] = React.useState(false);
  const [isAdvSearchOSOpen, setIsAdvSearchOSOpen] = React.useState(false);
  const [isAdvSearchVCPUOpOpen, setIsAdvSearchVCPUOpOpen] = React.useState(false);
  const [isAdvSearchMemoryOpOpen, setIsAdvSearchMemoryOpOpen] = React.useState(false);
  const [isAdvSearchMemoryUnitOpen, setIsAdvSearchMemoryUnitOpen] = React.useState(false);
  const [isAdvSearchStorageOpen, setIsAdvSearchStorageOpen] = React.useState(false);
  const [isAdvSearchDateOpen, setIsAdvSearchDateOpen] = React.useState(false);
  
  // Advanced search results page filter dropdown states
  const [isAdvSearchResultsClusterOpen, setIsAdvSearchResultsClusterOpen] = React.useState(false);
  const [isAdvSearchResultsProjectOpen, setIsAdvSearchResultsProjectOpen] = React.useState(false);
  const [isAdvSearchResultsStorageClassOpen, setIsAdvSearchResultsStorageClassOpen] = React.useState(false);
  const [isAdvSearchResultsHardwareOpen, setIsAdvSearchResultsHardwareOpen] = React.useState(false);
  const [isAdvSearchResultsSchedulingOpen, setIsAdvSearchResultsSchedulingOpen] = React.useState(false);
  const [isAdvSearchResultsNodeOpen, setIsAdvSearchResultsNodeOpen] = React.useState(false);

  // Helper function to get all cluster sets, clusters, namespaces, and VMs from mock data
  const getAllClusterSets = () => mockClusterSets;
  const getAllClusters = () => {
    const clusters: Array<{ id: string; name: string; clusterSetId: string }> = [];
    mockClusterSets.forEach(cs => {
      cs.clusters.forEach(c => {
        clusters.push({ id: c.id, name: c.name, clusterSetId: cs.id });
      });
    });
    return clusters;
  };
  const getAllNamespaces = () => {
    const namespaces: Array<{ id: string; name: string; clusterId: string }> = [];
    mockClusterSets.forEach(cs => {
      cs.clusters.forEach(cluster => {
        cluster.namespaces.forEach(ns => {
          namespaces.push({ id: ns.id, name: ns.name, clusterId: cluster.id });
        });
      });
    });
    return namespaces;
  };
  const getAllVirtualMachines = () => {
    const vms: Array<{ id: string; name: string; clusterId: string; namespaceId: string; labels?: string[] }> = [];
    mockClusterSets.forEach(cs => {
      cs.clusters.forEach(cluster => {
        cluster.namespaces.forEach(ns => {
          ns.vms.forEach(vm => {
            // Add mock labels for each VM
            const labels = [
              `app=${vm.name.toLowerCase().replace('vm-', 'app-')}`,
              `env=${ns.name.toLowerCase().includes('prod') ? 'production' : 'development'}`,
              `cluster=${cluster.name.toLowerCase().replace(/\s+/g, '-')}`,
            ];
            vms.push({ id: vm.id, name: vm.name, clusterId: cluster.id, namespaceId: ns.id, labels });
          });
        });
      });
    });
    return vms;
  };
  const getVirtualMachinesByNamespace = (namespaceId: string) => {
    const vms: Array<{ id: string; name: string }> = [];
    mockClusterSets.forEach(cs => {
      cs.clusters.forEach(cluster => {
        const ns = cluster.namespaces.find(n => n.id === namespaceId);
        if (ns) {
          ns.vms.forEach(vm => {
            vms.push({ id: vm.id, name: vm.name });
          });
        }
      });
    });
    return vms;
  };

  // Get all VMs based on selection
  const getAllVMs = React.useMemo(() => {
    let vms: Array<{ 
      id: string; 
      name: string; 
      status: string; 
      namespace: string; 
      cluster: string; 
      labels?: string[];
      conditions?: string;
      node?: string;
      ipAddress?: string;
      storageClass?: string;
    }> = [];
    
    // Only get labels when needed - optimize by building a map
    const labelsMap = new Map<string, string[]>();
    getAllVirtualMachines().forEach(vm => {
      labelsMap.set(vm.id, vm.labels || []);
    });
    
    // Process VMs more efficiently - only process what we need
    let vmCounter = 0;
    mockClusterSets.forEach(clusterSet => {
      clusterSet.clusters.forEach(cluster => {
        cluster.namespaces.forEach(namespace => {
            namespace.vms.forEach((vm, vmIndex) => {
              const labels = labelsMap.get(vm.id) || [];
              // Generate mock data for new fields
              const conditions = vm.status === 'Running' || vm.status === 'Stopped' ? 'LiveMigratable=True' : '';
              const node = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `ip-10-0-8-${137 + vmCounter}.ec2.internal` : undefined;
              const ipAddress = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `10.131.1.${179 + vmCounter}` : undefined;
              const storageClass = vmCounter % 2 === 0 ? (vmCounter % 4 === 0 ? 'ocs-storagecluster-ceph-rbd-virtualization' : 'gp3-csi') : undefined;
              
              vms.push({
                id: vm.id,
                name: vm.name,
                status: vm.status,
                namespace: namespace.name,
                cluster: cluster.name,
                labels,
                conditions,
                node,
                ipAddress,
                storageClass,
              });
              vmCounter++;
            });
        });
      });
    });

    // Filter based on selected tree node
    if (selectedTreeNode) {
      if (selectedTreeNode.startsWith('clusterset-')) {
        const clusterSetId = selectedTreeNode.replace('clusterset-', '');
        const clusterSet = mockClusterSets.find(cs => cs.id === clusterSetId);
        if (clusterSet) {
          vms = [];
          let vmCounter = 0;
          clusterSet.clusters.forEach(cluster => {
            cluster.namespaces.forEach(namespace => {
              namespace.vms.forEach((vm) => {
                const labels = labelsMap.get(vm.id) || [];
                const conditions = vm.status === 'Running' || vm.status === 'Stopped' ? 'LiveMigratable=True' : '';
                const node = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `ip-10-0-8-${137 + vmCounter}.ec2.internal` : undefined;
                const ipAddress = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `10.131.1.${179 + vmCounter}` : undefined;
                const storageClass = vmCounter % 2 === 0 ? (vmCounter % 4 === 0 ? 'ocs-storagecluster-ceph-rbd-virtualization' : 'gp3-csi') : undefined;
                vms.push({
                  id: vm.id,
                  name: vm.name,
                  status: vm.status,
                  namespace: namespace.name,
                  cluster: cluster.name,
                  labels,
                  conditions,
                  node,
                  ipAddress,
                  storageClass,
                });
                vmCounter++;
              });
            });
          });
        }
      } else if (selectedTreeNode.startsWith('cluster-')) {
        const clusterId = selectedTreeNode.replace('cluster-', '');
        vms = [];
        let vmCounter = 0;
        mockClusterSets.forEach(clusterSet => {
          const cluster = clusterSet.clusters.find(c => c.id === clusterId);
          if (cluster) {
            cluster.namespaces.forEach(namespace => {
              namespace.vms.forEach((vm) => {
                const labels = labelsMap.get(vm.id) || [];
                const conditions = vm.status === 'Running' || vm.status === 'Stopped' ? 'LiveMigratable=True' : '';
                const node = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `ip-10-0-8-${137 + vmCounter}.ec2.internal` : undefined;
                const ipAddress = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `10.131.1.${179 + vmCounter}` : undefined;
                const storageClass = vmCounter % 2 === 0 ? (vmCounter % 4 === 0 ? 'ocs-storagecluster-ceph-rbd-virtualization' : 'gp3-csi') : undefined;
                vms.push({
                  id: vm.id,
                  name: vm.name,
                  status: vm.status,
                  namespace: namespace.name,
                  cluster: cluster.name,
                  labels,
                  conditions,
                  node,
                  ipAddress,
                  storageClass,
                });
                vmCounter++;
              });
            });
          }
        });
      } else if (selectedTreeNode.startsWith('namespace-')) {
        const namespaceId = selectedTreeNode.replace('namespace-', '');
        vms = [];
        let vmCounter = 0;
        mockClusterSets.forEach(clusterSet => {
          clusterSet.clusters.forEach(cluster => {
            const namespace = cluster.namespaces.find(ns => ns.id === namespaceId);
            if (namespace) {
              namespace.vms.forEach((vm) => {
                const labels = labelsMap.get(vm.id) || [];
                const conditions = vm.status === 'Running' || vm.status === 'Stopped' ? 'LiveMigratable=True' : '';
                const node = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `ip-10-0-8-${137 + vmCounter}.ec2.internal` : undefined;
                const ipAddress = (vm.status === 'Running' || vm.status === 'Starting' || vm.status === 'Migrating') ? `10.131.1.${179 + vmCounter}` : undefined;
                const storageClass = vmCounter % 2 === 0 ? (vmCounter % 4 === 0 ? 'ocs-storagecluster-ceph-rbd-virtualization' : 'gp3-csi') : undefined;
                vms.push({
                  id: vm.id,
                  name: vm.name,
                  status: vm.status,
                  namespace: namespace.name,
                  cluster: cluster.name,
                  labels,
                  conditions,
                  node,
                  ipAddress,
                  storageClass,
                });
                vmCounter++;
              });
            }
          });
        });
      }
    }

    return vms;
  }, [selectedTreeNode]);

  // Sort icon component
  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? <LongArrowAltUpIcon /> : <LongArrowAltDownIcon />;
    }
    return <ArrowsAltVIcon style={{ opacity: 0.4, fontSize: '0.875em' }} />;
  };

  // Sort handler
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Close search menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchMenuOpen && searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        const dropdown = document.querySelector('.search-dropdown-menu');
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setIsSearchMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchMenuOpen]);

  // Determine selected cluster and project from tree selection
  const selectedClusterFromTree = React.useMemo(() => {
    if (selectedTreeNode?.startsWith('cluster-')) {
      const clusterId = selectedTreeNode.replace('cluster-', '');
      const cluster = getAllClusters().find(c => c.id === clusterId);
      return cluster?.name || null;
    }
    return null;
  }, [selectedTreeNode]);

  const selectedProjectFromTree = React.useMemo(() => {
    if (selectedTreeNode?.startsWith('namespace-')) {
      const namespaceId = selectedTreeNode.replace('namespace-', '');
      const namespace = getAllNamespaces().find(n => n.id === namespaceId);
      return namespace?.name || null;
    }
    // If a cluster is selected, we might want to show all projects in that cluster
    if (selectedTreeNode?.startsWith('cluster-')) {
      return null; // Show all projects in the cluster
    }
    return null;
  }, [selectedTreeNode]);

  // When a project is selected, find its cluster to show in the cluster chip
  const clusterForSelectedProject = React.useMemo(() => {
    if (selectedProjectFromTree) {
      const namespace = getAllNamespaces().find(n => n.name === selectedProjectFromTree);
      if (namespace) {
        const cluster = getAllClusters().find(c => c.id === namespace.clusterId);
        return cluster?.name || null;
      }
    }
    return null;
  }, [selectedProjectFromTree]);

  // Filter and sort VMs
  const filteredVMs = React.useMemo(() => {
    let vms = getAllVMs.filter(vm => {
      // Apply cluster filter (from tree or dropdown, or from selected project's cluster)
      const effectiveClusterFilter = selectedClusterFromTree || clusterForSelectedProject || clusterFilter;
      if (effectiveClusterFilter && effectiveClusterFilter !== 'All' && vm.cluster !== effectiveClusterFilter) {
        return false;
      }
      
      // Apply project filter (from tree or dropdown)
      if (selectedProjectFromTree) {
        // If a project is selected from tree, only show that project
        if (vm.namespace !== selectedProjectFromTree) {
          return false;
        }
      } else if (projectFilter !== 'All') {
        // If projects are selected from dropdown (can be array for multi-select)
        if (Array.isArray(projectFilter)) {
          if (projectFilter.length === 0 || !projectFilter.includes(vm.namespace)) {
            return false;
          }
        } else if (vm.namespace !== projectFilter) {
          return false;
        }
      }
      
      // Apply advanced search filters if active
      if (isAdvancedSearchActive) {
        if (advancedSearchName && !vm.name.toLowerCase().includes(advancedSearchName.toLowerCase())) {
          return false;
        }
        if (advancedSearchCluster !== 'all') {
          const cluster = getAllClusters().find(c => c.name === advancedSearchCluster);
          if (!cluster || vm.cluster !== cluster.name) {
            return false;
          }
        }
        if (advancedSearchProject !== 'all') {
          const project = getAllNamespaces().find(n => n.name === advancedSearchProject);
          if (!project || vm.namespace !== project.name) {
            return false;
          }
        }
        if (advancedSearchStatus && vm.status !== advancedSearchStatus) {
          return false;
        }
        if (advancedSearchIPAddress && !vm.name.toLowerCase().includes(advancedSearchIPAddress.toLowerCase())) {
          return false;
        }
      }

      const matchesStatus = statusFilter === 'All' || vm.status === statusFilter;
      // Search in VM name and labels
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = !searchValue || 
        vm.name.toLowerCase().includes(searchLower) ||
        (vm.labels && vm.labels.some(label => label.toLowerCase().includes(searchLower)));
      return matchesStatus && matchesSearch;
    });

    // Sort VMs
    vms.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof typeof a] as string | number;
      let bValue: string | number = b[sortBy as keyof typeof b] as string | number;

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return vms;
  }, [getAllVMs, isAdvancedSearchActive, advancedSearchCluster, advancedSearchProject, advancedSearchStatus, advancedSearchOS, advancedSearchVCPUOperator, advancedSearchVCPUValue, advancedSearchMemoryOperator, advancedSearchMemoryValue, advancedSearchName, advancedSearchIPAddress, statusFilter, osFilter, clusterFilter, projectFilter, selectedClusterFromTree, clusterForSelectedProject, selectedProjectFromTree, searchValue, sortBy, sortDirection]);

  // Pagination
  const paginatedVMs = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredVMs.slice(start, start + perPage);
  }, [filteredVMs, page, perPage]);

  // Status counts
  const vmStatusCounts = React.useMemo(() => {
    const counts = { 
      Migrating: 0, 
      Paused: 0, 
      Provisioning: 0, 
      Running: 0, 
      Starting: 0, 
      Stopped: 0, 
      Stopping: 0, 
      Terminating: 0, 
      Unknown: 0, 
      WaitingForVolumeBinding: 0, 
      Error: 0 
    };
    getAllVMs.forEach(vm => {
      if (vm.status in counts) {
        counts[vm.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [getAllVMs]);

  const availableStatuses = ['All', 'Migrating', 'Paused', 'Provisioning', 'Running', 'Starting', 'Stopped', 'Stopping', 'Terminating', 'Unknown', 'WaitingForVolumeBinding', 'Error'];
  const availableOSs = ['All', 'RHEL', 'CentOS', 'Ubuntu'];

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.classList.remove('resizing-sidebar');
    };

    if (isResizing) {
      document.body.classList.add('resizing-sidebar');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.classList.remove('resizing-sidebar');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const treeData: TreeViewDataItem[] = React.useMemo(() => {
    const buildTreeData = (): TreeViewDataItem[] => {
      const searchLower = sidebarSearch.toLowerCase().trim();
      
      // Flatten all clusters from all cluster sets
      const allClusters = mockClusterSets.flatMap(clusterSet => clusterSet.clusters);
      
      const clusterNodes = allClusters
        .map(cluster => {
          // Filter namespaces/projects
          const matchingNamespaces = cluster.namespaces.filter(namespace => {
            // Filter by showOnlyWithVMs
            if (showOnlyWithVMs && namespace.vms.length === 0) {
              return false;
            }
            // Filter by search query (search in project/namespace name)
            if (searchLower) {
              return namespace.name.toLowerCase().includes(searchLower);
            }
            return true;
          });
          
          // Only include cluster if it has matching namespaces
          if (matchingNamespaces.length === 0) {
            return null;
          }
          
          const clusterId = `cluster-${cluster.id}`;
          const isSelected = selectedTreeNode === clusterId;

          return {
            name: (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  paddingRight: '16px',
                  backgroundColor: isSelected ? '#E7F1FA' : 'transparent',
                  padding: '4px 8px',
                  margin: '0 -8px',
                  borderRadius: '4px',
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tooltip content="Cluster">
                    <ServerIcon />
                  </Tooltip>
                  <span>{cluster.name}</span>
                </span>
              </div>
            ),
            id: clusterId,
            defaultExpanded: expandedNodes.length > 0
              ? expandedNodes.includes(`cluster-${cluster.id}`)
              : isTreeExpanded || searchLower.length > 0, // Auto-expand when searching
            children: matchingNamespaces.map(namespace => {
              const namespaceId = `namespace-${namespace.id}`;
              const isSelected = selectedTreeNode === namespaceId;

              return {
                name: (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      paddingRight: '16px',
                      backgroundColor: isSelected ? '#E7F1FA' : 'transparent',
                      padding: '4px 8px',
                      margin: '0 -8px',
                      borderRadius: '4px',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedTreeNode(namespaceId);
                      setPage(1);
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tooltip content="Project">
                        <ProjectDiagramIcon />
                      </Tooltip>
                      <span>{namespace.name}</span>
                    </span>
                    <Label isCompact color="grey" style={{ flexShrink: 0 }}>
                      {namespace.vms.length}
                    </Label>
                  </div>
                ),
                id: namespaceId,
                defaultExpanded: expandedNodes.length > 0
                  ? expandedNodes.includes(`namespace-${namespace.id}`)
                  : isTreeExpanded,
                // Don't render VMs in the tree view to prevent performance issues
                // VMs will be shown in the table when a project is selected
                children: [],
              };
            }),
          };
        })
        .filter(item => item !== null) as TreeViewDataItem[];

      // Wrap all clusters in an "All clusters" parent node
      return [{
        name: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              margin: '0 -8px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            <Tooltip content="All clusters">
              <ServerIcon />
            </Tooltip>
            <span>All clusters</span>
          </div>
        ),
        id: 'all-clusters',
        defaultExpanded: expandedNodes.length > 0
          ? expandedNodes.includes('all-clusters')
          : isTreeExpanded || searchLower.length > 0,
        children: clusterNodes,
      }];
    };

    return buildTreeData();
  }, [selectedTreeNode, showOnlyWithVMs, isTreeExpanded, expandedNodes, sidebarSearch]);

  const sidebar = (
    <div className="vm-sidebar" style={{ width: `${sidebarWidth}px`, minWidth: '200px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '16px', flexShrink: 0 }}>
        <SearchInput
          placeholder="Search projects..."
          value={sidebarSearch}
          onChange={(_event, value) => {
            setSidebarSearch(value);
          }}
          onClear={() => {
            setSidebarSearch('');
          }}
        />
      </div>

      <div style={{ marginBottom: '16px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ flex: 1 }}>Show only projects with VirtualMachines</span>
        <Switch
          id="show-vms-only"
          isChecked={showOnlyWithVMs}
          onChange={(_event, checked) => setShowOnlyWithVMs(checked)}
        />
      </div>

      <Divider style={{ margin: '16px calc(-16px - 8px) 16px -16px', width: 'calc(100% + 32px + 8px)', flexShrink: 0 }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          marginBottom: '16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tooltip content={isTreeExpanded ? 'Collapse all' : 'Expand all'}>
            <Button
              variant="plain"
              aria-label={isTreeExpanded ? 'Collapse all' : 'Expand all'}
              onClick={() => {
                setIsTreeExpanded(!isTreeExpanded);
              }}
              style={{ padding: '4px' }}
            >
              {isTreeExpanded ? <AngleDoubleUpIcon /> : <AngleDoubleDownIcon />}
            </Button>
          </Tooltip>
          <span style={{ fontWeight: 500 }}>Projects</span>
        </div>
        <Button variant="link" icon={<PlusCircleIcon />} iconPosition="start">
          Create project
        </Button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <TreeView
          key={treeKey}
          data={treeData}
          onSelect={(_event, item) => {
            if (item.id) {
              // Don't allow selection of namespace or all-clusters nodes
              if (item.id.startsWith('namespace-') || item.id === 'all-clusters') {
                return;
              }
              setSelectedTreeNode(item.id);
              setPage(1);
              // If a cluster is selected, clear project filter to enable multi-select
              if (item.id.startsWith('cluster-')) {
                setProjectFilter('All');
              }
              // If it's a VM, show the details panel
              if (item.id.startsWith('vm-')) {
                setSelectedVMDetails(item.id.replace('vm-', ''));
                setVmDetailsActiveTab('overview');
              } else {
                setSelectedVMDetails(null);
              }
            }
          }}
        />
      </div>

      <div
        className="sidebar-resize-handle"
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          cursor: 'col-resize',
        }}
      >
        <div
          className="resize-grip"
          style={{
            position: 'absolute',
            right: '-2px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '60px',
            cursor: 'col-resize',
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="vm-page">
      <div className="vm-header">
        <div>
          <Flex
            alignItems={{ default: 'alignItemsCenter' }}
            spaceItems={{ default: 'spaceItemsLg' }}
            flexWrap={{ default: 'nowrap' }}
            justifyContent={{ default: 'justifyContentSpaceBetween' }}
          >
            <FlexItem>
              <Title headingLevel="h1" size="2xl">
                Virtual machines
              </Title>
            </FlexItem>
            <FlexItem flex={{ default: 'flex_1' }}>
              <div style={{ position: 'relative' }}>
                <div ref={searchInputRef}>
                  <SearchInput
                    placeholder="Search Virtual Machines and labels..."
                    value={searchValue}
                    onChange={(_event, value) => {
                      setSearchValue(value);
                      setIsSearchMenuOpen(value.length > 0);
                    }}
                    onClear={() => {
                      setSearchValue('');
                      setIsSearchMenuOpen(false);
                    }}
                    onFocus={() => {
                      if (searchValue.length > 0) {
                        setIsSearchMenuOpen(true);
                      }
                    }}
                  />
                </div>
                {isSearchMenuOpen && (() => {
                  const searchLower = searchValue.toLowerCase();
                  
                  // Search virtual machines by name and labels
                  const matchingVMs = getAllVirtualMachines()
                    .filter(vm => {
                      const nameMatch = vm.name.toLowerCase().includes(searchLower);
                      const labelMatch = vm.labels?.some(label => label.toLowerCase().includes(searchLower));
                      return nameMatch || labelMatch;
                    })
                    .slice(0, 10);

                  // Get all unique labels that match the search
                  const allVMs = getAllVirtualMachines();
                  const matchingLabels = new Set<string>();
                  allVMs.forEach(vm => {
                    vm.labels?.forEach(label => {
                      if (label.toLowerCase().includes(searchLower)) {
                        matchingLabels.add(label);
                      }
                    });
                  });

                  // Don't show dropdown if search is empty
                  if (searchValue.length === 0) {
                    return null;
                  }

                  if (matchingVMs.length === 0 && matchingLabels.size === 0) {
                    return (
                      <div
                        className="search-dropdown-menu"
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          zIndex: 1000,
                          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                          border: '1px solid var(--pf-t--global--border--color--default)',
                          borderRadius: '4px',
                          boxShadow: 'var(--pf-t--global--box-shadow--md)',
                        }}
                      >
                        <div style={{ 
                          padding: '32px 16px',
                          textAlign: 'center',
                        }}>
                          <div style={{ 
                            marginBottom: '12px',
                            color: 'var(--pf-t--global--text--color--default)',
                            fontSize: '0.875rem',
                          }}>
                            No results found for "{searchValue}"
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            color: 'var(--pf-t--global--text--color--default)',
                            fontSize: '0.875rem',
                          }}>
                            <span>Try using the</span>
                            <Button
                              variant="link"
                              onClick={() => {
                                setIsAdvancedSearchOpen(true);
                                setIsSearchMenuOpen(false);
                              }}
                              style={{
                                padding: 0,
                                fontSize: '0.875rem',
                                color: 'var(--pf-t--global--color--brand--default)',
                                textDecoration: 'underline',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              advanced search
                              <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512">
                                <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      className="search-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        zIndex: 1000,
                        maxHeight: '500px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                        border: '1px solid var(--pf-t--global--border--color--default)',
                        borderRadius: '4px',
                        boxShadow: 'var(--pf-t--global--box-shadow--md)',
                      }}
                    >
                      {/* All search results section */}
                      {matchingVMs.length > 0 && (
                        <>
                          <div style={{ 
                            padding: '12px 16px', 
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--pf-t--global--color--brand--default)',
                          }}>
                            All search results found for '{searchValue}'
                          </div>
                          <div>
                            {matchingVMs.map(vm => {
                              const vmId = `vm-${vm.id}`;
                              const cluster = getAllClusters().find(c => c.id === vm.clusterId);
                              const project = getAllNamespaces().find(n => n.id === vm.namespaceId);
                              
                              return (
                                <div
                                  key={vm.id}
                                  onClick={() => {
                                    setSelectedTreeNode(vmId);
                                    // Expand parent nodes in tree (no cluster sets anymore)
                                    const nodesToExpand: string[] = [];
                                    if (cluster) {
                                      nodesToExpand.push(`cluster-${cluster.id}`);
                                    }
                                    if (project) {
                                      nodesToExpand.push(`namespace-${project.id}`);
                                    }
                                    nodesToExpand.push(vmId);
                                    setExpandedNodes(nodesToExpand);
                                    setTreeKey(prev => prev + 1);
                                    setSearchValue('');
                                    setIsSearchMenuOpen(false);
                                    setPage(1);
                                  }}
                                  style={{
                                    padding: '8px 16px',
                                    color: 'var(--pf-t--global--color--brand--default)',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--pf-t--global--background--color--primary--hover)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  {vm.name}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {/* Related suggestions section */}
                      {matchingLabels.size > 0 && (
                        <>
                          <Divider style={{ margin: '0' }} />
                          <div style={{ 
                            padding: '12px 16px', 
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--pf-t--global--text--color--default)',
                          }}>
                            Related suggestions
                          </div>
                          <div
                            onClick={() => {
                              setIsAdvancedSearchOpen(true);
                              setIsSearchMenuOpen(false);
                            }}
                            style={{
                              padding: '8px 16px',
                              color: 'var(--pf-t--global--text--color--default)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--pf-t--global--background--color--primary--hover)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            Labels ({matchingLabels.size})
                          </div>
                        </>
                      )}

                      {/* Advanced search button */}
                      <Divider style={{ margin: '0' }} />
                      <div style={{ padding: '12px 16px' }}>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setIsAdvancedSearchOpen(true);
                            setIsSearchMenuOpen(false);
                          }}
                          style={{
                            justifyContent: 'space-between',
                            borderColor: 'var(--pf-t--global--color--brand--default)',
                            color: 'var(--pf-t--global--text--color--default)',
                          }}
                        >
                          Advanced search
                          <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" style={{ marginLeft: '8px' }}>
                            <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </FlexItem>
            <FlexItem>
              <Button
                variant="control"
                aria-label="Advanced search"
                onClick={() => setIsAdvancedSearchOpen(true)}
                style={{
                  border: '0.5px solid var(--pf-t--global--border--color--default)',
                  padding: '0.5rem',
                  minWidth: '36px',
                  height: '36px',
                }}
              >
                <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512">
                  <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
                </svg>
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" onClick={() => setIsSaveSearchModalOpen(true)} isDisabled={!isAdvancedSearchActive}>
                Save search
              </Button>
            </FlexItem>
            <FlexItem>
              <Dropdown
                isOpen={isActionsOpen}
                onSelect={() => setIsActionsOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} onClick={() => setIsActionsOpen(!isActionsOpen)} isExpanded={isActionsOpen} variant="secondary">
                    Saved searches
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem isDisabled>
                    <div
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: 'var(--pf-t--global--text--color--subtle)',
                        width: '280px',
                        whiteSpace: 'normal',
                        lineHeight: '1.5',
                      }}
                    >
                      When you search for something and click 'Save search', it'll show up here.
                    </div>
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
            <FlexItem>
              <Divider orientation={{ default: 'vertical' }} />
            </FlexItem>
            <FlexItem>
              <Dropdown
                isOpen={isCreateOpen}
                onSelect={() => setIsCreateOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsCreateOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} onClick={() => setIsCreateOpen(!isCreateOpen)} isExpanded={isCreateOpen} variant="primary">
                    Create
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="from-template">From template</DropdownItem>
                  <DropdownItem key="from-yaml">From YAML</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
          </Flex>

          {/* Divider between header and search results */}
          {isAdvancedSearchActive && (
            <div style={{
              margin: '24px 0',
              borderTop: '1px solid var(--pf-t--global--border--color--default)',
              width: '100%'
            }} />
          )}

          {/* Search Results Toolbar with Filters */}
          {isAdvancedSearchActive && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title headingLevel="h2" size="xl">Search results</Title>
                <Button
                  variant="link"
                  icon={<AngleLeftIcon />}
                  onClick={() => {
                    setIsAdvancedSearchActive(false);
                    setAdvancedSearchName('');
                    setAdvancedSearchCluster('all');
                    setAdvancedSearchProject('all');
                    setAdvancedSearchDescription('');
                    setAdvancedSearchStatus('');
                    setAdvancedSearchOS('');
                    setAdvancedSearchVCPUValue('');
                    setAdvancedSearchMemoryValue('');
                    setAdvancedSearchStorageClass('');
                    setAdvancedSearchGPU(false);
                    setAdvancedSearchHostDevices(false);
                    setAdvancedSearchDateCreated('any');
                    setAdvancedSearchIPAddress('');
                  }}
                >
                  Back to VirtualMachines list
                </Button>
              </div>
              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'nowrap' }}>
                <FlexItem>
                  <Dropdown
                    isOpen={isAdvSearchResultsClusterOpen}
                    onSelect={() => setIsAdvSearchResultsClusterOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsAdvSearchResultsClusterOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsAdvSearchResultsClusterOpen(!isAdvSearchResultsClusterOpen)}
                        isExpanded={isAdvSearchResultsClusterOpen}
                        variant="default"
                      >
                        Cluster: {advancedSearchCluster !== 'all' ? advancedSearchCluster : 'All'}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="all"
                        onClick={() => {
                          setAdvancedSearchCluster('all');
                          setIsAdvSearchResultsClusterOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-cluster-all"
                              isChecked={advancedSearchCluster === 'all'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            All
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      {getAllClusters().map(cluster => (
                        <DropdownItem
                          key={cluster.id}
                          onClick={() => {
                            setAdvancedSearchCluster(cluster.name);
                            setIsAdvSearchResultsClusterOpen(false);
                          }}
                        >
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <Checkbox
                                id={`adv-search-cluster-${cluster.id}`}
                                isChecked={advancedSearchCluster === cluster.name}
                                onChange={() => {}}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FlexItem>
                            <FlexItem>
                              {cluster.name}
                            </FlexItem>
                          </Flex>
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={isAdvSearchResultsProjectOpen}
                    onSelect={() => setIsAdvSearchResultsProjectOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsAdvSearchResultsProjectOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsAdvSearchResultsProjectOpen(!isAdvSearchResultsProjectOpen)}
                        isExpanded={isAdvSearchResultsProjectOpen}
                        variant="default"
                      >
                        Project: {advancedSearchProject !== 'all' ? advancedSearchProject : 'All'}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="all"
                        onClick={() => {
                          setAdvancedSearchProject('all');
                          setIsAdvSearchResultsProjectOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-project-all"
                              isChecked={advancedSearchProject === 'all'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            All
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      {getAllNamespaces()
                        .filter(ns => advancedSearchCluster === 'all' || ns.clusterId === getAllClusters().find(c => c.name === advancedSearchCluster)?.id)
                        .map(namespace => (
                          <DropdownItem
                            key={namespace.id}
                            onClick={() => {
                              setAdvancedSearchProject(namespace.name);
                              setIsAdvSearchResultsProjectOpen(false);
                            }}
                          >
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                <Checkbox
                                  id={`adv-search-project-${namespace.id}`}
                                  isChecked={advancedSearchProject === namespace.name}
                                  onChange={() => {}}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </FlexItem>
                              <FlexItem>
                                {namespace.name}
                              </FlexItem>
                            </Flex>
                          </DropdownItem>
                        ))}
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={isAdvSearchResultsStorageClassOpen}
                    onSelect={() => setIsAdvSearchResultsStorageClassOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsAdvSearchResultsStorageClassOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsAdvSearchResultsStorageClassOpen(!isAdvSearchResultsStorageClassOpen)}
                        isExpanded={isAdvSearchResultsStorageClassOpen}
                        variant="default"
                      >
                        Storage class: {advancedSearchStorageClass || 'All'}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="all"
                        onClick={() => {
                          setAdvancedSearchStorageClass('');
                          setIsAdvSearchResultsStorageClassOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-storage-all"
                              isChecked={!advancedSearchStorageClass}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            All
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="ocs-storagecluster-ceph-rbd-virtualization"
                        onClick={() => {
                          setAdvancedSearchStorageClass('ocs-storagecluster-ceph-rbd-virtualization');
                          setIsAdvSearchResultsStorageClassOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-storage-ocs"
                              isChecked={advancedSearchStorageClass === 'ocs-storagecluster-ceph-rbd-virtualization'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            ocs-storagecluster-ceph-rbd-virtualization
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="gp3-csi"
                        onClick={() => {
                          setAdvancedSearchStorageClass('gp3-csi');
                          setIsAdvSearchResultsStorageClassOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-storage-gp3"
                              isChecked={advancedSearchStorageClass === 'gp3-csi'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            gp3-csi
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={isAdvSearchResultsHardwareOpen}
                    onSelect={() => {}} // Don't close on select for multi-select
                    onOpenChange={(isOpen: boolean) => setIsAdvSearchResultsHardwareOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsAdvSearchResultsHardwareOpen(!isAdvSearchResultsHardwareOpen)}
                        isExpanded={isAdvSearchResultsHardwareOpen}
                        variant="default"
                      >
                        Hardware devices: {advancedSearchGPU || advancedSearchHostDevices ? 'Selected' : 'All'}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="all"
                        onClick={(e) => {
                          e?.stopPropagation();
                          setAdvancedSearchGPU(false);
                          setAdvancedSearchHostDevices(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="hardware-all"
                              isChecked={!advancedSearchGPU && !advancedSearchHostDevices}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            All
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="gpu"
                        onClick={(e) => {
                          e?.stopPropagation();
                          setAdvancedSearchGPU(!advancedSearchGPU);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="hardware-gpu"
                              isChecked={advancedSearchGPU}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            GPU
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="host-devices"
                        onClick={(e) => {
                          e?.stopPropagation();
                          setAdvancedSearchHostDevices(!advancedSearchHostDevices);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="hardware-host-devices"
                              isChecked={advancedSearchHostDevices}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            Host devices
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={isAdvSearchResultsSchedulingOpen}
                    onSelect={() => setIsAdvSearchResultsSchedulingOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsAdvSearchResultsSchedulingOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsAdvSearchResultsSchedulingOpen(!isAdvSearchResultsSchedulingOpen)}
                        isExpanded={isAdvSearchResultsSchedulingOpen}
                        variant="default"
                      >
                        Scheduling: {advancedSearchDateCreated !== 'any' ? advancedSearchDateCreated : 'All'}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="any"
                        onClick={() => {
                          setAdvancedSearchDateCreated('any');
                          setIsAdvSearchResultsSchedulingOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-scheduling-all"
                              isChecked={advancedSearchDateCreated === 'any'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            All
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="last-hour"
                        onClick={() => {
                          setAdvancedSearchDateCreated('last-hour');
                          setIsAdvSearchResultsSchedulingOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-scheduling-hour"
                              isChecked={advancedSearchDateCreated === 'last-hour'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            Last hour
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="last-day"
                        onClick={() => {
                          setAdvancedSearchDateCreated('last-day');
                          setIsAdvSearchResultsSchedulingOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-scheduling-day"
                              isChecked={advancedSearchDateCreated === 'last-day'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            Last day
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="last-week"
                        onClick={() => {
                          setAdvancedSearchDateCreated('last-week');
                          setIsAdvSearchResultsSchedulingOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-scheduling-week"
                              isChecked={advancedSearchDateCreated === 'last-week'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            Last week
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      <DropdownItem
                        key="last-month"
                        onClick={() => {
                          setAdvancedSearchDateCreated('last-month');
                          setIsAdvSearchResultsSchedulingOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-scheduling-month"
                              isChecked={advancedSearchDateCreated === 'last-month'}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            Last month
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={isAdvSearchResultsNodeOpen}
                    onSelect={() => setIsAdvSearchResultsNodeOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsAdvSearchResultsNodeOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsAdvSearchResultsNodeOpen(!isAdvSearchResultsNodeOpen)}
                        isExpanded={isAdvSearchResultsNodeOpen}
                        variant="default"
                      >
                        Node: All
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="all"
                        onClick={() => {
                          setIsAdvSearchResultsNodeOpen(false);
                        }}
                      >
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Checkbox
                              id="adv-search-node-all"
                              isChecked={true}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </FlexItem>
                          <FlexItem>
                            All
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                      {/* Node options would go here - for now just showing All */}
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
              </Flex>
              <Flex style={{ marginTop: '0px' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                {advancedSearchName && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchName('')}
                      closeBtnAriaLabel="Remove name filter"
                    >
                      Name: {advancedSearchName}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchCluster !== 'all' && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchCluster('all')}
                      closeBtnAriaLabel="Remove cluster filter"
                    >
                      Cluster: {advancedSearchCluster}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchProject !== 'all' && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchProject('all')}
                      closeBtnAriaLabel="Remove project filter"
                    >
                      Project: {advancedSearchProject}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchStatus && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchStatus('')}
                      closeBtnAriaLabel="Remove status filter"
                    >
                      Status: {advancedSearchStatus}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchOS && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchOS('')}
                      closeBtnAriaLabel="Remove OS filter"
                    >
                      Operating system: {advancedSearchOS}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchVCPUValue && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchVCPUValue('')}
                      closeBtnAriaLabel="Remove vCPU filter"
                    >
                      vCPU: {advancedSearchVCPUOperator} {advancedSearchVCPUValue}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchMemoryValue && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchMemoryValue('')}
                      closeBtnAriaLabel="Remove memory filter"
                    >
                      Memory: {advancedSearchMemoryOperator} {advancedSearchMemoryValue} {advancedSearchMemoryUnit}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchIPAddress && (
                  <FlexItem>
                    <Label
                      color="grey"
                      onClose={() => setAdvancedSearchIPAddress('')}
                      closeBtnAriaLabel="Remove IP address filter"
                    >
                      IP address: {advancedSearchIPAddress}
                    </Label>
                  </FlexItem>
                )}
                {(advancedSearchName || advancedSearchCluster !== 'all' || advancedSearchProject !== 'all' ||
                  advancedSearchStatus || advancedSearchOS || advancedSearchVCPUValue ||
                  advancedSearchMemoryValue || advancedSearchIPAddress) && (
                    <FlexItem>
                      <Button
                        variant="link"
                        onClick={() => {
                          setAdvancedSearchName('');
                          setAdvancedSearchCluster('all');
                          setAdvancedSearchProject('all');
                          setAdvancedSearchStatus('');
                          setAdvancedSearchOS('');
                          setAdvancedSearchVCPUValue('');
                          setAdvancedSearchMemoryValue('');
                          setAdvancedSearchIPAddress('');
                        }}
                      >
                        Clear all filters
                      </Button>
                    </FlexItem>
                  )}
              </Flex>
            </div>
          )}
        </div>
      </div>

      <div className={`vm-content-wrapper ${isSidebarCollapsed || isAdvancedSearchActive ? 'sidebar-collapsed' : ''}`}>
        {!isSidebarCollapsed && !isAdvancedSearchActive && sidebar}

        {!isAdvancedSearchActive && !isSidebarCollapsed && (
          <Button
            variant="plain"
            className="sidebar-toggle"
            style={{ left: `${sidebarWidth - 14}px` }}
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <AngleRightIcon /> : <AngleLeftIcon />}
          </Button>
        )}

        {!isAdvancedSearchActive && isSidebarCollapsed && (
          <Button
            variant="plain"
            className="sidebar-toggle"
            style={{ left: '0px' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }}
            aria-label="Expand sidebar"
          >
            <AngleRightIcon />
          </Button>
        )}

        <div className="vm-main-content">
          {selectedVMDetails ? (
            // VM Details View
            (() => {
              const vm = getAllVirtualMachines().find(v => v.id === selectedVMDetails);
              if (!vm) return null;
              
              const vmFromMock = mockClusterSets
                .flatMap(cs => cs.clusters)
                .flatMap(c => c.namespaces)
                .flatMap(ns => ns.vms)
                .find(v => v.id === selectedVMDetails);
              
              if (!vmFromMock) return null;
              
              const namespace = getAllNamespaces().find(n => n.id === vm.namespaceId);
              const cluster = getAllClusters().find(c => c.id === vm.clusterId);
              
              return (
                <div style={{ 
                  padding: '24px', 
                  height: '100%', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--pf-t--global--background--color--primary--default)' 
                }}>
                  {/* Breadcrumb */}
                  <Breadcrumb style={{ marginBottom: '16px', flexShrink: 0 }}>
                    <BreadcrumbItem>
                      <Button variant="link" onClick={() => setSelectedVMDetails(null)} style={{ padding: 0 }}>
                        VirtualMachines
                      </Button>
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>VirtualMachine details</BreadcrumbItem>
                  </Breadcrumb>

                  {/* Header */}
                  <div style={{ marginBottom: '16px', flexShrink: 0 }}>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <DesktopIcon style={{ fontSize: '1.5rem', color: 'var(--pf-t--global--icon--color--default)' }} />
                          </FlexItem>
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                              <FlexItem>
                                <Title headingLevel="h1" size="2xl" style={{ margin: 0 }}>
                                  {vm.name}
                                </Title>
                              </FlexItem>
                              <FlexItem>
                                <Label color={
                                  vmFromMock.status === 'Running' ? 'green' : 
                                  vmFromMock.status === 'Stopped' || vmFromMock.status === 'Stopping' || vmFromMock.status === 'Terminating' ? 'grey' : 
                                  vmFromMock.status === 'Error' ? 'red' : 
                                  vmFromMock.status === 'Starting' || vmFromMock.status === 'Provisioning' || vmFromMock.status === 'Migrating' || vmFromMock.status === 'WaitingForVolumeBinding' ? 'blue' :
                                  'orange'
                                }>
                                  {vmFromMock.status}
                                </Label>
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Button variant="plain" aria-label="Stop" style={{ padding: '8px' }}>
                              <StopIcon />
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="plain" aria-label="Restart" style={{ padding: '8px' }}>
                              <RefreshIcon />
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="plain" aria-label="Pause" style={{ padding: '8px' }}>
                              <PauseIcon />
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="plain" aria-label="Start" style={{ padding: '8px' }}>
                              <PlayIcon />
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Dropdown
                              isOpen={isActionsOpen}
                              onSelect={() => setIsActionsOpen(false)}
                              onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setIsActionsOpen(!isActionsOpen)} isExpanded={isActionsOpen} variant="secondary">
                                  Actions
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem key="view">View details</DropdownItem>
                                <DropdownItem key="edit">Edit</DropdownItem>
                                <DropdownItem key="clone">Clone</DropdownItem>
                                <DropdownItem key="delete">Delete</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </div>

                  {/* Tabs */}
                  <Tabs
                    activeKey={vmDetailsActiveTab}
                    onSelect={(_event, tabIndex) => setVmDetailsActiveTab(tabIndex as string)}
                    style={{ marginBottom: '24px', flexShrink: 0 }}
                  >
                    <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>} />
                    <Tab eventKey="metrics" title={<TabTitleText>Metrics</TabTitleText>} />
                    <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} />
                    <Tab eventKey="configuration" title={<TabTitleText>Configuration</TabTitleText>} />
                    <Tab eventKey="events" title={<TabTitleText>Events</TabTitleText>} />
                    <Tab eventKey="console" title={<TabTitleText>Console</TabTitleText>} />
                    <Tab eventKey="snapshots" title={<TabTitleText>Snapshots</TabTitleText>} />
                    <Tab eventKey="diagnostics" title={<TabTitleText>Diagnostics</TabTitleText>} />
                  </Tabs>

                  {/* Content */}
                  {vmDetailsActiveTab === 'overview' && (
                    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                      <Grid hasGutter>
                      {/* Left Column */}
                      <GridItem span={8}>
                        {/* Details */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Details</Title>
                            <Grid hasGutter>
                              <GridItem span={6}>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Name</div>
                                  <div>{vm.name}</div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Folder</div>
                                  <div>-</div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Status</div>
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    <FlexItem>
                                      <Button variant="link" isInline style={{ padding: 0 }}>
                                        {vmFromMock.status}
                                      </Button>
                                    </FlexItem>
                                    <FlexItem>
                                      <InfoCircleIcon style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }} />
                                    </FlexItem>
                                  </Flex>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Created</div>
                                  <div>Nov 19, 2025, 10:56 PM (14 hours ago)</div>
                                </div>
                              </GridItem>
                              <GridItem span={6}>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Operating system</div>
                                  <div>Not available</div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>CPU | Memory</div>
                                  <div>1 CPU | 2 GiB Memory</div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Time zone</div>
                                  <div>-</div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Template</div>
                                  <Button variant="link" isInline style={{ padding: 0 }}>
                                    <span style={{ 
                                      marginRight: '4px', 
                                      display: 'inline-block',
                                      width: '16px',
                                      height: '16px',
                                      lineHeight: '16px',
                                      textAlign: 'center',
                                      backgroundColor: 'var(--pf-t--global--color--brand--default)',
                                      color: 'white',
                                      borderRadius: '2px',
                                      fontSize: '0.75rem',
                                      fontWeight: 600
                                    }}>T</span>
                                    example
                                  </Button>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Hostname</div>
                                  <div>Not available</div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>VNC console</div>
                                  <Button variant="secondary" icon={<ExternalLinkAltIcon />} iconPosition="end">
                                    Open web console
                                  </Button>
                                  <div style={{ marginTop: '16px', height: '200px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '4px' }}></div>
                                </div>
                              </GridItem>
                            </Grid>
                          </CardBody>
                        </Card>

                        {/* Utilization */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Utilization</Title>
                            <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>VirtualMachine is not running</div>
                          </CardBody>
                        </Card>

                        {/* Hardware devices */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Hardware devices (0)</Title>
                            <Tabs activeKey="gpu" style={{ marginBottom: '16px' }}>
                              <Tab eventKey="gpu" title={<TabTitleText>GPU devices (0)</TabTitleText>} />
                              <Tab eventKey="host" title={<TabTitleText>Host devices (0)</TabTitleText>} />
                            </Tabs>
                            <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Not found</div>
                          </CardBody>
                        </Card>

                        {/* File systems */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>File systems (0)</Title>
                            <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>VirtualMachine is not running</div>
                          </CardBody>
                        </Card>

                        {/* Services */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Services (1)</Title>
                          </CardBody>
                        </Card>

                        {/* Active users */}
                        <Card>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Active users (0)</Title>
                            <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>VirtualMachine is not running</div>
                          </CardBody>
                        </Card>
                      </GridItem>

                      {/* Right Column */}
                      <GridItem span={4}>
                        {/* Alerts */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Alerts (0)</Title>
                          </CardBody>
                        </Card>

                        {/* General */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>General</Title>
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Namespace</div>
                              <Label color="green" style={{ marginRight: '4px' }}>NS</Label>
                              <Button variant="link" isInline style={{ padding: 0 }}>
                                {namespace?.name || 'default'}
                              </Button>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Node</div>
                              <div>-</div>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>VirtualMachineInstance</div>
                              <div>-</div>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Pod</div>
                              <div>-</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Owner</div>
                              <div>No owner</div>
                            </div>
                          </CardBody>
                        </Card>

                        {/* Snapshots */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <Title headingLevel="h2" size="lg" style={{ margin: 0 }}>Snapshots (0)</Title>
                              <Button variant="link" isInline>
                                Take snapshot
                              </Button>
                            </div>
                            <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No snapshots found</div>
                          </CardBody>
                        </Card>

                        {/* Network */}
                        <Card style={{ marginBottom: '24px' }}>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Network (1)</Title>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Name</th>
                                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>IP address</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style={{ padding: '8px' }}>
                                    <Button variant="link" isInline style={{ padding: 0 }}>
                                      default
                                    </Button>
                                  </td>
                                  <td style={{ padding: '8px' }}>-</td>
                                </tr>
                              </tbody>
                            </table>
                            <div style={{ marginTop: '12px' }}>
                              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Internal FQDN</div>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>{vm.name}.headl...</FlexItem>
                                <FlexItem>
                                  <Button variant="plain" aria-label="Copy" style={{ padding: '4px' }}>
                                    <CopyIcon />
                                  </Button>
                                </FlexItem>
                              </Flex>
                            </div>
                          </CardBody>
                        </Card>

                        {/* Storage */}
                        <Card>
                          <CardBody>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>Storage (2)</Title>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Name</th>
                                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Drive</th>
                                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Size</th>
                                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Interface</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style={{ padding: '8px' }}>rootdisk</td>
                                  <td style={{ padding: '8px' }}>Disk</td>
                                  <td style={{ padding: '8px' }}>Dynamic</td>
                                  <td style={{ padding: '8px' }}>virtio</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '8px' }}>cloudinitdisk</td>
                                  <td style={{ padding: '8px' }}>Disk</td>
                                  <td style={{ padding: '8px' }}>-</td>
                                  <td style={{ padding: '8px' }}>virtio</td>
                                </tr>
                              </tbody>
                            </table>
                          </CardBody>
                        </Card>
                      </GridItem>
                    </Grid>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <>
          {!isAdvancedSearchActive && isSummaryExpanded && (
            <Card style={{ marginBottom: '16px', flexShrink: 0 }}>
              <CardBody style={{ minHeight: '120px' }}>
                <Flex>
                  <FlexItem flex={{ default: 'flex_1' }} style={{ paddingRight: '24px' }}>
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
                          Virtual Machines ({getAllVMs.length})
                        </Title>
                      </FlexItem>
                      <FlexItem>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                          <FlexItem>
                            <Button variant="plain" onClick={() => setStatusFilter('Error')} style={{ padding: '8px', cursor: 'pointer' }}>
                              <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                  <FlexItem>
                                    <ExclamationCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)', fontSize: '16px' }} />
                                  </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>
                                    {vmStatusCounts.Error}
                                  </FlexItem>
                                </Flex>
                                <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Error</FlexItem>
                              </Flex>
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="plain" onClick={() => setStatusFilter('Running')} style={{ padding: '8px', cursor: 'pointer' }}>
                              <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                  <FlexItem>
                                    <SyncAltIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)', fontSize: '16px' }} />
                                  </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>
                                    {vmStatusCounts.Running}
                                  </FlexItem>
                                </Flex>
                                <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Running</FlexItem>
                              </Flex>
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="plain" onClick={() => setStatusFilter('Stopped')} style={{ padding: '8px', cursor: 'pointer' }}>
                              <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                  <FlexItem>
                                    <OffIcon style={{ color: 'var(--pf-t--global--icon--color--regular)', fontSize: '16px' }} />
                                  </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>
                                    {vmStatusCounts.Stopped}
                                  </FlexItem>
                                </Flex>
                                <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Stopped</FlexItem>
                              </Flex>
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="plain" onClick={() => setStatusFilter('Paused')} style={{ padding: '8px', cursor: 'pointer' }}>
                              <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                  <FlexItem>
                                    <PauseCircleIcon style={{ color: 'var(--pf-t--global--icon--color--regular)', fontSize: '16px' }} />
                                  </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>
                                    {vmStatusCounts.Paused}
                                  </FlexItem>
                                </Flex>
                                <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Paused</FlexItem>
                              </Flex>
                            </Button>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </FlexItem>

                  <Divider orientation={{ default: 'vertical' }} style={{ margin: '0 24px' }} />

                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
                          Usage
                        </Title>
                      </FlexItem>
                      <FlexItem>
                        <Grid>
                          <GridItem span={4}>
                            <Flex direction={{ default: 'column' }}>
                              <FlexItem style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>CPU</FlexItem>
                              <FlexItem style={{ fontSize: '16px' }}>-</FlexItem>
                              <FlexItem style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '4px' }}>
                                Requested of -
                              </FlexItem>
                            </Flex>
                          </GridItem>
                          <GridItem span={4}>
                            <Flex direction={{ default: 'column' }}>
                              <FlexItem style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Memory</FlexItem>
                              <FlexItem style={{ fontSize: '16px' }}>0 B</FlexItem>
                              <FlexItem style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '4px' }}>
                                Used of 0 B
                              </FlexItem>
                            </Flex>
                          </GridItem>
                          <GridItem span={4}>
                            <Flex direction={{ default: 'column' }}>
                              <FlexItem style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Storage</FlexItem>
                              <FlexItem style={{ fontSize: '16px' }}>0 B</FlexItem>
                              <FlexItem style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '4px' }}>
                                Used of 0 B
                              </FlexItem>
                            </Flex>
                          </GridItem>
                        </Grid>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          )}

          {filteredVMs.length === 0 ? (
            <EmptyState>
              <Title headingLevel="h2" size="lg">
                No virtual machines
              </Title>
              <EmptyStateBody>No virtual machines match the selected filters.</EmptyStateBody>
              <EmptyStateActions>
                <Button variant="primary" onClick={() => setStatusFilter('All')}>
                  Clear filters
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : (
            <>
              <Toolbar>
                <ToolbarContent style={{ gap: '8px' }}>
                  {/* Bulk selector */}
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isBulkSelectOpen}
                      onSelect={() => {}}
                      onOpenChange={(isOpen: boolean) => setIsBulkSelectOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsBulkSelectOpen(!isBulkSelectOpen)}
                          isExpanded={isBulkSelectOpen}
                          variant="plain"
                          style={{
                            border: '1px solid var(--pf-t--global--border--color--default)',
                            borderRadius: 'var(--pf-t--global--border--radius--small)',
                            padding: '6px 8px',
                            minWidth: 'auto',
                          }}
                        >
                          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem>
                              <Checkbox
                                id="select-all-vms"
                                isChecked={selectedVMs.length > 0 && selectedVMs.length === paginatedVMs.length}
                                onChange={(event, checked) => {
                                  event.stopPropagation();
                                  if (checked) {
                                    setSelectedVMs(paginatedVMs.map(vm => vm.id));
                                  } else {
                                    setSelectedVMs([]);
                                  }
                                }}
                                aria-label="Select all"
                              />
                            </FlexItem>
                            {selectedVMs.length > 0 && (
                              <FlexItem>
                                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{selectedVMs.length} selected</span>
                              </FlexItem>
                            )}
                            <FlexItem>
                              <CaretDownIcon />
                            </FlexItem>
                          </Flex>
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem key="select-none" onClick={() => setSelectedVMs([])}>
                          Select none
                        </DropdownItem>
                        <DropdownItem key="select-page" onClick={() => setSelectedVMs(paginatedVMs.map(vm => vm.id))}>
                          Select page ({paginatedVMs.length} items)
                        </DropdownItem>
                        <DropdownItem key="select-all" onClick={() => setSelectedVMs(filteredVMs.map(vm => vm.id))}>
                          Select all ({filteredVMs.length} items)
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  {!isAdvancedSearchActive && (
                    <>
                      {/* Cluster dropdown */}
                      <ToolbarItem>
                        <Dropdown
                          isOpen={isClusterFilterOpen}
                          onSelect={() => setIsClusterFilterOpen(false)}
                          onOpenChange={(isOpen: boolean) => setIsClusterFilterOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setIsClusterFilterOpen(!isClusterFilterOpen)}
                              isExpanded={isClusterFilterOpen}
                              variant="default"
                              isDisabled={!!selectedClusterFromTree || !!selectedProjectFromTree}
                              style={{
                                backgroundColor: (selectedClusterFromTree || selectedProjectFromTree || clusterFilter !== 'All') ? 'var(--pf-t--global--background--color--primary--hover)' : undefined
                              }}
                            >
                              Cluster{(selectedClusterFromTree || selectedProjectFromTree || clusterFilter !== 'All') ? ' 1' : ''}
                            </MenuToggle>
                          )}
                        >
                        <DropdownList>
                          <DropdownItem
                            key="all"
                            onClick={() => {
                              setClusterFilter('All');
                              setSelectedTreeNode(null); // Clear tree selection when 'All' is chosen
                              setIsClusterFilterOpen(false);
                            }}
                          >
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                <Checkbox
                                  id="cluster-filter-all"
                                  isChecked={clusterFilter === 'All'}
                                  onChange={() => {}}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </FlexItem>
                              <FlexItem>
                                All
                              </FlexItem>
                            </Flex>
                          </DropdownItem>
                          {getAllClusters().map(cluster => (
                            <DropdownItem
                              key={cluster.id}
                              onClick={() => {
                                setClusterFilter(cluster.name);
                                setSelectedTreeNode(`cluster-${cluster.id}`); // Set tree selection to match
                                setIsClusterFilterOpen(false);
                              }}
                            >
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Checkbox
                                    id={`cluster-filter-${cluster.id}`}
                                    isChecked={clusterFilter === cluster.name}
                                    onChange={() => {}}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </FlexItem>
                                <FlexItem>
                                  {cluster.name}
                                </FlexItem>
                              </Flex>
                            </DropdownItem>
                          ))}
                        </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        {/* Project dropdown */}
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isProjectFilterOpen}
                            onSelect={() => {
                              // Only close if not in multi-select mode (when cluster is selected from tree)
                              if (!selectedClusterFromTree) {
                                setIsProjectFilterOpen(false);
                              }
                            }}
                            onOpenChange={(isOpen: boolean) => setIsProjectFilterOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => {
                              const projectFilterArray = Array.isArray(projectFilter) ? projectFilter : (projectFilter !== 'All' ? [projectFilter] : []);
                              const selectedCount = selectedProjectFromTree ? 1 : projectFilterArray.length;
                              return (
                                <MenuToggle 
                                  ref={toggleRef} 
                                  onClick={() => setIsProjectFilterOpen(!isProjectFilterOpen)} 
                                  isExpanded={isProjectFilterOpen} 
                                  variant="default"
                                  isDisabled={!!selectedProjectFromTree}
                                  style={{
                                    backgroundColor: (selectedProjectFromTree || projectFilter !== 'All') ? 'var(--pf-t--global--background--color--primary--hover)' : undefined
                                  }}
                                >
                                  Project{selectedCount > 0 ? ` ${selectedCount}` : ''}
                                </MenuToggle>
                              );
                            }}
                          >
                            <DropdownList>
                              <DropdownItem
                                key="all"
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  setProjectFilter('All');
                                  if (!selectedClusterFromTree) {
                                    setIsProjectFilterOpen(false);
                                  }
                                }}
                              >
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                  <FlexItem>
                                    <Checkbox
                                      id="project-filter-all"
                                      isChecked={projectFilter === 'All' || (Array.isArray(projectFilter) && projectFilter.length === 0)}
                                      onChange={() => {}}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </FlexItem>
                                  <FlexItem>
                                    All
                                  </FlexItem>
                                </Flex>
                              </DropdownItem>
                              {getAllNamespaces()
                                .filter(ns => !selectedClusterFromTree || ns.clusterId === getAllClusters().find(c => c.name === selectedClusterFromTree)?.id)
                                .map(namespace => {
                                  const projectFilterArray = Array.isArray(projectFilter) ? projectFilter : (projectFilter !== 'All' ? [projectFilter] : []);
                                  const isSelected = projectFilterArray.includes(namespace.name);
                                  return (
                                    <DropdownItem
                                      key={namespace.id}
                                      onClick={(e) => {
                                        e?.stopPropagation();
                                        if (selectedClusterFromTree) {
                                          // Multi-select mode when cluster is selected from tree
                                          if (isSelected) {
                                            // Remove from selection
                                            const newFilter = projectFilterArray.filter(p => p !== namespace.name);
                                            setProjectFilter(newFilter.length === 0 ? 'All' : newFilter);
                                          } else {
                                            // Add to selection
                                            const newFilter = projectFilter === 'All' ? [namespace.name] : [...projectFilterArray, namespace.name];
                                            setProjectFilter(newFilter);
                                          }
                                        } else {
                                          // Single select mode
                                          setProjectFilter(namespace.name);
                                          setIsProjectFilterOpen(false);
                                        }
                                      }}
                                    >
                                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                        <FlexItem>
                                          <Checkbox
                                            id={`project-filter-${namespace.id}`}
                                            isChecked={isSelected}
                                            onChange={() => {}}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </FlexItem>
                                        <FlexItem>
                                          {namespace.name}
                                        </FlexItem>
                                      </Flex>
                                    </DropdownItem>
                                  );
                                })}
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        {/* Status filter */}
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isStatusFilterOpen}
                            onSelect={() => setIsStatusFilterOpen(false)}
                            onOpenChange={(isOpen: boolean) => setIsStatusFilterOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle ref={toggleRef} onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)} isExpanded={isStatusFilterOpen} variant="default">
                                Status: {statusFilter}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              {availableStatuses.map(status => (
                                <DropdownItem
                                  key={status}
                                  onClick={() => {
                                    setStatusFilter(status);
                                    setIsStatusFilterOpen(false);
                                  }}
                                >
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    <FlexItem>
                                      <Checkbox
                                        id={`status-filter-${status}`}
                                        isChecked={statusFilter === status}
                                        onChange={() => {}}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </FlexItem>
                                    <FlexItem>
                                      {status}
                                    </FlexItem>
                                  </Flex>
                                </DropdownItem>
                              ))}
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        {/* Search */}
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Search by name, IP, cluster, or namespace"
                            value={searchValue}
                            onChange={(_event, value) => setSearchValue(value)}
                            onClear={() => setSearchValue('')}
                          />
                        </ToolbarItem>
                      </>
                  )}
                  {/* Actions dropdown */}
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isToolbarActionsOpen}
                      onSelect={() => setIsToolbarActionsOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsToolbarActionsOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsToolbarActionsOpen(!isToolbarActionsOpen)}
                          isExpanded={isToolbarActionsOpen}
                          variant="default"
                          isDisabled={selectedVMs.length === 0}
                        >
                          Actions
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem key="start" onClick={() => setIsToolbarActionsOpen(false)}>
                          Start
                        </DropdownItem>
                        <DropdownItem key="stop" onClick={() => setIsToolbarActionsOpen(false)}>
                          Stop
                        </DropdownItem>
                        <DropdownItem key="restart" onClick={() => setIsToolbarActionsOpen(false)}>
                          Restart
                        </DropdownItem>
                        <DropdownItem key="pause" onClick={() => setIsToolbarActionsOpen(false)}>
                          Pause
                        </DropdownItem>
                        <Divider key="divider" />
                        <DropdownItem key="delete" onClick={() => setIsToolbarActionsOpen(false)}>
                          Delete
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  {/* Manage columns icon */}
                  <ToolbarItem>
                    <Button variant="plain" aria-label="Manage columns" onClick={() => setIsManageColumnsOpen(true)}>
                      <ColumnsIcon />
                    </Button>
                  </ToolbarItem>
                  {/* Pagination */}
                  <ToolbarItem align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={filteredVMs.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={(_event, newPage) => setPage(newPage)}
                      onPerPageSelect={(_event, newPerPage) => {
                        setPerPage(newPerPage);
                        setPage(1);
                      }}
                      variant={PaginationVariant.top}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              {/* Filter chips row - only show when filters are active */}
              {(selectedClusterFromTree || clusterForSelectedProject || selectedProjectFromTree || clusterFilter !== 'All' || (projectFilter !== 'All' && (Array.isArray(projectFilter) ? projectFilter.length > 0 : true)) || statusFilter !== 'All') && (
                <div style={{ padding: '12px 16px', backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }} wrap="wrap">
                    {/* Cluster chip */}
                    {(selectedClusterFromTree || clusterForSelectedProject || clusterFilter !== 'All') && (
                      <FlexItem>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          border: '1px solid var(--pf-t--global--border--color--default)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
                        }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--default)', fontWeight: 400 }}>Cluster</span>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#E7F1FA',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            <span style={{ color: 'var(--pf-t--global--text--color--default)' }}>
                              {selectedClusterFromTree || clusterForSelectedProject || clusterFilter}
                            </span>
                            <Button
                              variant="plain"
                              onClick={() => {
                                if (selectedClusterFromTree) {
                                  setSelectedTreeNode(null);
                                } else if (clusterForSelectedProject) {
                                  setSelectedTreeNode(null);
                                } else {
                                  setClusterFilter('All');
                                }
                              }}
                              aria-label="Remove cluster filter"
                              style={{ padding: '0', minWidth: 'auto', height: 'auto' }}
                            >
                              <TimesIcon style={{ fontSize: '0.75rem', color: 'var(--pf-t--global--text--color--default)' }} />
                            </Button>
                          </div>
                        </div>
                      </FlexItem>
                    )}
                    {/* Project chip(s) */}
                    {(selectedProjectFromTree || (projectFilter !== 'All' && (Array.isArray(projectFilter) ? projectFilter.length > 0 : true))) && (
                      <>
                        {selectedProjectFromTree ? (
                          <FlexItem>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              border: '1px solid var(--pf-t--global--border--color--default)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
                            }}>
                              <span style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--default)', fontWeight: 400 }}>Project</span>
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#E7F1FA',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.875rem'
                              }}>
                                <span style={{ color: 'var(--pf-t--global--text--color--default)' }}>
                                  {selectedProjectFromTree}
                                </span>
                                <Button
                                  variant="plain"
                                  onClick={() => {
                                    setSelectedTreeNode(null);
                                  }}
                                  aria-label="Remove project filter"
                                  style={{ padding: '0', minWidth: 'auto', height: 'auto' }}
                                >
                                  <TimesIcon style={{ fontSize: '0.75rem', color: 'var(--pf-t--global--text--color--default)' }} />
                                </Button>
                              </div>
                            </div>
                          </FlexItem>
                        ) : (
                          (Array.isArray(projectFilter) ? projectFilter : [projectFilter]).map((project, index) => (
                            <FlexItem key={index}>
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '1px solid var(--pf-t--global--border--color--default)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
                              }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--default)', fontWeight: 400 }}>Project</span>
                                <div style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  backgroundColor: '#E7F1FA',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.875rem'
                                }}>
                                  <span style={{ color: 'var(--pf-t--global--text--color--default)' }}>
                                    {project}
                                  </span>
                                  <Button
                                    variant="plain"
                                    onClick={() => {
                                      if (Array.isArray(projectFilter)) {
                                        const newFilter = projectFilter.filter(p => p !== project);
                                        setProjectFilter(newFilter.length === 0 ? 'All' : newFilter);
                                      } else if (projectFilter === project) {
                                        setProjectFilter('All');
                                      }
                                    }}
                                    aria-label="Remove project filter"
                                    style={{ padding: '0', minWidth: 'auto', height: 'auto' }}
                                  >
                                    <TimesIcon style={{ fontSize: '0.75rem', color: 'var(--pf-t--global--text--color--default)' }} />
                                  </Button>
                                </div>
                              </div>
                            </FlexItem>
                          ))
                        )}
                      </>
                    )}
                    {/* Status chip */}
                    {statusFilter !== 'All' && (
                      <FlexItem>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          border: '1px solid var(--pf-t--global--border--color--default)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
                        }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--default)', fontWeight: 400 }}>Status</span>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#E7F1FA',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            <span style={{ color: 'var(--pf-t--global--text--color--default)' }}>
                              {statusFilter}
                            </span>
                            <Button
                              variant="plain"
                              onClick={() => setStatusFilter('All')}
                              aria-label="Remove status filter"
                              style={{ padding: '0', minWidth: 'auto', height: 'auto' }}
                            >
                              <TimesIcon style={{ fontSize: '0.75rem', color: 'var(--pf-t--global--text--color--default)' }} />
                            </Button>
                          </div>
                        </div>
                      </FlexItem>
                    )}
                    {/* Clear all filters link */}
                    <FlexItem align={{ default: 'alignRight' }}>
                      <Button
                        variant="link"
                        isInline
                        onClick={() => {
                          setSelectedTreeNode(null);
                          setClusterFilter('All');
                          setProjectFilter('All');
                          setStatusFilter('All');
                        }}
                        style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--color--brand--default)', textDecoration: 'underline' }}
                      >
                        Clear
                      </Button>
                    </FlexItem>
                  </Flex>
                </div>
              )}

              <div style={{ marginTop: '16px', overflowX: 'hidden', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, width: '40px' }}></th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '12%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('name')}
                      >
                        <Tooltip content="Name">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Name</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="name" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '10%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('cluster')}
                      >
                        <Tooltip content="Cluster">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Cluster</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="cluster" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '10%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('namespace')}
                      >
                        <Tooltip content="Namespace">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Namespace</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="namespace" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '12%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('status')}
                      >
                        <Tooltip content="Status">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Status</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="status" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '12%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('conditions')}
                      >
                        <Tooltip content="Conditions">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Conditions</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="conditions" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '12%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('node')}
                      >
                        <Tooltip content="Node">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Node</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="node" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '10%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('ipAddress')}
                      >
                        <Tooltip content="IP address">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>IP address</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="ipAddress" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          cursor: 'pointer',
                          userSelect: 'none',
                          width: '12%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('storageClass')}
                      >
                        <Tooltip content="Storage class">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Storage class</span>
                            <span style={{ flexShrink: 0 }}><SortIcon column="storageClass" /></span>
                          </div>
                        </Tooltip>
                      </th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVMs.map(vm => {
                      // Determine status icon and color
                      const getStatusIcon = () => {
                        if (vm.status === 'Error') {
                          return <ExclamationTriangleIcon style={{ color: 'var(--pf-t--global--icon--color--status--warning--default)' }} />;
                        } else if (vm.status === 'Stopped' || vm.status === 'Stopping' || vm.status === 'Terminating') {
                          return <ClockIcon style={{ color: 'var(--pf-t--global--icon--color--regular)' }} />;
                        } else if (vm.status === 'Running') {
                          return <SyncAltIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />;
                        } else if (vm.status === 'Starting' || vm.status === 'Provisioning' || vm.status === 'Migrating' || vm.status === 'WaitingForVolumeBinding') {
                          return <SyncAltIcon style={{ color: 'var(--pf-t--global--icon--color--status--info--default)' }} />;
                        } else if (vm.status === 'Paused') {
                          return <ClockIcon style={{ color: 'var(--pf-t--global--icon--color--regular)' }} />;
                        }
                        // Unknown status - no icon or default icon
                        return null;
                      };

                      return (
                        <tr
                          key={vm.id}
                          style={{
                            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
                            backgroundColor: selectedVMs.includes(vm.id) ? '#E7F1FA' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '12px', width: '40px' }}>
                            <Checkbox
                              id={`select-vm-${vm.id}`}
                              isChecked={selectedVMs.includes(vm.id)}
                              onChange={(event, checked) => {
                                event.stopPropagation();
                                if (checked) {
                                  setSelectedVMs([...selectedVMs, vm.id]);
                                } else {
                                  setSelectedVMs(selectedVMs.filter(id => id !== vm.id));
                                }
                              }}
                              aria-label={`Select ${vm.name}`}
                            />
                          </td>
                          <td style={{ padding: '12px', width: '12%' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                <Label color="blue" isCompact>VM</Label>
                              </FlexItem>
                              <FlexItem style={{ minWidth: 0, flex: 1 }}>
                                <Tooltip content={vm.name}>
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => {
                                      setSelectedVMDetails(vm.id);
                                      setVmDetailsActiveTab('overview');
                                    }}
                                    style={{ 
                                      padding: 0, 
                                      textDecoration: 'underline',
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'inline-block'
                                    }}
                                  >
                                    {vm.name}
                                  </Button>
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </td>
                          <td style={{ padding: '12px', width: '10%' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                <Label color="blue" isCompact>MC</Label>
                              </FlexItem>
                              <FlexItem style={{ minWidth: 0, flex: 1 }}>
                                <Tooltip content={vm.cluster}>
                                  <Button variant="link" isInline style={{ 
                                    padding: 0, 
                                    textDecoration: 'underline',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block'
                                  }}>
                                    {vm.cluster}
                                  </Button>
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </td>
                          <td style={{ padding: '12px', width: '10%' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                <Label color="green" isCompact>NS</Label>
                              </FlexItem>
                              <FlexItem style={{ minWidth: 0, flex: 1 }}>
                                <Tooltip content={vm.namespace}>
                                  <Button variant="link" isInline style={{ 
                                    padding: 0, 
                                    textDecoration: 'underline',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block'
                                  }}>
                                    {vm.namespace}
                                  </Button>
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </td>
                          <td style={{ padding: '12px', width: '12%' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>{getStatusIcon()}</FlexItem>
                              <FlexItem style={{ minWidth: 0, flex: 1 }}>
                                <Tooltip content={vm.status}>
                                  <Button variant="link" isInline style={{ 
                                    padding: 0, 
                                    textDecoration: 'underline',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block'
                                  }}>
                                    {vm.status}
                                  </Button>
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </td>
                          <td style={{ padding: '12px', width: '12%' }}>
                            {vm.conditions ? (
                              <Tooltip content={vm.conditions}>
                                <div style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100%'
                                }}>
                                  {vm.conditions}
                                </div>
                              </Tooltip>
                            ) : (
                              ''
                            )}
                          </td>
                          <td style={{ padding: '12px', width: '12%' }}>
                            {vm.node ? (
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Label color="purple" isCompact>N</Label>
                                </FlexItem>
                                <FlexItem style={{ minWidth: 0, flex: 1 }}>
                                  <Tooltip content={vm.node}>
                                    <Button variant="link" isInline style={{ 
                                      padding: 0, 
                                      textDecoration: 'underline',
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'inline-block'
                                    }}>
                                      {vm.node}
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                              </Flex>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td style={{ padding: '12px', width: '10%' }}>
                            {vm.ipAddress ? (
                              <Tooltip content={vm.ipAddress}>
                                <div style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100%'
                                }}>
                                  {vm.ipAddress}
                                </div>
                              </Tooltip>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td style={{ padding: '12px', width: '12%' }}>
                            {vm.storageClass ? (
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Label color="blue" isCompact>SC</Label>
                                </FlexItem>
                                <FlexItem style={{ minWidth: 0, flex: 1 }}>
                                  <Tooltip content={vm.storageClass}>
                                    <Button variant="link" isInline style={{ 
                                      padding: 0, 
                                      textDecoration: 'underline',
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'inline-block'
                                    }}>
                                      {vm.storageClass}
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                              </Flex>
                            ) : (
                              ''
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', position: 'relative' }}>
                            <Dropdown
                              isOpen={openRowMenuId === vm.id}
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
                                  onClick={() => setOpenRowMenuId(openRowMenuId === vm.id ? null : vm.id)}
                                  isExpanded={openRowMenuId === vm.id}
                                  aria-label={`Actions for ${vm.name}`}
                                  style={{ padding: '4px' }}
                                >
                                  <EllipsisVIcon />
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem key="start" onClick={() => console.log('Start', vm.id)}>
                                  Start
                                </DropdownItem>
                                <DropdownItem key="stop" onClick={() => console.log('Stop', vm.id)}>
                                  Stop
                                </DropdownItem>
                                <DropdownItem key="restart" onClick={() => console.log('Restart', vm.id)}>
                                  Restart
                                </DropdownItem>
                                <DropdownItem key="migrate" onClick={() => console.log('Migrate', vm.id)}>
                                  Migrate
                                </DropdownItem>
                                <Divider key="divider" />
                                <DropdownItem key="delete" onClick={() => console.log('Delete', vm.id)}>
                                  Delete
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
            </>
          )}
        </div>
      </div>

      {/* Advanced Search Modal */}
      <Modal
        width="60%"
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        tabIndex={0}
        aria-label="Advanced search"
      >
        {/* Sticky Header */}
        <div style={{
          padding: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--pf-t--global--border--color--default)',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title headingLevel="h1" size="2xl">
            Advanced search
          </Title>
          <Button
            variant="plain"
            aria-label="Close"
            onClick={() => setIsAdvancedSearchOpen(false)}
            style={{ padding: '8px' }}
          >
            <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 352 512" aria-hidden="true">
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
            </svg>
          </Button>
        </div>

        {/* Scrollable Content */}
        <div style={{
          padding: '24px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <Form>
            {/* Details Section */}
            <ExpandableSection
              toggleText="Details"
              onToggle={(_event, isExpanded) => setIsDetailsExpanded(isExpanded)}
              isExpanded={isDetailsExpanded}
              isIndented
            >
              <FormGroup label="Name" fieldId="adv-search-name">
                <TextInput
                  id="adv-search-name"
                  value={advancedSearchName}
                  onChange={(_event, value) => setAdvancedSearchName(value)}
                  placeholder="Name"
                />
              </FormGroup>

              <FormGroup label="Cluster" fieldId="adv-search-cluster">
                <Dropdown
                  isOpen={isAdvSearchClusterOpen}
                  onSelect={() => setIsAdvSearchClusterOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchClusterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchClusterOpen(!isAdvSearchClusterOpen)}
                      isExpanded={isAdvSearchClusterOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchCluster === 'all' ? 'All clusters' : advancedSearchCluster}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="all" onClick={() => { setAdvancedSearchCluster('all'); setIsAdvSearchClusterOpen(false); }}>
                      All clusters
                    </DropdownItem>
                    {getAllClusters().map(cluster => (
                      <DropdownItem key={cluster.id} onClick={() => { setAdvancedSearchCluster(cluster.name); setIsAdvSearchClusterOpen(false); }}>
                        {cluster.name}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Project" fieldId="adv-search-project">
                <Dropdown
                  isOpen={isAdvSearchProjectOpen}
                  onSelect={() => setIsAdvSearchProjectOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchProjectOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchProjectOpen(!isAdvSearchProjectOpen)}
                      isExpanded={isAdvSearchProjectOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchProject === 'all' ? 'All projects' : advancedSearchProject}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="all" onClick={() => { setAdvancedSearchProject('all'); setIsAdvSearchProjectOpen(false); }}>
                      All projects
                    </DropdownItem>
                    {getAllNamespaces().map(project => (
                      <DropdownItem key={project.id} onClick={() => { setAdvancedSearchProject(project.name); setIsAdvSearchProjectOpen(false); }}>
                        {project.name}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Description" fieldId="adv-search-description">
                <TextInput
                  id="adv-search-description"
                  value={advancedSearchDescription}
                  onChange={(_event, value) => setAdvancedSearchDescription(value)}
                  placeholder="Description"
                />
              </FormGroup>

              <FormGroup label="Status" fieldId="adv-search-status">
                <Dropdown
                  isOpen={isAdvSearchStatusOpen}
                  onSelect={() => setIsAdvSearchStatusOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchStatusOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchStatusOpen(!isAdvSearchStatusOpen)}
                      isExpanded={isAdvSearchStatusOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchStatus || 'Select status'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    {availableStatuses.filter(s => s !== 'All').map(status => (
                      <DropdownItem key={status} onClick={() => { setAdvancedSearchStatus(status); setIsAdvSearchStatusOpen(false); }}>
                        {status}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Operating system" fieldId="adv-search-os">
                <Dropdown
                  isOpen={isAdvSearchOSOpen}
                  onSelect={() => setIsAdvSearchOSOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchOSOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchOSOpen(!isAdvSearchOSOpen)}
                      isExpanded={isAdvSearchOSOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchOS || 'Select OS'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    {availableOSs.filter(os => os !== 'All').map(os => (
                      <DropdownItem key={os} onClick={() => { setAdvancedSearchOS(os); setIsAdvSearchOSOpen(false); }}>
                        {os}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="vCPU" fieldId="adv-search-vcpu">
                <Split hasGutter>
                  <SplitItem>
                    <Dropdown
                      isOpen={isAdvSearchVCPUOpOpen}
                      onSelect={() => setIsAdvSearchVCPUOpOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsAdvSearchVCPUOpOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsAdvSearchVCPUOpOpen(!isAdvSearchVCPUOpOpen)}
                          isExpanded={isAdvSearchVCPUOpOpen}
                          style={{ width: '150px' }}
                        >
                          {advancedSearchVCPUOperator === 'greater' ? 'Greater than' : advancedSearchVCPUOperator === 'less' ? 'Less than' : 'Equal to'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => { setAdvancedSearchVCPUOperator('greater'); setIsAdvSearchVCPUOpOpen(false); }}>Greater than</DropdownItem>
                        <DropdownItem onClick={() => { setAdvancedSearchVCPUOperator('less'); setIsAdvSearchVCPUOpOpen(false); }}>Less than</DropdownItem>
                        <DropdownItem onClick={() => { setAdvancedSearchVCPUOperator('equals'); setIsAdvSearchVCPUOpOpen(false); }}>Equal to</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </SplitItem>
                  <SplitItem isFilled>
                    <TextInput
                      id="adv-search-vcpu-value"
                      type="number"
                      value={advancedSearchVCPUValue}
                      onChange={(_event, value) => setAdvancedSearchVCPUValue(value)}
                      placeholder="vCPU value"
                    />
                  </SplitItem>
                </Split>
              </FormGroup>

              <FormGroup label="Memory" fieldId="adv-search-memory">
                <Split hasGutter>
                  <SplitItem>
                    <Dropdown
                      isOpen={isAdvSearchMemoryOpOpen}
                      onSelect={() => setIsAdvSearchMemoryOpOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsAdvSearchMemoryOpOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsAdvSearchMemoryOpOpen(!isAdvSearchMemoryOpOpen)}
                          isExpanded={isAdvSearchMemoryOpOpen}
                          style={{ width: '150px' }}
                        >
                          {advancedSearchMemoryOperator === 'greater' ? 'Greater than' : advancedSearchMemoryOperator === 'less' ? 'Less than' : 'Equal to'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => { setAdvancedSearchMemoryOperator('greater'); setIsAdvSearchMemoryOpOpen(false); }}>Greater than</DropdownItem>
                        <DropdownItem onClick={() => { setAdvancedSearchMemoryOperator('less'); setIsAdvSearchMemoryOpOpen(false); }}>Less than</DropdownItem>
                        <DropdownItem onClick={() => { setAdvancedSearchMemoryOperator('equals'); setIsAdvSearchMemoryOpOpen(false); }}>Equal to</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </SplitItem>
                  <SplitItem isFilled>
                    <TextInput
                      id="adv-search-memory-value"
                      type="number"
                      value={advancedSearchMemoryValue}
                      onChange={(_event, value) => setAdvancedSearchMemoryValue(value)}
                      placeholder="Memory value"
                    />
                  </SplitItem>
                  <SplitItem>
                    <Dropdown
                      isOpen={isAdvSearchMemoryUnitOpen}
                      onSelect={() => setIsAdvSearchMemoryUnitOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsAdvSearchMemoryUnitOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsAdvSearchMemoryUnitOpen(!isAdvSearchMemoryUnitOpen)}
                          isExpanded={isAdvSearchMemoryUnitOpen}
                          style={{ width: '100px' }}
                        >
                          {advancedSearchMemoryUnit}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => { setAdvancedSearchMemoryUnit('GiB'); setIsAdvSearchMemoryUnitOpen(false); }}>GiB</DropdownItem>
                        <DropdownItem onClick={() => { setAdvancedSearchMemoryUnit('MiB'); setIsAdvSearchMemoryUnitOpen(false); }}>MiB</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </SplitItem>
                </Split>
              </FormGroup>

              <FormGroup label="Storage class" fieldId="adv-search-storage">
                <Dropdown
                  isOpen={isAdvSearchStorageOpen}
                  onSelect={() => setIsAdvSearchStorageOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchStorageOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchStorageOpen(!isAdvSearchStorageOpen)}
                      isExpanded={isAdvSearchStorageOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchStorageClass || 'Select storage class'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => { setAdvancedSearchStorageClass('standard'); setIsAdvSearchStorageOpen(false); }}>standard</DropdownItem>
                    <DropdownItem onClick={() => { setAdvancedSearchStorageClass('premium'); setIsAdvSearchStorageOpen(false); }}>premium</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Hardware devices" fieldId="adv-search-hardware">
                <Checkbox
                  id="adv-search-gpu"
                  label="GPU devices"
                  isChecked={advancedSearchGPU}
                  onChange={(_event, checked) => setAdvancedSearchGPU(checked)}
                  style={{ marginBottom: '8px' }}
                />
                <Checkbox
                  id="adv-search-host-devices"
                  label="Host devices"
                  isChecked={advancedSearchHostDevices}
                  onChange={(_event, checked) => setAdvancedSearchHostDevices(checked)}
                />
              </FormGroup>

              <FormGroup label="Date created" fieldId="adv-search-date">
                <Dropdown
                  isOpen={isAdvSearchDateOpen}
                  onSelect={() => setIsAdvSearchDateOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchDateOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchDateOpen(!isAdvSearchDateOpen)}
                      isExpanded={isAdvSearchDateOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchDateCreated === 'any' ? 'Any time' : advancedSearchDateCreated}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => { setAdvancedSearchDateCreated('any'); setIsAdvSearchDateOpen(false); }}>Any time</DropdownItem>
                    <DropdownItem onClick={() => { setAdvancedSearchDateCreated('today'); setIsAdvSearchDateOpen(false); }}>Today</DropdownItem>
                    <DropdownItem onClick={() => { setAdvancedSearchDateCreated('week'); setIsAdvSearchDateOpen(false); }}>Last 7 days</DropdownItem>
                    <DropdownItem onClick={() => { setAdvancedSearchDateCreated('month'); setIsAdvSearchDateOpen(false); }}>Last 30 days</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FormGroup>
            </ExpandableSection>

            {/* Divider between sections */}
            <Divider style={{ margin: '16px 0' }} />

            {/* Network Section */}
            <ExpandableSection
              toggleText="Network"
              onToggle={(_event, isExpanded) => setIsNetworkExpanded(isExpanded)}
              isExpanded={isNetworkExpanded}
              isIndented
            >
              <FormGroup label="IP address" fieldId="adv-search-ip">
                <TextInput
                  id="adv-search-ip"
                  value={advancedSearchIPAddress}
                  onChange={(_event, value) => setAdvancedSearchIPAddress(value)}
                  placeholder="IP address"
                />
              </FormGroup>

              <FormGroup label="Network Attachment Definitions" fieldId="adv-search-nad">
                <TextInput
                  id="adv-search-nad"
                  value=""
                  placeholder="Find by name"
                />
              </FormGroup>
            </ExpandableSection>
          </Form>

          {/* Spacer below last field */}
          <div style={{ height: '24px' }} />
        </div>

        {/* Sticky Footer with Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: '16px 24px 24px 24px',
          borderTop: '1px solid var(--pf-t--global--border--color--default)',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          position: 'sticky',
          bottom: 0,
          marginTop: '-24px'
        }}>
          <Button variant="primary" onClick={() => {
            setIsAdvancedSearchActive(true);
            setIsAdvancedSearchOpen(false);
          }}>
            Search
          </Button>
          <Button variant="secondary" onClick={() => {
            setAdvancedSearchName('');
            setAdvancedSearchCluster('all');
            setAdvancedSearchProject('all');
            setAdvancedSearchDescription('');
            setAdvancedSearchStatus('');
            setAdvancedSearchOS('');
            setAdvancedSearchVCPUValue('');
            setAdvancedSearchMemoryValue('');
            setAdvancedSearchStorageClass('');
            setAdvancedSearchGPU(false);
            setAdvancedSearchHostDevices(false);
            setAdvancedSearchDateCreated('any');
            setAdvancedSearchIPAddress('');
          }}>
            Clear all
          </Button>
          <Button variant="link" onClick={() => setIsAdvancedSearchOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Save Search Modal */}
      <Modal
        width="50%"
        isOpen={isSaveSearchModalOpen}
        onClose={() => {
          setIsSaveSearchModalOpen(false);
          setSaveSearchName('');
          setSaveSearchDescription('');
        }}
        title="Save search"
        tabIndex={0}
        aria-label="Save search"
      >
        <div style={{ padding: '24px' }}>
          <Form>
            <FormGroup label="Name" isRequired fieldId="save-search-name" style={{ marginBottom: '16px' }}>
            <TextInput
              id="save-search-name"
              value={saveSearchName}
              onChange={(_event, value) => setSaveSearchName(value)}
              placeholder="Enter search name"
            />
          </FormGroup>
            <FormGroup label="Description" fieldId="save-search-description" style={{ marginBottom: '24px' }}>
              <TextArea
                id="save-search-description"
                value={saveSearchDescription}
                onChange={(_event, value) => setSaveSearchDescription(value)}
                placeholder="Enter search description (optional)"
                rows={3}
              />
            </FormGroup>
            <Flex spaceItems={{ default: 'spaceItemsMd' }} justifyContent={{ default: 'justifyContentFlexEnd' }}>
            <FlexItem>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsSaveSearchModalOpen(false);
                  setSaveSearchName('');
                  setSaveSearchDescription('');
                }}
              >
                Cancel
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                variant="primary"
                onClick={() => {
                  if (saveSearchName.trim()) {
                    const newSearch = {
                      id: `search-${Date.now()}`,
                      name: saveSearchName.trim(),
                      description: saveSearchDescription.trim(),
                      // Save advanced search parameters
                      advancedSearchName,
                      advancedSearchCluster,
                      advancedSearchProject,
                      advancedSearchDescription,
                      advancedSearchStatus,
                      advancedSearchOS,
                      advancedSearchVCPUOperator,
                      advancedSearchVCPUValue,
                      advancedSearchMemoryOperator,
                      advancedSearchMemoryValue,
                      advancedSearchMemoryUnit,
                      advancedSearchStorageClass,
                      advancedSearchGPU,
                      advancedSearchHostDevices,
                      advancedSearchDateCreated,
                      advancedSearchIPAddress,
                    };
                    setSavedSearches(prev => [...prev, newSearch]);
                    setIsSaveSearchModalOpen(false);
                    setSaveSearchName('');
                    setSaveSearchDescription('');
                  }
                }}
                isDisabled={!saveSearchName.trim()}
              >
                Save
              </Button>
            </FlexItem>
          </Flex>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export { VirtualMachines };
