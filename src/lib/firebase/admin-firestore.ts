import { COLLECTIONS } from '../constants/COLLECTIONS';
import { adminDb } from './admin';
import {
  FieldValue,
  QueryDocumentSnapshot,
  DocumentData,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

export class AdminFirestoreService {
  /**
   * Get all documents from a collection
   */
  async getDocuments<T>(collectionName: string): Promise<T[]> {
    try {
      const colRef = adminDb.collection(collectionName);
      const snapshot = await colRef.get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error: any) {
      console.error(`Error fetching documents from ${collectionName}:`, error);
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  /**
   * Get documents filtered by a field value
   */
  async getDocumentsByField<T>(collectionName: string, field: string, value: any): Promise<T[]> {
    try {
      const colRef = adminDb.collection(collectionName);
      const snapshot = await colRef.where(field, '==', value).get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error: any) {
      console.error(`Error fetching documents by field ${field}=${value}:`, error);
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    } catch (error: any) {
      console.error(`Error fetching document ${id} from ${collectionName}:`, error);
      throw new Error(`Failed to fetch document: ${error.message}`);
    }
  }

  /**
   * Add a new document to a collection
   */
  async addDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<T> {
    try {
      const colRef = adminDb.collection(collectionName);
      const docRef = await colRef.add(data);

      return {
        id: docRef.id,
        ...data,
      } as T;
    } catch (error: any) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw new Error(`Failed to add document: ${error.message}`);
    }
  }

  /**
   * Update a document
   */
  async updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      await docRef.update(data);

      // Fetch and return the updated document
      const updatedDoc = await this.getDocument<T>(collectionName, id);

      if (!updatedDoc) {
        throw new Error('Failed to retrieve updated document');
      }

      return updatedDoc;
    } catch (error: any) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      await docRef.delete();
    } catch (error: any) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Get documents ordered by a field and limited
   */
  async getDocumentsOrdered<T>(
    collectionName: string,
    orderByField: string,
    limitCount?: number,
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<T[]> {
    try {
      const colRef = adminDb.collection(collectionName);
      let queryRef = colRef.orderBy(orderByField, direction);

      if (limitCount) {
        queryRef = queryRef.limit(limitCount);
      }

      const snapshot = await queryRef.get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error: any) {
      console.error(`Error fetching ordered documents from ${collectionName}:`, error);
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  /**
   * Increment a numeric field in a document
   */
  async incrementField(
    collectionName: string,
    id: string,
    field: string,
    amount: number = 1
  ): Promise<void> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      await docRef.update({
        [field]: FieldValue.increment(amount),
      });
    } catch (error: any) {
      console.error(`Error incrementing field ${field} in document ${id}:`, error);
      throw new Error(`Failed to increment field: ${error.message}`);
    }
  }

  /**
   * Check if an admin user exists and is active
   */
  async isActive(uid: string): Promise<boolean> {
    try {
      const doc = await adminDb.collection(COLLECTIONS.ADMIN_USERS).doc(uid).get();

      if (!doc.exists) {
        return false;
      }

      const data = doc.data();

      return data?.isActive === true;
    } catch (error: any) {
      console.error(`Error checking admin status for ${uid}:`, error);
      throw new Error(`Failed to check admin status: ${error.message}`);
    }
  }
}

// Singleton instance
export const firestoreService = new AdminFirestoreService();
