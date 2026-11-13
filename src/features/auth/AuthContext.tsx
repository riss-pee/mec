import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SignInCredentials,
  SignUpCredentials,
  StudentLoginCredentials,
  TeacherApplicationRequest,
  TeacherApplication,
  AuthModalView,
} from './types';
import * as authService from './services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  signIn: (creds: SignInCredentials) => Promise<UserProfile>;
  studentLogin: (creds: StudentLoginCredentials) => Promise<UserProfile>;
  submitTeacherRequest: (req: TeacherApplicationRequest) => Promise<TeacherApplication>;
  adminSignIn: (creds: SignInCredentials) => Promise<UserProfile>;
  signUp: (creds: SignUpCredentials) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  enterAsGuest: (nickname?: string) => UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isFirstLoginModalOpen: boolean;
  setIsFirstLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('sign-in');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFirstLoginModalOpen, setIsFirstLoginModalOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const profile = await authService.getCurrentUserProfile();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const signIn = async (creds: SignInCredentials): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.signInWithEmail(creds);
      setUser(profile);
      setIsAuthModalOpen(false);
      toast.success(`Welcome back, ${profile.displayName}!`);
      return profile;
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const studentLogin = async (creds: StudentLoginCredentials): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.studentLoginWithUsername(creds);
      setUser(profile);
      setIsAuthModalOpen(false);
      toast.success(`Welcome to ZIRNA, ${profile.displayName}!`);
      if (profile.isFirstLogin) {
        setIsFirstLoginModalOpen(true);
      }
      return profile;
    } catch (err: any) {
      toast.error(err.message || 'Student login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitTeacherRequest = async (
    req: TeacherApplicationRequest
  ): Promise<TeacherApplication> => {
    setIsLoading(true);
    try {
      const app = await authService.submitTeacherApplication(req);
      toast.success('Teacher application submitted! Awaiting administrator approval.');
      return app;
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const adminSignIn = async (creds: SignInCredentials): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.adminSignInWithEmail(creds);
      setUser(profile);
      setIsAuthModalOpen(false);
      toast.success(`Administrator session verified. Welcome, ${profile.displayName}!`);
      return profile;
    } catch (err: any) {
      toast.error(err.message || 'Administrative verification failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (creds: SignUpCredentials): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.signUpWithEmail(creds);
      setUser(profile);
      setIsAuthModalOpen(false);
      toast.success(`Account created! Welcome to ZIRNA, ${profile.displayName}!`);
      return profile;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    await authService.signOutUser();
    setUser(null);
    toast.info('Signed out successfully.');
  };

  const enterAsGuest = (nickname?: string): UserProfile => {
    const guest = authService.createGuestSession(nickname);
    setUser(guest);
    setIsAuthModalOpen(false);
    toast.info(`Continuing as guest: ${guest.displayName}`);
    return guest;
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    const updated = authService.updateStoredProfile(data);
    if (updated) {
      setUser(updated);
    }
  };

  const openAuthModal = (view: AuthModalView = 'sign-in') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isAuthenticated = Boolean(user && !user.isGuest);
  const isGuest = Boolean(user && user.isGuest);
  const isTeacher = Boolean(user && user.role === 'teacher');
  const isStudent = Boolean(user && user.role === 'student');
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isGuest,
        isTeacher,
        isStudent,
        isAdmin,
        signIn,
        studentLogin,
        submitTeacherRequest,
        adminSignIn,
        signUp,
        signOut,
        enterAsGuest,
        updateProfile,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isFirstLoginModalOpen,
        setIsFirstLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
