
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useState } from 'react';
import Login from '@/components/ui/login';

export default function ProfileScreen() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  /**
   * Callback function passed to the LoginScreen to update parent state.
   */
  const handleLoginSuccess = (loggedInStatus: boolean, token: string) => {
    setIsLoggedIn(loggedInStatus);
    setUserToken(token);
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <ThemedText>Welcome! You are logged in.</ThemedText>
        <ThemedText>Your token: {userToken}</ThemedText>
        {/* Add more app content here */}
      </View>
    );
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
container: { flex: 1, justifyContent: 'center', alignItems: 'center' },

});
