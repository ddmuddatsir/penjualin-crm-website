// services/firebase/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FirestoreUser, COLLECTIONS } from "@/types/firebase";

export class FirebaseAuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    // Configure Google provider
    this.googleProvider.addScope("email");
    this.googleProvider.addScope("profile");
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  }

  /**
   * Register with email and password
   */
  async registerWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile
      await updateProfile(credential.user, {
        displayName: displayName,
      });

      // Create user document in Firestore
      await this.createUserDocument(credential.user, {
        name: displayName,
        role: "SALES_REP",
      });

      return credential;
    } catch (error) {
      console.error("Error registering with email:", error);
      throw error;
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);

      // Create or update user document in Firestore
      await this.createUserDocument(result.user);

      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset:", error);
      throw error;
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Create or update user document in Firestore
   */
  private async createUserDocument(
    user: User,
    additionalData?: Partial<
      Omit<FirestoreUser, "id" | "email" | "createdAt" | "updatedAt">
    >
  ): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userDoc = await getDoc(userRef);

      const userData: Omit<FirestoreUser, "id"> = {
        name: additionalData?.name || user.displayName || "User",
        email: user.email || "",
        role: additionalData?.role || "SALES_REP",
        avatar: user.photoURL || undefined,
        isActive: true,
        lastLoginAt: Timestamp.now(),
        settings: {
          timezone: "UTC",
          notifications: true,
          emailUpdates: true,
        },
        createdAt: userDoc.exists()
          ? userDoc.data().createdAt
          : Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          lastLoginAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          ...(user.photoURL && { avatar: user.photoURL }),
        });
      } else {
        // Create new user document
        await setDoc(userRef, userData);
      }
    } catch (error) {
      console.error("Error creating/updating user document:", error);
      throw error;
    }
  }

  /**
   * Get user data from Firestore
   */
  async getUserData(userId: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt?.toDate(),
          updatedAt: userDoc.data().updatedAt?.toDate(),
          lastLoginAt: userDoc.data().lastLoginAt?.toDate(),
        } as FirestoreUser;
      }

      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    data: Partial<FirestoreUser>
  ): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      // Also update Firebase Auth profile if name is updated
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.name,
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updateUserPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No authenticated user found");
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
}

// Create singleton instance
export const authService = new FirebaseAuthService();
