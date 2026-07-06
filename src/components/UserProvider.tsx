"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

interface UserData {
  username: string;
  height_cm: number | null;
  goal_weight_kg: number | null;
  unit_preference: string;
}

interface UserContextValue {
  user: UserData | null;
  loading: boolean;
  refresh: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  refresh: () => {},
});

export function useMaybeUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const fetchUser = useCallback(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("/api/me")
      .then(async (res) => {
        if (res.ok) {
          setUser(await res.json());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refresh: () => {
          fetched.current = false;
          setLoading(true);
          fetchUser();
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
