import { useState } from "react";
import {
  ArticleCategoriesType,
  ArticleCategoryAddType,
  ArticleCategoryType,
} from "../types/articleCategory";
import { useAuthFetch } from "../utils/authFetch";

interface UseCategoriesReturn {
  articleCategories: ArticleCategoriesType;
  loading: boolean;
  error: Error | null;
  fetchArticleCategories: () => Promise<void>;
  createArticleCategory: (
    newCategory: Omit<ArticleCategoryType, "id">
  ) => Promise<void>;
  updateArticleCategory: (
    id: string,
    updatedFields: Partial<ArticleCategoryType>
  ) => Promise<void>;
  deleteArticleCategory: (id: string) => Promise<void>;
}

const useArticleCategory = (): UseCategoriesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const authFetch = useAuthFetch();
  const [articleCategories, setCategories] = useState<ArticleCategoriesType>({
    data: [],
    message: "",
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticleCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/article-category`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ArticleCategoriesType = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createArticleCategory = async (
    newCategory: Omit<ArticleCategoryType, "id">
  ) => {
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/article-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdCategory: ArticleCategoryAddType = await res.json();
      setCategories((prev) => ({
        data: [...prev.data, createdCategory.data],
        message: createdCategory.message,
        total: prev.total + 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  const updateArticleCategory = async (
    id: string,
    updatedFields: Partial<ArticleCategoryType>
  ) => {
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/article-category/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedCategory: ArticleCategoryAddType = await res.json();
      setCategories((prev) => ({
        data: prev.data.map((category) =>
          category.id === id ? updatedCategory.data : category
        ),
        message: updatedCategory.message,
        total: prev.total,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  const deleteArticleCategory = async (id: string) => {
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/article-category/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedCategory: Omit<ArticleCategoryAddType, "data"> =
        await res.json();
      setCategories((prev) => ({
        data: prev.data.filter((category) => category.id !== id),
        message: messageDeletedCategory.message,
        total: prev.total - 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    articleCategories,
    loading,
    error,
    fetchArticleCategories,
    createArticleCategory,
    updateArticleCategory,
    deleteArticleCategory,
  };
};

export default useArticleCategory;
