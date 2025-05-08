import { useState } from "react";

interface UseImagesReturn {
  image: File | null;
  imageUrl: string | null;
  loading: boolean;
  error: Error | null;
  fetchImage: (id: string) => Promise<File>;
}

const useImages = (): UseImagesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchImage = async (id: string): Promise<File> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/image/${id}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: File = await res.json();
      setImage(data);
      setImageUrl(`${baseUrl}/image/${id}`);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    image,
    imageUrl,
    loading,
    error,
    fetchImage,
  };
};

export default useImages;
