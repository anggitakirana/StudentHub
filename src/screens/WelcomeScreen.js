
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({
  onGooglePress,
  onEmailPress,
  googleLoading = false,
}) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background decoration */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Ionicons name="school-outline" size={23} color="#FFFFFF" />
        </View>

        <Text style={styles.brandName}>StudentHub</Text>
      </View>

      {/* Hero illustration */}
      <View style={styles.hero}>
        <View style={styles.heroSky} />

        <View style={styles.starOne} />
        <View style={styles.starTwo} />
        <View style={styles.starThree} />

        <View style={styles.moon} />

        <View style={styles.mountainOne} />
        <View style={styles.mountainTwo} />
        <View style={styles.mountainThree} />

        <View style={styles.forestLayer}>
          <View style={styles.treeOne} />
          <View style={styles.treeTwo} />
          <View style={styles.treeThree} />
          <View style={styles.treeFour} />
          <View style={styles.treeFive} />
        </View>

        <View style={styles.heroCaption}>
          <Text style={styles.heroCaptionText}>
            YOUR CAMPUS JOURNEY STARTS HERE
          </Text>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Everything you need,{'\n'}
          <Text style={styles.titleHighlight}>all in one place.</Text>
        </Text>

        <Text style={styles.description}>
          Stay connected with your campus.
          Access student information and manage
          your academic journey with ease.
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
        style={[
            styles.googleButton,
            googleLoading && { opacity: 0.7 },
        ]}
        onPress={onGooglePress}
        disabled={googleLoading}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Sign in with Google"
        >
        {googleLoading ? (
            <ActivityIndicator color="#FFFFFF" />
        ) : (
            <>
            <Ionicons name="logo-google" size={19} color="#FFFFFF" />

            <Text style={styles.googleText}>
                Sign in with Google
            </Text>

            <View style={styles.buttonArrow}>
                <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
                />
            </View>
            </>
        )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={onEmailPress}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Ionicons name="mail-outline" size={18} color="#FFFFFF" />
          <Text style={styles.emailText}>Sign in with Email</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsHighlight}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsHighlight}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090F',
    paddingHorizontal: 25,
    paddingTop: 55,
    paddingBottom: 28,
    overflow: 'hidden',
  },

  glowTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#67458D',
    opacity: 0.12,
    top: 100,
    alignSelf: 'center',
  },

  glowBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#4C367A',
    opacity: 0.10,
    bottom: 30,
    right: -100,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },

  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#514078',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  hero: {
    width: '100%',
    height: 285,
    backgroundColor: '#211D36',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },

  heroSky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#39314F',
  },

  starOne: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
    top: 40,
    left: 55,
  },

  starTwo: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
    top: 78,
    right: 105,
  },

  starThree: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
    top: 115,
    left: 115,
  },

  moon: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E8DDF6',
    top: 35,
    right: 55,
    opacity: 0.95,
  },

  mountainOne: {
    position: 'absolute',
    bottom: 65,
    left: -70,
    width: 270,
    height: 190,
    backgroundColor: '#88759E',
    borderRadius: 25,
    transform: [{ rotate: '45deg' }],
  },

  mountainTwo: {
    position: 'absolute',
    bottom: 40,
    right: -85,
    width: 280,
    height: 195,
    backgroundColor: '#69587F',
    borderRadius: 25,
    transform: [{ rotate: '45deg' }],
  },

  mountainThree: {
    position: 'absolute',
    bottom: -110,
    left: 35,
    width: 300,
    height: 220,
    backgroundColor: '#39334D',
    borderRadius: 25,
    transform: [{ rotate: '45deg' }],
  },

  forestLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: '#211F32',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },

  treeOne: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 42,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#151521',
    marginTop: -15,
  },

  treeTwo: {
    width: 0,
    height: 0,
    borderLeftWidth: 19,
    borderRightWidth: 19,
    borderBottomWidth: 55,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#171725',
    marginTop: -23,
  },

  treeThree: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 45,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#151521',
    marginTop: -15,
  },

  treeFour: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 56,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#171725',
    marginTop: -24,
  },

  treeFive: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 42,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#151521',
    marginTop: -14,
  },

  heroCaption: {
    position: 'absolute',
    top: 20,
    left: 18,
  },

  heroCaptionText: {
    color: '#E6DDF1',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },

  content: {
    alignItems: 'center',
    marginTop: 28,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: -0.6,
  },

  titleHighlight: {
    color: '#B9A1E6',
  },

  description: {
    color: '#92929F',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },

  actions: {
    width: '100%',
    marginTop: 25,
  },

  googleButton: {
    height: 55,
    borderRadius: 28,
    backgroundColor: '#514078',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  googleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 11,
  },

  buttonArrow: {
    position: 'absolute',
    right: 17,
  },

  emailButton: {
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#454553',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },

  emailText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  terms: {
    color: '#777783',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 17,
    paddingHorizontal: 15,
  },

  termsHighlight: {
    color: '#C2B0E4',
    textDecorationLine: 'underline',
  },
});
