import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function LocationScreen() {
  const router = useRouter();
  const { setLocation, token, user, role, location, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isLoading) return;
    if (token && user) {
      router.replace(user.role === 'farmer' ? '/(farmer)/dashboard' : '/(customer)/home');
      return;
    }
    if (location && role) {
      router.replace('/auth/login');
      return;
    }
    if (location) {
      router.replace('/role');
    }
  }, [isLoading, token, user, location, role, router]);

  const requestLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location needed',
          'Nobanno uses your location to show nearby crop listings.',
        );
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      let label = 'Your area';
      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        if (geo) {
          label = [geo.city, geo.district, geo.region]
            .filter(Boolean)
            .join(', ') || label;
        }
      } catch {
        // keep default label
      }
      await setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        label,
      });
      router.push('/role');
    } catch {
      Alert.alert('Error', 'Could not get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Ionicons name="leaf" size={48} color={Colors.white} />
        </View>
        <Text style={styles.brand}>Nobanno</Text>
        <Text style={styles.tagline}>Fresh crops from local farmers</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="location" size={32} color={Colors.darkGreen} />
        <Text style={styles.title}>Enable Location</Text>
        <Text style={styles.subtitle}>
          We need your location to show crop listings near you and sort by distance.
        </Text>
        {loading ? (
          <ActivityIndicator color={Colors.darkGreen} style={{ marginTop: Spacing.lg }} />
        ) : (
          <PrimaryButton
            title="Allow Location Access"
            onPress={requestLocation}
            style={styles.btn}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleGreen,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  brand: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: Colors.darkGreen,
  },
  tagline: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.textDark,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  btn: {
    marginTop: Spacing.lg,
    width: '100%',
  },
});
