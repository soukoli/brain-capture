/**
 * IndexedDB storage layer for offline-first Brain Capture
 * Provides persistent storage with auto-sync capabilities
 */

import type { CapturedIdea, SyncStatus } from '@/types';

const DB_NAME = 'brain-capture-db';
const DB_VERSION = 1;
const STORE_NAME = 'ideas';

/**
 * Initialize IndexedDB connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create ideas store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

        // Create indexes for efficient queries
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        objectStore.createIndex('synced', 'synced', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
      }
    };
  });
}

/**
 * Save or update an idea in IndexedDB
 */
export async function saveIdea(idea: CapturedIdea): Promise<CapturedIdea> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Update timestamp
    const updatedIdea = {
      ...idea,
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(updatedIdea);

      request.onsuccess = () => resolve(updatedIdea);
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to save idea:', error);
    throw new Error('Failed to save idea to local storage');
  }
}

/**
 * Get all ideas from IndexedDB, optionally filtered by status
 */
export async function getIdeas(status?: string): Promise<CapturedIdea[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = status
        ? store.index('status').getAll(status)
        : store.getAll();

      request.onsuccess = () => {
        // Sort by most recent first
        const ideas = request.result.sort((a, b) => b.createdAt - a.createdAt);
        resolve(ideas);
      };

      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to get ideas:', error);
    throw new Error('Failed to retrieve ideas from local storage');
  }
}

/**
 * Get a single idea by ID
 */
export async function getIdea(id: string): Promise<CapturedIdea | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to get idea:', error);
    return null;
  }
}

/**
 * Delete an idea from IndexedDB
 */
export async function deleteIdea(id: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to delete idea:', error);
    throw new Error('Failed to delete idea from local storage');
  }
}

/**
 * Get all unsynced ideas
 */
export async function getUnsyncedIdeas(): Promise<CapturedIdea[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to get unsynced ideas:', error);
    return [];
  }
}

/**
 * Sync unsynced ideas to server
 * This function should be called periodically or on network reconnection
 */
export async function syncToServer(): Promise<SyncStatus> {
  const syncStatus: SyncStatus = {
    lastSync: null,
    pendingCount: 0,
    syncing: false,
  };

  try {
    const unsyncedIdeas = await getUnsyncedIdeas();
    syncStatus.pendingCount = unsyncedIdeas.length;

    if (unsyncedIdeas.length === 0) {
      syncStatus.lastSync = Date.now();
      return syncStatus;
    }

    syncStatus.syncing = true;

    // Sync each idea to the server
    const syncPromises = unsyncedIdeas.map(async (idea) => {
      try {
        const response = await fetch('/api/ideas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(idea),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        // Mark as synced in local storage
        await saveIdea({ ...idea, synced: true });
        return true;
      } catch (error) {
        console.error(`Failed to sync idea ${idea.id}:`, error);
        return false;
      }
    });

    await Promise.all(syncPromises);

    syncStatus.syncing = false;
    syncStatus.lastSync = Date.now();
    syncStatus.pendingCount = (await getUnsyncedIdeas()).length;

    return syncStatus;
  } catch (error) {
    console.error('Sync failed:', error);
    syncStatus.syncing = false;
    syncStatus.error = error instanceof Error ? error.message : 'Unknown sync error';
    return syncStatus;
  }
}

/**
 * Create a new idea with default values
 */
export function createNewIdea(content: string): CapturedIdea {
  const now = Date.now();
  return {
    id: `idea-${now}-${Math.random().toString(36).substring(2, 9)}`,
    content,
    createdAt: now,
    updatedAt: now,
    status: 'captured',
    synced: false,
  };
}

/**
 * Clear all data from IndexedDB (use with caution)
 */
export async function clearAllData(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw new Error('Failed to clear local storage');
  }
}
