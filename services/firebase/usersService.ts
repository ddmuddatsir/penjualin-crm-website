// services/firebase/usersService.ts
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  Timestamp,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import type { FirestoreUser, ClientUser } from "@/types/firebase";

class UsersService {
  private collectionName = "users";

  // Convert Firestore data to client format
  private convertFirestoreToClient(doc: DocumentSnapshot): ClientUser | null {
    if (!doc.exists()) return null;

    const data = doc.data() as FirestoreUser;
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
      isActive: data.isActive,
      lastLoginAt: data.lastLoginAt?.toDate() as ClientUser["lastLoginAt"],
      createdAt: data.createdAt.toDate() as ClientUser["createdAt"],
      updatedAt: data.updatedAt.toDate() as ClientUser["updatedAt"],
      settings: data.settings,
    };
  }

  private convertQuerySnapshot(snapshot: QuerySnapshot): ClientUser[] {
    return snapshot.docs
      .map((doc) => this.convertFirestoreToClient(doc))
      .filter((user): user is ClientUser => user !== null);
  }

  // Get all users
  async getAll(): Promise<ClientUser[]> {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      return this.convertQuerySnapshot(snapshot);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  // Get user by ID
  async getById(id: string): Promise<ClientUser | null> {
    try {
      const userRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(userRef);
      return this.convertFirestoreToClient(snapshot);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user");
    }
  }

  // Get user by email
  async getByEmail(email: string): Promise<ClientUser | null> {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      return this.convertFirestoreToClient(snapshot.docs[0]);
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Failed to fetch user by email");
    }
  }

  // Get active users
  async getActiveUsers(): Promise<ClientUser[]> {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(
        usersRef,
        where("isActive", "==", true),
        orderBy("name", "asc")
      );
      const snapshot = await getDocs(q);
      return this.convertQuerySnapshot(snapshot);
    } catch (error) {
      console.error("Error fetching active users:", error);
      throw new Error("Failed to fetch active users");
    }
  }

  // Create user
  async create(
    userData: Omit<ClientUser, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const firestoreData: Omit<FirestoreUser, "id"> = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
        isActive: userData.isActive,
        createdAt: now,
        updatedAt: now,
      };

      // Handle lastLoginAt conversion separately to avoid type issues
      if (userData.lastLoginAt) {
        firestoreData.lastLoginAt = Timestamp.fromDate(
          userData.lastLoginAt as unknown as Date
        );
      }

      const docRef = await addDoc(
        collection(db, this.collectionName),
        firestoreData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  // Update user
  async update(
    id: string,
    userData: Partial<Omit<ClientUser, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, id);
      const firestoreData: Partial<FirestoreUser> = {
        ...userData,
        updatedAt: Timestamp.now(),
      };

      // Handle lastLoginAt conversion separately to avoid type issues
      if (userData.lastLoginAt) {
        firestoreData.lastLoginAt = Timestamp.fromDate(
          userData.lastLoginAt as unknown as Date
        );
      }

      await updateDoc(userRef, firestoreData);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  // Delete user
  async delete(id: string): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }

  // Update last login
  async updateLastLogin(id: string): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, id);
      await updateDoc(userRef, {
        lastLoginAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating last login:", error);
      throw new Error("Failed to update last login");
    }
  }

  // Add missing methods for useUsers hook
  async getUsers(): Promise<ClientUser[]> {
    return this.getAll();
  }

  async getUser(id: string): Promise<ClientUser | null> {
    return this.getById(id);
  }

  async createUser(
    data: Omit<ClientUser, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    return this.create(data);
  }

  async updateUser(
    id: string,
    data: Partial<Omit<ClientUser, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    return this.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete(id);
  }
}

export const usersService = new UsersService();
