import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetCurrentUser, AuthUser, getGetCurrentUserQueryKey } from '@workspace/api-client-react';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: isQueryLoading } = useGetCurrentUser({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
      queryKey: getGetCurrentUserQueryKey(),
    },
  });

  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isQueryLoading) {
      setLocalUser(user || null);
      setIsInitializing(false);
    }
  }, [user, isQueryLoading]);

  return (
    <AuthContext.Provider
      value={{
        user: localUser,
        isLoading: isQueryLoading || isInitializing,
        setUser: setLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);