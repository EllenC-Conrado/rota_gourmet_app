import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEmailLogin = async () => {
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)'); // redireciona após login
    } catch (err: any) {
      Alert.alert('Erro ao entrar', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro no login com Google', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Rota Gourmet</Text>

      <TextInput
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />

      <Button title="Entrar com E-mail" onPress={handleEmailLogin} />
      <View style={styles.spacer} />
      <Button title="Entrar com Google" onPress={handleGoogleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 10, borderRadius: 8,
  },
  spacer: { height: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
