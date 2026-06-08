import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "create_listing": "Create Listing",
      "product_photos": "Product Photos",
      "add_images": "Add Images",
      "product_details": "Product Details",
      "product_name": "Product Name (e.g., Miniket Rice)",
      "description": "Description (Harvest details, etc.)",
      "quantity_price": "Quantity & Price",
      "total_qty": "Total Quantity (kg)",
      "price_per_kg": "Price per kg (৳)",
      "min_order": "Min. Order Quantity (kg)",
      "est_total": "Estimated Total Price:",
      "pickup_loc": "Pick-up Location",
      "address_label": "Address (for pick-up)",
      "post_listing": "Post Listing",
      "commission_note": "10% commission will be activated on completed orders"
    }
  },
  bn: {
    translation: {
      "create_listing": "নতুন লিস্টিং তৈরি করুন",
      "product_photos": "পণ্যের ছবি",
      "add_images": "ছবি যোগ করুন",
      "product_details": "পণ্যের বিবরণ",
      "product_name": "পণ্যের নাম (যেমন: মিনিকেট চাল)",
      "description": "বিস্তারিত (ফসলের তথ্য, মান ইত্যাদি)",
      "quantity_price": "পরিমাণ এবং মূল্য",
      "total_qty": "মোট পরিমাণ (কেজি)",
      "price_per_kg": "প্রতি কেজির দাম (৳)",
      "min_order": "সর্বনিম্ন অর্ডার (কেজি)",
      "est_total": "মোট সম্ভাব্য মূল্য:",
      "pickup_loc": "পিক-আপ লোকেশন",
      "address_label": "ঠিকানা (পিক-আপের জন্য)",
      "post_listing": "পোস্ট করুন",
      "commission_note": "সম্পন্ন অর্ডারের ওপর ১০% কমিশন প্রযোজ্য হবে"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'bn', // Default to Bangla
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;