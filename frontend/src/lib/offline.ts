export interface PendingVibe {
  mood: number;
  note: string;
  relationship_id: number;
  timestamp: number;
}

export const getPendingVibes = (): PendingVibe[] => {
  const pendingVibes = localStorage.getItem('pendingVibes');
  return pendingVibes ? JSON.parse(pendingVibes) : [];
};

export const savePendingVibe = (vibe: Omit<PendingVibe, 'timestamp'>) => {
  const pendingVibes = getPendingVibes();
  const newVibe: PendingVibe = { ...vibe, timestamp: Date.now() };
  localStorage.setItem('pendingVibes', JSON.stringify([...pendingVibes, newVibe]));
};

export const clearPendingVibes = () => {
  localStorage.removeItem('pendingVibes');
};
