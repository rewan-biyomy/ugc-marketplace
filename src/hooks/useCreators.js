import { useState, useEffect } from "react";
import { api } from "../services/api";

/** Hook لجلب صناع المحتوى من طبقة الـ API (جاهز للـ Backend) */
export default function useCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.creators
      .getAll()
      .then(setCreators)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { creators, loading, error };
}