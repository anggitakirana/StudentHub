
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from '../lib/firebase';

import {
  saveCache,
  getCache,
} from '../storage/mmkv';

// =====================================
// KONFIGURASI
// =====================================

// Nama collection Firestore
const STUDENT_COLLECTION = 'students';

// Key untuk cache MMKV
const STUDENT_CACHE_KEY = 'students_data';

// =====================================
// FUNGSI MENGAMBIL DATA MAHASISWA
// =====================================

export async function getStudents() {
  console.log('[Firestore] Memulai pengambilan data mahasiswa...');

  try {
    // 1. Mengambil collection students dari Firestore
    const studentQuery = query(
      collection(db, STUDENT_COLLECTION),
      orderBy('nama', 'asc')
    );

    const snapshot = await getDocs(studentQuery);

    // 2. Mengubah dokumen Firestore menjadi array
    const students = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    console.log(
      `[Firestore] ${students.length} mahasiswa berhasil diambil`
    );

    // 3. Menyimpan data Firestore ke MMKV
    const cacheSaved = saveCache(
      STUDENT_CACHE_KEY,
      students
    );

    if (cacheSaved) {
      console.log(
        '[MMKV] Cache mahasiswa berhasil diperbarui'
      );
    } else {
      console.warn(
        '[MMKV] Gagal memperbarui cache mahasiswa'
      );
    }

    // 4. Mengembalikan data dari Firestore
    return {
      students: students,
      source: 'firestore',
    };

  } catch (error) {

    console.error(
      '[Firestore] Gagal mengambil data:',
      error.message
    );

    // 5. Jika Firestore gagal, periksa cache MMKV
    console.log('[MMKV] Memeriksa cache lokal...');

    const cachedStudents = getCache(STUDENT_CACHE_KEY);

    // 6. Jika cache tersedia, gunakan data lokal
    if (
      Array.isArray(cachedStudents) &&
      cachedStudents.length > 0
    ) {
      console.log(
        `[MMKV] Cache ditemukan: ${cachedStudents.length} mahasiswa`
      );

      return {
        students: cachedStudents,
        source: 'cache',
      };
    }

    // 7. Jika cache juga kosong
    console.warn(
      '[MMKV] Cache belum tersedia atau masih kosong'
    );

    throw error;
  }
}
