import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Contact } from "../types";

export const useContacts = (connectionId: string | undefined) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não houver conexão selecionada, não busca nada
    if (!connectionId) {
      setContacts([]);
      setLoading(false);
      return;
    }

    // Requisito SAAS: Filtramos por connectionId para isolar os dados
    const q = query(
      collection(db, "contacts"),
      where("connectionId", "==", connectionId),
    );

    // Tempo real: onSnapshot atualiza a lista se um contato for add/removido
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];

      setContacts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [connectionId]);

  return { contacts, loading };
};
