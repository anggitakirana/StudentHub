
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({
  onBack,
  onGooglePress,
  googleLoading = false,
  onEmailLogin,
  onEmailRegister,
  onPasswordReset,
  authLoading = false,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const isBusy = authLoading || googleLoading;

  // EMAIL LOGIN & REGISTRATION
  async function handleEmailSubmit() {
    setEmailError('');

    const cleanEmail = email.trim().toLowerCase();

    if (isRegistering && !name.trim()) {
      Alert.alert(
        'Nama belum diisi',
        'Masukkan nama lengkap terlebih dahulu.'
      );
      return;
    }

    if (!cleanEmail || !password) {
      Alert.alert(
        'Form belum lengkap',
        'Silakan isi email dan password terlebih dahulu.'
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      setEmailError('Masukkan alamat email yang valid.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Password tidak valid',
        'Password minimal terdiri dari 6 karakter.'
      );
      return;
    }

    try {
      if (isRegistering) {
        if (typeof onEmailRegister !== 'function') {
          throw new Error(
            'Fungsi registrasi belum dihubungkan di App.js.'
          );
        }

        await onEmailRegister(
          name.trim(),
          cleanEmail,
          password
        );

      } else {
        if (typeof onEmailLogin !== 'function') {
          throw new Error(
            'Fungsi login email belum dihubungkan di App.js.'
          );
        }

        await onEmailLogin(cleanEmail, password);
      }

    } catch (error) {
      const messages = {
        'auth/email-already-in-use':
          'Email sudah terdaftar. Silakan login.',

        'auth/invalid-email':
          'Format email tidak valid.',

        'auth/invalid-credential':
          'Email atau password salah.',

        'auth/user-not-found':
          'Akun tidak ditemukan. Silakan registrasi.',

        'auth/wrong-password':
          'Password yang dimasukkan salah.',

        'auth/weak-password':
          'Password terlalu lemah. Gunakan minimal 6 karakter.',

        'auth/network-request-failed':
          'Periksa koneksi internet kamu.',

        'auth/too-many-requests':
          'Terlalu banyak percobaan. Coba lagi nanti.',

        'auth/operation-not-allowed':
          'Metode Email/Password belum diaktifkan di Firebase.',
      };

      Alert.alert(
        isRegistering ? 'Registrasi Gagal' : 'Login Gagal',
        messages[error?.code] ||
          error?.message ||
          'Terjadi kesalahan. Silakan coba lagi.'
      );
    }
  }

  // FORGOT PASSWORD
  async function handlePasswordReset() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert(
        'Email diperlukan',
        'Masukkan alamat email terlebih dahulu.'
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      setEmailError('Masukkan alamat email yang valid.');
      return;
    }

    if (typeof onPasswordReset !== 'function') {
      Alert.alert(
        'Fitur belum terhubung',
        'Fungsi reset password belum dihubungkan di App.js.'
      );
      return;
    }

    try {
      await onPasswordReset(cleanEmail);

      Alert.alert(
        'Email terkirim',
        'Jika alamat email terdaftar, Firebase akan mengirimkan tautan reset password.'
      );

    } catch (error) {
      Alert.alert(
        'Reset Password Gagal',
        error?.message || 'Gagal mengirim email reset password.'
      );
    }
  }

  // SWITCH LOGIN / REGISTER
  function switchMode() {
    setIsRegistering((current) => !current);
    setEmailError('');
    setPassword('');
    setName('');
    setShowPassword(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          disabled={isBusy}
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-back"
            size={23}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* HEADING */}
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>
            {isRegistering ? 'GET STARTED' : 'WELCOME BACK'}
          </Text>

          <Text style={styles.title}>
            {isRegistering
              ? 'Create your account'
              : 'Log in to StudentHub'}
          </Text>

          <Text style={styles.subtitle}>
            {isRegistering
              ? 'Create an account to access your student information and stay connected with your campus.'
              : 'Access your student information and stay connected with your campus.'}
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>

          {/* NAME - REGISTRATION ONLY */}
          {isRegistering && (
            <>
              <Text style={styles.label}>Full Name</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#92929F"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#777783"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isBusy}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldSpacing} />
            </>
          )}

          {/* EMAIL */}
          <Text style={styles.label}>Email Address</Text>

          <View
            style={[
              styles.inputContainer,
              emailError ? styles.inputError : null,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={19}
              color="#92929F"
            />

            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#777783"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!isBusy}
              returnKeyType="next"
            />
          </View>

          {emailError ? (
            <Text style={styles.errorText}>
              {emailError}
            </Text>
          ) : null}

          {/* PASSWORD LABEL */}
          <View style={styles.passwordLabelRow}>
            <Text style={styles.label}>Password</Text>

            {!isRegistering && (
              <TouchableOpacity
                onPress={handlePasswordReset}
                disabled={isBusy}
              >
                <Text style={styles.forgotText}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* PASSWORD INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={19}
              color="#92929F"
            />

            <TextInput
              style={styles.input}
              placeholder={
                isRegistering
                  ? 'Create a password'
                  : 'Enter your password'
              }
              placeholderTextColor="#777783"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={
                isRegistering
                  ? 'new-password'
                  : 'current-password'
              }
              textContentType={
                isRegistering
                  ? 'newPassword'
                  : 'password'
              }
              returnKeyType="done"
              onSubmitEditing={handleEmailSubmit}
              editable={!isBusy}
            />

            {/* SHOW / HIDE PASSWORD */}
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword((current) => !current)
              }
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={21}
                color="#A5A5B3"
              />
            </TouchableOpacity>
          </View>

          {isRegistering && (
            <Text style={styles.helperText}>
              Password must contain at least 6 characters.
            </Text>
          )}

          {/* LOGIN / REGISTER BUTTON */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isBusy && styles.buttonDisabled,
            ]}
            onPress={handleEmailSubmit}
            disabled={isBusy}
            activeOpacity={0.85}
          >
            {authLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  {isRegistering
                    ? 'Create Account'
                    : 'Log in'}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

        </View>

        {/* DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />

          <Text style={styles.orText}>
            OR CONTINUE WITH
          </Text>

          <View style={styles.dividerLine} />
        </View>

        {/* GOOGLE SIGN IN */}
        <TouchableOpacity
          style={[
            styles.googleButton,
            isBusy && styles.buttonDisabled,
          ]}
          onPress={onGooglePress}
          disabled={isBusy}
          activeOpacity={0.8}
        >
          {googleLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="logo-google"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.googleText}>
                Sign in with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* FOOTER: SWITCH MODE */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isRegistering
              ? 'Already have an account? '
              : "Don't have an account? "}
          </Text>

          <TouchableOpacity
            onPress={switchMode}
            disabled={isBusy}
          >
            <Text style={styles.footerHighlight}>
              {isRegistering
                ? 'Log in'
                : 'Create account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PRIVACY */}
        <Text style={styles.privacyText}>
          Your information is protected and securely managed.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090F',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 58,
    paddingBottom: 35,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22222E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#343441',
  },

  heading: {
    marginTop: 42,
    marginBottom: 30,
  },

  eyebrow: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginBottom: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  subtitle: {
    color: '#92929F',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },

  form: {
    width: '100%',
  },

  label: {
    color: '#E1E1E8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },

  fieldSpacing: {
    height: 20,
  },

  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 23,
  },

  forgotText: {
    color: '#B9A5E8',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },

  inputContainer: {
    minHeight: 56,
    backgroundColor: '#1B1B27',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#353542',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  inputError: {
    borderColor: '#E56B75',
  },

  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  eyeButton: {
    width: 38,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    color: '#E56B75',
    fontSize: 12,
    marginTop: 7,
  },

  helperText: {
    color: '#92929F',
    fontSize: 11,
    marginTop: 8,
  },

  loginButton: {
    minHeight: 55,
    borderRadius: 28,
    backgroundColor: '#514078',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 30,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    gap: 13,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#343441',
  },

  orText: {
    color: '#92929F',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },

  googleButton: {
    minHeight: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#454553',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  googleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 55,
  },

  footerText: {
    color: '#92929F',
    fontSize: 12,
  },

  footerHighlight: {
    color: '#C5B2EA',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  privacyText: {
    color: '#696976',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 24,
  },
});
