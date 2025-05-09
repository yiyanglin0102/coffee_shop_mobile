// src/screens/OrdersScreen.js
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OrdersScreen() {
  const navigation = useNavigation();
  
  const orders = [
    { id: '1', items: 'Cappuccino x1, Croissant x2', total: 12.50, date: 'Today, 10:30 AM' },
    { id: '2', items: 'Latte x2', total: 8.00, date: 'Yesterday, 4:15 PM' },
  ];

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.items}>{item.items}</Text>
            <Text style={styles.total}>${item.total.toFixed(2)}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      
      {/* Fixed Checkout Button */}
      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={handleCheckout}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  items: {
    color: '#666',
    marginBottom: 5,
  },
  total: {
    fontWeight: 'bold',
    color: '#2a9d8f',
    textAlign: 'right',
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});