import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/services/api';
import { ScreenHeader } from '@/components/ScreenHeader';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function CreatePostScreen() {
  const router = useRouter();
  const { token, location, user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [minOrder, setMinOrder] = useState('10');
  const [loading, setLoading] = useState(false);

  const estimatedTotal =
    totalWeight && pricePerKg
      ? (parseFloat(totalWeight) * parseFloat(pricePerKg)).toFixed(0)
      : '--';

  const submit = async () => {
    if (!token) return;
    if (!title || !totalWeight || !pricePerKg) {
      Alert.alert('Missing fields', 'Product name, quantity and price are required.');
      return;
    }
    const lat = location?.latitude ?? user?.latitude ?? 23.81;
    const lng = location?.longitude ?? user?.longitude ?? 90.41;

    setLoading(true);
    try {
      await api.createPost(token, {
        title,
        description,
        total_weight_kg: parseFloat(totalWeight),
        price_per_kg: parseFloat(pricePerKg),
        latitude: lat,
        longitude: lng,
      });
      Alert.alert('Listing posted', 'Your crop listing is now live.', [
        { text: 'OK', onPress: () => router.push('/(farmer)/dashboard') },
      ]);
      setTitle('');
      setDescription('');
      setTotalWeight('');
      setPricePerKg('');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to post listing';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Create Listing" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Product Photos</Text>
        <TouchableOpacity
          style={styles.photoBox}
          onPress={() =>
            Alert.alert('Coming soon', 'Image upload will be added in a future update.')
          }
        >
          <Ionicons name="add" size={28} color={Colors.darkGreen} />
          <Text style={styles.photoText}>Add Images</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Product Details</Text>
        <InputField
          placeholder="Product Name (e.g., Miniket Rice, Granola Potato)"
          value={title}
          onChangeText={setTitle}
        />
        <InputField
          placeholder="Description (Harvest details, quality notes, etc.)"
          value={description}
          onChangeText={setDescription}
          variant="white"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <Text style={styles.sectionLabel}>Quantity & Price</Text>
        <View style={styles.grid}>
          <InputField
            placeholder="Total Quantity (kg)"
            value={totalWeight}
            onChangeText={setTotalWeight}
            keyboardType="decimal-pad"
            style={styles.gridInput}
          />
          <InputField
            placeholder="Price per kg (৳)"
            value={pricePerKg}
            onChangeText={setPricePerKg}
            keyboardType="decimal-pad"
            style={styles.gridInput}
          />
        </View>
        <View style={styles.grid}>
          <InputField
            placeholder="Min. Order Quantity (kg)"
            value={minOrder}
            onChangeText={setMinOrder}
            keyboardType="number-pad"
            style={styles.gridInput}
          />
          <View style={styles.estimateBox}>
            <Text style={styles.estimateLabel}>Estimated Total Price:</Text>
            <Text style={styles.estimateValue}>৳ {estimatedTotal}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Pick-up Location</Text>
        <View style={styles.locationBox}>
          <View style={styles.mapThumb}>
            <Ionicons name="location" size={24} color={Colors.darkGreen} />
          </View>
          <View style={styles.locationText}>
            <Text style={styles.locationLabel}>
              Address (for pick-up, different from registered address?)
            </Text>
            <Text style={styles.locationValue}>
              {user?.address || location?.label || 'Set your farm address in profile'}
            </Text>
          </View>
          <Ionicons name="pencil" size={16} color={Colors.darkGreen} />
        </View>

        <PrimaryButton title="Post Listing" onPress={submit} loading={loading} />

        <View style={styles.commissionNote}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.darkGreen} />
          <Text style={styles.commissionText}>
            10% commission will be activated on completed orders
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.paleGreen,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  photoBox: {
    width: 100,
    height: 100,
    backgroundColor: Colors.lightGreen,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  photoText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.darkGreen,
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  gridInput: {
    flex: 1,
  },
  estimateBox: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: Radius.md,
    padding: Spacing.md,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  estimateLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textMuted,
  },
  estimateValue: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textDark,
    marginTop: 2,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGreen,
    borderWidth: 1,
    borderColor: Colors.darkGreen,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  mapThumb: {
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textMuted,
  },
  locationValue: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textDark,
    marginTop: 2,
  },
  commissionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    justifyContent: 'center',
  },
  commissionText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
