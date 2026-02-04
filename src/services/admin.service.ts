import { ModelInfo, SystemMetrics, AuditLog, User, UserRole, AuditAction } from '@/types';

// Mock model status data
const mockModels: ModelInfo[] = [
  {
    id: 'enhancement-v1',
    name: 'Enhancement Model (CNN+GAN)',
    type: 'enhancement',
    status: 'online',
    uptime: 99.9,
    lastHeartbeat: new Date(Date.now() - 5000),
    version: '2.4.1',
  },
  {
    id: 'segmentation-v1',
    name: 'Segmentation Model (U-Net)',
    type: 'segmentation',
    status: 'online',
    uptime: 99.7,
    lastHeartbeat: new Date(Date.now() - 3000),
    version: '1.8.0',
  },
  {
    id: 'security-v1',
    name: 'Security Module (AES-256)',
    type: 'security',
    status: 'online',
    uptime: 100,
    lastHeartbeat: new Date(Date.now() - 1000),
    version: '3.0.2',
  },
];

// Mock users data
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date('2024-01-15'),
    status: 'active',
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'user',
    createdAt: new Date('2024-02-20'),
    status: 'active',
  },
  {
    id: 'user-3',
    email: 'mike.wilson@example.com',
    name: 'Mike Wilson',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    status: 'active',
  },
  {
    id: 'user-4',
    email: 'sarah.johnson@example.com',
    name: 'Sarah Johnson',
    role: 'user',
    createdAt: new Date('2024-03-10'),
    status: 'disabled',
  },
  {
    id: 'user-5',
    email: 'alex.brown@example.com',
    name: 'Alex Brown',
    role: 'user',
    createdAt: new Date('2024-04-05'),
    status: 'active',
  },
];

// Generate mock audit logs
function generateMockAuditLogs(): AuditLog[] {
  const actions: AuditAction[] = ['login', 'upload', 'run', 'download', 'share', 'logout'];
  const logs: AuditLog[] = [];
  const now = Date.now();

  for (let i = 0; i < 50; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const timestamp = new Date(now - i * 15 * 60 * 1000 - Math.random() * 30 * 60 * 1000);

    logs.push({
      id: `log-${i}`,
      timestamp,
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action,
      jobId: ['upload', 'run', 'download', 'share'].includes(action) 
        ? `job-${Math.random().toString(36).substr(2, 9)}` 
        : undefined,
      details: getActionDetails(action),
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function getActionDetails(action: AuditAction): string {
  switch (action) {
    case 'login': return 'User logged in successfully';
    case 'logout': return 'User logged out';
    case 'upload': return 'Image uploaded for processing';
    case 'run': return 'Processing pipeline executed';
    case 'download': return 'Processed image downloaded';
    case 'share': return 'Share link generated';
    case 'delete': return 'Item deleted from vault';
    case 'role_change': return 'User role updated';
    case 'user_disable': return 'User account disabled';
    default: return '';
  }
}

let cachedLogs: AuditLog[] | null = null;

export const adminService = {
  async getModelStatus(): Promise<ModelInfo[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Randomly update heartbeats
    return mockModels.map(model => ({
      ...model,
      lastHeartbeat: new Date(Date.now() - Math.random() * 10000),
    }));
  },

  async getSystemMetrics(): Promise<SystemMetrics> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      queueLength: Math.floor(Math.random() * 5),
      avgProcessingTime: 3.5 + Math.random() * 2,
      errorRate: Math.random() * 0.5,
      totalJobsToday: Math.floor(150 + Math.random() * 100),
      activeUsers: Math.floor(20 + Math.random() * 30),
    };
  },

  async getAuditLogs(filters?: {
    startDate?: Date;
    endDate?: Date;
    action?: AuditAction;
    userId?: string;
  }): Promise<AuditLog[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!cachedLogs) {
      cachedLogs = generateMockAuditLogs();
    }

    let logs = [...cachedLogs];

    if (filters) {
      if (filters.startDate) {
        logs = logs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }
      if (filters.userId) {
        logs = logs.filter(log => log.actorId === filters.userId);
      }
    }

    return logs;
  },

  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockUsers];
  },

  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      return true;
    }
    return false;
  },

  async updateUserStatus(userId: string, status: 'active' | 'disabled'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = status;
      return true;
    }
    return false;
  },
};
