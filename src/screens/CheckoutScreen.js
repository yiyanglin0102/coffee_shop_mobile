import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
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

  const handlePlaceOrder = () => {
    // Process order logic here
    navigation.navigate('OrderConfirmation', { orderId: Math.random().toString(36).substr(2, 9) });
    const orderId = `ORDER-${Math.floor(Math.random() * 1000000)}`;

    navigation.navigate('OrderConfirmation', {
      orderId,
      total: total.toFixed(2),
      items: cartItems // Pass the entire cart if needed
    });
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
              placeholder="Delivery Address"
              value={address}
              onChangeText={setAddress}
            />
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
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
            <Text>💵 Cash on Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Order Total */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Delivery:</Text>
            <Text>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax:</Text>
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
        disabled={deliveryOption === 'delivery' && !address}
      >
        <Text style={styles.checkoutButtonText}>Place Order - ${total.toFixed(2)}</Text>
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
});

export default CheckoutScreen;