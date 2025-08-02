import { router, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user: User | null, isLoading: boolean) {
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't redirect until we know the auth state

    const inAuthGroup = segments[0] === '(AuthScreens)';

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if the user is not signed in
      // and not in the auth group.
      router.replace('/(AuthScreens)');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page if the user is signed in.
      router.replace('/tabs/explore');
    }
  }, [user, segments, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useProtectedRoute(user, isLoading);

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
}
