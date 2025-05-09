// src/components/CartIcon.js
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CartIcon({ navigation, itemCount = 0 }) {
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Orders')}
      style={styles.container}
      hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
    >
      <Icon name="shopping-cart" size={24} color="#2a9d8f" />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});