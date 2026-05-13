import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Connection } from "../types";

export const useConnections = (ownerId: string | undefined) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;

    const q = query(
      collection(db, "connections"),
      where("ownerId", "==", ownerId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Connection[];

      setConnections(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ownerId]);

  return { connections, loading };
};
