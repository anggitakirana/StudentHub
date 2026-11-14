
import { createMMKV } from 'react-native-mmkv';

// MMKV khusus cache StudentHub
export const storage = createMMKV({
  id: 'studenthub-cache',
});

// Fungsi menyimpan cache
export function saveCache(key, data) {
  try {
    storage.set(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Gagal menyimpan cache:', error);
    return false;
  }
}

// Fungsi mengambil cache
export function getCache(key) {
  try {
    const data = storage.getString(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Gagal membaca cache:', error);
    return null;
  }
}

// Menghapus data cache
export function removeCache(key) {
  try {
    storage.remove(key);
    return true;
  } catch (error) {
    console.error('[MMKV] Gagal menghapus cache:', error);
    return false;
  }
}
