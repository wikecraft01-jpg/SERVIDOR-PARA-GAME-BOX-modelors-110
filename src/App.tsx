import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  Terminal as TerminalIcon,
  Download,
  Wifi,
  Usb,
  Shield,
  Bot,
  Zap,
  Settings,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Send,
  RefreshCw,
  Play,
  Square,
  FileCode,
  Info,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowDownToLine,
  Power,
  Sliders,
  ExternalLink,
  Database,
  Search,
  Plus,
  Trash2,
  Table,
  Server,
  Network,
  Share2,
  Laptop,
  Monitor as MonitorIcon,
  AlertTriangle,
  Tv,
  Radio,
  Mouse,
  Keyboard,
  SlidersHorizontal,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Signal,
  Gamepad2,
  FolderPlus,
  Folder,
  FolderTree,
  Users,
  Box,
  RotateCcw
} from 'lucide-react';

interface TelemetryData {
  hardware: {
    model: string;
    soc: string;
    gpu: string;
    cores: number;
    totalRamMB: number;
    totalStorageGB: number;
    storageUsedGB: number;
    storageFreeGB: number;
    emmcHealth: string;
    sdSlot: string;
    ports: string[];
  };
  telemetry: {
    cpuUsagePercent: number;
    cpuCoresLoad: number[];
    cpuTemperatureC: number;
    ramUsedMB: number;
    ramFreeMB: number;
    zramUsedMB: number;
    zramTotalMB: number;
    zramCompressionRatio: string;
    gpuLoadPercent: number;
    gpuMemoryCmaMB: number;
    uptime: number;
    ipAddress: string;
    hostname: string;
    kernel: string;
    osDistribution: string;
  };
  settings: {
    developerMode: boolean;
    usbDebugging: boolean;
    wirelessDebugging: boolean;
    wirelessPort: number;
    sshEnabled: boolean;
    sshPort: number;
    rootAccess: boolean;
    cpuGovernor: 'schedutil' | 'ondemand' | 'performance' | 'powersave';
    zramEnabled: boolean;
    zramSizeMB: number;
    maliGpuCmaMB: number;
    aiBotEnabled: boolean;
    botType: 'telegram' | 'discord' | 'whatsapp' | 'rest_api' | 'gemini_bridge';
    botName: string;
    botPromptTemplate: string;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolUsed?: {
    name: string;
    args: any;
    result: any;
  } | null;
}

interface DbTable {
  name: string;
  description: string;
  columns: string[];
  rows: any[];
}

interface DbStatus {
  databaseFile: string;
  engine: string;
  location: string;
  allocatedDiskSizeKB: number;
  maxAllowedGB: number;
  totalTables: number;
  totalRecords: number;
  totalQueriesProcessed: number;
  status: string;
  connections: {
    activeLocalConnections: number;
    remoteBotClients: number;
  };
}

interface ComputeNode {
  id: string;
  name: string;
  ip: string;
  platform: string;
  cpuCores: number;
  totalRamGB: number;
  gpuName?: string;
  status: 'active' | 'standby' | 'processing';
  activeTasks: number;
  tasksCompleted: number;
  lastHeartbeat: string;
}

interface ClusterStatus {
  autoOffloadEnabled: boolean;
  offloadThresholdRamPercent: number;
  offloadThresholdCpuPercent: number;
  currentPeakStatus: boolean;
  totalOffloadedTasks: number;
  clusterTotals: {
    totalRamGB: number;
    totalCores: number;
    connectedWorkersCount: number;
    masterDevice: string;
  };
  nodes: ComputeNode[];
}

interface StorageStateInfo {
  emmc: {
    device: string;
    mountPoint: string;
    totalGB: number;
    usedGB: number;
    freeGB: number;
    health: string;
    role: string;
    essentialFiles: string[];
  };
  microsd: {
    detected: boolean;
    device: string;
    mountPoint: string;
    totalGB: number;
    usedGB: number;
    freeGB: number;
    filesystem: string;
    role: string;
    dataDirectories: string[];
  };
  aiDataLocation: 'emmc' | 'microsd';
  lastMigrationTime?: string;
}

interface HardwareComponent {
  id: string;
  name: string;
  category: 'cpu' | 'gpu' | 'ram' | 'storage' | 'input' | 'network';
  hardwareSpecs: string;
  driverKernelModule: string;
  status: 'adapted' | 'optimizing' | 'pending';
  adaptationDetails: string;
}

interface HardwareScanReport {
  lastScanTimestamp: string;
  isScanning: boolean;
  overallHealth: string;
  components: HardwareComponent[];
}

interface PeripheralsInfo {
  tvRemote: {
    connected: boolean;
    sensor: string;
    protocol: string;
    keymapLoaded: string;
    lastButtonReceived: string;
    buttons: Array<{ key: string; code: string; label: string; action: string }>;
  };
  usbKeyboard: {
    connected: boolean;
    model: string;
    deviceNode: string;
    status: string;
    keystrokesDetected: number;
    capsLock: boolean;
  };
  usbMouse: {
    connected: boolean;
    model: string;
    deviceNode: string;
    status: string;
    lastCoordinates: { x: number; y: number };
    clicksDetected: number;
  };
}

interface WifiNetworkItem {
  ssid: string;
  bssid: string;
  signalPercent: number;
  signalDbm: number;
  security: 'WPA2-PSK' | 'WPA3' | 'WPA/WPA2' | 'Abierta';
  frequency: '2.4 GHz' | '5 GHz';
  channel: number;
  connected: boolean;
}

interface WifiStateInfo {
  interface: string;
  driver: string;
  macAddress: string;
  powerState: 'on' | 'off';
  currentSsid: string;
  ipAddress: string;
  gateway: string;
  dns: string[];
  connected: boolean;
  signalPercent: number;
  internetAccess: boolean;
}

interface MinecraftPlayer {
  name: string;
  uuid: string;
  platform: 'Java (PC)' | 'Bedrock (Celular/Consola)';
  ping: number;
  ip: string;
  joinedAt: string;
  isOp: boolean;
}

interface MinecraftStatusResponse {
  server: {
    status: 'running' | 'stopped' | 'starting';
    engine: string;
    version: string;
    portJava: number;
    portBedrock: number;
    tps: number;
    uptimeSeconds: number;
    ramAllocatedMB: number;
    ramUsedMB: number;
    worldPath: string;
    storageDevice: string;
    aikarsFlags: string;
    difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
    gamemode: 'survival' | 'creative' | 'adventure';
    pvp: boolean;
    maxPlayers: number;
    viewDistance: number;
    onlineMode: boolean;
    motd: string;
    crossplayEnabled: boolean;
    players: MinecraftPlayer[];
    consoleLogs: string[];
  };
  network: {
    ip: string;
    portJava: number;
    portBedrock: number;
    connectStringJava: string;
    connectStringBedrock: string;
  };
  performance: {
    tps: number;
    ramAllocatedMB: number;
    ramUsedMB: number;
    cpuUsagePercent: number;
    storageDevice: string;
    worldPath: string;
    zramCompression: string;
  };
}

interface MultiServerService {
  id: string;
  name: string;
  category: 'gaming' | 'storage' | 'network' | 'media' | 'ai';
  status: 'running' | 'stopped';
  port: number;
  description: string;
  ramUsageMB: number;
  cpuUsagePercent: number;
  storageTarget: string;
  endpointOrPath: string;
  features: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'bot' | 'database' | 'hardware' | 'minecraft' | 'cluster' | 'iso' | 'devmode' | 'optimizer' | 'terminal'>('monitor');
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Minecraft Server & Multi-Services state (RS-110 Allwinner H313)
  const [mcData, setMcData] = useState<MinecraftStatusResponse | null>(null);
  const [mcLoading, setMcLoading] = useState(false);
  const [mcCmdInput, setMcCmdInput] = useState('');
  const [mcCmdExecuting, setMcCmdExecuting] = useState(false);
  const [mcSubTab, setMcSubTab] = useState<'console' | 'players' | 'settings' | 'multiserver'>('console');
  const [newSambaFolder, setNewSambaFolder] = useState('');
  const [sambaFeedback, setSambaFeedback] = useState<string | null>(null);
  const [multiServices, setMultiServices] = useState<MultiServerService[]>([]);
  const [mcNotice, setMcNotice] = useState<string | null>(null);
  const [mcSettingsDraft, setMcSettingsDraft] = useState({
    difficulty: 'normal',
    gamemode: 'survival',
    pvp: true,
    maxPlayers: 10,
    viewDistance: 6,
    onlineMode: false,
    motd: '§a§lRS-110 §eGame Box §bServer §7[Java & Bedrock]',
    ramAllocatedMB: 1024,
  });
  const mcConsoleEndRef = useRef<HTMLDivElement>(null);

  // Wi-Fi Connection & Scanner state (Allwinner H313)
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetworkItem[]>([]);
  const [wifiCurrent, setWifiCurrent] = useState<WifiStateInfo | null>(null);
  const [isScanningWifi, setIsScanningWifi] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState<WifiNetworkItem | null>(null);
  const [wifiPassword, setWifiPassword] = useState('');
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [isConnectingWifi, setIsConnectingWifi] = useState(false);
  const [wifiNotice, setWifiNotice] = useState<string | null>(null);
  const [customSsid, setCustomSsid] = useState('');
  const [isAddingHiddenNetwork, setIsAddingHiddenNetwork] = useState(false);

  // Dual Storage state
  const [storageInfo, setStorageInfo] = useState<StorageStateInfo | null>(null);
  const [isMigratingStorage, setIsMigratingStorage] = useState(false);
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  // Hardware Auto-Scan state
  const [hardwareReport, setHardwareReport] = useState<HardwareScanReport | null>(null);
  const [isScanningHardware, setIsScanningHardware] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');

  // Peripherals & TV Remote state
  const [peripheralsInfo, setPeripheralsInfo] = useState<PeripheralsInfo | null>(null);
  const [remoteRecentActions, setRemoteRecentActions] = useState<Array<{ code: string; key: string; name: string; description: string; executedAt: string }>>([]);
  const [tvScreenDisplay, setTvScreenDisplay] = useState<{ title: string; ip: string; port: number; ssh: string; adb: string; storage: string } | null>({
    title: 'GAME BOX RS-110 - MINI SERVIDOR IA',
    ip: '192.168.1.110',
    port: 3000,
    ssh: 'ssh root@192.168.1.110 -p 22',
    adb: 'adb connect 192.168.1.110:5555',
    storage: 'eMMC 64GB (Sistema) + MicroSD 128GB (Datos IA)',
  });
  const [keyboardTestInput, setKeyboardTestInput] = useState('');
  const [keyboardStatusFeedback, setKeyboardStatusFeedback] = useState<string | null>(null);
  const [mouseClickCount, setMouseClickCount] = useState(0);
  const [mouseCoords, setMouseCoords] = useState({ x: 960, y: 540 });
  const [pcFractionSlider, setPcFractionSlider] = useState(12);

  // Settings state
  const [devMode, setDevMode] = useState(true);
  const [usbDebug, setUsbDebug] = useState(true);
  const [wifiDebug, setWifiDebug] = useState(true);
  const [sshActive, setSshActive] = useState(true);
  const [rootActive, setRootActive] = useState(true);
  const [zramActive, setZramActive] = useState(true);
  const [governor, setGovernor] = useState<'schedutil' | 'ondemand' | 'performance' | 'powersave'>('schedutil');
  const [gpuCma, setGpuCma] = useState<number>(32);
  const [botRunning, setBotRunning] = useState(true);
  const [botType, setBotType] = useState<'gemini_bridge' | 'telegram' | 'discord' | 'whatsapp' | 'rest_api'>('gemini_bridge');

