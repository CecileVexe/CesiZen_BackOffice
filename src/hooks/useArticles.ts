import { useState } from "react";
import { ArticleAddType, ArticlesType, ArticleType } from "../types/article";
import { useAuthFetch } from "../utils/authFetch";

interface UseArticlesReturn {
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
  createArticle: (newArticle: Omit<ArticleType, "id">) => Promise<ArticleType>;
  updateArticle: (
    id: string,
    updatedFields: Partial<ArticleType>
  ) => Promise<ArticleType>;
  deleteArticle: (id: string) => Promise<void>;
}

const useArticles = (): UseArticlesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const authFetch = useAuthFetch();
  const [articles, setArticles] = useState<ArticlesType>({
    data: [],
    message: "",
    total: 0,
  });
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

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

  const createArticle = async (
    newArticle: Omit<ArticleType, "id">
  ): Promise<ArticleType> => {
    setError(null);
    try {
      const formData = new FormData();

      formData.append("title", newArticle.title);
      formData.append("description", newArticle.description);
      formData.append("readingTime", newArticle.readingTime.toString());
      formData.append("content", newArticle.content);
      formData.append("categoryId", newArticle.categoryId);

      if (newArticle.banner) {
        formData.append("banner", newArticle.banner);
      }

      const res = await authFetch(`${baseUrl}/article`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok)
        throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdArticle: ArticleAddType = await res.json();
      setArticles((prev) => ({
        data: [...prev.data, createdArticle.data],
        message: createdArticle.message,
        total: prev.total + 1,
      }));
      return createdArticle.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

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
        } else if (typeof value === "number") {
          formData.append(key, value.toString()); // number
        } else if (typeof value === "string") {
          formData.append(key, value); // text
        }
      }

      const res = await authFetch(`${baseUrl}/article/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok)
        throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedArticle: ArticleAddType = await res.json();
      setArticles((prev) => ({
        data: prev.data.map((article) =>
          article.id.toString() === id ? updatedArticle.data : article
        ),
        message: updatedArticle.message,
        total: prev.total,
      }));
      return updatedArticle.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteArticle = async (id: string) => {
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/article/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedArticle: Omit<ArticleAddType, "data"> =
        await res.json();
      setArticles((prev) => ({
        data: prev.data.filter((article) => article.id.toString() !== id),
        message: messageDeletedArticle.message,
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
