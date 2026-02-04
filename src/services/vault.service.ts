import { VaultItem, Job } from '@/types';

// Mock vault storage
const vaultStorage: Map<string, VaultItem[]> = new Map();

// Generate mock vault items for demo
function generateMockVaultItems(userId: string): VaultItem[] {
  const items: VaultItem[] = [];
  const now = Date.now();

  const mockOperations: ('enhancement' | 'background' | 'encryption')[][] = [
    ['enhancement'],
    ['enhancement', 'background'],
    ['enhancement', 'encryption'],
    ['enhancement', 'background', 'encryption'],
    ['background'],
  ];

  for (let i = 0; i < 8; i++) {
    const createdAt = new Date(now - i * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000);
    const operations = mockOperations[i % mockOperations.length];

    items.push({
      id: `vault-${userId}-${i}`,
      job: {
        id: `job-${userId}-${i}`,
        status: 'completed',
        steps: [],
        currentStepIndex: 0,
        progress: 100,
        settings: {
          enhancement: { enabled: operations.includes('enhancement'), mode: 'auto', quality: 'balanced' },
          background: { 
            enabled: operations.includes('background'), 
            action: 'remove', 
            type: 'transparent',
            edgeSmoothing: 50,
            refineEdges: true,
          },
          security: { enabled: operations.includes('encryption') },
        },
        originalImage: {
          id: `img-${i}`,
          name: `image_${i + 1}.jpg`,
          url: `https://picsum.photos/seed/${userId}${i}/800/600`,
          size: 1024 * 1024 * (1 + Math.random() * 4),
          width: 800,
          height: 600,
          format: 'image/jpeg',
        },
        enhancedImageUrl: operations.includes('enhancement') 
          ? `https://picsum.photos/seed/${userId}${i}e/1600/1200` 
          : undefined,
        backgroundEditedUrl: operations.includes('background')
          ? `https://picsum.photos/seed/${userId}${i}b/800/600`
          : undefined,
        encryptedPackageUrl: operations.includes('encryption')
          ? `encrypted_image_${i + 1}.enc`
          : undefined,
        metrics: {
          psnr: operations.includes('enhancement') ? 32 + Math.random() * 6 : undefined,
          ssim: operations.includes('enhancement') ? 0.88 + Math.random() * 0.1 : undefined,
          dice: operations.includes('background') ? 0.85 + Math.random() * 0.1 : undefined,
          encryptionSuccess: operations.includes('encryption') ? true : undefined,
        },
        createdAt,
        updatedAt: createdAt,
        completedAt: new Date(createdAt.getTime() + 5000 + Math.random() * 10000),
        expiresAt: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      thumbnail: `https://picsum.photos/seed/${userId}${i}/200/150`,
      operations,
      createdAt,
      expiresAt: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  return items;
}

export const vaultService = {
  async getVaultItems(userId: string): Promise<VaultItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!vaultStorage.has(userId)) {
      vaultStorage.set(userId, generateMockVaultItems(userId));
    }

    return vaultStorage.get(userId) || [];
  },

  async addToVault(userId: string, job: Job): Promise<VaultItem> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const operations: ('enhancement' | 'background' | 'encryption')[] = [];
    if (job.settings.enhancement.enabled) operations.push('enhancement');
    if (job.settings.background.enabled) operations.push('background');
    if (job.settings.security.enabled) operations.push('encryption');

    const item: VaultItem = {
      id: `vault-${Date.now()}`,
      job,
      thumbnail: job.originalImage.url,
      operations,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const items = vaultStorage.get(userId) || [];
    items.unshift(item);
    vaultStorage.set(userId, items);

    return item;
  },

  async deleteFromVault(userId: string, itemId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const items = vaultStorage.get(userId) || [];
    const filtered = items.filter(item => item.id !== itemId);
    vaultStorage.set(userId, filtered);

    return true;
  },

  async generateShareLink(itemId: string, expiry: '1h' | '24h' | '7d'): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const expiryMap = { '1h': 3600, '24h': 86400, '7d': 604800 };
    const expirySeconds = expiryMap[expiry];
    const token = btoa(`${itemId}-${Date.now()}-${expirySeconds}`).replace(/=/g, '');

    return `https://imageai.app/share/${token}`;
  },
};
