import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { total = '0.00' } = route.params || {};

  // Test card details
  const TEST_CARD = {
    number: '4111 1111 1111 1111',
    cvv: '111',
    expiry: '12/25',
    name: 'TEST CARD'
  };

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardFront, setIsCardFront] = useState(true);
  const [readerStatus, setReaderStatus] = useState('checking');
  const [readerDetails, setReaderDetails] = useState(null);
  const [sdkAvailable, setSdkAvailable] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [devMode] = useState(__DEV__);

  const TARGET_SERIAL_NUMBER = "429LS22205005721";

  // Initialize Square module
  const SquarePayment = NativeModules.SquarePayment || {
    checkReaderConnection: () => Promise.resolve(devMode),
    getConnectedReaderDetails: () => Promise.resolve(
      devMode ? { serialNumber: TARGET_SERIAL_NUMBER, deviceType: "MOCK" } : null
    ),
    startPayment: () => devMode ? 
      Promise.resolve({ transactionId: 'mock_' + Date.now() }) : 
      Promise.reject(new Error('Square module not available')),
    addReaderListener: () => {}
  };

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

  // Check if native module exists
  useEffect(() => {
    if (!NativeModules.SquarePayment && !devMode) {
      console.error('SquarePayment native module not found!');
      setReaderStatus('disconnected');
      return;
    }
    setSdkAvailable(true);
  }, []);

  // Monitor reader connection status
  useEffect(() => {
    if (devMode) {
      setReaderStatus('connected');
      setReaderDetails({ serialNumber: TARGET_SERIAL_NUMBER, deviceType: "MOCK" });
      return;
    }

    const eventEmitter = new NativeEventEmitter();
    let subscription;
    let interval;

    const checkReaderDetails = async () => {
      try {
        const details = await SquarePayment.getConnectedReaderDetails();
        
        setReaderDetails(details);
        
        if (details && details.serialNumber === TARGET_SERIAL_NUMBER) {
          setReaderStatus('connected');
        } else if (details) {
          setReaderStatus('wrong_reader');
        } else {
          setReaderStatus('disconnected');
        }
      } catch (error) {
        console.error('Reader details check failed:', error);
        setReaderStatus('disconnected');
      }
    };

    const setupConnectionMonitoring = async () => {
      await checkReaderDetails();
      
      subscription = eventEmitter.addListener(
        'onReaderConnectionChange',
        async (event) => {
          if (event.isConnected) {
            const details = {
              serialNumber: event.serialNumber,
              deviceType: event.deviceType
            };
            setReaderDetails(details);
            
            if (details.serialNumber === TARGET_SERIAL_NUMBER) {
              setReaderStatus('connected');
            } else {
              setReaderStatus('wrong_reader');
            }
          } else {
            setReaderStatus('disconnected');
            setReaderDetails(null);
          }
        }
      );

      interval = setInterval(checkReaderDetails, 3000);
    };

    if (sdkAvailable) {
      setupConnectionMonitoring();
    }

    return () => {
      subscription?.remove();
      clearInterval(interval);
    };
  }, [sdkAvailable, devMode]);

  // Card flip animation
  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isCardFront ? 180 : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => setIsCardFront(!isCardFront));
  };

  const checkConnection = async () => {
    setReaderStatus('checking');
    try {
      const details = await SquarePayment.getConnectedReaderDetails();
      setReaderDetails(details);
      
      if (details && details.serialNumber === TARGET_SERIAL_NUMBER) {
        setReaderStatus('connected');
      } else if (details) {
        setReaderStatus('wrong_reader');
      } else {
        setReaderStatus('disconnected');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setReaderStatus('disconnected');
    }
  };

  const handlePayment = async () => {
    
    if (paymentMethod === 'card') {
      if (readerStatus === 'wrong_reader') {
        Alert.alert(
          'Wrong Reader Connected',
          `Please connect reader with serial number: ${TARGET_SERIAL_NUMBER}\n\n` +
          `Currently connected: ${readerDetails?.serialNumber || 'None'}`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (readerStatus !== 'connected') {
        Alert.alert(
          'Reader Not Connected',
          'Please connect your Square reader before processing payment',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Android Bluetooth permissions
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          perm => perm === PermissionsAndroid.RESULTS.GRANTED
        );
        if (!allGranted) throw new Error('Required permissions not granted');
      }

      const amountCents = Math.round(parseFloat(total) * 100);
      const result = await SquarePayment.startPayment(
        amountCents,
        'USD',
        route.params?.orderId || 'N/A'
      );
console.log('LOG~');
      if (!result?.transactionId) {
        throw new Error('Payment completed but no transaction ID received');
      }
      

      navigation.navigate('OrderConfirmation', {
        orderId: route.params?.orderId,
        total: total,
        paymentMethod: paymentMethod,
        transactionId: result.transactionId
      });

    } catch (error) {
      let errorMessage = error.message || 'Could not complete payment';
      
      if (error.message.includes('permission')) {
        errorMessage = 'Please grant all required permissions in app settings';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Reader connection lost during payment';
      }
      
      Alert.alert('Payment Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Animation interpolations
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

  const getReaderStatusText = () => {
    switch (readerStatus) {
      case 'checking': return 'Checking reader connection...';
      case 'connected': return `Connected to: ${readerDetails?.serialNumber || 'Unknown'}`;
      case 'wrong_reader': return `Wrong reader: ${readerDetails?.serialNumber || 'Unknown'}`;
      case 'disconnected': return 'Reader not connected';
      default: return 'Unknown reader status';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

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

      {paymentMethod === 'card' && (
        <>
          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
              <Animated.View style={[
                styles.card,
                styles.cardFront,
                { transform: [{ rotateY: frontInterpolate }] }
              ]}>
                <Image source={require('../assets/chip.png')} style={styles.chip} />
                <Text style={styles.cardNumber}>{TEST_CARD.number}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardText}>{TEST_CARD.name}</Text>
                  <Text style={styles.cardText}>EXP {TEST_CARD.expiry}</Text>
                </View>
              </Animated.View>

              <Animated.View style={[
                styles.card,
                styles.cardBack,
                { transform: [{ rotateY: backInterpolate }] }
              ]}>
                <View style={styles.magneticStrip} />
                <View style={styles.cvvContainer}>
                  <Text style={styles.cvvText}>CVV</Text>
                  <View style={styles.cvvBox}>
                    <Text style={styles.cvvNumber}>{TEST_CARD.cvv}</Text>
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>

            <Text style={styles.flipText}>Tap card to flip</Text>
            <Text style={styles.testCardText}>TEST CARD: {TEST_CARD.number}</Text>
          </View>

          <View style={[
            styles.readerStatusContainer,
            readerStatus === 'connected' && styles.readerConnected,
            readerStatus === 'disconnected' && styles.readerDisconnected,
            readerStatus === 'wrong_reader' && styles.readerWrong
          ]}>
            <Icon
              name="bluetooth"
              size={16}
              color={
                readerStatus === 'connected' ? '#4CAF50' :
                readerStatus === 'wrong_reader' ? '#FF9800' :
                readerStatus === 'checking' ? '#FFC107' : '#FF5722'
              }
            />
            <Text style={styles.readerStatusText}>{getReaderStatusText()}</Text>
          </View>

          {readerStatus === 'wrong_reader' && (
            <Text style={styles.targetReaderText}>
              Expected reader: {TARGET_SERIAL_NUMBER}
            </Text>
          )}

          {readerStatus === 'disconnected' && (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={checkConnection}
            >
              <Text style={styles.retryText}>Retry Connection</Text>
            </TouchableOpacity>
          )}

          {devMode && (
            <Text style={styles.devModeText}>Development Mode: Using mock Square reader</Text>
          )}
        </>
      )}

      {paymentMethod === 'cash' && (
        <View style={styles.cashContainer}>
          <Icon name="attach-money" size={80} color="#2a9d8f" />
          <Text style={styles.cashText}>Pay with cash upon delivery</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.payButton,
          (isProcessing || (paymentMethod === 'card' && readerStatus !== 'connected')) && styles.disabledButton
        ]}
        onPress={handlePayment}
        disabled={isProcessing || (paymentMethod === 'card' && readerStatus !== 'connected')}
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
    marginBottom: 20,
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
  testCardText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
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
  disabledButton: {
    backgroundColor: '#cccccc',
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
  readerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  readerConnected: {
    backgroundColor: '#e8f5e9',
  },
  readerDisconnected: {
    backgroundColor: '#ffebee',
  },
  readerWrong: {
    backgroundColor: '#fff3e0',
  },
  readerStatusText: {
    marginLeft: 8,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#ff7043',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  devModeText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  targetReaderText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
    fontSize: 12,
  }
});

export default PaymentScreen;