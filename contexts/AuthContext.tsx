import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { createContext, useContext, useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'com.rotagourmet.app', // 🔁 ou 'your.app.scheme' definido no app.json
      native: 'com.rotagourmet.app:/oauthredirect',
    }),
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, fbUser => {
      setUser(fbUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (response?.type !== 'success') return;

    if (Platform.OS === 'web') {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).catch(console.error);
      return;
    }

    const idToken =
      (response.params?.id_token as string | undefined) ?? response.authentication?.idToken;

    if (!idToken) {
      console.warn('Google login: idToken ausente', response);
      return;
    }

    const credential = GoogleAuthProvider.credential(idToken);
    signInWithCredential(auth, credential).catch(console.error);
  }, [response]);

  const signIn = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async (): Promise<void> => {
    await signOut(auth);
  };

  const signInWithGoogle = async (): Promise<void> => {
    await promptAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOutUser,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
