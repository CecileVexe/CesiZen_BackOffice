import { useState } from "react";
import { ArticleAddType, ArticlesType, ArticleType } from "../types/article";

interface UseResourcesReturn {
  articles: ArticlesType;
  article: ArticleType | null;
  loading: boolean;
  error: Error | null;
  fetchArticles: ({
    page,
    perPage,
  }: {
    page?: number;
    perPage?: number;
  }) => Promise<void>;
  fetchArticle: (id: string) => Promise<ArticleType>;
  createArticle: (newResource: Omit<ArticleType, "id">) => Promise<ArticleType>;
  updateArticle: (
    id: string,
    updatedFields: Partial<ArticleType>
  ) => Promise<ArticleType>;
  deleteArticle: (id: string) => Promise<void>;
}

const useArticles = (): UseResourcesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [articles, setArticles] = useState<ArticlesType>({
    data: [],
    message: "",
    total: 0,
  });
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer la liste des citoyens
  const fetchArticles = async ({
    page,
    perPage,
  }: {
    page?: number;
    perPage?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${
          page && perPage
            ? baseUrl + "/article" + `?page=${page}&perPage=${perPage}`
            : baseUrl + "/article"
        }`
      );
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ArticlesType = await res.json();
      setArticles(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticle = async (id: string): Promise<ArticleType> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/article/${id}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ArticleAddType = await res.json();
      setArticle(data.data);
      return data.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau citoyen
  const createArticle = async (
    newArticle: Omit<ArticleType, "id">
  ): Promise<ArticleType> => {
    setError(null);
    try {
      const formData = new FormData();

      // Champs texte / number (converti en string automatiquement)
      formData.append("title", newArticle.title);
      formData.append("description", newArticle.description);
      formData.append("readingTime", newArticle.readingTime.toString());
      formData.append("content", newArticle.content);
      formData.append("categoryId", newArticle.categoryId);

      if (newArticle.banner) {
        formData.append("banner", newArticle.banner);
      }

      const res = await fetch(`${baseUrl}/article`, {
      method: 'POST',
      body: formData,
    });

      if (!res.ok)
        throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdResource: ArticleAddType = await res.json();
      setArticles((prev) => ({
        data: [...prev.data, createdResource.data],
        message: createdResource.message,
        total: prev.total + 1,
      }));
      return createdResource.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Mettre à jour un citoyen
  const updateArticle = async (
    id: string,
    updatedFields: Partial<ArticleType>
  ): Promise<ArticleType> => {
    setError(null);
    try {
      
        const formData = new FormData();

    for (const [key, value] of Object.entries(updatedFields)) {
      if (value instanceof File) {
        formData.append(key, value); // image
      } else if (typeof value === 'number') {
        formData.append(key, value.toString()); // number
      } else if (typeof value === 'string') {
        formData.append(key, value); // text
      }
    }

    const res = await fetch(`${baseUrl}/article/${id}`, {
      method: "PATCH",
      body: formData, 
    });

      if (!res.ok)
        throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedResource: ArticleAddType = await res.json();
      setArticles((prev) => ({
        data: prev.data.map((article) =>
          article.id.toString() === id ? updatedResource.data : article
        ),
        message: updatedResource.message,
        total: prev.total,
      }));
      return updatedResource.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Supprimer un citoyen
  const deleteArticle = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/article/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedResource: Omit<ArticleAddType, "data"> =
        await res.json();
      setArticles((prev) => ({
        data: prev.data.filter((article) => article.id.toString() !== id),
        message: messageDeletedResource.message,
        total: prev.total - 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    articles,
    article,
    loading,
    error,
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

export default useArticles;
