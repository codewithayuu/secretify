// utils/device.ts
export function getDeviceId(): string {
  const key = "confession_device_id";
  
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return 'server-side';
  }
  
  let deviceId = localStorage.getItem(key);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(key, deviceId);
  }

  return deviceId;
}

// Helper function to check if device has reacted to a confession
export function hasReacted(confessionId: string, reactionType: 'support' | 'relate'): boolean {
  if (typeof window === 'undefined') return false;
  
  const key = `reaction_${confessionId}_${reactionType}`;
  return localStorage.getItem(key) === 'true';
}

// Helper function to mark a reaction as made
export function markReaction(confessionId: string, reactionType: 'support' | 'relate'): void {
  if (typeof window === 'undefined') return;
  
  const key = `reaction_${confessionId}_${reactionType}`;
  localStorage.setItem(key, 'true');
}

// Helper function to remove a reaction mark
export function unmarkReaction(confessionId: string, reactionType: 'support' | 'relate'): void {
  if (typeof window === 'undefined') return;
  
  const key = `reaction_${confessionId}_${reactionType}`;
  localStorage.removeItem(key);
}
