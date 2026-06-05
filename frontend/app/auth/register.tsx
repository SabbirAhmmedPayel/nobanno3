import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ApiError } from '@/services/api';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, role } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone_number: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Missing fields', 'Username, email and password are required.');
      return;
    }
    if (!role) {
      Alert.alert('Select role', 'Please go back and choose customer or farmer.');
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, role });
      Alert.alert('Account created', 'Please log in with your new account.', [
        { text: 'OK', onPress: () => router.replace('/auth/login') },
      ]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed';
      Alert.alert('Sign up failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>Nobanno</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Sign up as {role ?? 'user'}</Text>

        <InputField
          label="Full Name"
          value={form.name}
          onChangeText={(v) => update('name', v)}
          placeholder="Your name"
        />
        <InputField
          label="Username"
          value={form.username}
          onChangeText={(v) => update('username', v)}
          autoCapitalize="none"
          placeholder="Choose a username"
        />
        <InputField
          label="Email"
          value={form.email}
          onChangeText={(v) => update('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@email.com"
        />
        <InputField
          label="Phone"
          value={form.phone_number}
          onChangeText={(v) => update('phone_number', v)}
          keyboardType="phone-pad"
          placeholder="01XXXXXXXXX"
        />
        <InputField
          label="Address"
          value={form.address}
          onChangeText={(v) => update('address', v)}
          placeholder="Delivery / farm address"
        />
        <InputField
          label="Password"
          value={form.password}
          onChangeText={(v) => update('password', v)}
          secureTextEntry
          placeholder="Secure password"
        />

        <PrimaryButton title="Sign Up" onPress={handleRegister} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.paleGreen },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: 48,
    paddingBottom: Spacing.xl,
  },
  brand: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.darkGreen,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.textDark,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xl,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
  },
  link: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.darkGreen,
    textDecorationLine: 'underline',
  },
});
