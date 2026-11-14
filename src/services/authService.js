
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import { auth } from '../lib/firebase';

// =====================================
// GOOGLE SIGN-IN CONFIGURATION
// =====================================

const WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: false,
});

// =====================================
// GOOGLE SIGN-IN FUNCTION
// =====================================

export async function signInWithGoogle() {
  try {
    console.log('[Google Sign-In] Memulai login...');

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Memilih akun Google
    const response = await GoogleSignin.signIn();

    // Jika pengguna membatalkan login
    if (response.type !== 'success') {
      console.log('[Google Sign-In] Login dibatalkan');
      return null;
    }

    const idToken = response.data.idToken;

    if (!idToken) {
      throw new Error('Google ID Token tidak ditemukan.');
    }

    console.log('[Google Sign-In] ID Token berhasil diperoleh');

    // Membuat Firebase credential
    const credential = GoogleAuthProvider.credential(idToken);

    // Login ke Firebase Authentication
    const userCredential = await signInWithCredential(
      auth,
      credential
    );

    console.log(
      '[Firebase Auth] Login berhasil:',
      userCredential.user.email
    );

    return userCredential.user;

  } catch (error) {

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('[Google Sign-In] Pengguna membatalkan login');
      return null;
    }

    console.error(
      '[Google Sign-In] Login gagal:',
      error.code,
      error.message
    );

    throw error;
  }
}
