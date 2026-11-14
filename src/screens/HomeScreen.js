
import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

import { removeCache } from '../storage/mmkv';
import { getStudents } from '../services/studentService';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const STUDENT_CACHE_KEY = 'students_data';

export default function HomeScreen({ user }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  // Mengambil data mahasiswa dari Firestore / MMKV
  const loadStudents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      console.log('[StudentHub] Memuat data mahasiswa...');

      const result = await getStudents();

      setStudents(result.students || []);
      setSource(result.source || '');

      console.log(
        `[StudentHub] ${result.students?.length || 0} mahasiswa ditampilkan`
      );

      console.log('[StudentHub] Sumber data:', result.source);

    } catch (err) {
      console.error(
        '[StudentHub] Gagal memuat mahasiswa:',
        err.message
      );

      setError('Data mahasiswa gagal dimuat. Silakan coba lagi.');

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Logout Firebase dan menghapus cache mahasiswa

// Logout Firebase, Google Sign-In, dan menghapus cache mahasiswa
    async function handleLogout() {
    Alert.alert(
        'Konfirmasi Logout',
        'Apakah kamu yakin ingin keluar dari StudentHub?',
        [
        {
            text: 'Batal',
            style: 'cancel',
        },
        {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
            try {
                console.log('[Firebase Auth] Memulai proses logout...');

                // 1. Logout dari Firebase Authentication
                await signOut(auth);
                console.log('[Firebase Auth] Logout berhasil');

                // 2. Logout dari Google Sign-In
                await GoogleSignin.signOut();
                console.log('[Google Sign-In] Logout berhasil');

                // 3. Hapus cache mahasiswa dari MMKV
                removeCache(STUDENT_CACHE_KEY);
                console.log('[MMKV] Cache mahasiswa berhasil dihapus');

            } catch (err) {
                console.error('[Logout] Gagal:', err);

                Alert.alert(
                'Logout Gagal',
                'Terjadi kesalahan saat keluar dari akun.'
                );
            }
            },
        },
        ]
    );
    }


  // Mengambil inisial nama mahasiswa
  function getInitial(name) {
    return name?.trim()?.charAt(0)?.toUpperCase() || 'M';
  }

  // Header halaman
  function renderHeader() {
    return (
      <View>

        {/* APP HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>
              Student<Text style={styles.titleAccent}>Hub</Text>
            </Text>

            <Text style={styles.appSubtitle}>
              Student Information Dashboard
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
            accessibilityLabel="Logout"
          >
            <Ionicons
              name="log-out-outline"
              size={21}
              color="#E7D9FF"
            />
          </TouchableOpacity>
        </View>

        {/* USER INFORMATION - COMPACT */}
        {/* USER GREETING */}
        <View style={styles.greetingContainer}>
        <Text style={styles.greetingLabel}>
            Selamat datang,
        </Text>

        <Text style={styles.greetingName}>
            {user?.displayName || 'Student'}
        </Text>

        <Text style={styles.greetingEmail}>
            {user?.email || '-'}
        </Text>
        </View>

        {/* STUDENT LIST SECTION */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>
              Daftar Mahasiswa
            </Text>

            <Text style={styles.sectionSubtitle}>
              Data mahasiswa StudentHub
            </Text>
          </View>

          <View style={styles.sectionActions}>
            <View style={styles.totalBadge}>
              <Ionicons
                name="people-outline"
                size={15}
                color="#CDB9FF"
              />

              <Text style={styles.totalText}>
                {students.length}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => loadStudents(true)}
              disabled={refreshing}
              activeOpacity={0.7}
              accessibilityLabel="Refresh data mahasiswa"
            >
              <Ionicons
                name="refresh-outline"
                size={19}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* DATA SOURCE */}
        <View style={styles.sourceContainer}>
          <Ionicons
            name={
              source === 'cache'
                ? 'cloud-offline-outline'
                : 'cloud-done-outline'
            }
            size={14}
            color="#A99ACB"
          />

          <Text style={styles.sourceLabel}>
            {source === 'cache'
              ? 'Data ditampilkan dari cache lokal'
              : 'Data tersinkronisasi dari Cloud Firestore'}
          </Text>
        </View>

        {/* ERROR MESSAGE */}
        {!!error && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#FF899B"
            />

            <View style={styles.errorContent}>
              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity
                onPress={() => loadStudents(true)}
              >
                <Text style={styles.retryText}>
                  Coba lagi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    );
  }

  // Student Card
  function renderStudent({ item }) {
    return (
      <View style={styles.studentCard}>

        {/* Avatar */}
        <View style={styles.studentAvatar}>
          <Text style={styles.studentAvatarText}>
            {getInitial(item.nama)}
          </Text>
        </View>

        {/* Student Information */}
        <View style={styles.studentInfo}>

          <View style={styles.studentNameRow}>
            <Text
              style={styles.studentName}
              numberOfLines={2}
            >
              {item.nama || '-'}
            </Text>

            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>
                {item.angkatan || '-'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="card-outline"
              size={14}
              color="#B9A5E8"
            />

            <Text style={styles.nimText}>
              {item.nim || '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="school-outline"
              size={14}
              color="#92929F"
            />

            <Text style={styles.majorText}>
              {item.jurusan || '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={14}
              color="#92929F"
            />

            <Text
              style={styles.emailText}
              numberOfLines={1}
            >
              {item.email || '-'}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  // Tampilan loading awal
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#09090F" />

        <ActivityIndicator
          size="large"
          color="#B9A5E8"
        />

        <Text style={styles.loadingText}>
          Memuat data mahasiswa...
        </Text>
      </View>
    );
  }


    return (
    <View style={styles.container}>
        <StatusBar
        barStyle="light-content"
        backgroundColor="#09090F"
        />

        {/* DAFTAR MAHASISWA */}
        <FlatList
        data={students}
        keyExtractor={(item, index) =>
            item.id || item.nim || String(index)
        }
        renderItem={renderStudent}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
            <View style={styles.cardSeparator} />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadStudents(true)}
            tintColor="#B9A5E8"
            colors={['#B9A5E8']}
            />
        }
        ListEmptyComponent={
            !error ? (
            <View style={styles.emptyContainer}>
                <Ionicons
                name="people-outline"
                size={42}
                color="#78669F"
                />

                <Text style={styles.emptyTitle}>
                Belum Ada Mahasiswa
                </Text>

                <Text style={styles.emptySubtitle}>
                Data mahasiswa belum tersedia di database.
                </Text>
            </View>
            ) : null
        }
        />

        {/* BOTTOM NAVIGATION */}
        <View style={styles.bottomNav}>

        <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
        >
            <Ionicons
            name="home"
            size={23}
            color="#B9A5E8"
            />

            <Text style={[styles.navLabel, styles.activeNavLabel]}>
            Home
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}
        >
            <Ionicons
            name="person-outline"
            size={23}
            color="#85838F"
            />

            <Text style={styles.navLabel}>
            Profile
            </Text>
        </TouchableOpacity>

        </View>

    </View>
    );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#09090F',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 2,
  },

  appTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  titleAccent: {
    color: '#B9A5E8',
  },

  appSubtitle: {
    color: '#92929F',
    fontSize: 12,
    marginTop: 3,
  },

  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#211D2D',
    borderWidth: 1,
    borderColor: '#393047',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // USER INFORMATION
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 2,
  },

  userAvatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#514078',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  userEmail: {
    color: '#A99ACB',
    fontSize: 12,
    marginTop: 3,
  },

  loginBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19251F',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#65C995',
  },

  loginBadgeText: {
    color: '#8AD5AB',
    fontSize: 10,
    fontWeight: '600',
  },

  // STUDENT SECTION
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionTitleContainer: {
    flex: 1,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#92929F',
    fontSize: 12,
    marginTop: 4,
  },

  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginLeft: 8,
  },

  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: '#211D2D',
    borderRadius: 12,
  },

  totalText: {
    color: '#D8C7FF',
    fontSize: 13,
    fontWeight: '700',
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#514078',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },

  sourceLabel: {
    color: '#92929F',
    fontSize: 11,
  },

  // STUDENT CARD
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171621',
    borderWidth: 1,
    borderColor: '#302B3D',
    borderRadius: 17,
    padding: 14,
  },

  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#514078',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  studentAvatarText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  studentInfo: {
    flex: 1,
    minWidth: 0,
  },

  studentNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 7,
  },

  studentName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },

  yearBadge: {
    backgroundColor: '#2B243A',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
  },

  yearText: {
    color: '#D8C7FF',
    fontSize: 11,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },

  nimText: {
    color: '#B9A5E8',
    fontSize: 12,
  },

  majorText: {
    color: '#D0CDD8',
    fontSize: 12,
  },

  emailText: {
    color: '#85838F',
    fontSize: 11,
    flex: 1,
  },

  cardSeparator: {
    height: 11,
  },

  // EMPTY STATE
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 55,
    paddingHorizontal: 25,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },

  emptySubtitle: {
    color: '#92929F',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },

  // ERROR
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#26171C',
    borderRadius: 13,
    padding: 13,
    marginBottom: 15,
    gap: 10,
  },

  errorContent: {
    flex: 1,
  },

  errorText: {
    color: '#FFB6C1',
    fontSize: 12,
  },

  retryText: {
    color: '#D8C7FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },

  // LOADING
  loadingContainer: {
    flex: 1,
    backgroundColor: '#09090F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#B9A5E8',
    fontSize: 13,
    marginTop: 12,
  },

  // USER GREETING
    greetingContainer: {
    marginTop: 22,
    marginBottom: 25,
    },

    greetingLabel: {
    color: '#92929F',
    fontSize: 12,
    fontWeight: '400',
    },

    greetingName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
    },

    greetingEmail: {
    color: '#A99ACB',
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
    },
    bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#111019',
    borderTopWidth: 1,
    borderTopColor: '#302B3D',
    paddingVertical: 9,
    paddingBottom: 10,
    justifyContent: 'space-around',
    },

    navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    },

    navLabel: {
    color: '#85838F',
    fontSize: 11,
    fontWeight: '500',
    },

    activeNavLabel: {
    color: '#B9A5E8',
    fontWeight: '700',
    },

});
