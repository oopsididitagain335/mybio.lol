// @contexts/DiscoveryContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 🔹 Define the shape of a public user
export interface PublicUser {
  id: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  category?: string;
  badges?: string[];
  followersCount?: number;
  weeklyClicks?: number;
}

// 🔹 Define the context type
export interface DiscoveryContextType {
  search: (query: string) => Promise<void>;
  results: PublicUser[];
  loading: boolean;
  error: string | null;
}

// 🔹 Create the context
const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

// 🔹 Provider
export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string): Promise<void> => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError('Search query cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`/api/user/search?q=${encodeURIComponent(trimmed)}`);

      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }

      // ✅ CORRECT: Declare a variable called 'data' of type PublicUser[]
      const  PublicUser[] = await res.json();

      setResults(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to load results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DiscoveryContext.Provider
      value={{ search, results, loading, error }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
};

// 🔹 Custom hook
export const useDiscovery = (): DiscoveryContextType => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
};
