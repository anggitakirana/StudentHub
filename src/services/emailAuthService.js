
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../lib/firebase';

// ========================================
// EMAIL LOGIN
// ========================================
export async function loginWithEmail(email, password) {
  try {
    console.log('[Firebase Auth] Memulai email login...');

    const result = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    console.log(
      '[Firebase Auth] Email login berhasil:',
      result.user.email
    );

    return result.user;
  } catch (error) {
    console.error('[Firebase Auth] Email login gagal:', error.code);
    throw error;
  }
}

// ========================================
// EMAIL REGISTRATION
// ========================================
export async function registerWithEmail(name, email, password) {
  try {
    console.log('[Firebase Auth] Memulai registrasi...');

    const result = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    // Menyimpan nama pengguna ke Firebase Auth Profile
    await updateProfile(result.user, {
      displayName: name.trim(),
    });

    console.log(
      '[Firebase Auth] Registrasi berhasil:',
      result.user.email
    );

    return result.user;
  } catch (error) {
    console.error('[Firebase Auth] Registrasi gagal:', error.code);
    throw error;
  }
}

// ========================================
// RESET PASSWORD
// ========================================
export async function resetEmailPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());

    console.log('[Firebase Auth] Email reset password berhasil dikirim');
  } catch (error) {
    console.error('[Firebase Auth] Reset password gagal:', error.code);
    throw error;
  }
}
