import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Fonts, Spacing, Radius } from '@/constants/theme';

type Method = 'email' | 'phone';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('email');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = () => {
    if (!contact) {
      Alert.alert('Required', `Enter your ${method === 'email' ? 'email' : 'phone number'}.`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Code sent',
        method === 'email'
          ? `A reset code was sent to ${contact}. (Mock — backend OTP not wired yet.)`
          : `An OTP was sent to ${contact}. (Mock — backend OTP not wired yet.)`,
        [{ text: 'Back to Login', onPress: () => router.replace('/auth/login') }],
      );
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Choose how you want to receive your reset code.
      </Text>

      <View style={styles.methodRow}>
        <TouchableOpacity
          style={[styles.methodBtn, method === 'email' && styles.methodActive]}
          onPress={() => setMethod('email')}
        >
          <Text
            style={[
              styles.methodText,
              method === 'email' && styles.methodTextActive,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.methodBtn, method === 'phone' && styles.methodActive]}
          onPress={() => setMethod('phone')}
        >
          <Text
            style={[
              styles.methodText,
              method === 'phone' && styles.methodTextActive,
            ]}
          >
            Phone OTP
          </Text>
        </TouchableOpacity>
      </View>

      <InputField
        label={method === 'email' ? 'Email address' : 'Phone number'}
        value={contact}
        onChangeText={setContact}
        keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
        autoCapitalize="none"
        placeholder={method === 'email' ? 'you@email.com' : '01XXXXXXXXX'}
      />

      <PrimaryButton title="Send Code" onPress={sendCode} loading={loading} />

      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>Back to login</Text>
      </TouchableOpacity>
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
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.textDark,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  methodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  methodBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  methodActive: {
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.darkGreen,
  },
  methodText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  methodTextActive: {
    color: Colors.white,
  },
  back: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  backText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.mediumGreen,
    textDecorationLine: 'underline',
  },
});