  // Database state
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [dbTables, setDbTables] = useState<DbTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('ai_memory');
  const [dbFilter, setDbFilter] = useState('');
  const [sqlQueryInput, setSqlQueryInput] = useState('SELECT * FROM ai_memory ORDER BY id DESC LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newTags, setNewTags] = useState('ia, recordatorio');
  const [isSavingMemory, setIsSavingMemory] = useState(false);

  // Cluster Distributed Computing state
  const [clusterInfo, setClusterInfo] = useState<ClusterStatus | null>(null);
  const [autoOffload, setAutoOffload] = useState(true);
  const [ramThreshold, setRamThreshold] = useState(80);
  const [isSimulatingOffload, setIsSimulatingOffload] = useState(false);
  const [offloadBannerMessage, setOffloadBannerMessage] = useState<string | null>(null);

  // AI Chat Bot test state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: '¡Hola! Soy el bot de inteligencia artificial ejecutándome en el firmware RS110-ServerOS de tu Game Box RS-110. Tengo acceso a la base de datos persistente SQLite (eMMC 64GB) y si me sobrecargo de trabajo, el sistema derivará tareas pesadas a tus computadoras conectadas.',
      timestamp: '14:00',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Bot Code Generator state
  const [generatorPlatform, setGeneratorPlatform] = useState('Telegram');
  const [generatorPurpose, setGeneratorPurpose] = useState('Asistente personal con ejecución de comandos de servidor');
  const [generatedScript, setGeneratedScript] = useState<{
    mainCode?: string;
    requirements?: string;
    serviceFile?: string;
    deployInstructions?: string;
  } | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string }>>([
    {
      cmd: 'uname -a',
      out: 'Linux rs110-ai-box 6.1.75-sunxi64 #1 SMP PREEMPT Tue Jan 27 10:14:22 UTC 2026 aarch64 GNU/Linux',
    },
    {
      cmd: 'sqlite3 /var/lib/ai-models/ai_memory.db "SELECT COUNT(*) FROM ai_memory;"',
      out: '4 recuerdos persistentes cargados en la eMMC de 64GB.',
    },
    {
      cmd: 'rs110-cluster status',
      out: 'Master: RS-110 (Active) · Workers: 2 PCs conectadas · Modo Offload: Automático > 80% RAM',
    },
  ]);
  const [termInput, setTermInput] = useState('');
  const [termRunning, setTermRunning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // PhoenixSuit wizard & Flashing simulation state
  const [phoenixStep, setPhoenixStep] = useState<number>(1);
  const [isoGenerating, setIsoGenerating] = useState(false);
  const [imgGenerating, setImgGenerating] = useState(false);
  const [isFlashingSim, setIsFlashingSim] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [flashStage, setFlashStage] = useState('');

  // Fetch initial telemetry and database
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.settings) {
          setDevMode(json.settings.developerMode);
          setUsbDebug(json.settings.usbDebugging);
          setWifiDebug(json.settings.wirelessDebugging);
          setSshActive(json.settings.sshEnabled);
          setRootActive(json.settings.rootAccess);
          setGovernor(json.settings.cpuGovernor);
          setZramActive(json.settings.zramEnabled);
          setGpuCma(json.settings.maliGpuCmaMB);
          setBotRunning(json.settings.aiBotEnabled);
          setBotType(json.settings.botType);
        }
      }
    } catch (e) {
      console.error('Failed to load system status:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatabaseInfo = async () => {
    try {
      const [statusRes, tablesRes] = await Promise.all([
        fetch('/api/database/status'),
        fetch('/api/database/tables'),
      ]);
      if (statusRes.ok) {
        const statusJson = await statusRes.json();
        setDbStatus(statusJson);
      }
      if (tablesRes.ok) {
        const tablesJson = await tablesRes.json();
        setDbTables(tablesJson.tables || []);
      }
    } catch (e) {
      console.error('Failed to load database info:', e);
    }
  };

  const fetchClusterInfo = async () => {
    try {
      const res = await fetch('/api/cluster/status');
      if (res.ok) {
        const json = await res.json();
        setClusterInfo(json);
        setAutoOffload(json.autoOffloadEnabled);
        setRamThreshold(json.offloadThresholdRamPercent);
      }
    } catch (e) {
      console.error('Failed to load cluster info:', e);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const res = await fetch('/api/storage/devices');
      if (res.ok) {
        const json = await res.json();
        setStorageInfo(json.storageState);
      }
    } catch (e) {
      console.error('Failed to load storage info:', e);
    }
  };

  const fetchHardwareReport = async () => {
    try {
      const res = await fetch('/api/hardware/status');
      if (res.ok) {
        const json = await res.json();
        setHardwareReport(json);
      }
    } catch (e) {
      console.error('Failed to load hardware report:', e);
    }
  };

  const fetchPeripheralsInfo = async () => {
    try {
      const res = await fetch('/api/peripherals/status');
      if (res.ok) {
        const json = await res.json();
        setPeripheralsInfo(json.peripherals);
        setRemoteRecentActions(json.recentActions || []);
      }
    } catch (e) {
      console.error('Failed to load peripherals info:', e);
    }
  };

  const handleRunHardwareScan = async () => {
    if (isScanningHardware) return;
    setIsScanningHardware(true);
    setScanProgress(15);
    setScanStage('Identificando SoC Allwinner Quad-Core Cortex-A53 y frecuencias...');

    setTimeout(() => {
      setScanProgress(38);
      setScanStage('Optimizando GPU Mali 3+2 cores y reduciendo memoria CMA a 32MB headless...');
    }, 700);

    setTimeout(() => {
      setScanProgress(62);
      setScanStage('Verificando MMC0 (eMMC 64GB) y montando MicroSD MMC1 en /mnt/sdcard...');
    }, 1400);

    setTimeout(() => {
      setScanProgress(84);
      setScanStage('Cargando controladores sunxi-cir del Mando de TV (/dev/lirc0) y USB HID...');
    }, 2100);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/hardware/scan', { method: 'POST' });
        const json = await res.json();
        setHardwareReport(json.results);
        setScanProgress(100);
        setScanStage('¡Escaneo y adaptación de hardware 100% completados con éxito!');
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => {
          setIsScanningHardware(false);
          fetchHardwareReport();
          fetchStorageInfo();
          fetchPeripheralsInfo();
        }, 1200);
      }
    }, 2800);
  };

  const handleMigrateStorage = async (target: 'microsd' | 'emmc') => {
    setIsMigratingStorage(true);
    try {
      const res = await fetch('/api/storage/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLocation: target }),
      });
      const json = await res.json();
      setStorageNotice(json.message);
      fetchStorageInfo();
    } catch (e) {
      console.error(e);
    } finally {
      setIsMigratingStorage(false);
    }
  };

  const handleFormatSdCard = async () => {
    if (!window.confirm('¿Formatear la Tarjeta MicroSD en ext4 seguro para almacenar la base de datos de la IA?')) return;
    try {
      const res = await fetch('/api/storage/format-sd', { method: 'POST' });
      const json = await res.json();
      setStorageNotice(json.message);
      fetchStorageInfo();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePressRemoteButton = async (key: string) => {
    try {
      const res = await fetch('/api/peripherals/ir-press', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const json = await res.json();
      if (json.tvScreenDisplay) {
        setTvScreenDisplay(json.tvScreenDisplay);
      }
      fetchPeripheralsInfo();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestKeyboard = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyboardTestInput.trim()) return;
    try {
      const res = await fetch('/api/peripherals/test-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: 'keyboard', payload: { text: keyboardTestInput.trim() } }),
      });
      const json = await res.json();
      setKeyboardStatusFeedback(json.message);
      setKeyboardTestInput('');
      fetchPeripheralsInfo();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestMouse = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1920);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1080);
    setMouseCoords({ x, y });
    setMouseClickCount(prev => prev + 1);

    try {
      await fetch('/api/peripherals/test-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: 'mouse', payload: { x, y } }),
      });
      fetchPeripheralsInfo();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWifiData = async () => {
    try {
      const [statusRes, scanRes] = await Promise.all([
        fetch('/api/wifi/status'),
        fetch('/api/wifi/scan'),
      ]);
      if (statusRes.ok) {
        const json = await statusRes.json();
        setWifiCurrent(json.current);
      }
      if (scanRes.ok) {
        const json = await scanRes.json();
        setWifiNetworks(json.networks || []);
      }
    } catch (e) {
      console.error('Failed to load Wi-Fi data:', e);
    }
  };

  const handleScanWifi = async () => {
    setIsScanningWifi(true);
    try {
      const res = await fetch('/api/wifi/scan');
      if (res.ok) {
        const json = await res.json();
        setWifiNetworks(json.networks || []);
      }
    } catch (e) {
      console.error('Failed to scan Wi-Fi:', e);
    } finally {
      setTimeout(() => setIsScanningWifi(false), 500);
    }
  };

  const handleConnectWifi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetSsid = isAddingHiddenNetwork ? customSsid.trim() : (selectedWifi?.ssid || '');
    if (!targetSsid || isConnectingWifi) return;

    setIsConnectingWifi(true);
    try {
      const res = await fetch('/api/wifi/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid: targetSsid, password: wifiPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        setWifiNotice(json.message);
        setWifiPassword('');
        setSelectedWifi(null);
        setIsAddingHiddenNetwork(false);
        setCustomSsid('');
        fetchWifiData();
        fetchStatus();
      } else {
        setWifiNotice(json.error || 'Error al conectar');
      }
    } catch (err: any) {
      setWifiNotice(err.message || 'Error de conexión Wi-Fi');
    } finally {
      setIsConnectingWifi(false);
    }
  };

  const handleDisconnectWifi = async () => {
    try {
      const res = await fetch('/api/wifi/disconnect', { method: 'POST' });
      const json = await res.json();
      setWifiNotice(json.message);
      fetchWifiData();
      fetchStatus();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMinecraftData = async () => {
    try {
      const res = await fetch('/api/minecraft/status');
      if (res.ok) {
        const json = await res.json();
        setMcData(json);
        if (json.server) {
          setMcSettingsDraft((prev) => ({
            ...prev,
            difficulty: json.server.difficulty,
            gamemode: json.server.gamemode,
            pvp: json.server.pvp,
            maxPlayers: json.server.maxPlayers,
            viewDistance: json.server.viewDistance,
            onlineMode: json.server.onlineMode,
            motd: json.server.motd,
            ramAllocatedMB: json.server.ramAllocatedMB,
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load Minecraft data:', e);
    }
  };

  const fetchMultiServerData = async () => {
    try {
      const res = await fetch('/api/multiserver/status');
      if (res.ok) {
        const json = await res.json();
        setMultiServices(json.services || []);
      }
    } catch (e) {
      console.error('Failed to load multi-server data:', e);
    }
  };

  const handleMinecraftControl = async (action: 'start' | 'stop' | 'restart') => {
    setMcLoading(true);
    try {
      const res = await fetch('/api/minecraft/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      setMcNotice(json.message);
      fetchMinecraftData();
      fetchMultiServerData();
    } catch (e: any) {
      setMcNotice(e.message || 'Error al controlar servidor');
    } finally {
      setMcLoading(false);
    }
  };

  const handleMinecraftCommand = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || mcCmdInput).trim();
    if (!cmd || mcCmdExecuting) return;

    setMcCmdExecuting(true);
    setMcCmdInput('');
    try {
      const res = await fetch('/api/minecraft/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const json = await res.json();
      if (json.success) {
        fetchMinecraftData();
      }
    } catch (e) {
      console.error('Error executing minecraft command:', e);
    } finally {
      setMcCmdExecuting(false);
    }
  };

  const handleSaveMinecraftSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/minecraft/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mcSettingsDraft),
      });
      const json = await res.json();
      setMcNotice(json.message);
      fetchMinecraftData();
    } catch (e: any) {
      setMcNotice(e.message || 'Error al guardar ajustes');
    }
  };

  const handlePlayerAction = async (action: 'kick' | 'op' | 'deop', playerName: string) => {
    try {
      const res = await fetch('/api/minecraft/player-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, playerName }),
      });
      const json = await res.json();
      setMcNotice(json.message);
      fetchMinecraftData();
    } catch (e: any) {
      setMcNotice(e.message);
    }
  };

  const handleClearMcLogs = async () => {
    try {
      await fetch('/api/minecraft/clear-logs', { method: 'POST' });
      fetchMinecraftData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleMultiService = async (serviceId: string) => {
    try {
      const res = await fetch('/api/multiserver/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId }),
      });
      const json = await res.json();
      setSambaFeedback(json.message);
      fetchMultiServerData();
      fetchMinecraftData();
      fetchStatus();
    } catch (e: any) {
      setSambaFeedback(e.message);
    }
  };

  const handleCreateSambaFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSambaFolder.trim()) return;
    try {
      const res = await fetch('/api/multiserver/samba/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName: newSambaFolder.trim() }),
      });
      const json = await res.json();
      setSambaFeedback(json.message);
      setNewSambaFolder('');
      fetchStorageInfo();
    } catch (e: any) {
      setSambaFeedback(e.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchDatabaseInfo();
    fetchClusterInfo();
    fetchStorageInfo();
    fetchHardwareReport();
    fetchPeripheralsInfo();
    fetchWifiData();
    fetchMinecraftData();
    fetchMultiServerData();
    const interval = setInterval(() => {
      fetchStatus();
      fetchDatabaseInfo();
      fetchClusterInfo();
      fetchStorageInfo();
      fetchPeripheralsInfo();
      fetchWifiData();
      fetchMinecraftData();
      fetchMultiServerData();
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    mcConsoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mcData?.server.consoleLogs]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAiGenerating) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiGenerating(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Error al comunicarse con el bot');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resData.reply || 'Sin respuesta del modelo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: resData.toolUsed || null,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (resData.toolUsed) {
        fetchDatabaseInfo();
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error al conectar con el bot: ${err.message}. Asegúrate de que el servicio esté activo.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleExecuteSql = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sqlQueryInput.trim() || isExecutingSql) return;

    setIsExecutingSql(true);
    try {
      const res = await fetch('/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQueryInput.trim() }),
      });
      const json = await res.json();
      setSqlResult(json);
      fetchDatabaseInfo();
    } catch (err: any) {
      setSqlResult({ error: err.message });
    } finally {
      setIsExecutingSql(false);
    }
  };

  const handleSaveMemoryManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim() || isSavingMemory) return;

    setIsSavingMemory(true);
    try {
      const res = await fetch('/api/database/store-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: newTopic.trim() || 'Nota Manual',
          memory_text: newMemoryText.trim(),
          tags: newTags.trim(),
        }),
      });
      if (res.ok) {
        setNewTopic('');
        setNewMemoryText('');
        fetchDatabaseInfo();
      }
    } catch (err) {
      console.error('Error saving memory:', err);
    } finally {
      setIsSavingMemory(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('¿Deseas restaurar la base de datos de la RS-110 a los datos iniciales?')) return;
    try {
      await fetch('/api/database/reset', { method: 'POST' });
      fetchDatabaseInfo();
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger load offloading test when RS-110 reaches peak capacity
  const handleTestOffload = async () => {
    setIsSimulatingOffload(true);
    setOffloadBannerMessage('La Game Box RS-110 alcanzó el 92% de RAM y 89% CPU. Transfiriendo cálculo pesado a la PC conectada...');
    try {
      const res = await fetch('/api/cluster/test-offload', { method: 'POST' });
      const json = await res.json();
      fetchClusterInfo();
      setTimeout(() => {
        setOffloadBannerMessage('✔ Tarea procesada en nodo "PC de Escritorio Principal". Resultados devueltos y guardados en la eMMC de la RS-110.');
        setIsSimulatingOffload(false);
        setTimeout(() => setOffloadBannerMessage(null), 5000);
      }, 3500);
    } catch (e) {
      console.error(e);
      setIsSimulatingOffload(false);
    }
  };

  const handleToggleAutoOffload = async (enabled: boolean) => {
    setAutoOffload(enabled);
    try {
      await fetch('/api/cluster/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoOffloadEnabled: enabled }),
      });
      fetchClusterInfo();
    } catch (e) {
      console.error(e);
    }
  };

  // Start live PhoenixSuit flashing simulation
  const startPhoenixSimulation = () => {
    setIsFlashingSim(true);
    setFlashProgress(5);
    setFlashStage('Detectando dispositivo Allwinner en Modo FEL (USB VID: 1f3a, PID: efe8)...');

    const steps = [
      { p: 20, msg: 'Handshake BROM exitoso. Inicializando DRAM DDR3/DDR4 (2048 MB)...' },
      { p: 40, msg: 'Formateando eMMC interna de 64GB y creando tabla de particiones ext4...' },
      { p: 65, msg: 'Escribiendo Kernel Linux 6.1 sunxi64 y U-Boot bootloader...' },
      { p: 85, msg: 'Escribiendo Rootfs Debian 12 minimal + Base de Datos SQLite (/data)...' },
      { p: 100, msg: '¡Flasheo completado con éxito (100% OK)! Desconectar USB y encender consola.' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setFlashProgress(steps[current].p);
        setFlashStage(steps[current].msg);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFlashingSim(false);
          setFlashProgress(0);
          setFlashStage('');
        }, 4000);
      }
    }, 1200);
  };

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/gemini/generate-bot-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botPlatform: generatorPlatform,
          purpose: generatorPurpose,
        }),
      });
      const json = await res.json();
      setGeneratedScript(json);
    } catch (err) {
      console.error('Failed to generate bot script:', err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleRunCommand = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || termInput).trim();
    if (!cmd || termRunning) return;

    setTermInput('');
    setTermRunning(true);

    try {
      const res = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const json = await res.json();
      setTerminalHistory((prev) => [...prev, { cmd, out: json.output || 'Ejecutado con código 0' }]);
    } catch (err: any) {
      setTerminalHistory((prev) => [...prev, { cmd, out: `Error: ${err.message}` }]);
    } finally {
      setTermRunning(false);
    }
  };

  const handleSaveSettings = async (overrides: Record<string, any> = {}) => {
    try {
      await fetch('/api/system/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerMode: devMode,
          usbDebugging: usbDebug,
          wirelessDebugging: wifiDebug,
          sshEnabled: sshActive,
          rootAccess: rootActive,
          cpuGovernor: governor,
          zramEnabled: zramActive,
          maliGpuCmaMB: gpuCma,
          aiBotEnabled: botRunning,
          botType: botType,
          ...overrides,
        }),
      });
      fetchStatus();
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const handleDownloadIso = () => {
    setIsoGenerating(true);
    setTimeout(() => {
      window.location.href = '/api/firmware/download-iso';
      setIsoGenerating(false);
    }, 1200);
  };

  const handleDownloadImg = () => {
    setImgGenerating(true);
    setTimeout(() => {
      window.location.href = '/api/firmware/download-img';
      setImgGenerating(false);
    }, 1200);
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const ip = data?.telemetry.ipAddress || '192.168.1.110';
  const cpuLoad = isSimulatingOffload ? 92 : (data?.telemetry.cpuUsagePercent || 15);
  const ramUsed = isSimulatingOffload ? 1860 : (data?.telemetry.ramUsedMB || 340);
  const ramTotal = 2048;
  const ramPercent = Math.round((ramUsed / ramTotal) * 100);
  const storageTotal = 64;
  const storageUsed = data?.hardware.storageUsedGB || 6.8;
  const storageFree = data?.hardware.storageFreeGB || 57.2;

  const currentTableData = dbTables.find((t) => t.name === selectedTable);
  const filteredRows = (currentTableData?.rows || []).filter((r) => {
    if (!dbFilter) return true;
    return JSON.stringify(r).toLowerCase().includes(dbFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Bar Contract (3 zones: Wordmark, Nav items, Primary Action) */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white whitespace-nowrap">
                  RS110-FirmwareOS
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 border border-amber-800/80 text-amber-300 font-mono font-medium">
                  Custom Firmware (CFW)
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Allwinner H313 Quad-Core · Mali-G31 MP2 · 2GB RAM · 64GB eMMC · Wi-Fi XR819/RTL8189FS
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('monitor')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'monitor'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Monitor</span>
            </button>
            <button
              onClick={() => setActiveTab('bot')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'bot'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Bot de IA</span>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'database'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Base de Datos</span>
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'hardware'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Hardware & Mando TV</span>
            </button>
            <button
              onClick={() => setActiveTab('minecraft')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'minecraft'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Minecraft & Servicios</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                Cross-Play
              </span>
            </button>
            <button
              onClick={() => setActiveTab('cluster')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'cluster'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Clúster de PCs</span>
            </button>
            <button
              onClick={() => setActiveTab('iso')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'iso'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Firmware (.ISO / .IMG)</span>
            </button>
            <button
              onClick={() => setActiveTab('devmode')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'devmode'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Usb className="w-4 h-4" />
              <span>Modo Dev</span>
            </button>
            <button
              onClick={() => setActiveTab('optimizer')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'optimizer'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Optimizador</span>
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'terminal'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TerminalIcon className="w-4 h-4" />
              <span>Terminal</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('iso');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Descargar Firmware</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pt-3 border-t border-slate-800/80 mt-3 pb-1">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'monitor' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Monitor
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'bot' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Bot IA
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'database' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Base de Datos
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'hardware' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Hardware & TV
          </button>
          <button
            onClick={() => setActiveTab('minecraft')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'minecraft' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Minecraft & Servicios</span>
          </button>
          <button
            onClick={() => setActiveTab('cluster')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'cluster' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Clúster PCs
          </button>
          <button
            onClick={() => setActiveTab('iso')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'iso' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Firmware
          </button>
          <button
            onClick={() => setActiveTab('devmode')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'devmode' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Modo Dev
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'optimizer' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Optimizador
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap ${
              activeTab === 'terminal' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Terminal
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Dynamic Alert Banner for Peak Capacity / Cluster Offload */}
        {offloadBannerMessage && (
          <div className="bg-amber-950/80 border border-amber-600/60 p-4 rounded-xl flex items-center gap-3 text-amber-200 text-xs shadow-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <div className="flex-1">
              <span className="font-bold">Desbordamiento por Capacidad Activo: </span>
              <span>{offloadBannerMessage}</span>
            </div>
          </div>
        )}

        {/* Quick Hardware Status Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">Hardware</span>
              <span className="font-semibold text-slate-200">Game Box RS-110</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">Tipo</span>
              <span className="font-mono text-amber-300">Firmware Nativo Linux (eMMC)</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">Clúster Conectado</span>
              <span className="font-mono text-cyan-400">
                {clusterInfo ? `${clusterInfo.clusterTotals.totalCores} Cores · ${clusterInfo.clusterTotals.totalRamGB}GB RAM` : '24 Cores · 48GB'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">IP Red Local</span>
              <span className="font-mono text-cyan-400">{ip}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">Uptime</span>
              <span className="font-mono text-slate-200">
                {data ? formatUptime(data.telemetry.uptime) : '10h 42m'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Cómputo Distribuido:</span>
              <span className={`font-medium ${autoOffload ? 'text-emerald-400' : 'text-slate-500'}`}>
                {autoOffload ? 'Auto (>80%)' : 'Inactivo'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Depuración:</span>
              <span className={`font-medium ${wifiDebug ? 'text-cyan-400' : 'text-slate-500'}`}>
                {wifiDebug ? 'Wi-Fi :5555' : 'Desactivada'}
              </span>
            </div>
          </div>
        </div>

        {/* TAB 1: MONITOR & HARDWARE METRICS */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CPU Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">CPU Quad-Core</span>
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                      {cpuLoad}%
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {data?.telemetry.cpuTemperatureC || 47.2}°C
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${cpuLoad > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                      style={{ width: `${Math.min(100, Math.max(5, cpuLoad))}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1 pt-1 text-[11px] font-mono text-slate-400">
                  {(data?.telemetry.cpuCoresLoad || [12, 18, 9, 14]).map((load, idx) => (
                    <div key={idx} className="bg-slate-950 p-1 rounded text-center">
                      <div className="text-[9px] text-slate-500">C{idx}</div>
                      <div className="text-slate-200 tabular-nums">{isSimulatingOffload ? 88 + idx * 3 : load}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RAM 2GB Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Memoria RAM (2 GB)</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                      {ramUsed} MB
                    </span>
                    <span className="text-xs font-mono text-slate-400">de 2048 MB</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${ramPercent > 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${ramPercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Libre: <span className="text-slate-200 font-mono tabular-nums">{2048 - ramUsed} MB</span></span>
                  <span>ZRAM: <span className="text-cyan-400 font-mono">1024 MB LZ4</span></span>
                </div>
              </div>

              {/* Storage 64GB Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Almacenamiento (64 GB eMMC)</span>
                  <HardDrive className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                      {storageFree} GB
                    </span>
                    <span className="text-xs text-slate-400">Libres para BD & IA</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${Math.round((storageUsed / storageTotal) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Ocupado Firmware: <span className="text-slate-200 font-mono">{storageUsed} GB</span></span>
                  <span className="text-emerald-400 font-medium">Salud: 99%</span>
                </div>
              </div>

              {/* Cluster Offload Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Cómputo en Clúster</span>
                  <Network className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                      2 PCs
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">Conectadas y Listas</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="text-xs text-slate-400 pt-1 flex justify-between">
                  <span>RAM Total Clúster: <span className="text-cyan-400 font-mono font-medium">50 GB</span></span>
                  <span>Tareas Derivadas: <span className="text-slate-200 font-mono">{clusterInfo?.totalOffloadedTasks || 67}</span></span>
                </div>
              </div>
            </div>

            {/* Quick Status and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-semibold text-sm text-slate-200">
                    Esquema del Firmware de Bajo Nivel en la Memoria eMMC de 64 GB
                  </h3>
                  <span className="text-xs text-amber-300 font-mono">CFW Flasheado en Bare Metal</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Este firmware sustituye la ROM Android original por un sistema operativo Linux directo, otorgando acceso completo al hardware sin capas de virtualización ni emuladores que consuman memoria.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex justify-between font-medium text-slate-300">
                      <span>Memoria RAM Física + ZRAM</span>
                      <span className="text-emerald-400 font-mono">3072 MB Efectivos</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      2GB físicos + 1GB swap comprimido LZ4 permiten ejecutar el bot y la base de datos sin colapsos por falta de memoria.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex justify-between font-medium text-slate-300">
                      <span>Cómputo Asistido por Red</span>
                      <span className="text-cyan-400 font-mono">Automático al 80%</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Si la Game Box se llena, desvía el exceso de cálculo a computadoras en la misma red Wi-Fi o cable Ethernet.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">¿Quieres probar la delegación de carga a tu PC?</span>
                  <button
                    onClick={() => setActiveTab('cluster')}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Configurar Clúster de Computadoras</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Flash & Connection Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-200 border-b border-slate-800 pb-3">
                    Flasheo e Instalación del Firmware
                  </h3>
                  <div className="space-y-3 mt-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center font-medium text-slate-200">
                        <span>Formato PhoenixSuit .IMG</span>
                        <span className="text-cyan-400 font-mono">FEL Mode</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Para flasheo directo en la eMMC de 64GB conectando cable USB A-A.
                      </p>
                      <button
                        onClick={handleDownloadImg}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar Firmware .IMG</span>
                      </button>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center font-medium text-slate-200">
                        <span>Formato Híbrido .ISO</span>
                        <span className="text-emerald-400 font-mono">Rufus / SD</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Para arrancar o instalar desde MicroSD en la ranura TF de la RS-110.
                      </p>
                      <button
                        onClick={handleDownloadIso}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar Firmware .ISO</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setActiveTab('iso')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ver Guía y Simulador PhoenixSuit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ALMACENAMIENTO DUAL & ADAPTACIÓN DE HARDWARE */}
        {activeTab === 'hardware' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">
                        Almacenamiento Dual & Adaptación de Hardware RS-110
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
                        Allwinner SoC · MMC0 / MMC1 · CIR IR
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      eMMC 64GB interno para el Sistema Linux y archivo IP de la IA + Ranura MicroSD para datos pesados de la consola. Calibra componentes y controla el mando de TV, teclado y ratón.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunHardwareScan}
                    disabled={isScanningHardware}
                    className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    {isScanningHardware ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isScanningHardware ? 'Escaneando y Adaptando...' : 'Escanear Componentes de la Game Box'}</span>
                  </button>
                </div>
              </div>

              {/* Live scan progress banner */}
              {isScanningHardware && (
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-cyan-400">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{scanStage}</span>
                    </span>
                    <span className="font-bold tabular-nums">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status Notice if storage migration occurred */}
              {storageNotice && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{storageNotice}</span>
                  </div>
                  <button
                    onClick={() => setStorageNotice(null)}
                    className="text-slate-400 hover:text-white cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* SECCIÓN 1: ARQUITECTURA DE ALMACENAMIENTO DUAL */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span>Arquitectura de Almacenamiento Dual: eMMC Interno vs Tarjeta MicroSD</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    El sistema operativo y los archivos esenciales (como la IP fija del servidor) se alojan en la memoria interna de 64GB; todos los datos pesados y base de datos van a la SD.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Ubicación actual de BD: {storageInfo?.aiDataLocation === 'microsd' ? 'Tarjeta MicroSD (/mnt/sdcard)' : 'eMMC Interno (/var/lib/ai-models)'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Almacenamiento Interno eMMC 64GB */}
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold text-xs">
                        eMMC
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">Almacenamiento Interno eMMC (64 GB)</span>
                        <span className="text-[11px] font-mono text-slate-400">Dispositivo: /dev/mmcblk0p3 · Montaje: /</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      Sistema & Core IP
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Alberga el Sistema Operativo Linux (Debian 12 minimal), Kernel 6.1, U-Boot y el archivo de configuración esencial con la IP de la IA (<code className="text-cyan-300 font-mono">/etc/rs110/server_ip.conf</code>). Se mantiene protegido contra escrituras pesadas para garantizar máxima longevidad.
                  </p>

                  {/* Visual Storage Meter */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Espacio Usado: 6.8 GB (11%)</span>
                      <span className="text-emerald-400 font-bold">57.2 GB Libres</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '11%' }} />
                    </div>
                  </div>

                  {/* Essential Files Box */}
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Archivos Esenciales Preservados en Memoria Interna:</span>
                    </span>
                    <ul className="font-mono text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                      <li><span className="text-cyan-300">/etc/rs110/server_ip.conf</span> (IP fija del Servidor de IA: 192.168.1.110)</li>
                      <li><span className="text-slate-300">/boot/u-boot-sunxi.bin</span> &amp; <span className="text-slate-300">vmlinuz-6.1-sunxi64</span></li>
                      <li><span className="text-slate-300">/etc/systemd/system/ai-bot.service</span></li>
                      <li><span className="text-slate-300">/etc/network/interfaces</span> (Configuración Ethernet/Wi-Fi)</li>
                    </ul>
                  </div>
                </div>

                {/* 2. Tarjeta MicroSD Externa (Ranura TF) */}
                <div className="p-5 bg-slate-950 rounded-xl border border-cyan-900/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        SD
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">Ranura de Tarjeta MicroSD / TF (128 GB)</span>
                        <span className="text-[11px] font-mono text-slate-400">Dispositivo: /dev/mmcblk1p1 · Montaje: /mnt/sdcard</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Datos Pesados &amp; BD IA
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aquí se guarda <strong className="text-slate-200">toda la información de la Game Box</strong>: la base de datos SQLite con los recuerdos de la IA (<code className="text-emerald-400 font-mono">ai_memory.db</code>), registros de actividad, copias de seguridad de juegos y modelos locales sin desgastar el eMMC interno.
                  </p>

                  {/* Visual Storage Meter */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Espacio Usado: 14.2 GB (11%)</span>
                      <span className="text-emerald-400 font-bold">113.8 GB Libres (ext4)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '11%' }} />
                    </div>
                  </div>

                  {/* Actions for MicroSD */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleMigrateStorage('microsd')}
                      disabled={isMigratingStorage || storageInfo?.aiDataLocation === 'microsd'}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{storageInfo?.aiDataLocation === 'microsd' ? 'Base de Datos Enlazada a SD (Activo)' : 'Migrar Base de Datos a SD'}</span>
                    </button>
                    <button
                      onClick={handleFormatSdCard}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Formatear MicroSD</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: ESCÁNER Y ADAPTADOR AUTOMÁTICO DE COMPONENTES */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Escáner de Componentes y Controladores Adaptados</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Al instalar o pulsar "Escanear", el sistema ejecuta una calibración automática que detecta el SoC Allwinner, GPU Mali, memoria ZRAM, bus MMC1 y periféricos.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Salud del Hardware:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded">
                    100% Adaptado
                  </span>
                </div>
              </div>

              {/* Grid of 9 Hardware Components */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(hardwareReport?.components || []).map((comp) => (
                  <div key={comp.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-white text-xs leading-tight">{comp.name}</span>
                      <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold">
                        Adaptado
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400">{comp.hardwareSpecs}</div>
                    <div className="text-[10px] font-mono text-slate-400">Módulo: {comp.driverKernelModule}</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed border-t border-slate-800/80 pt-2">
                      {comp.adaptationDetails}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: MANDO DE TV PREDETERMINADO & PERIFÉRICOS USB */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-amber-400" />
                    <span>Control de TV Predeterminado &amp; Periféricos USB (Teclado y Ratón)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Controla el servidor con el mando de infrarrojos original de la Game Box (presiona MENÚ para ver la IP en el televisor), o conecta teclado y ratón USB.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Receptor CIR /dev/lirc0: Activo</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual TV Remote Control (Left Column - 5 cols) */}
                <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center space-y-4">
                  <div className="flex justify-between w-full items-center text-xs text-slate-400 font-mono border-b border-slate-800 pb-2">
                    <span className="text-amber-300 font-bold">Mando Game Box RS-110</span>
                    <span>Protocolo NEC (38kHz)</span>
                  </div>

                  {/* Remote Body Graphic */}
                  <div className="w-64 bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl space-y-4 flex flex-col items-center">
                    {/* Top Row: Power & Mouse mode */}
                    <div className="flex justify-between w-full px-2">
                      <button
                        onClick={() => handlePressRemoteButton('KEY_POWER')}
                        className="w-10 h-10 rounded-full bg-red-950/80 border border-red-700 text-red-400 hover:bg-red-800 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md"
                        title="Encendido / Modo Bajo Consumo (0x45)"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePressRemoteButton('KEY_CURSOR')}
                        className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs font-mono"
                        title="Alternar Modo Ratón Virtual (0x0d)"
                      >
                        <Mouse className="w-4 h-4" />
                      </button>
                    </div>

                    {/* KEY_MENU Button: PROMINENT for viewing AI Server IP on TV */}
                    <div className="w-full px-2">
                      <button
                        onClick={() => handlePressRemoteButton('KEY_MENU')}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Tv className="w-4 h-4" />
                        <span>MENÚ (Ver IP de la IA en TV)</span>
                      </button>
                    </div>

                    {/* D-Pad Directional Arrows & OK */}
                    <div className="relative w-40 h-40 bg-slate-950 rounded-full border border-slate-700 flex items-center justify-center shadow-inner">
                      {/* Up */}
                      <button
                        onClick={() => handlePressRemoteButton('KEY_UP')}
                        className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-8 rounded-t-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95"
                        title="Arriba (0x46)"
                      >
                        ▲
                      </button>
                      {/* Down */}
                      <button
                        onClick={() => handlePressRemoteButton('KEY_DOWN')}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-8 rounded-b-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95"
                        title="Abajo (0x15)"
                      >
                        ▼
                      </button>
                      {/* Left */}
                      <button
                        onClick={() => handlePressRemoteButton('KEY_LEFT')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-10 rounded-l-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95"
                        title="Izquierda (0x40)"
                      >
                        ◄
                      </button>
                      {/* Right */}
                      <button
                        onClick={() => handlePressRemoteButton('KEY_RIGHT')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-10 rounded-r-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95"
                        title="Derecha (0x43)"
                      >
                        ►
                      </button>
                      {/* Center OK */}
                      <button
                        onClick={() => handlePressRemoteButton('KEY_OK')}
                        className="w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
                        title="OK / Seleccionar (0x44)"
                      >
                        OK
                      </button>
                    </div>

                    {/* Bottom Row: Home, Back, Volume */}
                    <div className="grid grid-cols-4 gap-2 w-full px-2">
                      <button
                        onClick={() => handlePressRemoteButton('KEY_HOMEPAGE')}
                        className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono cursor-pointer active:scale-95"
                        title="Inicio / Home (0x07)"
                      >
                        Home
                      </button>
                      <button
                        onClick={() => handlePressRemoteButton('KEY_BACK')}
                        className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono cursor-pointer active:scale-95"
                        title="Atrás (0x19)"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={() => handlePressRemoteButton('KEY_VOLUMEDOWN')}
                        className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono cursor-pointer active:scale-95"
                        title="Volumen Menos (0x09)"
                      >
                        Vol -
                      </button>
                      <button
                        onClick={() => handlePressRemoteButton('KEY_VOLUMEUP')}
                        className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono cursor-pointer active:scale-95"
                        title="Volumen Más (0x1d)"
                      >
                        Vol +
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 text-center">
                    Pulsa cualquier botón para enviar el pulso infrarrojo al decodificador Allwinner CIR.
                  </span>
                </div>

                {/* Right Column: TV Display Screen & USB Inputs (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* TV Screen Display Simulator (What appears on HDMI TV when pressing MENÚ) */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-cyan-800/80 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-xs text-white">Pantalla OSD del Televisor (Salida HDMI)</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        1080p @ 60Hz
                      </span>
                    </div>

                    {/* TV Display Card */}
                    <div className="bg-blue-950/60 border border-blue-800/70 rounded-xl p-4 space-y-2.5 font-mono text-xs">
                      <div className="text-cyan-300 font-bold text-sm tracking-wide">
                        {tvScreenDisplay?.title || 'GAME BOX RS-110 - MINI SERVIDOR IA'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-slate-900/80 p-2 rounded border border-blue-900/50">
                          <span className="text-slate-400 block text-[10px]">DIRECCIÓN IP DE LA IA:</span>
                          <span className="text-emerald-400 font-bold text-sm">{tvScreenDisplay?.ip || ip}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2 rounded border border-blue-900/50">
                          <span className="text-slate-400 block text-[10px]">PUERTO PANEL &amp; API:</span>
                          <span className="text-cyan-300 font-bold text-sm">:{tvScreenDisplay?.port || 3000}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2 rounded border border-blue-900/50">
                          <span className="text-slate-400 block text-[10px]">CONEXIÓN SSH:</span>
                          <span className="text-slate-200">{tvScreenDisplay?.ssh || `ssh root@${ip} -p 22`}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2 rounded border border-blue-900/50">
                          <span className="text-slate-400 block text-[10px]">DEPURACIÓN ADB:</span>
                          <span className="text-slate-200">{tvScreenDisplay?.adb || `adb connect ${ip}:5555`}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-cyan-400/90 pt-1 border-t border-blue-900/50 flex justify-between">
                        <span>Almacenamiento: {tvScreenDisplay?.storage || 'eMMC 64GB (Sistema) + MicroSD (Datos)'}</span>
                        <span>Presiona MENÚ en el mando para actualizar</span>
                      </div>
                    </div>
                  </div>

                  {/* USB Keyboard & Mouse Testing Box */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                    <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                      <span className="font-bold text-xs text-white flex items-center gap-2">
                        <Keyboard className="w-4 h-4 text-cyan-400" />
                        <span>Puertos USB Host: Teclado y Ratón Conectados</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Plug &amp; Play OK</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Keyboard Input Test */}
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-200">Teclado USB</span>
                          <span className="text-[10px] font-mono text-cyan-400">Puerto USB 1</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          /dev/input/event0 (104 teclas, soporte UTF-8 para consola).
                        </p>
                        <form onSubmit={handleTestKeyboard} className="flex gap-1.5 pt-1">
                          <input
                            type="text"
                            placeholder="Escribe teclas para probar..."
                            value={keyboardTestInput}
                            onChange={(e) => setKeyboardTestInput(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white placeholder-slate-500 font-mono"
                          />
                          <button
                            type="submit"
                            className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs cursor-pointer"
                          >
                            Enviar
                          </button>
                        </form>
                        {keyboardStatusFeedback && (
                          <span className="text-[10px] text-emerald-400 font-mono block">
                            {keyboardStatusFeedback}
                          </span>
                        )}
                      </div>

                      {/* Mouse Interactive Test Pad */}
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-200">Ratón USB / Air Mouse</span>
                          <span className="text-[10px] font-mono text-cyan-400">Puerto USB 2</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          /dev/input/mouse0 (Puntero acelerado por hardware HDMI).
                        </p>
                        <div
                          onClick={handleTestMouse}
                          className="h-16 bg-slate-950 rounded border border-slate-700 border-dashed flex flex-col items-center justify-center cursor-crosshair text-[11px] font-mono text-slate-400 hover:text-cyan-300 hover:border-cyan-500 transition-colors select-none"
                        >
                          <span>Haz clic aquí para probar ratón</span>
                          <span className="text-[10px] text-cyan-400">
                            X: {mouseCoords.x} | Y: {mouseCoords.y} | Clics: {mouseClickCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent IR Log Table */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 font-semibold block">
                        Registro de Pulsaciones Infrarrojas Recibidas (Allwinner CIR):
                      </span>
                      <div className="bg-slate-900 rounded-lg p-2 font-mono text-[11px] max-h-24 overflow-y-auto space-y-1 border border-slate-800">
                        {remoteRecentActions.map((act, i) => (
                          <div key={i} className="flex justify-between text-slate-300">
                            <span className="text-amber-400 font-bold">{act.name} ({act.code})</span>
                            <span className="text-slate-400 truncate max-w-[240px]">{act.description}</span>
                            <span className="text-slate-500">{act.executedAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: CONEXIÓN A RED WI-FI & ACCESO A INTERNET (ALLWINNER H313) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span>Conexión a Red Wi-Fi &amp; Acceso a Internet (Allwinner H313)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Busca redes Wi-Fi al alcance de la Game Box RS-110, selecciona tu red e ingresa la contraseña para otorgar acceso a Internet al servidor de IA.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleScanWifi}
                    disabled={isScanningWifi}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    {isScanningWifi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    <span>{isScanningWifi ? 'Buscando Redes...' : 'Buscar Redes Wi-Fi'}</span>
                  </button>

                  {wifiCurrent?.connected && (
                    <button
                      onClick={handleDisconnectWifi}
                      className="px-3 py-2 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-lg text-xs font-medium border border-red-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Desconectar
                    </button>
                  )}
                </div>
              </div>

              {/* Wi-Fi Alert Feedback */}
              {wifiNotice && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{wifiNotice}</span>
                  </div>
                  <button
                    onClick={() => setWifiNotice(null)}
                    className="text-slate-400 hover:text-white cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Current Connection Summary Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    wifiCurrent?.connected ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' : 'bg-slate-900 border border-slate-700 text-slate-500'
                  }`}>
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {wifiCurrent?.connected ? wifiCurrent.currentSsid : 'Sin Conexión Wi-Fi Activa'}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        wifiCurrent?.connected ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}>
                        {wifiCurrent?.connected ? 'Conectado a Internet' : 'Desconectado'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Chip: Allwinner H313 SDIO ({wifiCurrent?.driver || 'xradio_wlan / RTL8189FS'}) · MAC: {wifiCurrent?.macAddress || 'cc:4b:73:a1:8f:12'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-xs font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Dirección IP Local</span>
                    <span className="text-emerald-400 font-bold">{wifiCurrent?.ipAddress || ip}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Potencia de Señal</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <Signal className="w-3.5 h-3.5" />
                      <span>{wifiCurrent?.signalPercent || 88}%</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Gateway Router</span>
                    <span className="text-slate-300">{wifiCurrent?.gateway || '192.168.1.1'}</span>
                  </div>
                </div>
              </div>

              {/* Network Scan Results & Connection Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Available Networks List (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-white flex items-center gap-2">
                      <Signal className="w-4 h-4 text-cyan-400" />
                      <span>Redes Wi-Fi Detectadas en el Área ({wifiNetworks.length})</span>
                    </span>
                    <button
                      onClick={() => {
                        setIsAddingHiddenNetwork(!isAddingHiddenNetwork);
                        setSelectedWifi(null);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                    >
                      {isAddingHiddenNetwork ? 'Cancelar Red Manual' : '+ Conectar a Red Oculta'}
                    </button>
                  </div>

                  {isScanningWifi ? (
                    <div className="py-8 text-center space-y-2 text-xs text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                      <span>Escaneando frecuencias de 2.4 GHz y 5 GHz del Allwinner H313...</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {wifiNetworks.map((net) => {
                        const isSelected = selectedWifi?.ssid === net.ssid;
                        return (
                          <div
                            key={net.ssid}
                            onClick={() => {
                              setSelectedWifi(net);
                              setIsAddingHiddenNetwork(false);
                            }}
                            className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              net.connected
                                ? 'bg-emerald-950/40 border-emerald-700/80 text-white'
                                : isSelected
                                ? 'bg-cyan-950/50 border-cyan-500 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Signal className={`w-4 h-4 ${
                                net.signalPercent > 70 ? 'text-emerald-400' : net.signalPercent > 40 ? 'text-amber-400' : 'text-slate-500'
                              }`} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm">{net.ssid}</span>
                                  {net.connected && (
                                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded font-mono">
                                      Conectado
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>{net.frequency} · Canal {net.channel}</span>
                                  <span>· BSSID: {net.bssid}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                {net.security !== 'Abierta' ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-slate-400" />}
                                <span>{net.security}</span>
                              </span>
                              <span className="font-mono text-xs font-bold tabular-nums text-slate-300">
                                {net.signalPercent}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Password Entry Box (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h5 className="font-bold text-xs text-white">
                      {isAddingHiddenNetwork
                        ? 'Conectar a Red Oculta o Manual'
                        : selectedWifi
                        ? `Conectar a "${selectedWifi.ssid}"`
                        : 'Selecciona una red de la lista'}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Ingresa la contraseña de seguridad para que la Game Box RS-110 se conecte al router.
                    </p>
                  </div>

                  {isAddingHiddenNetwork ? (
                    <div className="space-y-1.5">
                      <label className="text-slate-300 text-xs font-semibold block">Nombre de la Red (SSID):</label>
                      <input
                        type="text"
                        placeholder="Ej: MiRedOculta"
                        value={customSsid}
                        onChange={(e) => setCustomSsid(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                      />
                    </div>
                  ) : null}

                  {selectedWifi || isAddingHiddenNetwork ? (
                    <form onSubmit={handleConnectWifi} className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-slate-300 text-xs font-semibold block">Contraseña de Wi-Fi:</label>
                        <div className="relative">
                          <input
                            type={showWifiPassword ? 'text' : 'password'}
                            placeholder="Introduce la clave de tu red Wi-Fi..."
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowWifiPassword(!showWifiPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isConnectingWifi}
                        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs font-mono transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isConnectingWifi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                        <span>{isConnectingWifi ? 'Autenticando y solicitando IP...' : 'Conectar Game Box a Internet'}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 text-center text-xs text-slate-400 space-y-2">
                      <Wifi className="w-8 h-8 mx-auto text-slate-600" />
                      <p>
                        Haz clic en cualquiera de las redes Wi-Fi de la lista izquierda para ingresar tu contraseña y conectar la consola.
                      </p>
                    </div>
                  )}

                  {/* Persistence Notice */}
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Guardado Automático:</span>
                    <p>
                      La clave se cifra en <code className="text-cyan-300 font-mono">/etc/wpa_supplicant/wpa_supplicant.conf</code> dentro de la eMMC de 64GB. La Game Box se reconectará sola en cada reinicio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CLUSTER & DISTRIBUTED COMPUTE (Offloading when RS-110 reaches peak capacity) */}
        {activeTab === 'cluster' && (
          <div className="space-y-6">
            {/* Header explanation banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">
                        Cómputo Distribuido: Asistencia de Computadoras Conectadas
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950 border border-blue-800 text-blue-300">
                        Cluster Load Shedding
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Cuando la Game Box RS-110 llega al tope de su capacidad (2GB RAM / 4 cores), automáticamente deriva los cálculos pesados a las PCs conectadas en tu red local.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestOffload}
                    disabled={isSimulatingOffload}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSimulatingOffload ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>Simular Carga Pico (100% RS-110)</span>
                  </button>
                </div>
              </div>

              {/* Threshold controls */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Desbordamiento Automático</span>
                    <button
                      onClick={() => handleToggleAutoOffload(!autoOffload)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        autoOffload ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                          autoOffload ? 'left-5.5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Activa la delegación instantánea a computadoras auxiliares cuando se alcance el límite.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Umbral Activación RAM</span>
                    <span className="font-mono text-cyan-400 font-bold">{ramThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    value={ramThreshold}
                    onChange={(e) => setRamThreshold(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500 flex justify-between font-mono">
                    <span>Conservador (60%)</span>
                    <span>Pico (95%)</span>
                  </div>
                </div>

                {/* Controlled Micro-Fraction of PC */}
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Fracción en PC (Sin Exagerar)</span>
                    <span className="font-mono text-emerald-400 font-bold">{pcFractionSlider}% CPU</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={pcFractionSlider}
                    onChange={(e) => setPcFractionSlider(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                    <span>Mínimo (5%)</span>
                    <span className="text-emerald-400 font-bold">Máx 1 núcleo (20%)</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">Prioridad en tu Computador</span>
                    <span className="text-emerald-400 font-bold font-mono">nice +19 (Idle)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Solo aprovecha micro-ciclos ociosos. Tu PC no nota ninguna ralentización mientras juegas o trabajas.
                  </p>
                </div>
              </div>
            </div>

            {/* List of Connected Computers & Nodes */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <MonitorIcon className="w-4 h-4 text-cyan-400" />
                  <span>Computadoras Conectadas como Nodos Auxiliares</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">2 Nodos Activos en Red Local</span>
              </div>

              <div className="space-y-3">
                {/* Master Node (RS-110) */}
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-bold font-mono text-xs">
                      MAIN
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">Game Box RS-110 (Maestro & Base de Datos)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                          Master Coordinator
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        IP: {ip} · Allwinner Quad-Core Cortex-A53 · 2GB RAM · 64GB eMMC
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Carga RAM</span>
                      <span className={ramPercent > 80 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {ramUsed} MB ({ramPercent}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Rol Exclusivo</span>
                      <span className="text-slate-200">Base de Datos & Webhooks</span>
                    </div>
                  </div>
                </div>

                {/* Worker Node 1: Desktop PC */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center">
                      <MonitorIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">PC de Escritorio Principal (Windows / Linux)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${isSimulatingOffload ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                          {isSimulatingOffload ? 'PROCESANDO TAREA DELEGADA' : 'Listo en Espera'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        IP: 192.168.1.50 · AMD Ryzen 7 5800X (16 Cores) · 32GB RAM · RTX 3060 12GB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tareas Completadas</span>
                      <span className="text-cyan-400 font-bold">44 Tareas</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Latencia Red</span>
                      <span className="text-emerald-400 font-mono">1.2 ms (Ethernet)</span>
                    </div>
                  </div>
                </div>

                {/* Worker Node 2: Laptop */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center">
                      <Laptop className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">Laptop Auxiliar (Wi-Fi)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400">
                          Listo en Espera
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        IP: 192.168.1.75 · Intel Core i5-12400 (8 Cores) · 16GB RAM · Iris Xe
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tareas Completadas</span>
                      <span className="text-cyan-400 font-bold">23 Tareas</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Latencia Red</span>
                      <span className="text-emerald-400 font-mono">3.4 ms (Wi-Fi 6)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions on how to connect any PC to the RS-110 */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">¿Cómo conectar tu PC o Laptop para que ayude a la Game Box?</span>
                  <a
                    href="/api/firmware/download-config?file=rs110_cluster_worker.py"
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar rs110_cluster_worker.py</span>
                  </a>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Solo necesitas ejecutar el script worker en cualquier computadora conectada a la misma red de la Game Box. El worker se anunciará automáticamente y recibirá las solicitudes pesadas de inferencia cuando la RS-110 alcance el 80% de memoria RAM.
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-cyan-300 flex justify-between items-center text-[11px]">
                  <span>python rs110_cluster_worker.py --master http://{ip}:3000</span>
                  <button
                    onClick={() => handleCopy(`python rs110_cluster_worker.py --master http://${ip}:3000`, 'pywork')}
                    className="cursor-pointer text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'pywork' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FIRMWARE (.ISO / .IMG) FLASHER SUITE */}
        {activeTab === 'iso' && (
          <div className="space-y-6">
            {/* Primary Firmware Box */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-amber-800/50 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
                      FIRMWARE COMPLETO DE BAJO NIVEL (CFW)
                    </span>
                    <span className="text-xs text-emerald-400">Reemplazo total de Android / Retro Games</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    RS110_Linux_AIServer_CFW_v2.4
                  </h2>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Este firmware instala Linux Debian 12 nativo directamente en la memoria eMMC de 64GB de la Game Box RS-110. Elimina todo el software de fábrica innecesario para entregar el 100% de la CPU Quad-Core y los 2GB de RAM al servidor de IA y su base de datos.
                  </p>
                  {/* Standalone Game Box Clarification Callout */}
                  <div className="p-3 bg-cyan-950/70 border border-cyan-800 rounded-lg text-xs text-cyan-200 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-white block">Aclaración de Arquitectura Standalone:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <strong className="text-cyan-300">TODO el firmware, el sistema operativo Linux y la base de datos se ejecutan 100% dentro de la Game Box RS-110.</strong> Tu PC NO es el servidor ni donde vive el firmware. La PC solo se usa 3 minutos con PhoenixSuit y el cable USB para transferir el firmware a la memoria interna de 64GB (o quemar la .ISO a una MicroSD). Al terminar el flasheo, desconectas la consola y la Game Box funciona sola de forma 100% autónoma.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleDownloadImg}
                      disabled={imgGenerating}
                      className="px-5 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      {imgGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      <span>Descargar Formato .IMG (PhoenixSuit)</span>
                    </button>

                    <button
                      onClick={handleDownloadIso}
                      disabled={isoGenerating}
                      className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      {isoGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      <span>Descargar Formato .ISO (Rufus / SD)</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-center text-slate-400 font-mono">
                    SHA256: a8f94d12...fa2891 · Tamaño: 1.24 GB
                  </span>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">SoC Compatible</span>
                  <span className="font-semibold text-cyan-400">Allwinner H313 (sun50iw9p1)</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Nivel de Instalación</span>
                  <span className="font-semibold text-amber-300">Bare Metal (eMMC 64GB)</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Herramienta de Flasheo</span>
                  <span className="font-semibold text-cyan-400">PhoenixSuit v1.10 (FEL)</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Wi-Fi &amp; Internet</span>
                  <span className="font-semibold text-emerald-400">XR819 / RTL8189FS (DHCP)</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Base de Datos</span>
                  <span className="font-semibold text-slate-200">SQLite WAL (/mnt/sdcard)</span>
                </div>
              </div>
            </div>

            {/* Live PhoenixSuit Flashing Simulator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-white">Simulador de Flasheo con PhoenixSuit en Vivo</h4>
                  <p className="text-xs text-slate-400">
                    Comprueba en pantalla cómo PhoenixSuit detecta el chip Allwinner de la RS-110 y graba el firmware.
                  </p>
                </div>
                <button
                  onClick={startPhoenixSimulation}
                  disabled={isFlashingSim}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 font-mono text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isFlashingSim ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Probar Simulación de Flasheo</span>
                </button>
              </div>

              {isFlashingSim ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-cyan-400">
                    <span>{flashStage}</span>
                    <span className="font-bold tabular-nums">{flashProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${flashProgress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Dispositivo: Allwinner FEL USB (1f3a:efe8)</span>
                    <span>Destino: /dev/mmcblk0 (64GB eMMC)</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Pulsa "Probar Simulación de Flasheo" para ver la secuencia exacta de comunicación BROM y escritura de bloques de la Game Box.</span>
                </div>
              )}
            </div>

            {/* Binary Components Explorer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-white">Componentes Binarios Incluidos en el Firmware</h4>
                <p className="text-xs text-slate-400">
                  Desglose de los módulos de bajo nivel que PhoenixSuit graba en cada partición física de la eMMC.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5 font-semibold">Módulo / Archivo</th>
                      <th className="p-2.5 font-semibold">Tamaño</th>
                      <th className="p-2.5 font-semibold">Destino en eMMC</th>
                      <th className="p-2.5 font-semibold">Función</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="hover:bg-slate-950/60">
                      <td className="p-2.5 text-amber-300 font-bold">boot0_nand.bin</td>
                      <td className="p-2.5 text-slate-400">32 KB</td>
                      <td className="p-2.5 text-slate-400">Sector 16 (SPL)</td>
                      <td className="p-2.5 text-slate-300">Inicializa la memoria RAM DDR3/DDR4 2GB y frecuencias de CPU.</td>
                    </tr>
                    <tr className="hover:bg-slate-950/60">
                      <td className="p-2.5 text-cyan-300 font-bold">u-boot.bin</td>
                      <td className="p-2.5 text-slate-400">896 KB</td>
                      <td className="p-2.5 text-slate-400">Sector 40</td>
                      <td className="p-2.5 text-slate-300">Bootloader con soporte de recuperación USB FEL y paso de bootargs.</td>
                    </tr>
                    <tr className="hover:bg-slate-950/60">
                      <td className="p-2.5 text-white font-bold">sunxi-rs110-ai.dtb</td>
                      <td className="p-2.5 text-slate-400">42 KB</td>
                      <td className="p-2.5 text-slate-400">/boot/dtb</td>
                      <td className="p-2.5 text-slate-300">Device Tree: ajusta CMA Mali GPU a 32MB y habilita USB OTG gadget.</td>
                    </tr>
                    <tr className="hover:bg-slate-950/60">
                      <td className="p-2.5 text-emerald-300 font-bold">boot.img (Kernel 6.1)</td>
                      <td className="p-2.5 text-slate-400">28 MB</td>
                      <td className="p-2.5 text-slate-400">/boot (FAT16)</td>
                      <td className="p-2.5 text-slate-300">Kernel Linux 6.1 LTS compilado para Quad-Core ARMv8 sunxi64 con ZRAM.</td>
                    </tr>
                    <tr className="hover:bg-slate-950/60">
                      <td className="p-2.5 text-blue-300 font-bold">rootfs.ext4</td>
                      <td className="p-2.5 text-slate-400">5.2 GB (Expandido)</td>
                      <td className="p-2.5 text-slate-400">/ (ext4 48GB)</td>
                      <td className="p-2.5 text-slate-300">Debian 12 minimal headless con Python 3.11, OpenSSH y systemd AI Bot.</td>
                    </tr>
                    <tr className="hover:bg-slate-950/60">
                      <td className="p-2.5 text-purple-300 font-bold">ai_memory.db</td>
                      <td className="p-2.5 text-slate-400">24 MB (Auto 10GB)</td>
                      <td className="p-2.5 text-slate-400">/var/lib/ai-models</td>
                      <td className="p-2.5 text-slate-300">Base de datos SQLite persistente con soporte para Function Calling.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-step PhoenixSuit guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                Pasos para Flashear el Firmware en la Game Box RS-110
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>Descarga el firmware en formato <code className="text-amber-300 font-mono">.IMG</code> o <code className="text-cyan-300 font-mono">.ISO</code>.</li>
                <li>Abre **PhoenixSuit v1.10** en tu PC y selecciona la imagen descargada en la pestaña **Firmware**.</li>
                <li>Con la consola apagada, introduce un palillo en el puerto **AV** para presionar el **botón oculto de Modo FEL**.</li>
                <li>Conecta el cable **USB A-A** al puerto USB 1 de la Game Box y a la PC; PhoenixSuit iniciará el formateo e instalación.</li>
                <li>Al terminar al 100%, desconecta el cable USB, conecta el cargador y el cable de red. ¡La consola arrancará como servidor de IA!</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 2: AI BOT HUB & SERVER RUNNER */}
        {activeTab === 'bot' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${botRunning ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Servidor del Bot de Inteligencia Artificial</h3>
                  <p className="text-xs text-slate-400">
                    Servicio daemon <code className="font-mono text-cyan-400">ai-bot.service</code> ejecutándose con acceso directo a la base de datos de la RS-110.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const next = !botRunning;
                    setBotRunning(next);
                    handleSaveSettings({ aiBotEnabled: next });
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    botRunning
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                >
                  {botRunning ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Detener Servicio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Iniciar Servicio</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setBotRunning(false);
                    setTimeout(() => {
                      setBotRunning(true);
                      handleSaveSettings({ aiBotEnabled: true });
                    }, 500);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>

            {/* Two-Column: Interactive Bot Test & Bot Script Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Live AI Bot Test with Database Memory Integration */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[560px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-sm text-slate-200">
                      Consola de Prueba con Acceso a Base de Datos
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">BD eMMC Conectada</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 p-2 my-3 font-sans text-xs">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                        <span>{m.role === 'user' ? 'Tú (Cliente)' : 'Bot RS-110'}</span>
                        <span>·</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-xl p-3 leading-relaxed space-y-2 ${
                          m.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-950 text-slate-200 border border-slate-800'
                        }`}
                      >
                        {m.toolUsed && (
                          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5">
                            <Database className="w-3 h-3 shrink-0" />
                            <span>
                              BD RS-110: {m.toolUsed.name}({JSON.stringify(m.toolUsed.args)})
                            </span>
                          </div>
                        )}
                        <div>{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {isAiGenerating && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>El bot en la Game Box RS-110 está procesando y consultando la base de datos...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Prueba: 'Guarda que mi cumpleaños es el 15 de marzo' o '¿Qué recuerdos tienes guardados?'..."
                    disabled={isAiGenerating}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputPrompt.trim() || isAiGenerating}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Bot Generator & Deployment Script */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-sm text-slate-200">
                        Generador de Código para tu Bot en RS-110
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">Python 3 / Node.js</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    Crea automáticamente los scripts de ejecución en Python optimizados para el procesador Quad-Core y los 2GB de RAM de tu consola Game Box con integración a su base de datos.
                  </p>

                  <div className="space-y-3 mt-4 text-xs">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Plataforma del Bot:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Telegram', 'Discord', 'WhatsApp / Webhook'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setGeneratorPlatform(p)}
                            className={`py-1.5 px-2 rounded-lg font-medium text-center border transition-colors cursor-pointer ${
                              generatorPlatform === p
                                ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Propósito o Función del Bot:</label>
                      <input
                        type="text"
                        value={generatorPurpose}
                        onChange={(e) => setGeneratorPurpose(e.target.value)}
                        placeholder="Ej: Asistente personal, responder preguntas con IA, base de datos local..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      onClick={handleGenerateScript}
                      disabled={isGeneratingScript}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                    >
                      {isGeneratingScript ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generando scripts con conexión a BD de RS-110...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generar Código (main.py y ai-bot.service)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {generatedScript ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono text-cyan-400 font-medium">/opt/rs110-bot/main.py</span>
                      <button
                        onClick={() => handleCopy(generatedScript.mainCode || '', 'maincode')}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'maincode' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copiar Código</span>
                      </button>
                    </div>
                    <pre className="max-h-36 overflow-y-auto text-[11px] font-mono text-slate-300 bg-slate-900/60 p-2 rounded">
                      {generatedScript.mainCode || 'Código generado...'}
                    </pre>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
                    💡 <strong>Conexión Base de Datos:</strong> Los scripts generados incluyen la conexión nativa a <code className="text-emerald-400 font-mono">/var/lib/ai-models/ai_memory.db</code> para que la IA guarde el contexto permanentemente.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DATABASE & AI MEMORY ENGINE */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">
                        Servidor de Base de Datos y Memoria Persistente para la IA
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-300">
                        SQLite 3.42 WAL
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Ubicación en eMMC 64GB: <code className="font-mono text-cyan-400">/var/lib/ai-models/ai_memory.db</code>. La IA lee y escribe aquí sus recuerdos y conocimientos.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchDatabaseInfo}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Actualizar</span>
                  </button>
                  <button
                    onClick={handleResetDb}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-400 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    Restaurar Datos
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Total Tablas</span>
                  <span className="font-bold text-slate-200 text-base font-mono">
                    {dbTables.length} Tablas
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Registros Totales</span>
                  <span className="font-bold text-emerald-400 text-base font-mono tabular-nums">
                    {dbStatus?.totalRecords || 7} Registros
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Consultas IA Procesadas</span>
                  <span className="font-bold text-cyan-400 text-base font-mono tabular-nums">
                    {dbStatus?.totalQueriesProcessed || 84}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Espacio eMMC Asignado</span>
                  <span className="font-bold text-slate-200 text-base font-mono">
                    8.0 GB Máx (Partición ext4)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {dbTables.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => setSelectedTable(t.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono whitespace-nowrap transition-colors cursor-pointer ${
                            selectedTable === t.name
                              ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t.name} ({t.rows.length})
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={dbFilter}
                        onChange={(e) => setDbFilter(e.target.value)}
                        placeholder="Filtrar registros..."
                        className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 max-h-72">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                        <tr>
                          {selectedTable === 'ai_memory' && (
                            <>
                              <th className="p-2.5 font-semibold">ID</th>
                              <th className="p-2.5 font-semibold">Tema</th>
                              <th className="p-2.5 font-semibold">Contenido / Memoria</th>
                              <th className="p-2.5 font-semibold">Tags</th>
                              <th className="p-2.5 font-semibold text-right">Accesos</th>
                            </>
                          )}
                          {selectedTable === 'knowledge_base' && (
                            <>
                              <th className="p-2.5 font-semibold">ID</th>
                              <th className="p-2.5 font-semibold">Clave</th>
                              <th className="p-2.5 font-semibold">Título</th>
                              <th className="p-2.5 font-semibold">Categoría</th>
                              <th className="p-2.5 font-semibold">Documento</th>
                            </>
                          )}
                          {selectedTable === 'conversations' && (
                            <>
                              <th className="p-2.5 font-semibold">ID</th>
                              <th className="p-2.5 font-semibold">Sesión</th>
                              <th className="p-2.5 font-semibold">Rol</th>
                              <th className="p-2.5 font-semibold">Mensaje</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {filteredRows.length > 0 ? (
                          filteredRows.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                              {selectedTable === 'ai_memory' && (
                                <>
                                  <td className="p-2.5 text-cyan-400">#{row.id}</td>
                                  <td className="p-2.5 font-semibold text-white whitespace-nowrap">{row.topic}</td>
                                  <td className="p-2.5 max-w-md truncate">{row.memory_text}</td>
                                  <td className="p-2.5 text-slate-500 whitespace-nowrap">{row.tags}</td>
                                  <td className="p-2.5 text-right text-emerald-400 tabular-nums">{row.access_count}</td>
                                </>
                              )}
                              {selectedTable === 'knowledge_base' && (
                                <>
                                  <td className="p-2.5 text-cyan-400">#{row.id}</td>
                                  <td className="p-2.5 font-medium text-amber-300 whitespace-nowrap">{row.key}</td>
                                  <td className="p-2.5 text-white font-medium whitespace-nowrap">{row.title}</td>
                                  <td className="p-2.5 text-slate-400 whitespace-nowrap">{row.category}</td>
                                  <td className="p-2.5 max-w-sm truncate">{row.document_content}</td>
                                </>
                              )}
                              {selectedTable === 'conversations' && (
                                <>
                                  <td className="p-2.5 text-cyan-400">#{row.id}</td>
                                  <td className="p-2.5 text-slate-400">{row.session_id}</td>
                                  <td className="p-2.5 font-semibold">{row.role}</td>
                                  <td className="p-2.5 max-w-md truncate">{row.content}</td>
                                </>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-slate-500 text-xs">
                              No hay registros que coincidan con la búsqueda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SQL Query Console */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                      <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Consola SQL Directa para la Game Box RS-110</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">SQLite 3</span>
                  </div>

                  <form onSubmit={handleExecuteSql} className="space-y-2">
                    <textarea
                      value={sqlQueryInput}
                      onChange={(e) => setSqlQueryInput(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                      placeholder="Escribe tu consulta SQL (ej: SELECT * FROM ai_memory;)"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {['SELECT * FROM ai_memory;', 'SELECT * FROM knowledge_base;'].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setSqlQueryInput(q)}
                            className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={isExecutingSql}
                        className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isExecutingSql ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>Ejecutar SQL</span>
                      </button>
                    </div>
                  </form>

                  {sqlResult && (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono max-h-36 overflow-y-auto">
                      <div className="text-slate-500 text-[10px] mb-1">Resultado de la consulta:</div>
                      <pre className="text-slate-300 whitespace-pre-wrap">
                        {JSON.stringify(sqlResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Insert Memory & AI Memory Connection */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Guardar Dato / Memoria en la RS-110</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Inserta información manualmente para que la IA la consulte.
                    </p>
                  </div>

                  <form onSubmit={handleSaveMemoryManual} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Tema / Título:</label>
                      <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Ej: Servidor Web, Recordatorio, Clave..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Contenido que la IA debe recordar:</label>
                      <textarea
                        value={newMemoryText}
                        onChange={(e) => setNewMemoryText(e.target.value)}
                        rows={3}
                        placeholder="Ej: El bot debe responder de forma técnica..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Etiquetas (separadas por comas):</label>
                      <input
                        type="text"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="ej: red, hardware, personal"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newMemoryText.trim() || isSavingMemory}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSavingMemory ? <RefreshCw className="w-4 h-4 animate-spin" /> : <SaveIcon className="w-4 h-4" />}
                      <span>Guardar en Base de Datos eMMC</span>
                    </button>
                  </form>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span>Conectar Bots Externos a la RS-110</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Usa la Game Box como base de datos central para tus bots de Python o Node.js.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                      <div className="text-slate-500 mb-1"># Conectar cliente Python a la RS-110:</div>
                      <div className="text-cyan-400">import requests</div>
                      <div>r = requests.post(</div>
                      <div className="pl-2">"http://{ip}:3000/api/database/query",</div>
                      <div className="pl-2">json=&#123;"query": "SELECT * FROM ai_memory"&#125;</div>
                      <div>)</div>
                      <div className="text-emerald-400">print(r.json())</div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href="/api/firmware/download-config?file=ai_database_client.py"
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-center rounded text-[11px] font-mono border border-slate-700 transition-colors"
                      >
                        Cliente Python
                      </a>
                      <a
                        href="/api/firmware/download-config?file=init_ai_database.sql"
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-center rounded text-[11px] font-mono border border-slate-700 transition-colors"
                      >
                        Esquema .SQL
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEVELOPER MODE & DEBUGGING (USB & WIRELESS) */}
        {activeTab === 'devmode' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-base text-white">Modo Desarrollador & Opciones de Depuración</h3>
                  <p className="text-xs text-slate-400">
                    Controla los protocolos de depuración por USB OTG, ADB inalámbrico por Wi-Fi y acceso root para la Game Box RS-110.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Modo Desarrollador</span>
                  <button
                    onClick={() => {
                      const next = !devMode;
                      setDevMode(next);
                      handleSaveSettings({ developerMode: next });
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      devMode ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                        devMode ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center">
                        <Usb className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-200">Depuración por USB</div>
                        <div className="text-xs text-slate-400">Módulo Gadget USB OTG (Puerto USB 1)</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !usbDebug;
                        setUsbDebug(next);
                        handleSaveSettings({ usbDebugging: next });
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        usbDebug ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                          usbDebug ? 'left-5.5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Permite conectar la Game Box RS-110 a tu PC mediante un cable USB macho a macho para transferir archivos, flashear con PhoenixSuit y ejecutar comandos <code className="text-cyan-400 font-mono">adb</code> directamente.
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
                    <span>Estado: {usbDebug ? <span className="text-emerald-400">Activo (Ready)</span> : 'Inactivo'}</span>
                    <span>Driver: g_ffs / sunxi-otg</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center">
                        <Wifi className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-200">Depuración Inalámbrica</div>
                        <div className="text-xs text-slate-400">ADB over Wi-Fi / Ethernet (TCP:5555)</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !wifiDebug;
                        setWifiDebug(next);
                        handleSaveSettings({ wirelessDebugging: next });
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        wifiDebug ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                          wifiDebug ? 'left-5.5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Depura tu bot y envía archivos a través de la red local sin necesidad de cables. Conéctate desde cualquier computadora en la misma red Wi-Fi.
                  </p>
                  <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>adb connect {ip}:5555</span>
                    <button
                      onClick={() => handleCopy(`adb connect ${ip}:5555`, 'wificmd')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedKey === 'wificmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                        <TerminalIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-200">Servidor OpenSSH</div>
                        <div className="text-xs text-slate-400">Puerto 22 · Terminal remota cifrada</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !sshActive;
                        setSshActive(next);
                        handleSaveSettings({ sshEnabled: next });
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        sshActive ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                          sshActive ? 'left-5.5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Acceso por consola Linux con soporte para autenticación por clave pública o contraseña predeterminada (<code className="font-mono text-slate-300">rs110root</code>).
                  </p>
                  <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>ssh root@{ip} -p 22</span>
                    <button
                      onClick={() => handleCopy(`ssh root@${ip} -p 22`, 'sshcmd')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedKey === 'sshcmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-200">Acceso Root Completo</div>
                        <div className="text-xs text-slate-400">Permisos de superusuario para el bot</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !rootActive;
                        setRootActive(next);
                        handleSaveSettings({ rootAccess: next });
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        rootActive ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                          rootActive ? 'left-5.5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Permite que tu bot de IA ejecute comandos del sistema operativo, gestione puertos GPIO, reinicie servicios de red y modifique archivos sin restricciones.
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
                    <span>UID: 0 (root)</span>
                    <span>Sudo NOPASSWD: Activo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OPTIMIZER SUITE */}
        {activeTab === 'optimizer' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Suite de Optimización de Rendimiento RS-110</h3>
                <p className="text-xs text-slate-400">
                  Ajustes para maximizar la memoria RAM libre de los 2GB físicos y evitar sobrecalentamiento en la carcasa pequeña de la Game Box.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-200">Compresión ZRAM (LZ4)</span>
                    <button
                      onClick={() => {
                        const next = !zramActive;
                        setZramActive(next);
                        handleSaveSettings({ zramEnabled: next });
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        zramActive ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                          zramActive ? 'left-5.5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Crea un área de intercambio comprimida en RAM con ratio 3.1x. Convierte tus 2GB de RAM en más de 3GB de memoria de trabajo para el bot de IA.
                  </p>
                  <div className="pt-2 text-xs font-mono text-cyan-400 flex justify-between">
                    <span>Tamaño: 1024 MB</span>
                    <span>Algoritmo: LZ4 ultra-rápido</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-200">Memoria GPU Mali 3+2 Core</span>
                    <span className="text-xs font-mono text-amber-400 font-bold">{gpuCma} MB</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Las TV Box reservan 256MB para salida 4K de video. Como este es un mini servidor headless, reducimos la memoria de video a solo 32MB.
                  </p>
                  <div className="flex gap-2 pt-1">
                    {[16, 32, 64].map((mb) => (
                      <button
                        key={mb}
                        onClick={() => {
                          setGpuCma(mb);
                          handleSaveSettings({ maliGpuCmaMB: mb });
                        }}
                        className={`flex-1 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                          gpuCma === mb
                            ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {mb}MB
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-200">Governor de CPU Quad-Core</span>
                    <span className="text-xs font-mono text-cyan-400">{governor}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ajusta la frecuencia dinámica para mantener las temperaturas por debajo de 55°C sin estrangulamiento térmico (thermal throttling).
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {(['schedutil', 'ondemand', 'performance', 'powersave'] as const).map((gov) => (
                      <button
                        key={gov}
                        onClick={() => {
                          setGovernor(gov);
                          handleSaveSettings({ cpuGovernor: gov });
                        }}
                        className={`py-1 text-[11px] font-mono rounded border text-center transition-colors cursor-pointer ${
                          governor === gov
                            ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {gov}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Limpieza Profunda de Bloatware de Consola / Android</span>
                  <span className="text-emerald-400 font-mono font-medium">58 GB Reclamados</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Eliminados emuladores y ROMs de stock</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Eliminados servicios de Google Play y Cast</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Desactivada aceleración de video en reposo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INTERACTIVE WEB TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-sm text-slate-200">
                    Consola Linux Interactiva (Game Box RS-110 - aarch64)
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">root@rs110-ai-box:~#</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 text-[11px]">Comandos rápidos:</span>
                {['neofetch', 'free -h', 'adb devices', 'systemctl status ai-bot', 'lsblk', 'rs110-cluster status', 'mali-status', 'uname -a', 'help'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleRunCommand(cmd)}
                    disabled={termRunning}
                    className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono rounded border border-slate-800 transition-colors cursor-pointer text-[11px]"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-slate-200 h-[420px] overflow-y-auto space-y-3">
                <div className="text-slate-500 text-[11px]">
                  # RS110-FirmwareOS (Linux 6.1 sunxi64 aarch64 - Allwinner Quad-Core 2GB/64GB)
                  # Escribe cualquier comando Linux o presiona los botones de acceso rápido.
                </div>

                {terminalHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-cyan-400 flex items-center gap-2">
                      <span className="text-emerald-400">root@rs110-ai-box:~#</span>
                      <span className="text-white font-medium">{item.cmd}</span>
                    </div>
                    <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed pl-2 border-l border-slate-800">
                      {item.out}
                    </pre>
                  </div>
                ))}
                {termRunning && (
                  <div className="flex items-center gap-2 text-slate-400 italic">
                    <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                    <span>Ejecutando comando en el kernel de la RS-110...</span>
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunCommand();
                }}
                className="flex gap-2"
              >
                <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus-within:border-cyan-500 transition-colors">
                  <span className="text-emerald-400 mr-2 shrink-0">root@rs110:~#</span>
                  <input
                    type="text"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    placeholder="Escribe un comando (ej: free -h, htop, lsblk, adb devices)..."
                    disabled={termRunning}
                    className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!termInput.trim() || termRunning}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 font-mono font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ejecutar</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 lg:px-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-400">RS110-FirmwareOS (CFW)</span> · Firmware Linux Flasheable para Game Box RS-110 (Allwinner Quad-Core, 2GB RAM, 64GB eMMC).
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Base de Datos: SQLite WAL</span>
            <span>·</span>
            <span>Clúster Distribuido Activo</span>
            <span>·</span>
            <a href="/api/firmware/download-img" className="text-amber-400 hover:underline">
              Firmware .IMG
            </a>
            <span>·</span>
            <a href="/api/firmware/download-iso" className="text-cyan-400 hover:underline">
              Firmware .ISO
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icon helper for Save
function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  );
}
