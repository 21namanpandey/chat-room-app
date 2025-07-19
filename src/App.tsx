import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import { User } from './types';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('chatUser');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage:", error);
        await AsyncStorage.removeItem('chatUser'); 
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('chatUser');
    } catch (error) {
      console.error("Failed to remove user from AsyncStorage:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="ChatRoom">
            {(props) => <ChatRoomScreen {...props} user={user} onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default App;