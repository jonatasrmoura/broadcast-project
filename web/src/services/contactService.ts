import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Contact } from "../types";

export const contactService = {
  create: async (
    name: string,
    phone: string,
    connectionId: string,
    ownerId: string,
  ) => {
    return await addDoc(collection(db, "contacts"), {
      name,
      phone,
      connectionId,
      ownerId,
    });
  },

  update: async (id: string, name: string, phone: string) => {
    const docRef = doc(db, "contacts", id);
    return await updateDoc(docRef, { name, phone });
  },

  delete: async (id: string) => {
    const docRef = doc(db, "contacts", id);
    return await deleteDoc(docRef);
  },

  getAll: async (ownerId: string, connectionId: string): Promise<Contact[]> => {
    const colRef = collection(db, "contacts");
    const q = query(
      colRef,
      where("ownerId", "==", ownerId),
      where("connectionId", "==", connectionId),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Contact,
    );
  },
};
