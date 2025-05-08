import { useState } from "react";
import { EmotionAddType, EmotionType, EmotionTypeApi } from "../types/emotion";

interface UseEmotionsReturn {
  emotions: EmotionTypeApi;
  loading: boolean;
  error: Error | null;
  fetchEmotions: () => Promise<void>;
  createEmotion: (newEmotion: Omit<EmotionType, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateEmotion: (id: string,  updatedFields: Partial<EmotionType>) => Promise<void>;
  deleteEmotion: (id: string) => Promise<void>;
}

const useEmotions = (): UseEmotionsReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [emotions, setEmotions] = useState<EmotionTypeApi>({
    data: [],
    message: "",
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer la liste des citoyens
  const fetchEmotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: EmotionTypeApi = await res.json();
      setEmotions(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createEmotion = async (
    newEmotion: Omit<EmotionType, "id" | "createdAt" | "updatedAt">
  ) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmotion),
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdResourceType: EmotionAddType = await res.json();
      setEmotions((prev) => ({
        data: [...prev.data, createdResourceType.data],
        message: createdResourceType.message,
        total: prev.total + 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Mettre à jour une resourceType
  const updateEmotion = async (
    id: string,
    updatedFields: Partial<EmotionType>
  ) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion-category/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedResourceType: EmotionAddType = await res.json();
      setEmotions((prev) => ({
        data: prev.data.map((r) =>
          r.id === id ? updatedResourceType.data : r
        ),
        message: updatedResourceType.message,
        total: prev.total,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Supprimer un citoyen
  const deleteEmotion = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/emotion/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedEmotion: Omit<EmotionAddType, "data"> =
        await res.json();
      setEmotions((prev) => ({
        data: prev.data.filter((emotion) => emotion.id !== id),
        message: messageDeletedEmotion.message,
         total: prev.total - 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    emotions,
    loading,
    error,
    fetchEmotions,
    deleteEmotion,
    updateEmotion,
    createEmotion,
  };
};

export default useEmotions;
