import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

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
      connectionId, // Vincula ao "pai" (Conexão)
      ownerId, // Vincula ao Cliente (SAAS)
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
};
