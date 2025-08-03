import { router, useSegments } from 'expo-router';
import { signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true, signOut: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user: User | null, isLoading: boolean) {
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't redirect until we know the auth state

    const inAuthGroup = segments[0] === '(AuthTabs)';

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if the user is not signed in
      // and not in the auth group.
      router.replace('/(AuthTabs)');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page if the user is signed in.
      router.replace('/Home');
    }
  }, [user, segments, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = () => {
    firebaseSignOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useProtectedRoute(user, isLoading);

  return <AuthContext.Provider value={{ user, isLoading, signOut }}>{children}</AuthContext.Provider>;
}
