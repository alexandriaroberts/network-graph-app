'use client';

import { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeProps,
  EdgeProps,
} from 'reactflow';
import {
  Info,
  RefreshCw,
  Settings,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Menu,
} from 'lucide-react';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Mock data for nodes
const mockNodeData = {
  egress: { ip: '192.168.1.1', os: 'Ubuntu 20.04', location: 'New York' },
  'test-server': { ip: '192.168.1.2', os: 'CentOS 8', location: 'Los Angeles' },
  'egress-iptables': {
    ip: '192.168.1.3',
    os: 'Debian 10',
    location: 'Chicago',
  },
  gateway: { ip: '10.104.0.1', os: 'pfSense 2.5', location: 'Miami' },
  'aged-pond': { ip: '192.168.1.10', os: 'Windows 10', location: 'Seattle' },
  'broken-moon': { ip: '192.168.1.11', os: 'macOS 11', location: 'Boston' },
  'empty-frog': { ip: '192.168.1.12', os: 'Fedora 34', location: 'Denver' },
  'green-sky': { ip: '192.168.1.13', os: 'Arch Linux', location: 'Austin' },
  'hidden-brook': {
    ip: '192.168.1.14',
    os: 'FreeBSD 13',
    location: 'San Francisco',
  },
  'hidden-water': {
    ip: '192.168.1.15',
    os: 'OpenBSD 6.9',
    location: 'Washington D.C.',
  },
  'node-1': { ip: '192.168.1.4', os: 'Rocky Linux 8', location: 'Dallas' },
  'patient-sunset': { ip: '192.168.1.16', os: 'Manjaro', location: 'Phoenix' },
  'shy-morning': {
    ip: '192.168.1.17',
    os: 'Linux Mint 20',
    location: 'Portland',
  },
};

interface NetworkNodeData {
  label: keyof typeof mockNodeData;
  type: string;
}

