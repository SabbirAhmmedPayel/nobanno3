import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ApiError } from '@/services/api';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, role } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing fields', 'Please enter username and password.');
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login(username, password);
      router.replace(
        loggedInUser.role === 'farmer' ? '/(farmer)/dashboard' : '/(customer)/home',
      );
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login failed';
      Alert.alert('Login failed', msg);
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
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          {role === 'farmer' ? 'Farmer login' : 'Customer login'}
        </Text>

        <InputField
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Enter your username"
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <Link href="/auth/forgot-password" asChild>
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        </Link>

        <PrimaryButton title="Login" onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/auth/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign up</Text>
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
    paddingTop: 60,
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
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  forgot: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.mediumGreen,
    textAlign: 'right',
    marginBottom: Spacing.lg,
    textDecorationLine: 'underline',
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
