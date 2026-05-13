import { useState, useEffect, useCallback } from "react";
import { contactService } from "../services/contactService";
import { useAuth } from "./useAuth";
import type { Contact } from "../types";

export const useContacts = (connectionId: string | undefined) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!connectionId || !user?.uid) {
      setContacts([]);
      return;
    }

    setLoading(true);
    try {
      const data = await contactService.getAll(user.uid, connectionId);
      setContacts(data);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
    } finally {
      setLoading(false);
    }
  }, [connectionId, user?.uid]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return { contacts, loading, refresh: fetchContacts };
};
