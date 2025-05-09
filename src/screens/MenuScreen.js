import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView
} from 'react-native';
// import { Amplify } from 'aws-amplify';
// import awsmobile from './aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { withAuthenticator } from 'aws-amplify-react-native';

// Amplify.configure({
//   ...awsmobile,
//   Analytics: {
//     disabled: true, // Disable analytics if not needed
//   },
// });

const products = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 59.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.0,
  },
  {
    id: '4',
    name: 'Laptop Backpack',
    price: 39.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Wireless Charger',
    price: 29.99,
    image: 'https://via.placeholder.com/150',
    rating: 3.9,
  },
  {
    id: '6',
    name: 'Fitness Tracker',
    price: 79.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.3,
  },
];

export default function BrowseScreen() {
  const [searchText, setSearchText] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ShopEase</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartCount}>{cartCount}</Text>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 24,
  },
  cartCount: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginRight: 5,
    fontSize: 12,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
  },
  addToCartButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
  },
});