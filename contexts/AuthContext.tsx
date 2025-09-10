// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { authService } from "@/services/firebase/authService";
import { FirestoreUser } from "@/types/firebase";

interface AuthContextType {
  user: User | null;
  userData: FirestoreUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Get user data from Firestore
        try {
          const firestoreUserData = await authService.getUserData(
            firebaseUser.uid
          );
          setUserData(firestoreUserData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.signInWithEmail(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    try {
      await authService.registerWithEmail(email, password, displayName);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await authService.sendPasswordReset(email);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: { name: string; email: string }) => {
    try {
      if (!user) {
        throw new Error("No authenticated user found");
      }

      await authService.updateUserProfile(user.uid, {
        name: data.name,
        email: data.email,
      });

      // Refresh user data
      const updatedUserData = await authService.getUserData(user.uid);
      setUserData(updatedUserData);
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await authService.updateUserPassword(currentPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signInWithEmail,
    registerWithEmail,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
