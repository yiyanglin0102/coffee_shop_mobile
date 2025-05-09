import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [scaleValue] = useState(new Animated.Value(1));
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Menu');
    });
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
      blurRadius={2}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Coffee Shop</Text>
        
        <Animated.View style={[
          styles.circleButton,
          { transform: [{ scale: scaleValue }],
            backgroundColor: isPressed ? '#E05555' : '#FF6B6B' 
          }
        ]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.touchable}
          >
            <Text style={[styles.buttonText, styles.mainText]}>Start Order</Text>
            <Text style={styles.subText}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 50,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  circleButton: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 140,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  mainText: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 10,
  },
  subText: {
    fontSize: 40,
    marginTop: 15,
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});