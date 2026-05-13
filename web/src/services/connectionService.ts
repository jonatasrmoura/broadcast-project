import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Connection } from "../types";

export const connectionService = {
  create: async (name: string, ownerId: string) => {
    const colRef = collection(db, "connections");
    return await addDoc(colRef, { name, ownerId });
  },

  getAll: async (ownerId: string) => {
    const colRef = collection(db, "connections");
    const q = query(colRef, where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Connection,
    );
  },

  delete: async (id: string) => {
    const docRef = doc(db, "connections", id);
    return await deleteDoc(docRef);
  },

  update: async (id: string, name: string) => {
    const docRef = doc(db, "connections", id);
    return await updateDoc(docRef, { name });
  },
};
