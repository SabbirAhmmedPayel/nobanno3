import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/services/api';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

interface Props {
  post: Post;
  onPress: () => void;
  imageTint?: string;
}

export function ProductCard({ post, onPress, imageTint = Colors.lightGreen }: Props) {
  const rating = 4.5;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.imageArea, { backgroundColor: imageTint }]}>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>
            {post.distance_km != null ? `${post.distance_km} km` : 'Nearby'}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.farmer}>{post.farmer_name || post.farmer_username}</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4].map((i) => (
            <Ionicons key={i} name="star" size={14} color={Colors.starGold} />
          ))}
          <Ionicons name="star-outline" size={14} color={Colors.starGold} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
        <Text style={styles.price}>
          ৳ {parseFloat(post.price_per_kg).toFixed(0)} / kg
        </Text>
        <Text style={styles.minOrder}>Min. 10 kg order</Text>
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>
            {parseFloat(post.total_weight_kg).toFixed(0)} kg left
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  imageArea: {
    height: 140,
    position: 'relative',
  },
  distanceBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.darkGreen,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  distanceText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: Colors.white,
  },
  body: {
    padding: Spacing.md,
    position: 'relative',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.darkGreen,
    marginBottom: 2,
  },
  farmer: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: Spacing.xs,
  },
  ratingText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.darkGreen,
  },
  minOrder: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  stockBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.paleGreen,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  stockText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: Colors.darkGreen,
  },
});
