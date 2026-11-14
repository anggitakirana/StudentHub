
import React, { useState, useEffect } from 'react';

import {
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

// Authentication Hook
import { useAuth } from './src/hooks/useAuth';

// Authentication Services
import { signInWithGoogle } from './src/services/authService';

import {
  loginWithEmail,
  registerWithEmail,
  resetEmailPassword,
} from './src/services/emailAuthService';


export default function App() {

  // ========================================
  // FIREBASE AUTHENTICATION STATE
  // ========================================

  const { user, loading, isLoggedIn } = useAuth();

  // ========================================
  // APPLICATION STATE
  // ========================================

  const [currentScreen, setCurrentScreen] = useState('welcome');

  const [googleLoading, setGoogleLoading] = useState(false);

  const [authLoading, setAuthLoading] = useState(false);


  // ========================================
  // RESET SCREEN AFTER LOGOUT
  // ========================================

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setCurrentScreen('welcome');
    }
  }, [loading, isLoggedIn]);


  // ========================================
  // GOOGLE SIGN-IN
  // ========================================

  async function handleGoogleLogin() {

    if (googleLoading || authLoading) return;

    try {
      setGoogleLoading(true);

      console.log('[App] Memulai Google Sign-In...');

      const googleUser = await signInWithGoogle();

      if (!googleUser) {
        return;
      }

      console.log('[App] Google login berhasil');
      console.log('[App] Email:', googleUser.email);

      // Navigasi otomatis ditangani useAuth()
      // melalui onAuthStateChanged Firebase.

    } catch (error) {

      console.error('[App] Google login error:', error);

      Alert.alert(
        'Login Gagal',
        error.message ||
          'Tidak dapat masuk menggunakan Google.'
      );

    } finally {
      setGoogleLoading(false);
    }
  }


  // ========================================
  // EMAIL LOGIN
  // ========================================

  async function handleEmailLogin(email, password) {

    if (authLoading || googleLoading) return;

    try {
      setAuthLoading(true);

      console.log('[App] Memulai Email Login...');

      const emailUser = await loginWithEmail(
        email,
        password
      );

      console.log('[App] Email login berhasil');
      console.log('[App] Email:', emailUser.email);

      // useAuth() mendeteksi perubahan sesi Firebase.

      return emailUser;

    } finally {
      setAuthLoading(false);
    }
  }


  // ========================================
  // EMAIL REGISTRATION
  // ========================================

  async function handleEmailRegister(name, email, password) {

    if (authLoading || googleLoading) return;

    try {
      setAuthLoading(true);

      console.log('[App] Memulai Email Registration...');

      const newUser = await registerWithEmail(
        name,
        email,
        password
      );

      console.log('[App] Registrasi berhasil');
      console.log('[App] Nama:', newUser.displayName);
      console.log('[App] Email:', newUser.email);

      // Firebase otomatis membuat sesi login.
      // useAuth() akan mendeteksi sesi tersebut.

      return newUser;

    } finally {
      setAuthLoading(false);
    }
  }


  // ========================================
  // FORGOT PASSWORD
  // ========================================

  async function handlePasswordReset(email) {

    if (authLoading || googleLoading) return;

    try {
      setAuthLoading(true);

      console.log('[App] Meminta reset password...');

      await resetEmailPassword(email);

      console.log('[App] Email reset password berhasil dikirim');

    } finally {
      setAuthLoading(false);
    }
  }


  // ========================================
  // INITIAL AUTHENTICATION LOADING
  // ========================================

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#B9A5E8"
        />
      </View>
    );
  }


  // ========================================
  // HOME SCREEN
  // ========================================

  if (isLoggedIn) {
    return (
      <HomeScreen user={user} />
    );
  }


  // ========================================
  // LOGIN SCREEN
  // ========================================

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onBack={() => setCurrentScreen('welcome')}

        // Google Authentication
        onGooglePress={handleGoogleLogin}
        googleLoading={googleLoading}

        // Email Authentication
        onEmailLogin={handleEmailLogin}
        onEmailRegister={handleEmailRegister}
        onPasswordReset={handlePasswordReset}

        // Loading State
        authLoading={authLoading}
      />
    );
  }


  // ========================================
  // WELCOME SCREEN
  // ========================================

  return (
    <WelcomeScreen
      onGooglePress={handleGoogleLogin}
      onEmailPress={() => setCurrentScreen('login')}
      googleLoading={googleLoading}
    />
  );

}


// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  loading: {
    flex: 1,
    backgroundColor: '#09090F',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
