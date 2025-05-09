import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderId, total } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.confirmationBox}>
        <Icon name="check-circle" size={80} color="#4CAF50" style={styles.icon} />
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Thank you for your purchase</Text>
        
        <View style={styles.orderDetails}>
          <Text style={styles.detailText}>Order #: {orderId}</Text>
          <Text style={styles.detailText}>Total: ${total}</Text>
          <Text style={styles.detailText}>Estimated delivery: 20-30 min</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.continueButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  confirmationBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  orderDetails: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderConfirmationScreen;