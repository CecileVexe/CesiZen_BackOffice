import { useState } from "react";
import {
  EmotionCategory,
  EmotionCategoryAddType,
  EmotionCategoryApi,
} from "../types/emotionCateogory";
import { useAuthFetch } from "../utils/authFetch";

interface UseEmotionCategoryApiReturn {
  emotionCategories: EmotionCategoryApi;
  emotionCategory: EmotionCategory | null;
  loading: boolean;
  error: Error | null;
  fetchEmotionCategories: () => Promise<void>;
  fetchEmotionCategory: (id: string) => Promise<void>;
  createEmotionCategory: (
    newEmotionCategory: Omit<EmotionCategory, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateEmotionCategory: (
    id: string,
    updatedFields: Partial<EmotionCategory>
  ) => Promise<void>;
  deleteEmotionCategory: (id: string) => Promise<void>;
}

const useEmotionCategory = (): UseEmotionCategoryApiReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
    const authFetch = useAuthFetch();
  const [emotionCategories, setEmotionCategories] =
    useState<EmotionCategoryApi>({
      data: [],
      message: "",
      total: 0,
    });
  const [emotionCategory, setEmotionCategory] =
    useState<EmotionCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmotionCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion-category`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: EmotionCategoryApi = await res.json();
      setEmotionCategories(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmotionCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion-category/${id}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: EmotionCategory = await res.json();
      setEmotionCategory(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createEmotionCategory = async (
    newEmotionCategory: Omit<EmotionCategory, "id" | "createdAt" | "updatedAt">
  ) => {
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/emotion-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmotionCategory),
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdEmotionCategory: EmotionCategoryAddType = await res.json();
      setEmotionCategories((prev) => ({
        data: [...prev.data, createdEmotionCategory.data],
        message: createdEmotionCategory.message,
        total: prev.total + 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  const updateEmotionCategory = async (
    id: string,
    updatedFields: Partial<EmotionCategory>
  ) => {
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/emotion-category/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedEmotionCategory: EmotionCategoryAddType = await res.json();
      setEmotionCategories((prev) => ({
        data: prev.data.map((r) =>
          r.id === id ? updatedEmotionCategory.data : r
        ),
        message: updatedEmotionCategory.message,
        total: prev.total,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  const deleteEmotionCategory = async (id: string) => {
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/emotion-category/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedEmotionCategory: Omit<
        EmotionCategoryAddType,
        "data"
      > = await res.json();
      setEmotionCategories((prev) => ({
        data: prev.data.filter((r) => r.id !== id),
        message: messageDeletedEmotionCategory.message,
        total: prev.total - 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    emotionCategories,
    emotionCategory,
    loading,
    error,
    fetchEmotionCategories,
    fetchEmotionCategory,
    createEmotionCategory,
    updateEmotionCategory,
    deleteEmotionCategory,
  };
};

export default useEmotionCategory;
