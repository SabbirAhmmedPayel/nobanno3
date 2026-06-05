import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order } from '@/services/api';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  order: Order;
  variant: 'paid' | 'shipped' | 'completed';
  onAction?: () => void;
  actionLabel?: string;
  actionLoading?: boolean;
}

const headerStyles = {
  paid: { bg: Colors.paleYellow, text: Colors.textDark },
  shipped: { bg: Colors.lightOrange, text: Colors.textDark },
  completed: { bg: Colors.darkGreen, text: Colors.white },
};

export function OrderCard({
  order,
  variant,
  onAction,
  actionLabel,
  actionLoading,
}: Props) {
  const header = headerStyles[variant];
  const qty = parseFloat(order.quantity_kg);
  const pricePerKg = qty > 0 ? parseFloat(order.total_paid) / qty : 0;

  const headerTitle =
    variant === 'paid'
      ? 'Customer Orders - Paid'
      : variant === 'shipped'
        ? 'Order Fulfilled & Awaiting Delivery Confirmation'
        : 'Order Delivered & Completed';

  const detailLine = `${order.customer_name || order.customer_username} · ${order.post_title}`;

  return (
    <View style={styles.card}>
      <View style={[styles.header, { backgroundColor: header.bg }]}>
        <Text style={[styles.headerText, { color: header.text }]}>{headerTitle}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.customer}>Customer: {order.customer_name || order.customer_username}</Text>
        <Text style={styles.product}>{order.post_title}</Text>
        <Text style={styles.detail}>
          {qty.toFixed(0)} kg @ ৳ {pricePerKg.toFixed(0)}/kg = ৳{' '}
          {parseFloat(order.total_paid).toFixed(0)}.{' '}
          {order.status.toUpperCase()}.
        </Text>
        {variant === 'shipped' && (
          <Text style={styles.subDetail}>
            Awaiting customer confirmation. Farmer rating pending.
          </Text>
        )}
        {variant === 'completed' && (
          <Text style={styles.subDetail}>
            Customer confirmed delivery. Payout released to wallet.
          </Text>
        )}
        {onAction && actionLabel && (
          <PrimaryButton
            title={actionLabel}
            onPress={onAction}
            loading={actionLoading}
            style={styles.actionBtn}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  header: {
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  headerText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
  },
  body: {
    padding: Spacing.md,
  },
  customer: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textDark,
  },
  product: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textDark,
    marginTop: 2,
  },
  detail: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  subDetail: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  actionBtn: {
    marginTop: Spacing.md,
  },
});
