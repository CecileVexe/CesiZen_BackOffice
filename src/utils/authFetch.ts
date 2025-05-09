import { useAuth } from "@clerk/clerk-react";

export const useAuthFetch = () => {
  const { getToken } = useAuth();

  const authFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = await getToken();

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return authFetch;
};