import { useState } from 'react';
import { EmotionCategory, EmotionCategoryAddType, EmotionCategoryApi } from '../types/emotionCateogory';

interface UseEmotionCategoryApiReturn {
  emotionCategories: EmotionCategoryApi;
  emotionCategory: EmotionCategory | null;
  loading: boolean;
  error: Error | null;
  fetchEmotionCategories: () => Promise<void>;
  fetchEmotionCategory: (id: string) => Promise<void>;
  createEmotionCategory: (newResourceType: Omit<EmotionCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEmotionCategory: (id: number, updatedFields: Partial<EmotionCategory>) => Promise<void>;
  deleteEmotionCategory: (id: number) => Promise<void>;
}

const useEmotionCategory = (): UseEmotionCategoryApiReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [emotionCategories, setEmotionCategories] = useState<EmotionCategoryApi>({
    data: [],
    message: '',
    total: 0,
  });
  const [emotionCategory, setEmotionCategory] = useState<EmotionCategory | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer les emotionCategories
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


  // Créer une resourceType
  const createEmotionCategory = async (newResourceType: Omit<EmotionCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResourceType),
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdResourceType: EmotionCategoryAddType = await res.json();
      setEmotionCategories((prev) => ({
        data: [...prev.data, createdResourceType.data],
        message: createdResourceType.message,
        total: prev.total + 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Mettre à jour une resourceType
  const updateEmotionCategory = async (id: number, updatedFields: Partial<EmotionCategory>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion-category/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedResourceType: EmotionCategoryAddType = await res.json();
      setEmotionCategories((prev) => ({
        data: prev.data.map((r) => (r.id === id ? updatedResourceType.data : r)),
        message: updatedResourceType.message,
        total: prev.total,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Supprimer une resourceType
  const deleteEmotionCategory = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion-category/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedResourceType: Omit<EmotionCategoryAddType, 'data'> = await res.json();
      setEmotionCategories((prev) => ({
        data: prev.data.filter((r) => r.id !== id),
        message: messageDeletedResourceType.message,
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
