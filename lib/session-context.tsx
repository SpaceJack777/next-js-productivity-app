'use client';

import { createContext, useContext } from 'react';

type User = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

type Session = {
  user?: User;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
