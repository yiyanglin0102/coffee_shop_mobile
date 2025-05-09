import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { total } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardFront, setIsCardFront] = useState(true);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Spin animation for processing
  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [isProcessing]);

  // Card flip animation
  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isCardFront ? 180 : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => setIsCardFront(!isCardFront));
  };

  // Update the handlePayment function in PaymentScreen.js:
  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('OrderConfirmation', {
        orderId: route.params.orderId || `#${Math.floor(Math.random() * 10000)}`,
        total: route.params.total,
        paymentMethod: 'card',
        items: route.params.cartItems,
        deliveryOption: route.params.deliveryOption,
        address: route.params.address
      });
    }, 2000);
  };

  // Interpolate animations
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      {/* Payment Method Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, paymentMethod === 'card' && styles.activeToggle]}
          onPress={() => setPaymentMethod('card')}
        >
          <Icon name="credit-card" size={24} color={paymentMethod === 'card' ? 'white' : '#2a9d8f'} />
          <Text style={[styles.toggleText, paymentMethod === 'card' && styles.activeToggleText]}>Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, paymentMethod === 'cash' && styles.activeToggle]}
          onPress={() => setPaymentMethod('cash')}
        >
          <Icon name="attach-money" size={24} color={paymentMethod === 'cash' ? 'white' : '#2a9d8f'} />
          <Text style={[styles.toggleText, paymentMethod === 'cash' && styles.activeToggleText]}>Cash</Text>
        </TouchableOpacity>
      </View>

      {/* Card Payment UI */}
      {paymentMethod === 'card' && (
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
            {/* Front of Card */}
            <Animated.View style={[
              styles.card,
              styles.cardFront,
              { transform: [{ rotateY: frontInterpolate }] }
            ]}>
              <Image source={require('../assets/chip.png')} style={styles.chip} />
              <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardText}>CARDHOLDER NAME</Text>
                <Text style={styles.cardText}>EXP 12/25</Text>
              </View>
            </Animated.View>

            {/* Back of Card */}
            <Animated.View style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backInterpolate }] }
            ]}>
              <View style={styles.magneticStrip} />
              <View style={styles.cvvContainer}>
                <Text style={styles.cvvText}>CVV</Text>
                <View style={styles.cvvBox}>
                  <Text style={styles.cvvNumber}>•••</Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Text style={styles.flipText}>Tap card to flip</Text>
        </View>
      )}

      {/* Cash Payment UI */}
      {paymentMethod === 'cash' && (
        <View style={styles.cashContainer}>
          <Icon name="attach-money" size={80} color="#2a9d8f" />
          <Text style={styles.cashText}>Pay with cash upon delivery</Text>
        </View>
      )}

      {/* Payment Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Animated.View style={styles.processing}>
            <Animated.View style={[styles.spinner, {
              transform: [{ rotate: spinInterpolate }]
            }]} />
            <Text style={styles.payButtonText}>Processing...</Text>
          </Animated.View>
        ) : (
          <Text style={styles.payButtonText}>Pay ${total}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 5,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: '#2a9d8f',
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2a9d8f',
    fontWeight: '600',
  },
  activeToggleText: {
    color: 'white',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    padding: 20,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardFront: {
    backgroundColor: '#3a86ff',
    justifyContent: 'space-between',
  },
  cardBack: {
    backgroundColor: '#4361ee',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chip: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
  cardNumber: {
    color: 'white',
    fontSize: 22,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  magneticStrip: {
    height: 40,
    width: '100%',
    backgroundColor: 'black',
    marginBottom: 20,
  },
  cvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  cvvText: {
    color: 'white',
    marginRight: 10,
  },
  cvvBox: {
    backgroundColor: 'white',
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  cvvNumber: {
    color: 'black',
    fontWeight: 'bold',
  },
  flipText: {
    marginTop: 220,
    color: '#666',
    fontStyle: 'italic',
  },
  cashContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  cashText: {
    marginTop: 15,
    fontSize: 18,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  processing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
    marginRight: 10,
  },
});

export default PaymentScreen;