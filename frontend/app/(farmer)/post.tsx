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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/services/api';
import { ScreenHeader } from '@/components/ScreenHeader';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import * as ImagePicker from "expo-image-picker";
//import '../localization/i18n';
import { useTranslation } from 'react-i18next';

export default function CreatePostScreen() {
  const router = useRouter();
  const { token, location, user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [minOrder, setMinOrder] = useState('10');
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { t } = useTranslation();

  const estimatedTotal =
    totalWeight && pricePerKg
      ? (parseFloat(totalWeight) * parseFloat(pricePerKg)).toFixed(0)
      : '--';


  const pickImage = async () => {

    const { status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status != 'granted') {
      Alert.alert('permission denied ');
      return; 
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: .5
    });

    if (!result.canceled) { 
      setImageUri(result.assets[0].uri);
    }
    else {
      alert("you did now select any image");

    }
  }
  

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
          imageUri: imageUri || undefined,
        });
        Alert.alert('Listing posted', 'Your crop listing is now live.', [
          { text: 'OK', onPress: () => router.push('/(farmer)/dashboard') },
        ]);
        setTitle('');
        setDescription('');
        setTotalWeight('');
        setPricePerKg('');
        setImageUri(null);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Failed to post listing';
        Alert.alert('Error', msg);
      } finally {
        setLoading(false);
      }
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScreenHeader title={t('create_listing')} />
          
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionLabel}>{t('product_photos')}</Text>
            <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <>
                  <Ionicons name="add" size={28} color={Colors.darkGreen} />
                  <Text style={styles.photoText}>{t('add_images')}</Text>
                </>
              )}
            </TouchableOpacity>
    
            <Text style={styles.sectionLabel}>{t('product_details')}</Text>
            <InputField placeholder={t('product_name')} value={title} onChangeText={setTitle} />
            <InputField placeholder={t('description')} value={description} onChangeText={setDescription} multiline />
    
            <Text style={styles.sectionLabel}>{t('quantity_price')}</Text>
            <View style={styles.grid}>
              <InputField placeholder={t('total_qty')} value={totalWeight} onChangeText={setTotalWeight} keyboardType="decimal-pad" />
              <InputField placeholder={t('price_per_kg')} value={pricePerKg} onChangeText={setPricePerKg} keyboardType="decimal-pad" />
            </View>
    
            <PrimaryButton title={t('post_listing')} onPress={submit} loading={loading} />
            
            <View style={styles.commissionNote}>
              <Text style={styles.commissionText}>{t('commission_note')}</Text>
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
    previewImage: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.md,
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
