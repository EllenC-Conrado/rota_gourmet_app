import { useState } from 'react';
import { View,Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro ao entrar com Google', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Rota Gourmet</Text>

      <TextInput
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Entrar com E-mail" onPress={handleLogin} />

      <View style={{ marginVertical: 12 }} />

      <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleButton}>
        <Text style={styles.googleText}>Entrar com Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
