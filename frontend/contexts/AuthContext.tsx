import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, User, UserRole } from '@/services/api';

interface LocationData {
  latitude: number;
  longitude: number;
  label: string;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  role: UserRole | null;
  location: LocationData | null;
  isLoading: boolean;
  setRole: (role: UserRole) => Promise<void>;
  setLocation: (loc: LocationData) => Promise<void>;
  login: (username: string, password: string) => Promise<User>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    role: UserRole; // Passed explicitly from registration screen form
    name?: string;
    phone_number?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const KEYS = {
  token: 'nobanno_token',
  user: 'nobanno_user',
  role: 'nobanno_role',
  location: 'nobanno_location',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing persistent session state on mount
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser, storedRole, storedLocation] =
          await Promise.all([
            AsyncStorage.getItem(KEYS.token),
            AsyncStorage.getItem(KEYS.user),
            AsyncStorage.getItem(KEYS.role),
            AsyncStorage.getItem(KEYS.location),
          ]);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedRole) setRoleState(storedRole as UserRole);
        if (storedLocation) setLocationState(JSON.parse(storedLocation));
      } catch (e) {
        console.error("Failed to load auth session:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setRole = useCallback(async (nextRole: UserRole) => {
    setRoleState(nextRole);
    await AsyncStorage.setItem(KEYS.role, nextRole);
  }, []);

  const setLocation = useCallback(async (loc: LocationData) => {
    setLocationState(loc);
    await AsyncStorage.setItem(KEYS.location, JSON.stringify(loc));
  }, []);

  const persistSession = useCallback(async (nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    setRoleState(nextUser.role); // Automatically sync context role state from user object
    await AsyncStorage.multiSet([
      [KEYS.token, nextToken],
      [KEYS.user, JSON.stringify(nextUser)],
      [KEYS.role, nextUser.role], // Keeps local device storage synced
    ]);
  }, []);

  // Login: Automatically resolves role via user properties returned by API
  const login = useCallback(
    async (username: string, password: string) => {
      const result = await api.login(username, password);
      await persistSession(result.token, result.user);
      return result.user;
    },
    [persistSession],
  );

  // Registration: Directly receives role from your sign up form input fields
  const register = useCallback(
    async (data: {
      username: string;
      email: string;
      password: string;
      role: UserRole;
      name?: string;
      phone_number?: string;
      address?: string;
    }) => {
      await api.register({
        ...data, // Explicitly forwards data.role passed into the function argument
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
    },
    [location],
  );

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    setRoleState(null);
    await AsyncStorage.multiRemove([KEYS.token, KEYS.user, KEYS.role]);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await api.getProfile(token);
    setUser(profile);
    setRoleState(profile.role);
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(profile));
    await AsyncStorage.setItem(KEYS.role, profile.role);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      location,
      isLoading,
      setRole,
      setLocation,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [
      token,
      user,
      role,
      location,
      isLoading,
      setRole,
      setLocation,
      login,
      register,
      logout,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}