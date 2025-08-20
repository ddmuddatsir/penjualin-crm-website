// services/firebase/base.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Base service class untuk operasi CRUD Firestore
 * Provides common operations yang bisa di-extend oleh service lain
 */
export class FirebaseBaseService<T extends { id: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Get collection reference
   */
  protected getCollection() {
    return collection(db, this.collectionName);
  }

  /**
   * Get document reference
   */
  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  /**
   * Convert Firestore document to client format
   */
  protected docToData(doc: QueryDocumentSnapshot | DocumentSnapshot): T {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Timestamps to Dates
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as unknown as T;
  }

  /**
   * Get all documents from collection
   */
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(this.getCollection(), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.docToData(doc));
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.docToData(docSnap);
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  /**
   * Create new document
   */
  async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(this.getCollection(), docData);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update document by ID
   */
  async update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt">>
  ): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete document by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Listen to real-time updates
   */
  onSnapshot(
    callback: (data: T[]) => void,
    constraints: QueryConstraint[] = []
  ): () => void {
    const q = query(this.getCollection(), ...constraints);

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => this.docToData(doc));
      callback(data);
    });
  }

  /**
   * Get documents with pagination
   */
  async getPaginated(
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot,
    constraints: QueryConstraint[] = []
  ): Promise<{ data: T[]; hasMore: boolean; lastDoc?: QueryDocumentSnapshot }> {
    try {
      const queryConstraints = [
        ...constraints,
        limit(pageSize + 1), // Get one extra to check if there are more
      ];

      if (lastDoc) {
        queryConstraints.push(startAfter(lastDoc));
      }

      const q = query(this.getCollection(), ...queryConstraints);
      const snapshot = await getDocs(q);

      const docs = snapshot.docs;
      const hasMore = docs.length > pageSize;

      // Remove the extra doc if present
      const data = docs.slice(0, pageSize).map((doc) => this.docToData(doc));
      const newLastDoc = hasMore ? docs[pageSize - 1] : undefined;

      return {
        data,
        hasMore,
        lastDoc: newLastDoc,
      };
    } catch (error) {
      console.error(`Error getting paginated ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Search documents by field
   */
  async search(field: string, value: any): Promise<T[]> {
    try {
      const q = query(
        this.getCollection(),
        where(field, "==", value),
        orderBy("updatedAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.docToData(doc));
    } catch (error) {
      console.error(`Error searching ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Count documents in collection
   */
  async count(constraints: QueryConstraint[] = []): Promise<number> {
    try {
      const q = query(this.getCollection(), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error(`Error counting ${this.collectionName}:`, error);
      throw error;
    }
  }
}
