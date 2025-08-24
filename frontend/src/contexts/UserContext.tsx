import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getMyRelationship } from '~/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Relationship {
  id: number;
  code: string;
  users: User[];
}

interface UserContextType {
  user: User | null;
  relationship: Relationship | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setRelationship: (relationshipData: Relationship) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is logged in
        const response = await api.get('/user');
        if (response.data) {
          setUser(response.data);
          
          // Fetch relationship data
          try {
            const relationshipResponse = await getMyRelationship();
            setRelationship(relationshipResponse.data);
          } catch (error) {
            // User might not be in a relationship yet
            setRelationship(null);
          }
        }
      } catch (error) {
        // User is not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    
    // Fetch relationship after login
    try {
      const relationshipResponse = await getMyRelationship();
      setRelationship(relationshipResponse.data);
    } catch (error) {
      // User might not be in a relationship yet
      setRelationship(null);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    }
    
    setUser(null);
    setRelationship(null);
  };

  const value = {
    user,
    relationship,
    loading,
    login,
    logout,
    setRelationship,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};