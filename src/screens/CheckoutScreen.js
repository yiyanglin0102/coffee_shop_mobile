import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Cappuccino', price: 4.50, quantity: 2 },
    { id: 2, name: 'Blueberry Muffin', price: 3.25, quantity: 1 },
  ]);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryOption === 'delivery' ? 2.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  // In your CheckoutScreen.js, update the handlePlaceOrder function:
  const handlePlaceOrder = () => {
    // Validate address for delivery
    if (deliveryOption === 'delivery' && !address.trim()) {
      Alert.alert('Address Required', 'Please enter your delivery address');
      return;
    }

    const orderId = `ORDER-${Math.floor(Math.random() * 1000000)}`;

    if (paymentMethod === 'card') {
      // Navigate to PaymentScreen for card payments
      navigation.navigate('Payment', {
        total: total.toFixed(2),
        orderId,
        cartItems,
        deliveryOption,
        address: deliveryOption === 'delivery' ? address : null
      });
    } else {
      // Direct to confirmation for cash payments
      navigation.navigate('OrderConfirmation', {
        orderId,
        total: total.toFixed(2),
        paymentMethod: 'cash',
        items: cartItems,
        deliveryOption,
        address: deliveryOption === 'delivery' ? address : null
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          {cartItems.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          <TouchableOpacity
            style={[styles.optionButton, deliveryOption === 'delivery' && styles.selectedOption]}
            onPress={() => setDeliveryOption('delivery')}
          >
            <Text>🚚 Delivery (+${deliveryFee.toFixed(2)})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, deliveryOption === 'pickup' && styles.selectedOption]}
            onPress={() => setDeliveryOption('pickup')}
          >
            <Text>🏪 Pickup (Free)</Text>
          </TouchableOpacity>

          {deliveryOption === 'delivery' && (
            <TextInput
              style={styles.input}
              placeholder="Enter delivery address"
              value={address}
              onChangeText={setAddress}
              pointerEvents="auto" // Allows interaction with the input
            />
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[styles.optionButton, paymentMethod === 'card' && styles.selectedOption]}
            onPress={() => setPaymentMethod('card')}
          >
            <Text>💳 Credit/Debit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, paymentMethod === 'cash' && styles.selectedOption]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Text>💵 Cash {deliveryOption === 'delivery' ? 'on Delivery' : 'at Pickup'}</Text>
          </TouchableOpacity>
        </View>

        {/* Order Total */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          {deliveryOption === 'delivery' && (
            <View style={styles.totalRow}>
              <Text>Delivery Fee:</Text>
              <Text>${deliveryFee.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text>Tax (8%):</Text>
            <Text>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalText}>Total:</Text>
            <Text style={styles.grandTotalText}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handlePlaceOrder}
        disabled={deliveryOption === 'delivery' && !address.trim()}
      >
        <Text style={styles.checkoutButtonText}>
          {paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order'} - ${total.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 1, // Add this to ensure sections stack properly
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2a9d8f',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontWeight: '500',
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#2a9d8f',
    backgroundColor: '#e8f4f3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    backgroundColor: '#fff',
    zIndex: 2, // Higher than section but won't block touches below
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  grandTotalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2a9d8f',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 3, // Higher than input
  }
});

export default CheckoutScreen;