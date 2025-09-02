
import { useMemo } from 'react';

export const useAuth = () => {
  
  const token = localStorage.getItem('accessToken');
  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded JWT payload:", payload); 
      return payload.userId ?? payload.sub ?? null;
    } catch {
      return null;
    }
  }, [token]);

  return { token, userId };
};
