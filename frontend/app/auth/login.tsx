import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  KeyboardTypeOptions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ApiError } from '@/services/api';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import '../../localization/i18n'; // Ensure the config is loaded

type LoginIdentifier = 'username' | 'email' | 'phone';
type UserRole = 'farmer' | 'customer';

export default function LoginScreen(): React.JSX.Element {
  const router = useRouter();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();

  // Functional configurations
  const [loginIdentifier, setLoginIdentifier] = useState<LoginIdentifier>('username');
  const [identityInput, setIdentityInput] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Force re-render on language change
  const [, setTick] = useState(0);
  useEffect(() => {
    const handleLanguageChange = () => setTick((prev) => prev + 1);
    i18n.on('languageChanged', handleLanguageChange);
    return () => { i18n.off('languageChanged', handleLanguageChange); };
  }, []);

  const toggleLanguage = (): void => {
    i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');
  };

  const handleLogin = async (): Promise<void> => {
    if (!identityInput || !password) {
      Alert.alert(t('Missing fields'), t('Please fill in all details.'));
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login(identityInput, password);
      if (loggedInUser?.role === 'farmer') {
        router.replace('/(farmer)/dashboard');
      } else if (loggedInUser?.role === 'customer') {
        router.replace('/(customer)/home');
      } else {
        throw new Error(t('Unknown user role'));
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('Login failed');
      Alert.alert(t('Login failed'), msg);
    } finally {
      setLoading(false);
    }
  };

  const getIdentifierLabel = (): string => {
    if (loginIdentifier === 'username') return t('Username');
    if (loginIdentifier === 'email') return t('Email Address');
    return t('Phone Number');
  };

  const getKeyboardType = (): KeyboardTypeOptions => {
    if (loginIdentifier === 'email') return 'email-address';
    if (loginIdentifier === 'phone') return 'phone-pad';
    return 'default';
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>Nobanno</Text>
          <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
            <Ionicons name="language" size={16} color={Colors.darkGreen} style={{ marginRight: 4 }} />
            <Text style={styles.langToggleText}>{i18n.language === 'en' ? 'বাংলা' : 'English'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t('Welcome back')}</Text>
        <Text style={styles.subtitle}>{t('log in')}</Text>

        <View style={styles.dropdownSection}>
          <Text style={styles.selectorLabel}>{t('Login Using:')}</Text>
          <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.dropdownHeaderCtx}>{loginIdentifier.toUpperCase()}</Text>
            <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.darkGreen} />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownList}>
              {(['username', 'email', 'phone'] as LoginIdentifier[]).map((type) => (
                <TouchableOpacity key={type} style={styles.dropdownItem} onPress={() => { setLoginIdentifier(type); setShowDropdown(false); }}>
                  <Text style={[styles.dropdownItemText, loginIdentifier === type && styles.activeDropdownItemText]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <InputField
          label={getIdentifierLabel()}
          value={identityInput}
          onChangeText={setIdentityInput}
          autoCapitalize="none"
          keyboardType={getKeyboardType()}
          placeholder={t('Enter your') + ' ' + loginIdentifier}
        />

        <View style={styles.passwordWrapper}>
          <View style={{ flex: 1 }}>
            <InputField
              label={t("Password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholder={t("Enter your password")}
            />
          </View>
          <TouchableOpacity style={styles.eyeIconContainer} onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? 'eye-off' : 'eye'} size={22} color={Colors.mediumGreen} />
          </TouchableOpacity>
        </View>

        <Link href="/auth/forgot-password" asChild>
          <TouchableOpacity>
            <Text style={styles.forgot}>{t('Forgot password?')}</Text>
          </TouchableOpacity>
        </Link>

        <PrimaryButton title={t("Login")} onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("Don't have an account?")}</Text>
          <Link href="/auth/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>{t('Sign up')}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ... Keep your existing 'styles' object here
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.paleGreen },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: 50,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brand: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.darkGreen,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.mediumGreen,
  },
  langToggleText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.darkGreen,
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
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3ebd3',
    borderRadius: 8,
    padding: 4,
    marginBottom: Spacing.md,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeRoleTab: {
    backgroundColor: Colors.darkGreen,
  },
  roleTabText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  activeRoleTabText: {
    color: '#fff',
    fontFamily: Fonts.bold,
  },
  dropdownSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    zIndex: 10,
  },
  textDark: {
    color: Colors.textDark,
  },
  selectorLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 120,
    justifyContent: 'space-between',
  },
  dropdownHeaderCtx: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.darkGreen,
  },
  dropdownList: {
    position: 'absolute',
    top: 38,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 120,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textDark,
  },
  activeDropdownItemText: {
    fontFamily: Fonts.bold,
    color: Colors.darkGreen,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 12,
    bottom: 14,
    zIndex: 5,
  },
  forgot: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.mediumGreen,
    textAlign: 'right',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
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