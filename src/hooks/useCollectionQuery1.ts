import {
  CollectionReference,
  DocumentData,
  Query,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

let cache: { [key: string]: any } = {};

export const useCollectionQuery1: (
  key: string,
  collection: CollectionReference | Query<DocumentData>
) => { loading1: boolean; error1: boolean; data1: QuerySnapshot | null } = (
  key,
  collection
) => {
  const [data1, setData1] = useState<QuerySnapshot<DocumentData> | null>(
    cache[key] || null
  );

  const [loading1, setLoading1] = useState(!data1);
  const [error1, setError1] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection,
      (snapshot) => {
        setData1(snapshot);
        setLoading1(false);
        setError1(false);
        cache[key] = snapshot;
      },
      (err) => {
        console.log(err);
        setData1(null);
        setLoading1(false);
        setError1(true);
      }
    );

    return () => {
      unsubscribe();
    };

    // eslint-disable-next-line
  }, [key]);

  return { loading1, error1, data1 };
};
