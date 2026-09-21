import { createContext, useCallback, useContext, useState } from 'react';

const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  const [error, setError] = useState('');

  const clear = useCallback(() => setError(''), []);
  const showError = useCallback((message) => setError(message), []);

  return (
    <MessagesContext.Provider value={{ error, clear, showError }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within a MessagesProvider');
  return ctx;
}
