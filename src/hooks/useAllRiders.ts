// hooks/useAllRiders.ts
import { useEffect, useState } from "react";

import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Rider {
  id: string;
  name: string;
  // add other rider fields if needed
}

export function useAllRiders() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "riders"));
      const data: Rider[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Rider, "id">),
      }));
      setRiders(data);
      setLoading(false);
    };

    fetchRiders();
  }, []);

  return { riders, loading };
}