const NetworkNode = ({ data }: NodeProps<NetworkNodeData>) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
              data.type === 'egress'
                ? 'w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-purple-800'
                : data.type === 'server'
                ? 'w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-700'
                : data.type === 'gateway'
                ? 'w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-700'
                : 'w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 opacity-70'
            }`}
          >
            <div className='text-white font-semibold text-[10px] sm:text-xs'>
              {data.label}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className='p-2'>
            <p className='font-semibold text-lg'>{data.label}</p>
            <p>
              <span className='font-medium'>IP:</span>{' '}
              {mockNodeData[data.label].ip}
            </p>
            <p>
              <span className='font-medium'>OS:</span>{' '}
              {mockNodeData[data.label].os}
            </p>
            <p>
              <span className='font-medium'>Location:</span>{' '}
              {mockNodeData[data.label].location}
            </p>
            <p>
              <span className='font-medium'>Type:</span> {data.type}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}: EdgeProps) => {
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  return (
    <>
      <path
        id={id}
        style={style}
        className='react-flow__edge-path stroke-2 opacity-50'
        d={edgePath}
      />
      <path
        style={style}
        className='react-flow__edge-path stroke-2 opacity-20'
        d={edgePath}
        strokeWidth={4}
      />
    </>
  );
};

const nodeTypes = { custom: NetworkNode };
const edgeTypes = { custom: CustomEdge };

const initialNodes: Node[] = [
  {
    id: 'egress',
    type: 'custom',
    data: { label: 'egress', type: 'egress' },
    position: { x: 400, y: 250 },
  },
  {
    id: 'test-server',
    type: 'custom',
    data: { label: 'test-server', type: 'server' },
    position: { x: 200, y: 100 },
  },
  {
    id: 'egress-iptables',
    type: 'custom',
    data: { label: 'egress-iptables', type: 'server' },
    position: { x: 600, y: 100 },
  },
  {
    id: 'gateway',
    type: 'custom',
    data: { label: 'gateway', type: 'gateway' },
    position: { x: 600, y: 200 },
  },
  {
    id: 'aged-pond',
    type: 'custom',
    data: { label: 'aged-pond', type: 'node' },
    position: { x: 100, y: 300 },
  },
  {
    id: 'broken-moon',
    type: 'custom',
    data: { label: 'broken-moon', type: 'node' },
    position: { x: 200, y: 350 },
  },
  {
    id: 'empty-frog',
    type: 'custom',
    data: { label: 'empty-frog', type: 'node' },
    position: { x: 300, y: 400 },
  },
  {
    id: 'green-sky',
    type: 'custom',
    data: { label: 'green-sky', type: 'node' },
    position: { x: 500, y: 400 },
  },
  {
    id: 'hidden-brook',
    type: 'custom',
    data: { label: 'hidden-brook', type: 'node' },
    position: { x: 600, y: 350 },
  },
  {
    id: 'hidden-water',
    type: 'custom',
    data: { label: 'hidden-water', type: 'node' },
    position: { x: 700, y: 300 },
  },
  {
    id: 'node-1',
    type: 'custom',
    data: { label: 'node-1', type: 'server' },
    position: { x: 400, y: 100 },
  },
  {
    id: 'patient-sunset',
    type: 'custom',
    data: { label: 'patient-sunset', type: 'node' },
    position: { x: 700, y: 250 },
  },
  {
    id: 'shy-morning',
    type: 'custom',
    data: { label: 'shy-morning', type: 'node' },
    position: { x: 100, y: 250 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'egress',
    target: 'test-server',
    type: 'custom',
    style: { stroke: '#9333ea' },
  },
  {
    id: 'e1-3',
    source: 'egress',
    target: 'egress-iptables',
    type: 'custom',
    style: { stroke: '#9333ea' },
  },
  {
    id: 'e1-4',
    source: 'egress',
    target: 'gateway',
    type: 'custom',
    style: { stroke: '#22c55e' },
  },
  {
    id: 'e1-5',
    source: 'egress',
    target: 'aged-pond',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
  {
    id: 'e1-6',
    source: 'egress',
    target: 'broken-moon',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
  {
    id: 'e1-7',
    source: 'egress',
    target: 'empty-frog',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
  {
    id: 'e1-8',
    source: 'egress',
    target: 'green-sky',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
  {
    id: 'e1-9',
    source: 'egress',
    target: 'hidden-brook',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
  {
    id: 'e1-10',
    source: 'egress',
    target: 'hidden-water',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
  {
    id: 'e1-11',
    source: 'egress',
    target: 'node-1',
    type: 'custom',
    style: { stroke: '#9333ea' },
  },
  {
    id: 'e1-12',
    source: 'egress',
    target: 'patient-sunset',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
  {
    id: 'e1-13',
    source: 'egress',
    target: 'shy-morning',
    type: 'custom',
    style: { stroke: '#60a5fa' },
  },
];

export default function NetworkGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = nodes.filter(
    (node) =>
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockNodeData[node.data.label as keyof typeof mockNodeData].ip.includes(
        searchTerm
      ) ||
      mockNodeData[node.data.label as keyof typeof mockNodeData].os
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mockNodeData[node.data.label as keyof typeof mockNodeData].location
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col h-screen bg-gray-900'>
      {/* Top Navigation */}
      <div className='flex flex-col border-b border-gray-800'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center gap-4'>
            <h1 className='text-xl sm:text-2xl font-bold text-white'>
              netmaker
            </h1>
            <Button
              variant='link'
              className='hidden sm:inline-flex text-blue-400 hover:text-blue-300'
            >
              View All Networks
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='sm:hidden bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                >
                  <Menu className='h-4 w-4' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-[300px] sm:w-[400px] bg-gray-900 text-white'
              >
                <SheetHeader>
                  <SheetTitle className='text-white'>Menu</SheetTitle>
                  <SheetDescription className='text-gray-400'>
                    Access additional options and settings.
                  </SheetDescription>
                </SheetHeader>
                <div className='flex flex-col gap-4 mt-4'>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  >
                    <Info className='w-4 h-4' />
                    Take Tour
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  >
                    <RefreshCw className='w-4 h-4' />
                    Reload
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  >
                    <Settings className='w-4 h-4' />
                    Network Settings
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className='hidden sm:flex items-center gap-2'>
              <Button
                variant='outline'
                className='gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              >
                <Info className='w-4 h-4' />
                Take Tour
              </Button>
              <Button
                variant='outline'
                className='gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              >
                <RefreshCw className='w-4 h-4' />
                Reload
              </Button>
              <Button
                variant='outline'
                className='gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              >
                <Settings className='w-4 h-4' />
                Network Settings
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue='graph' className='w-full'>
          <TabsList className='w-full justify-start rounded-none border-0 bg-transparent p-0 overflow-x-auto'>
            {[
              'note Access',
              'Relays',
              'Egress',
              'Internet Gateways',
              'Tag Management',
              'Access Control',
              'DNS',
              'Graph',
              'Metrics',
              'Info',
            ].map((tab, index) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase().replace(' ', '-')}
                className='rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-gray-200 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 whitespace-nowrap'
              >
                {tab} {index < 4 && `(${index})`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Graph Area */}
      <div className='relative flex-1'>
        <div className='absolute left-4 top-4 z-10 flex items-center bg-gray-800 rounded-md w-full max-w-[300px] sm:max-w-[400px]'>
          <Search className='w-5 h-5 text-gray-400 ml-3' />
          <Input
            type='text'
            placeholder='Search nodes, IPs, OS, or locations...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full bg-transparent border-0 focus:ring-0 text-white placeholder-gray-400'
          />
        </div>

        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={1.5}
          fitView
          attributionPosition='bottom-left'
        >
          <Background color='#2a2a2a' gap={16} />
          <Controls className='bg-gray-800 border-gray-700 rounded-md overflow-hidden'>
            <ControlButton icon={<ZoomIn className='w-4 h-4' />} />
            <ControlButton icon={<ZoomOut className='w-4 h-4' />} />
            <ControlButton icon={<Maximize2 className='w-4 h-4' />} />
          </Controls>
          <MiniMap
            style={{
              backgroundColor: 'rgba(40, 40, 40, 0.7)',
              border: '1px solid #555',
              borderRadius: '4px',
            }}
            nodeColor={(node) => {
              switch (node.data.type) {
                case 'egress':
                  return '#9333ea';
                case 'server':
                  return '#8b5cf6';
                case 'gateway':
                  return '#22c55e';
                default:
                  return '#60a5fa';
              }
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

const ControlButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors'>
    {icon}
  </button>
);
