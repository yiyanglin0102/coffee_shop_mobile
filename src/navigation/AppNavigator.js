// src/navigation/AppNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import CartIcon from '../components/CartIcon';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTitleAlign: 'center',
                headerTintColor: '#2a9d8f',
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Welcome' }}
            />

            <Stack.Screen
                name="Menu"
                component={MenuScreen}
                options={({ navigation }) => ({
                    title: 'Our Menu',
                    headerRight: () => <CartIcon navigation={navigation} />,
                })}
            />

            <Stack.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    title: 'Your Orders',
                }}
            />

            <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ title: 'Checkout' }}
            />
            <Stack.Screen
                name="OrderConfirmation"
                component={OrderConfirmationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}