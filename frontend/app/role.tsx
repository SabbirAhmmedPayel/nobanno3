import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/services/api';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function RoleScreen() {
  const router = useRouter();
  const { setRole, location } = useAuth();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const continueNext = async () => {
    if (!selected) return;
    await setRole(selected);
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Nobanno</Text>
      <Text style={styles.title}>What are you?</Text>
      <Text style={styles.subtitle}>
        {location ? `Delivering near ${location.label}` : 'Choose how you will use Nobanno'}
      </Text>

      <TouchableOpacity
        style={[styles.option, selected === 'customer' && styles.optionActive]}
        onPress={() => setSelected('customer')}
      >
        <Ionicons
          name="cart"
          size={28}
          color={selected === 'customer' ? Colors.white : Colors.darkGreen}
        />
        <View style={styles.optionText}>
          <Text
            style={[
              styles.optionTitle,
              selected === 'customer' && styles.optionTitleActive,
            ]}
          >
            Customer
          </Text>
          <Text
            style={[
              styles.optionDesc,
              selected === 'customer' && styles.optionDescActive,
            ]}
          >
            Browse and buy fresh crops from nearby farmers
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selected === 'farmer' && styles.optionActive]}
        onPress={() => setSelected('farmer')}
      >
        <Ionicons
          name="leaf"
          size={28}
          color={selected === 'farmer' ? Colors.white : Colors.darkGreen}
        />
        <View style={styles.optionText}>
          <Text
            style={[
              styles.optionTitle,
              selected === 'farmer' && styles.optionTitleActive,
            ]}
          >
            Farmer
          </Text>
          <Text
            style={[
              styles.optionDesc,
              selected === 'farmer' && styles.optionDescActive,
            ]}
          >
            List your harvest and manage orders from buyers
          </Text>
        </View>
      </TouchableOpacity>

      <PrimaryButton
        title="Continue"
        onPress={continueNext}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleGreen,
    padding: Spacing.lg,
    paddingTop: 60,
  },
  brand: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.darkGreen,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.textDark,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionActive: {
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.darkGreen,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textDark,
  },
  optionTitleActive: {
    color: Colors.white,
  },
  optionDesc: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  optionDescActive: {
    color: Colors.lightGreen,
  },
  btn: {
    marginTop: Spacing.lg,
  },
});
