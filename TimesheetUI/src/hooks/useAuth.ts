
import { useMemo } from 'react';

export const useAuth = () => {
  // Example: parse JWT from localStorage and return userId from payload 'sub' or custom claim
  const token = localStorage.getItem('accessToken');
  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // adapt claim name: 'sub', 'userId', or custom
      return payload.userId ?? payload.sub ?? null;
    } catch {
      return null;
    }
  }, [token]);

  return { token, userId };
};
