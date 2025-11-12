import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with MongoDB implementation
  // - Check for existing session in MongoDB
  // - Implement session management with JWT tokens
  // - Store session data in localStorage or httpOnly cookies
  useEffect(() => {
    // Check localStorage for existing session (mock implementation)
    const storedUser = localStorage.getItem('arceus_user');
    const storedProfile = localStorage.getItem('arceus_userProfile');
    
    if (storedUser && storedProfile) {
      try {
        setUser(JSON.parse(storedUser));
        setUserProfile(JSON.parse(storedProfile));
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('arceus_user');
        localStorage.removeItem('arceus_userProfile');
      }
    }
    
    setLoading(false);
  }, []);

  // TODO: Replace with MongoDB implementation
  // - Fetch user profile from MongoDB users collection
  // - Use MongoDB query: db.users.findOne({ _id: ObjectId(userId) })
  // - Handle case where user profile doesn't exist
  const fetchUserProfile = async (userId, userEmail) => {
    try {
      // Mock implementation - replace with MongoDB query
      // const response = await fetch(`/api/users/${userId}`);
      // const data = await response.json();
      
      // For now, create a mock profile
      const mockProfile = {
        id: userId,
        username: userEmail?.split('@')[0] || 'user',
        display_name: userEmail?.split('@')[0] || 'User',
        onboarding_completed: false,
      };
      
      setUserProfile(mockProfile);
      localStorage.setItem('arceus_userProfile', JSON.stringify(mockProfile));
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Replace with MongoDB implementation
  // - Create user in MongoDB users collection
  // - Hash password using bcrypt before storing
  // - Generate JWT token for session
  // - Store user document: { email, passwordHash, username, display_name, onboarding_completed, createdAt }
  const signUp = async (email, password) => {
    // Mock implementation - replace with MongoDB
    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();
    
    // For now, create a mock user
    const mockUser = {
      id: `user_${Date.now()}`,
      email: email,
    };
    
    setUser(mockUser);
    localStorage.setItem('arceus_user', JSON.stringify(mockUser));
    
    await fetchUserProfile(mockUser.id, email);
    
    return { data: { user: mockUser }, error: null };
  };

  // TODO: Replace with MongoDB implementation
  // - Query MongoDB users collection: db.users.findOne({ email })
  // - Verify password hash using bcrypt.compare()
  // - Generate JWT token
  // - Return user data and token
  const signIn = async (email, password) => {
    // Mock implementation - replace with MongoDB
    // const response = await fetch('/api/auth/signin', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();
    
    // For now, create a mock user (accepts any email/password)
    const mockUser = {
      id: `user_${Date.now()}`,
      email: email,
    };
    
    setUser(mockUser);
    localStorage.setItem('arceus_user', JSON.stringify(mockUser));
    
    await fetchUserProfile(mockUser.id, email);
    
    return { data: { user: mockUser }, error: null };
  };

  // TODO: Replace with MongoDB implementation
  // - Invalidate JWT token on server
  // - Clear session from MongoDB sessions collection
  // - Remove httpOnly cookie if using cookies
  const signOut = async () => {
    // Mock implementation - replace with MongoDB
    // await fetch('/api/auth/signout', { method: 'POST' });
    
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('arceus_user');
    localStorage.removeItem('arceus_userProfile');
    
    return { error: null };
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
