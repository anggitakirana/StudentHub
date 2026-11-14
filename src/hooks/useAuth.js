
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Firebase Auth] Memeriksa sesi login...');

    // Memantau perubahan status autentikasi Firebase
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          console.log(
            '[Firebase Auth] Sesi login ditemukan:',
            currentUser.email
          );
        } else {
          console.log(
            '[Firebase Auth] Tidak ada sesi login aktif'
          );
        }

        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error(
          '[Firebase Auth] Gagal memeriksa sesi:',
          error.message
        );

        setUser(null);
        setLoading(false);
      }
    );

    // Membersihkan listener ketika komponen dilepas
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
  };
}
